import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Editora } from './schemas/editora.schema';
import { CreateEditoraDto } from './dto/createEditora.dto';
import { UpdateEditoraDto } from './dto/updateEditora.dto';

type FilterQuery<T> = { [P in keyof T]?: T[P] } & { _id?: any };

@Injectable()
export class EditorasService {
  constructor(
    @InjectModel(Editora.name)
    private editorasModel: Model<Editora>,
  ) {}

  /**
   * Retorna uma única editora baseada em um filtro de busca.
   * @param editoraFilterQuery Objeto de filtro para encontrar a editora (ex: { _id: id } ou { nome }).
   * @returns Editora encontrada.
   * @throws {BadRequestException} Se o filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se nenhuma editora corresponder ao filtro.
   */
  async findEditora(
    editoraFilterQuery: FilterQuery<Editora>,
  ): Promise<Editora> {
    if (!editoraFilterQuery || Object.keys(editoraFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const editora = await this.editorasModel.findOne(editoraFilterQuery).exec();

    if (!editora) {
      throw new NotFoundException('Editora não encontrada');
    }

    return editora;
  }

  /**
   * Retorna uma lista de editoras cadastradas, permitindo aplicar filtros opcionais.
   * @param editoraFilterQuery Filtro opcional de busca (ex: { nome: 'Editora Intrínseca' }). Se omitido, traz todos.
   * @returns Array de editoras.
   */
  async findAllEditoras(
    editoraFilterQuery?: FilterQuery<Editora>,
  ): Promise<Editora[]> {
    return this.editorasModel.find(editoraFilterQuery).exec();
  }

  /**
   * Cria e registra uma nova editora no banco de dados.
   * @param createEditoraDto Objeto contendo os dados de criação validados da editora (nome, email, etc).
   * @returns Documento da editora recém-criada.
   */
  async createEditora(createEditoraDto: CreateEditoraDto): Promise<Editora> {
    const newPublisher = new this.editorasModel(createEditoraDto);
    return newPublisher.save();
  }

  /**
   * Localiza uma editora por um filtro e aplica as atualizações fornecidas.
   * @param editoraFilterQuery Objeto de filtro para identificar a editora a ser atualizada (ex: { _id: id }).
   * @param updateEditoraDto Objeto contendo os campos que serão modificados (parcial ou completo).
   * @returns documento da editora atualizada.
   * @throws {BadRequestException} Se o filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se a editora não for encontrada para a atualização.
   */
  async findOneAndUpdateEditora(
    editoraFilterQuery: FilterQuery<Editora>,
    updateEditoraDto: UpdateEditoraDto,
  ): Promise<Editora> {
    if (!editoraFilterQuery || Object.keys(editoraFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const updatedPublisher = await this.editorasModel
      .findOneAndUpdate(editoraFilterQuery, updateEditoraDto, { new: true })
      .exec();

    if (!updatedPublisher) {
      throw new NotFoundException('Editora não encontrada');
    }
    return updatedPublisher;
  }

  /**
   * Remove uma editora do banco de dados baseado em um filtro de busca.
   * @param editoraFilterQuery Objeto de filtro para identificar a editora a ser removida (ex: { _id: id }).
   * @returns void
   * @throws {BadRequestException} Se o filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se a editora não for encontrada para a remoção.
   */
  async deleteEditora(editoraFilterQuery: FilterQuery<Editora>): Promise<void> {
    if (!editoraFilterQuery || Object.keys(editoraFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const deletedPublisher = await this.editorasModel
      .findOneAndDelete(editoraFilterQuery)
      .exec();

    if (!deletedPublisher) {
      throw new NotFoundException('Editora não encontrada para remoção');
    }
  }
}
