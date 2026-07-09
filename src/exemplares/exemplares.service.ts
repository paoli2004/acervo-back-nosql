import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LivrosService } from '../livros/livros.service';
import { Exemplar, ExemplarDocument } from './schemas/exemplar.schema';
import { CreateExemplarDto } from './dto/createExemplar.dto';
import { UpdateExemplarDto } from './dto/updateExemplar.dto';
import { findOrFail } from '../common/utils/query.utils';

type FilterQuery<T> = { [P in keyof T]?: T[P] } & { _id?: any };

@Injectable()
export class ExemplaresService {
  constructor(
    @InjectModel(Exemplar.name)
    private exemplarModel: Model<ExemplarDocument>,
    private readonly livrosService: LivrosService,
  ) {}

  /**
   * Localiza um único documento de exemplar baseado em um filtro de busca na coleção.
   * @param exemplarFilterQuery Objeto contendo os critérios de seleção (ex: { _id: id }).
   * @returns Documento do exemplar encontrado com seus métodos e propriedades do Mongoose.
   * @throws {NotFoundException} Se nenhum documento na coleção corresponder ao critério.
   */
  async findExemplar(
    exemplarFilterQuery: FilterQuery<Exemplar>,
  ): Promise<ExemplarDocument> {
    return await findOrFail(
      this.exemplarModel
        .findOne(exemplarFilterQuery)
        .populate({
          path: 'livro',
          populate: [{ path: 'autores' }, { path: 'editora' }],
        })
        .exec(),
      'Exemplar não encontrado',
    );
  }

  /**
   * Recupera uma lista de documentos de exemplares da coleção, permitindo aplicar filtros opcionais.
   * @param exemplarFilterQuery Critério opcional de projeção ou busca (ex: { codigo_patrimonio: '123' }). Se omitido, retorna todos da coleção.
   * @returns Array contendo os documentos dos exemplares localizados.
   */
  async findAllExemplares(): Promise<ExemplarDocument[]> {
    return this.exemplarModel
      .find()
      .sort({ codigo_patrimonio: 1 })
      .populate({
        path: 'livro',
        populate: [{ path: 'autores' }, { path: 'editora' }],
      })
      .exec();
  }

  /**
   * Recupera uma lista de documentos de exemplares registrados que estão disponíveis na estante.
   * Filtra diretamente pelo status ehDisponivel, trazendo os dados do livro, autores e editora de exemplares disponiveis.
   * @returns Array contendo os documentos dos exemplares localizados disponíveis.
   */
  async findAllExemplaresDisponiveis(): Promise<ExemplarDocument[]> {
    return this.exemplarModel
      .find({ ehDisponivel: true })
      .sort({ codigo_patrimonio: 1 })
      .populate({
        path: 'livro',
        populate: [{ path: 'autores' }, { path: 'editora' }],
      })
      .exec();
  }

  /**
   * Recupera uma lista de documentos de exemplares de um livro específico.
   * @param livroId - ID do livro.
   * @param onlyDisponiveis - Se true, retorna somente os exemplares disponíveis na estante.
   * @returns Array contendo os documentos dos exemplares localizados.
   */
  async findExemplaresByLivro(
    livroId: string,
    onlyDisponiveis = false,
  ): Promise<ExemplarDocument[]> {
    const query: any = { livro: new Types.ObjectId(livroId) };

    if (onlyDisponiveis) {
      query.ehDisponivel = true;
    }

    return this.exemplarModel
      .find(query)
      .sort({ codigo_patrimonio: 1 })
      .populate({
        path: 'livro',
        populate: [{ path: 'autores' }, { path: 'editora' }],
      })
      .exec();
  }

  /**
   * Cria e persiste um novo documento de exemplar na coleção correspondente do MongoDB.
   * @param createExemplarDto Objeto contendo os dados estruturados e validados do exemplar (código de patrimônio, ano de publicação, etc).
   * @returns O documento do exemplar recém-criado, incluindo o identificador único (_id) gerado pelo banco.
   */
  async createExemplar(
    createExemplarDto: CreateExemplarDto,
  ): Promise<ExemplarDocument> {
    const codigoPatrimonioAlreadyExist = await this.exemplarModel.exists({
      codigo_patrimonio: createExemplarDto.codigo_patrimonio,
    });

    if (codigoPatrimonioAlreadyExist) {
      throw new ConflictException(
        'Já existe um exemplar cadastrado com este código de patrimônio.',
      );
    }

    await this.livrosService.findLivro({ _id: createExemplarDto.livro });

    const novoExemplar = await this.exemplarModel.create({
      codigo_patrimonio: createExemplarDto.codigo_patrimonio,
      ano_publicacao: createExemplarDto.ano_publicacao,
      livro: new Types.ObjectId(createExemplarDto.livro),
    });

    return novoExemplar;
  }

  /**
   * Identifica um documento de exemplar por meio de um filtro e aplica as modificações fornecidas.
   * @param exemplarFilterQuery Objeto de seleção para mapear o documento a ser alterado (ex: { _id: id }).
   * @param updateExemplarDto Objeto contendo o conjunto de campos parciais ou completos a serem atualizados.
   * @returns O documento do exemplar com as modificações aplicadas e atualizadas em memória.
   * @throws {BadRequestException} Se o objeto de filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se o documento alvo não for localizado para a operação de escrita.
   */
  async findOneAndUpdateExemplar(
    exemplarFilterQuery: FilterQuery<Exemplar>,
    updateExemplarDto: UpdateExemplarDto,
  ): Promise<ExemplarDocument> {
    if (!exemplarFilterQuery || Object.keys(exemplarFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const exemplar = await findOrFail(
      this.exemplarModel.findOne(exemplarFilterQuery).exec(),
      'Exemplar não encontrado',
    );

    if (updateExemplarDto.livro) {
      await this.livrosService.findLivro({ _id: updateExemplarDto.livro });
    }

    return await findOrFail(
      this.exemplarModel
        .findOneAndUpdate(
          exemplarFilterQuery,
          {
            livro: updateExemplarDto.livro
              ? new Types.ObjectId(updateExemplarDto.livro)
              : exemplar.livro,
            ano_publicacao:
              updateExemplarDto.ano_publicacao ?? exemplar.ano_publicacao,
            codigo_patrimonio:
              updateExemplarDto.codigo_patrimonio ?? exemplar.codigo_patrimonio,
          },
          { new: true },
        )
        .exec(),
      'Exemplar não encontrado para atualização',
    );
  }

  /**
   * Remove de forma definitiva um documento de exemplar da coleção do MongoDB baseado em um filtro.
   * @param exemplarFilterQuery Objeto de seleção contendo as propriedades para identificar o exemplar a ser deletado (ex: { _id: id }).
   * @returns O documento do exemplar que foi removido da coleção.
   * @throws {BadRequestException} Se o objeto de filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se o documento não for encontrado na coleção para a remoção.
   */
  async deleteExemplar(
    exemplarFilterQuery: FilterQuery<Exemplar>,
  ): Promise<void> {
    if (!exemplarFilterQuery || Object.keys(exemplarFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    return await findOrFail(
      this.exemplarModel.findOneAndDelete(exemplarFilterQuery),
      'Exemplar não encontrado para remoção',
    );
  }
}
