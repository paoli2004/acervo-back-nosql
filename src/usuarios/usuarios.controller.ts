import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/createUsuario.dto';
import { UpdateUsuarioDto } from './dto/updateUsuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get(':usuarioId')
  async findUsuario(@Param('usuarioId') usuarioId: string) {
    return this.usuariosService.findUsuario({ _id: usuarioId });
  }

  @Get()
  async findAllUsuarios() {
    return this.usuariosService.findAllUsuarios();
  }

  @Post()
  async createUsuario(@Body() createUsuario: CreateUsuarioDto) {
    const newUser = await this.usuariosService.createUsuario(createUsuario);

    return {
      message: 'Usuário criado com sucesso',
      usuario: newUser,
    };
  }

  @Patch(':usuarioId')
  async findOneAndUpdateUsuario(
    @Param('usuarioId') usuarioId: string,
    @Body() updateUsuario: UpdateUsuarioDto,
  ) {
    const updatedUser = await this.usuariosService.findOneAndUpdateUsuario(
      { _id: usuarioId },
      updateUsuario,
    );

    return {
      message: 'Usuário atualizado com sucesso',
      usuario: updatedUser,
    };
  }

  @Delete(':usuarioId')
  async deleteUsuario(@Param('usuarioId') usuarioId: string) {
    await this.usuariosService.deleteUsuario({
      _id: usuarioId,
    });

    return {
      message: 'Usuário removido com sucesso',
    };
  }
}
