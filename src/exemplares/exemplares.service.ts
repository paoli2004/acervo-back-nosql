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

type FilterQuery<T> = { [P in keyof T]?: T[P] } & { _id?: any };

@Injectable()
export class ExemplaresService {
  constructor(
    @InjectModel(Exemplar.name)
    private exemplarModel: Model<ExemplarDocument>,
    private readonly livrosService: LivrosService,
  ) {}

  /**
   * Retorna um exemplar.
   * @param exemplarFilterQuery Objeto de filtro para encontrar o exemplar (ex: { _id: id }).
   * @returns Exemplar encontrado.
   */
  async findExemplar(
    exemplarFilterQuery: FilterQuery<Exemplar>,
  ): Promise<ExemplarDocument> {
    const exemplar = await this.exemplarModel
      .findOne(exemplarFilterQuery)
      .populate('livro')
      .populate('editora')
      .exec();

    if (!exemplar) {
      throw new NotFoundException('Exemplar não encontrado');
    }

    return exemplar;
  }

  /**
   * Retorna todos os exemplares registrados.
   * Traz os dados do livro pai populados, junto com seus respectivos autores e editora.
   * @returns Lista de exemplares com dados do acervo.
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
   * Retorna os exemplares registrados que estão disponíveis na estante.
   * Filtra diretamente pelo status booleano, trazendo os dados do livro, autores e editora.
   * @returns Lista de exemplares disponíveis.
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
   * Retorna todos os exemplares de um livro.
   * @param livroId - ID alfanumérico (ObjectId) do livro pai.
   * @param onlyDisponiveis - Se true, retorna somente os exemplares disponíveis na estante.
   * @returns Lista de exemplares de um livro.
   */
  async getExemplaresByLivro(
    livroId: string,
    onlyDisponiveis = false,
  ): Promise<ExemplarDocument[]> {
    const query: any = { livro: livroId };

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
   * Insere um novo exemplar no sistema após validar o código de patrimônio e a existência do livro.
   * @param createExemplarDto Dados para criação do exemplar.
   * @returns Documento do exemplar recém-criado.
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

    const newExemplary = await this.exemplarModel.create({
      codigo_patrimonio: createExemplarDto.codigo_patrimonio,
      ano_publicacao: createExemplarDto.ano_publicacao,
      livro: new Types.ObjectId(createExemplarDto.livro),
    });

    return newExemplary;
  }

  /**
   * Atualiza um exemplar de forma parcial e dinâmica com base em um filtro de busca.
   * @param exemplarFilterQuery Filtro para encontrar o exemplar que será atualizado (ex: { _id: id }).
   * @param updateExemplarDto Dados com as alterações parciais do exemplar.
   * @returns Documento do exemplar já atualizado.
   */
  async findOneAndUpdateExemplar(
    exemplarFilterQuery: FilterQuery<Exemplar>,
    updateExemplarDto: UpdateExemplarDto,
  ): Promise<ExemplarDocument> {
    if (!exemplarFilterQuery || Object.keys(exemplarFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const exemplar = await this.exemplarModel
      .findOne(exemplarFilterQuery)
      .exec();

    if (!exemplar) {
      throw new NotFoundException('Exemplar não encontrado');
    }

    if (updateExemplarDto.livro) {
      await this.livrosService.findLivro({ _id: updateExemplarDto.livro });
    }

    const updatedExemplary = await this.exemplarModel
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
      .exec();

    if (!updatedExemplary) {
      throw new NotFoundException('Exemplar não encontrado para atualização');
    }

    return updatedExemplary;
  }

  /**
   * Remove um exemplar do sistema com base em um filtro de busca.
   * @param exemplarFilterQuery Filtro para encontrar o exemplar que será removido (ex: { _id: id }).
   * @returns Documento do exemplar que foi removido.
   */
  async deleteExemplar(
    exemplarFilterQuery: FilterQuery<Exemplar>,
  ): Promise<ExemplarDocument> {
    if (!exemplarFilterQuery || Object.keys(exemplarFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const deletedExemplary = await this.exemplarModel
      .findOneAndDelete(exemplarFilterQuery)
      .exec();

    if (!deletedExemplary) {
      throw new NotFoundException('Exemplar não encontrado para remoção');
    }

    return deletedExemplary;
  }
}
