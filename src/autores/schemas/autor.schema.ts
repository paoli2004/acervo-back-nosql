import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AutorDocument = HydratedDocument<Autor>;

@Schema({
  timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
  collection: 'autores',
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
export class Autor {
  @Prop({ required: true, maxlength: 100 })
  nome!: string;

  @Prop({ required: true, maxlength: 50 })
  nacionalidade!: string;
}

export const AutorSchema = SchemaFactory.createForClass(Autor);
