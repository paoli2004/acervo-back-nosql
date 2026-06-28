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
   *Executa uma Promise que busca uma entidade e lança erro caso não encontre.
   *
   * @template T Tipo da entidade esperada
   * @param promise Promise que retorna a entidade ou null (ex: findOne do Mongoose)
   * @param message Mensagem de erro caso a entidade não seja encontrada
   * @returns A entidade encontrada (garantido que não é null)
   */
  private async findOrFail<T>(
    promise: Promise<T | null>,
    message: string,
  ): Promise<T> {
    const result = await promise;

    if (!result) {
      throw new NotFoundException(message);
    }

    return result;
  }

  async findEmprestimo(
    emprestimoFilterQuery: FilterQuery<Emprestimo>,
  ): Promise<EmprestimoDocument> {
    return this.findOrFail(
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

  async createEmprestimo(
    createEmprestimoDto: CreateEmprestimoDto,
  ): Promise<EmprestimoDocument> {
    const usuario = await this.findOrFail(
      this.usuariosService.findUsuario({ _id: createEmprestimoDto.usuario }),
      'Usuário não encontrado',
    );

    const exemplarEncontrado = await this.findOrFail(
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

  async devolveExemplar(
    emprestimoFilterQuery: FilterQuery<Emprestimo>,
  ): Promise<EmprestimoDocument> {
    const emprestimo = await this.findOrFail(
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

  async deleteEmprestimo(
    emprestimoFilterQuery: FilterQuery<Emprestimo>,
  ): Promise<EmprestimoDocument> {
    if (
      !emprestimoFilterQuery ||
      Object.keys(emprestimoFilterQuery).length === 0
    ) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const emprestimo = await this.findOrFail(
      this.emprestimoModel.findOneAndDelete(emprestimoFilterQuery).exec(),
      'Empréstimo não encontrado',
    );

    return emprestimo;
  }

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