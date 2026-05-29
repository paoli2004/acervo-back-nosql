import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Autor } from '../../autores/schemas/autor.schema';
import { Categoria } from '../../categorias/schemas/categoria.schema';
import { Editora } from '../../editoras/schemas/editora.schema';

export type LivroDocument = HydratedDocument<Livro>;

@Schema({
  timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
  collection: 'livros',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      const { _id, __v, ...rest } = ret;
      return rest;
    },
  },
  toObject: { virtuals: true },
})
export class Livro {
  @Prop({ required: true, maxlength: 150 })
  titulo!: string;

  @Prop({ required: true, unique: true })
  isbn!: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Autor' }], required: false })
  autores?: Types.ObjectId[] | Autor[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Categoria' }], required: true })
  categorias!: Types.ObjectId[] | Categoria[];

  @Prop({ type: Types.ObjectId, ref: 'Editora', required: true })
  editora!: Types.ObjectId | Editora;
}

export const LivroSchema = SchemaFactory.createForClass(Livro);
