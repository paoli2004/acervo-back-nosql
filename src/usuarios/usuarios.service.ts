import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';
import { CreateUsuarioDto } from './dto/createUsuario.dto';
import { UpdateUsuarioDto } from './dto/updateUsuario.dto';
import { Model } from 'mongoose';
import { findOrFail } from '../common/utils/query.utils';

type FilterQuery<T> = { [P in keyof T]?: T[P] } & { _id?: any };

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}

  /**
   * Localiza um único documento de usuário baseado em um filtro de busca na coleção.
   * @param usuarioFilterQuery Objeto contendo os critérios de seleção (ex: { _id: id }).
   * @returns Documento do usuário encontrado com seus métodos e propriedades do Mongoose.
   * @throws {BadRequestException} Se o objeto de filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se nenhum documento na coleção corresponder ao critério.
   */
  async findUsuario(
    usuarioFilterQuery: FilterQuery<Usuario>,
  ): Promise<UsuarioDocument> {
    if (!usuarioFilterQuery || Object.keys(usuarioFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    return await findOrFail(
      this.usuarioModel.findOne(usuarioFilterQuery).exec(),
      'Usuário não encontrado',
    );
  }

  /**
   * Recupera uma lista de documentos de usuários da coleção, permitindo aplicar filtros opcionais.
   * @param usuarioFilterQuery Critério opcional de projeção ou busca (ex: { nome: 'José' }). Se omitido, retorna todos da coleção.
   * @returns Array contendo os documentos dos usuários localizados.
   */
  async findAllUsuarios(
    usuarioFilterQuery?: FilterQuery<Usuario>,
  ): Promise<UsuarioDocument[]> {
    return this.usuarioModel.find(usuarioFilterQuery).exec();
  }

  /**
   * Cria e persiste um novo documento de usuário na coleção correspondente do MongoDB.
   * @param createUsuarioDto Objeto contendo os dados estruturados e validados do usuário (nome, email, etc).
   * @returns O documento do usuário recém-criado, incluindo o identificador único (_id) gerado pelo banco.
   */
  async createUsuario(
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<UsuarioDocument> {
    return await this.usuarioModel.create(createUsuarioDto);
  }

  /**
   * Identifica um documento de usuário por meio de um filtro e aplica as modificações fornecidas.
   * @param usuarioFilterQuery Objeto de seleção para mapear o documento a ser alterado (ex: { _id: id }).
   * @param updateUsuarioDto Objeto contendo o conjunto de campos parciais ou completos a serem atualizados.
   * @returns O documento do usuário com as modificações aplicadas e atualizadas em memória.
   * @throws {BadRequestException} Se o objeto de filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se o documento alvo não for localizado para a operação de escrita.
   */
  async findOneAndUpdateUsuario(
    usuarioFilterQuery: FilterQuery<Usuario>,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<UsuarioDocument> {
    if (!usuarioFilterQuery || Object.keys(usuarioFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    return await findOrFail(
      this.usuarioModel
        .findOneAndUpdate(usuarioFilterQuery, updateUsuarioDto, { new: true })
        .exec(),
      'Usuário não encontrado para atualização',
    );
  }

  /**
   * Remove de forma definitiva um documento de usuário da coleção do MongoDB baseado em um filtro.
   * @param usuarioFilterQuery Objeto de seleção contendo as propriedades para identificar o usuário a ser deletado (ex: { _id: id }).
   * @returns O documento do usuário que foi removido da coleção.
   * @throws {BadRequestException} Se o objeto de filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se o documento não for encontrado na coleção para a remoção.
   */
  async deleteUsuario(usuarioFilterQuery: FilterQuery<Usuario>): Promise<void> {
    if (!usuarioFilterQuery || Object.keys(usuarioFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    await findOrFail(
      this.usuarioModel.findOneAndDelete(usuarioFilterQuery).exec(),
      'Usuário não encontrado para remoção',
    );
  }
}
