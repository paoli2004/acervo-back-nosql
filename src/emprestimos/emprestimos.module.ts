import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Emprestimo } from './schemas/emprestimo.schema';
import { EmprestimosController } from './emprestimos.controller';
import { EmprestimosService } from './emprestimos.service';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { ExemplaresModule } from '../exemplares/exemplares.module';
import { EmprestimoSchema } from './schemas/emprestimo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Emprestimo.name , schema: EmprestimoSchema },
    ]),
    UsuariosModule,
    ExemplaresModule,
  ],
  controllers: [EmprestimosController],
  providers: [EmprestimosService],
})
export class EmprestimosModule {}
