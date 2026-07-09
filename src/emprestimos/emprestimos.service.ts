import { Model, Types } from 'mongoose';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Emprestimo, EmprestimoDocument } from './schemas/emprestimo.schema';
import { UsuariosService } from '../usuarios/usuarios.service';
import { ExemplaresService } from '../exemplares/exemplares.service';
import { CreateEmprestimoDto } from './dto/createEmprestimo.dto';
import { findOrFail } from '../common/utils/query.utils';

type FilterQuery<T> = { [P in keyof T]?: T[P] } & { _id?: any };

@Injectable()
export class EmprestimosService {
  constructor(
    @InjectModel(Emprestimo.name)
    private readonly emprestimoModel: Model<EmprestimoDocument>,
    private readonly usuariosService: UsuariosService,
    private readonly exemplaresService: ExemplaresService,
  ) {}

  /**
   * Localiza um único documento de emprestimo baseado em um filtro de busca na coleção.
   * @param emprestimoFilterQuery Objeto contendo os critérios de seleção (ex: { _id: id }).
   * @returns Documento do emprestimo encontrado com seus métodos e propriedades do Mongoose.
   * @throws {NotFoundException} Se nenhum documento na coleção corresponder ao critério.
   */
  async findEmprestimo(
    emprestimoFilterQuery: FilterQuery<Emprestimo>,
  ): Promise<EmprestimoDocument> {
    return await findOrFail(
      this.emprestimoModel
        .findOne(emprestimoFilterQuery)
        .populate('usuario')
        .populate({
          path: 'exemplar',
          populate: [
            {
              path: 'livro',
              populate: [
                { path: 'autores' },
                { path: 'categorias' },
                { path: 'editora' },
              ],
            },
          ],
        })
        .exec(),
      'Empréstimo não encontrado',
    );
  }

  /**
   * Recupera uma lista de documentos de emprestimos da coleção, permitindo aplicar filtros opcionais.
   * @param emprestimoFilterQuery Critério opcional de projeção ou busca (ex: { usuario: 'José' }). Se omitido, retorna todos da coleção.
   * @returns Array contendo os documentos dos emprestimos localizados.
   */
  async findAllEmprestimos(): Promise<EmprestimoDocument[]> {
    return this.emprestimoModel
      .find()
      .populate('usuario')
      .populate({
        path: 'exemplar',
        populate: [
          {
            path: 'livro',
            populate: [
              { path: 'autores' },
              { path: 'categorias' },
              { path: 'editora' },
            ],
          },
        ],
      })
      .exec();
  }

  /**
   * Cria e persiste um novo documento de emprestimo na coleção correspondente do MongoDB.
   * @param createEmprestimoDto Objeto contendo os dados estruturados e validados do emprestimo (usuario, exemplar, etc).
   * @returns O documento do emprestimo recém-criado, incluindo o identificador único (_id) gerado pelo banco.
   */
  async createEmprestimo(
    createEmprestimoDto: CreateEmprestimoDto,
  ): Promise<EmprestimoDocument> {
    await findOrFail(
      this.usuariosService.findUsuario({ _id: createEmprestimoDto.usuario }),
      'Usuário não encontrado',
    );

    const exemplarEncontrado = await findOrFail(
      this.exemplaresService.findExemplar({
        _id: createEmprestimoDto.exemplar,
      }),
      'Exemplar não encontrado',
    );

    if (!exemplarEncontrado.ehDisponivel) {
      throw new ConflictException('Este exemplar já está emprestado.');
    }

    const emprestimo = await this.emprestimoModel.create({
      usuario: new Types.ObjectId(createEmprestimoDto.usuario),
      exemplar: new Types.ObjectId(createEmprestimoDto.exemplar),
      data_emprestimo: createEmprestimoDto.data_emprestimo ?? new Date(),
      data_devolucao: createEmprestimoDto.data_devolucao,
      ativo: true,
    });

    await this.exemplaresService.findOneAndUpdateExemplar(
      { _id: exemplarEncontrado._id },
      { ehDisponivel: false } as any,
    );

    return emprestimo;
  }

