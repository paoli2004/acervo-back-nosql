import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoriaDocument = HydratedDocument<Categoria>;

@Schema({
  timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
  collection: 'categorias',
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
export class Categoria {
  @Prop({ required: true, maxlength: 50 })
  nome!: string;

  @Prop({ maxlength: 400, nullable: true })
  descricao?: string;
}

export const CategoriaSchema = SchemaFactory.createForClass(Categoria);
