import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Livro, LivroSchema } from './schemas/livro.schema';
import {
  Exemplar,
  ExemplarSchema,
} from '../exemplares/schemas/exemplar.schema';
import { LivrosController } from './livros.controller';
import { LivrosService } from './livros.service';
import { AutoresModule } from '../autores/autores.module';
import { CategoriasModule } from '../categorias/categorias.module';
import { EditorasModule } from '../editoras/editoras.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Livro.name, schema: LivroSchema },
      { name: Exemplar.name, schema: ExemplarSchema },
    ]),
    EditorasModule,
    AutoresModule,
    CategoriasModule,
  ],
  controllers: [LivrosController],
  providers: [LivrosService],
  exports: [LivrosService],
})
export class LivrosModule {}
