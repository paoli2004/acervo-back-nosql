import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EditoraDocument = HydratedDocument<Editora>;
@Schema({
  timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
  collection: 'editoras',
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
export class Editora {
  @Prop({ required: true, maxlength: 100 })
  nome!: string;

  @Prop({ required: true, maxlength: 100 })
  cidade!: string;
}

export const EditoraSchema = SchemaFactory.createForClass(Editora);
