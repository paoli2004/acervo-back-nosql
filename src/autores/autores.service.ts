import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Autor, AutorDocument } from './schemas/autor.schema';
import { CreateAutorDto } from './dto/createAutor.dto';

type FilterQuery<T> = { [P in keyof T]?: T[P] } & { _id?: any };

@Injectable()
export class AutoresService {
  constructor(
    @InjectModel(Autor.name)
    private readonly autorModel: Model<AutorDocument>,
  ) {}

  /**
   * Retorna um único autor baseado em um filtro de busca.
   * @param autorFilterQuery Objeto de filtro para encontrar o autor (ex: { _id: id }).
   * @returns Autor encontrado.
   * @throws {BadRequestException} Se o filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se nenhum autor corresponder ao filtro.
   */
  async findAutor(autorFilterQuery: FilterQuery<Autor>): Promise<Autor> {
    if (!autorFilterQuery || Object.keys(autorFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const autor = await this.autorModel.findOne(autorFilterQuery).exec();

    if (!autor) {
      throw new NotFoundException('Autor não encontrado');
    }

    return autor;
  }

  /**
   * Retorna uma lista de autores cadastrados, permitindo aplicar filtros opcionais.
   * @param autorFilterQuery Filtro opcional de busca (ex: { nome: 'José' }). Se omitido, traz todos.
   * @returns Array de autores.
   */
  async findAllAutores(
    autorFilterQuery?: FilterQuery<Autor>,
  ): Promise<Autor[]> {
    return this.autorModel.find(autorFilterQuery).exec();
  }

  /**
   * Cria e registra um novo autor no banco de dados.
   * @param createAutorDto Objeto contendo os dados de criação validados do autor (nome, email, etc).
   * @returns Documento do autor recém-criado.
   */
  async createAutor(createAutorDto: CreateAutorDto): Promise<Autor> {
    const newAutor = new this.autorModel(createAutorDto);
    return await newAutor.save();
  }

  /**
   * Localiza um autor por um filtro e aplica as atualizações fornecidas.
   * @param autorFilterQuery Objeto de filtro para identificar o autor a ser atualizado (ex: { _id: id }).
   * @param updateAutorDto Objeto contendo os campos que serão modificados (parcial ou completo).
   * @returns documento do autor atualizado.
   * @throws {BadRequestException} Se o filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se o autor não for encontrado para a atualização.
   */
  async findOneAndUpdateAutor(
    autorFilterQuery: FilterQuery<Autor>,
    updateAutorDto: Partial<CreateAutorDto>,
  ): Promise<Autor> {
    if (!autorFilterQuery || Object.keys(autorFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const updatedAuthor = await this.autorModel
      .findOneAndUpdate(autorFilterQuery, updateAutorDto, { new: true })
      .exec();

    if (!updatedAuthor) {
      throw new NotFoundException('Autor não encontrado para atualização');
    }

    return updatedAuthor;
  }

  /**
   * Remove um autor do banco de dados baseado em um filtro de busca.
   * @param autorFilterQuery Objeto de filtro para identificar o autor a ser removido (ex: { _id: id }).
   * @returns void
   * @throws {BadRequestException} Se o filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se o autor não for encontrado para a remoção.
   */
  async deleteAutor(autorFilterQuery: FilterQuery<Autor>): Promise<void> {
    if (!autorFilterQuery || Object.keys(autorFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const deletedAuthor = await this.autorModel
      .findOneAndDelete(autorFilterQuery)
      .exec();

    if (!deletedAuthor) {
      throw new NotFoundException('Autor não encontrado para remoção');
    }
  }
}
