import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Livro } from '../../livros/schemas/livro.schema';

export type ExemplarDocument = HydratedDocument<Exemplar>;

@Schema({
  timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
  collection: 'exemplares',
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
export class Exemplar {
  @Prop({ required: true, unique: true })
  codigo_patrimonio!: number;

  @Prop({ required: true })
  ano_publicacao!: number;

  @Prop({ required: true, default: true })
  ehDisponivel!: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'Livro',
    required: true,
  })
  livro!: Types.ObjectId | Livro;
}

export const ExemplarSchema = SchemaFactory.createForClass(Exemplar);
