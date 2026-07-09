import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Autor, AutorDocument } from './schemas/autor.schema';
import { Livro, LivroDocument } from '../livros/schemas/livro.schema';
import { CreateAutorDto } from './dto/createAutor.dto';
import { findOrFail } from '../common/utils/query.utils';

type FilterQuery<T> = { [P in keyof T]?: T[P] } & { _id?: any };

@Injectable()
export class AutoresService {
  constructor(
    @InjectModel(Autor.name)
    private readonly autorModel: Model<AutorDocument>,
    @InjectModel(Livro.name)
    private readonly livroModel: Model<LivroDocument>,
  ) {}

  /**
   * Localiza um único documento de autor baseado em um filtro de busca na coleção.
   * @param autorFilterQuery Objeto contendo os critérios de seleção (ex: { _id: id }).
   * @returns Documento do autor encontrado com seus métodos e propriedades do Mongoose.
   * @throws {BadRequestException} Se o objeto de filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se nenhum documento na coleção corresponder ao critério.
   */
  async findAutor(
    autorFilterQuery: FilterQuery<Autor>,
  ): Promise<AutorDocument> {
    if (!autorFilterQuery || Object.keys(autorFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    return await findOrFail(
      this.autorModel.findOne(autorFilterQuery),
      'Autor não encontrado',
    );
  }

  /**
   * Recupera uma lista de documentos de autores da coleção, permitindo aplicar filtros opcionais.
   * @param autorFilterQuery Critério opcional de projeção ou busca (ex: { nome: 'José' }). Se omitido, retorna todos da coleção.
   * @returns Array contendo os documentos dos autores localizados.
   */
  async findAllAutores(
    autorFilterQuery?: FilterQuery<Autor>,
  ): Promise<AutorDocument[]> {
    return this.autorModel.find(autorFilterQuery).exec();
  }

  /**
   * Cria e persiste um novo documento de autor na coleção correspondente do MongoDB.
   * @param createAutorDto Objeto contendo os dados estruturados e validados do autor (nome, nacionalidade, etc).
   * @returns O documento do autor recém-criado, incluindo o identificador único (_id) gerado pelo banco.
   */
  async createAutor(createAutorDto: CreateAutorDto): Promise<AutorDocument> {
    return await this.autorModel.create(createAutorDto);
  }

  /**
   * Identifica um documento de autor por meio de um filtro e aplica as modificações fornecidas.
   * @param autorFilterQuery Objeto de seleção para mapear o documento a ser alterado (ex: { _id: id }).
   * @param updateAutorDto Objeto contendo o conjunto de campos parciais ou completos a serem atualizados.
   * @returns O documento do autor com as modificações aplicadas e atualizadas em memória.
   * @throws {BadRequestException} Se o objeto de filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se o documento alvo não for localizado para a operação de escrita.
   */
  async findOneAndUpdateAutor(
    autorFilterQuery: FilterQuery<Autor>,
    updateAutorDto: Partial<CreateAutorDto>,
  ): Promise<AutorDocument> {
    if (!autorFilterQuery || Object.keys(autorFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    return await findOrFail(
      this.autorModel.findOneAndUpdate(autorFilterQuery, updateAutorDto, {
        new: true,
      }),
      'Autor não encontrado para atualização',
    );
  }

  /**
   * Remove de forma definitiva um documento de autor da coleção do MongoDB baseado em um filtro.
   * @param autorFilterQuery Objeto de seleção contendo as propriedades para identificar o autor a ser deletado (ex: { _id: id }).
   * @returns O documento do autor que foi removido da coleção.
   * @throws {BadRequestException} Se o objeto de filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se o documento não for encontrado na coleção para a remoção.
   */
  async deleteAutor(autorFilterQuery: FilterQuery<Autor>): Promise<void> {
    if (!autorFilterQuery || Object.keys(autorFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const livrosVinculados = await this.livroModel.countDocuments({
      autores: new Types.ObjectId(autorFilterQuery._id),
    });

    if (livrosVinculados > 0) {
      throw new ConflictException(
        `Não é possível remover: ${livrosVinculados} livro(s) vinculado(s) a este autor. Reatribua ou remova esse(s) livro(s) antes.`,
      );
    }

    await findOrFail(
      this.autorModel.findOneAndDelete(autorFilterQuery),
      'Autor não encontrado para remoção',
    );
  }
}
