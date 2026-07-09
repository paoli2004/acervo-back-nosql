import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario } from './schemas/usuario.schema';
import { UsuarioSchema } from './schemas/usuario.schema';
import {
  Emprestimo,
  EmprestimoSchema,
} from '../emprestimos/schemas/emprestimo.schema';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Emprestimo.name, schema: EmprestimoSchema },
    ]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
