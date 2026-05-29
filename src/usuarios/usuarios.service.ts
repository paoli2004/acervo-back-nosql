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

type FilterQuery<T> = { [P in keyof T]?: T[P] } & { _id?: any };

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}

  /**
   * Retorna um único usuário baseado em um filtro de busca.
   * @param usuarioFilterQuery Objeto de filtro para encontrar o usuário (ex: { _id: id } ou { email }).
   * @returns Usuário encontrado.
   * @throws {BadRequestException} Se o filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se nenhum usuário corresponder ao filtro.
   */
  async findUsuario(
    usuarioFilterQuery: FilterQuery<Usuario>,
  ): Promise<Usuario> {
    if (!usuarioFilterQuery || Object.keys(usuarioFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const usuario = await this.usuarioModel.findOne(usuarioFilterQuery).exec();

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  /**
   * Retorna uma lista de usuários cadastrados, permitindo aplicar filtros opcionais.
   * @param usuarioFilterQuery Filtro opcional de busca (ex: { nome: 'Ana' }). Se omitido, traz todos.
   * @returns Array de usuários.
   */
  async findAllUsuarios(
    usuarioFilterQuery?: FilterQuery<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioModel.find(usuarioFilterQuery).exec();
  }

  /**
   * Cria e registra um novo usuário no banco de dados.
   * @param createUsuarioDto Objeto contendo os dados de criação validados do usuário (nome, email, etc).
   * @returns Documento do usuário recém-criado.
   */
  async createUsuario(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const newUsuario = new this.usuarioModel(createUsuarioDto);
    return await newUsuario.save();
  }

  /**
   * Localiza um usuário por um filtro e aplica as atualizações fornecidas.
   * @param usuarioFilterQuery Objeto de filtro para identificar o usuário a ser atualizado (ex: { _id: id }).
   * @param updateUsuarioDto Objeto contendo os campos que serão modificados (parcial ou completo).
   * @returns documento do usuário atualizado.
   * @throws {BadRequestException} Se o filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se o usuário não for encontrado para a atualização.
   */
  async findOneAndUpdateUsuario(
    usuarioFilterQuery: FilterQuery<Usuario>,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    if (!usuarioFilterQuery || Object.keys(usuarioFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const updatedUser = await this.usuarioModel
      .findOneAndUpdate(usuarioFilterQuery, updateUsuarioDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Usuário não encontrado para atualização');
    }

    return updatedUser;
  }

  /**
   * Remove um usuário do banco de dados baseado em um filtro de busca.
   * @param usuarioFilterQuery Objeto de filtro para identificar o usuário a ser removido (ex: { _id: id }).
   * @returns void
   * @throws {BadRequestException} Se o filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se o usuário não for encontrado para a remoção.
   */
  async deleteUsuario(usuarioFilterQuery: FilterQuery<Usuario>): Promise<void> {
    if (!usuarioFilterQuery || Object.keys(usuarioFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const deletedUser = await this.usuarioModel
      .findOneAndDelete(usuarioFilterQuery)
      .exec();

    if (!deletedUser) {
      throw new NotFoundException('Usuário não encontrado para remoção');
    }
  }
}
