import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Editora, EditoraSchema } from './schemas/editora.schema';
import { Livro, LivroSchema } from '../livros/schemas/livro.schema';
import { EditorasController } from './editoras.controller';
import { EditorasService } from './editoras.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Editora.name, schema: EditoraSchema },
      { name: Livro.name, schema: LivroSchema },
    ]),
  ],
  controllers: [EditorasController],
  providers: [EditorasService],
  exports: [EditorasService],
})
export class EditorasModule {}
