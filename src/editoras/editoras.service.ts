import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Editora, EditoraDocument } from './schemas/editora.schema';
import { CreateEditoraDto } from './dto/createEditora.dto';
import { UpdateEditoraDto } from './dto/updateEditora.dto';
import { findOrFail } from '../common/utils/query.utils';

type FilterQuery<T> = { [P in keyof T]?: T[P] } & { _id?: any };

@Injectable()
export class EditorasService {
  constructor(
    @InjectModel(Editora.name)
    private editorasModel: Model<EditoraDocument>,
  ) {}

  /**
   * Localiza um único documento de editora baseado em um filtro de busca na coleção.
   * @param editoraFilterQuery Objeto contendo os critérios de seleção (ex: { _id: id }).
   * @returns Documento da editora encontrada com seus métodos e propriedades do Mongoose.
   * @throws {BadRequestException} Se o objeto de filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se nenhum documento na coleção corresponder ao critério.
   */
  async findEditora(
    editoraFilterQuery: FilterQuery<Editora>,
  ): Promise<EditoraDocument> {
    if (!editoraFilterQuery || Object.keys(editoraFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    return await findOrFail(
      this.editorasModel.findOne(editoraFilterQuery).exec(),
      'Editora não encontrada',
    );
  }

  /**
   * Recupera uma lista de documentos de editoras da coleção, permitindo aplicar filtros opcionais.
   * @param editoraFilterQuery Critério opcional de projeção ou busca (ex: { nome: 'Editora fulana' }). Se omitido, retorna todos da coleção.
   * @returns Array contendo os documentos das editoras localizadas.
   */
  async findAllEditoras(
    editoraFilterQuery?: FilterQuery<Editora>,
  ): Promise<EditoraDocument[]> {
    return this.editorasModel.find(editoraFilterQuery).exec();
  }

  /**
   * Cria e persiste um novo documento de editora na coleção correspondente do MongoDB.
   * @param createEditoraDto Objeto contendo os dados estruturados e validados da editora (nome, cidade, etc).
   * @returns O documento da editora recém-criado, incluindo o identificador único (_id) gerado pelo banco.
   */
  async createEditora(
    createEditoraDto: CreateEditoraDto,
  ): Promise<EditoraDocument> {
    return await this.editorasModel.create(createEditoraDto);
  }

  /**
   * Identifica um documento de editora por meio de um filtro e aplica as modificações fornecidas.
   * @param editoraFilterQuery Objeto de seleção para mapear o documento a ser alterado (ex: { _id: id }).
   * @param updateEditoraDto Objeto contendo o conjunto de campos parciais ou completos a serem atualizados.
   * @returns O documento da editora com as modificações aplicadas e atualizadas em memória.
   * @throws {BadRequestException} Se o objeto de filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se o documento alvo não for localizado para a operação de escrita.
   */
  async findOneAndUpdateEditora(
    editoraFilterQuery: FilterQuery<Editora>,
    updateEditoraDto: UpdateEditoraDto,
  ): Promise<EditoraDocument> {
    if (!editoraFilterQuery || Object.keys(editoraFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    return await findOrFail(
      this.editorasModel
        .findOneAndUpdate(editoraFilterQuery, updateEditoraDto, { new: true })
        .exec(),
      'Editora não encontrada para atualização',
    );
  }

  /**
   * Remove de forma definitiva um documento de editora da coleção do MongoDB baseado em um filtro.
   * @param editoraFilterQuery Objeto de seleção contendo as propriedades para identificar a editora a ser deletada (ex: { _id: id }).
   * @returns O documento da editora que foi removido da coleção.
   * @throws {BadRequestException} Se o objeto de filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se o documento não for encontrado na coleção para a remoção.
   */
  async deleteEditora(editoraFilterQuery: FilterQuery<Editora>): Promise<void> {
    if (!editoraFilterQuery || Object.keys(editoraFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    return await findOrFail(
      this.editorasModel.findOneAndDelete(editoraFilterQuery),
      'Editora não encontrada para remoção',
    );
  }
}