  /**
   * Registra a devolução de um exemplar, desativando o empréstimo e liberando o exemplar.
   * @param emprestimoFilterQuery Critério de busca para localizar o empréstimo (ex: { _id: id }).
   * @returns O documento do empréstimo atualizado com o status ativo como false.
   * @throws {ConflictException} Se o empréstimo já constar como devolvido no banco.
   */
  async devolveExemplar(
    emprestimoFilterQuery: FilterQuery<Emprestimo>,
  ): Promise<EmprestimoDocument> {
    const emprestimo = await findOrFail(
      this.emprestimoModel.findOne(emprestimoFilterQuery).exec(),
      'Empréstimo não encontrado',
    );

    if (!emprestimo.ativo) {
      throw new ConflictException('Este empréstimo já foi devolvido.');
    }

    emprestimo.ativo = false;
    await emprestimo.save();

    await this.exemplaresService.findOneAndUpdateExemplar(
      { _id: emprestimo.exemplar },
      { ehDisponivel: true } as any,
    );

    return emprestimo;
  }

  /**
   * Remove de forma definitiva um documento de emprestimo da coleção do MongoDB baseado em um filtro.
   * @param emprestimoFilterQuery Objeto de seleção contendo as propriedades para identificar o emprestimo a ser deletado (ex: { _id: id }).
   * @returns O documento do emprestimo que foi removido da coleção.
   * @throws {BadRequestException} Se o objeto de filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se o documento não for encontrado na coleção para a remoção.
   */
  async deleteEmprestimo(
    emprestimoFilterQuery: FilterQuery<Emprestimo>,
  ): Promise<void> {
    if (
      !emprestimoFilterQuery ||
      Object.keys(emprestimoFilterQuery).length === 0
    ) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const emprestimo = await findOrFail(
      this.emprestimoModel.findOne(emprestimoFilterQuery).exec(),
      'Empréstimo não encontrado',
    );

    if (emprestimo.ativo) {
      throw new ConflictException(
        'Não é possível remover um empréstimo ativo. Registre a devolução antes.',
      );
    }

    await this.emprestimoModel.findOneAndDelete(emprestimoFilterQuery).exec();
  }

  /**
   * Realiza uma busca dinâmica e filtrada de empréstimos na coleção.
   * @param params Filtros opcionais de busca (IDs de usuário/exemplar/livro, intervalo de datas e status ativo).
   * @returns Lista de empréstimos ordenados por data, com toda a árvore de relacionamentos populada
   * (Usuário, Exemplar, Livro, Autores, Categorias e Editora).
   */
  async buscarAvancado(params: {
    livro?: string;
    usuario?: string;
    exemplar?: string;
    data_inicio?: Date;
    data_fim?: Date;
    ativo?: boolean;
  }): Promise<EmprestimoDocument[]> {
    const query: any = {};

    if (params.usuario) {
      query.usuario = new Types.ObjectId(params.usuario);
    }

    if (params.exemplar) {
      query.exemplar = new Types.ObjectId(params.exemplar);
    }

    if (params.data_inicio || params.data_fim) {
      query.data_emprestimo = {};
      if (params.data_inicio) {
        query.data_emprestimo.$gte = new Date(params.data_inicio);
      }
      if (params.data_fim) {
        query.data_emprestimo.$lte = new Date(params.data_fim);
      }
    }

    if (params.ativo !== undefined) {
      query.ativo = params.ativo;
    }

    const emprestimo = await this.emprestimoModel
      .find(query)
      .sort({ data_emprestimo: 1 })
      .populate('usuario')
      .populate({
        path: 'exemplar',
        populate: {
          path: 'livro',
          populate: [
            { path: 'autores' },
            { path: 'categorias' },
            { path: 'editora' },
          ],
        },
      })
      .exec();

    if (params.livro) {
      return emprestimo.filter((e) => {
        const exemplar = e.exemplar as any;
        if (exemplar && exemplar.livro) {
          const livroIdString =
            exemplar.livro._id?.toString() || exemplar.livro.toString();
          return livroIdString === params.livro;
        }
        return false;
      });
    }

    return emprestimo;
  }
}
