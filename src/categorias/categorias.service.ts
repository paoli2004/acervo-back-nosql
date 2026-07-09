import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Categoria, CategoriaDocument } from './schemas/categoria.schema';
import { Livro, LivroDocument } from '../livros/schemas/livro.schema';
import { CreateCategoriaDto } from './dto/createCategoria.dto';
import { UpdateCategoriaDto } from './dto/updateCategoria.dto';

type FilterQuery<T> = { [P in keyof T]?: T[P] } & { _id?: any };

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel(Categoria.name)
    private readonly categoriaModel: Model<CategoriaDocument>,
    @InjectModel(Livro.name)
    private readonly livroModel: Model<LivroDocument>,
  ) {}

  /**
   * Retorna uma única categoria baseado em um filtro de busca.
   * @param categoriaFilterQuery Objeto de filtro para encontrar a categoria (ex: { _id: id } ou { nome: 'romance' }).
   * @returns Categoria encontrada.
   * @throws {BadRequestException} Se o filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se nenhuma categoria corresponder ao filtro.
   */
  async findCategoria(
    categoriaFilterQuery: FilterQuery<Categoria>,
  ): Promise<Categoria> {
    if (
      !categoriaFilterQuery ||
      Object.keys(categoriaFilterQuery).length === 0
    ) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const categoria = await this.categoriaModel
      .findOne(categoriaFilterQuery)
      .exec();

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }
    return categoria;
  }

  /**
   * Retorna uma lista de categorias cadastradas, permitindo aplicar filtros opcionais.
   * @param categoriaFilterQuery Filtro opcional de busca (ex: { nome: 'Ana' }). Se omitido, traz todos.
   * @returns Array de categorias.
   */
  async findAllCategorias(
    categoriaFilterQuery?: FilterQuery<Categoria>,
  ): Promise<Categoria[]> {
    return this.categoriaModel.find(categoriaFilterQuery).exec();
  }

  /**
   * Cria e registra uma nova categoria no banco de dados.
   * @param createCategoriaDto Objeto contendo os dados de criação validados da categoria (nome, descrição, etc).
   * @returns Documento da categoria recém-criada.
   */
  async createCategoria(
    createCategoriaDto: CreateCategoriaDto,
  ): Promise<Categoria> {
    const newCategory = new this.categoriaModel(createCategoriaDto);
    return newCategory.save();
  }

  /**
   * Localiza uma categoria por um filtro e aplica as atualizações fornecidas.
   * @param categoriaFilterQuery Objeto de filtro para identificar a categoria a ser atualizada (ex: { _id: id }).
   * @param updateCategoriaDto Objeto contendo os campos que serão modificados (parcial ou completo).
   * @returns documento da categoria atualizada.
   * @throws {BadRequestException} Se o filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se a categoria não for encontrada para a atualização.
   */
  async findOneAndUpdateCategoria(
    categoriaFilterQuery: FilterQuery<Categoria>,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<Categoria> {
    if (
      !categoriaFilterQuery ||
      Object.keys(categoriaFilterQuery).length === 0
    ) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const updatedCategory = await this.categoriaModel
      .findOneAndUpdate(categoriaFilterQuery, updateCategoriaDto, {
        new: true,
      })
      .exec();

    if (!updatedCategory) {
      throw new NotFoundException('Categoria não encontrada para atualização');
    }

    return updatedCategory;
  }

  /**
   * Remove uma categoria do banco de dados baseado em um filtro de busca.
   * @param categoriaFilterQuery Objeto de filtro para identificar a categoria a ser removida (ex: { _id: id }).
   * @returns void
   * @throws {BadRequestException} Se o filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se a categoria não for encontrada para a remoção.
   */
  async deleteCategoria(
    categoriaFilterQuery: FilterQuery<Categoria>,
  ): Promise<void> {
    if (
      !categoriaFilterQuery ||
      Object.keys(categoriaFilterQuery).length === 0
    ) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const livrosVinculados = await this.livroModel.countDocuments({
      categorias: new Types.ObjectId(categoriaFilterQuery._id),
    });

    if (livrosVinculados > 0) {
      throw new ConflictException(
        `Não é possível remover: ${livrosVinculados} livro(s) vinculado(s) a esta categoria. Reatribua ou remova esse(s) livro(s) antes.`,
      );
    }

    const deletedCategory = await this.categoriaModel
      .findOneAndDelete(categoriaFilterQuery)
      .exec();

    if (!deletedCategory) {
      throw new NotFoundException('Categoria não encontrada para exclusão');
    }
  }
}
