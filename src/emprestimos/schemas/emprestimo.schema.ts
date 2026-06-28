import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Usuario } from '../../usuarios/schemas/usuario.schema';
import { Types } from 'mongoose';
import { Exemplar } from '../../exemplares/schemas/exemplar.schema';

export type EmprestimoDocument = HydratedDocument<Emprestimo>;

@Schema({
  timestamps: { createdAt: 'criado_em' },
  collection: 'emprestimos',
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
export class Emprestimo {
  @Prop({
    type: Types.ObjectId,
    ref: 'Usuario',
    required: true,
  })
  usuario!: Types.ObjectId | Usuario;

  @Prop({ type: Date, default: Date.now })
  data_emprestimo!: Date;

  @Prop({ type: Date })
  data_devolucao!: Date;

  @Prop()
  ativo!: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Exemplar', required: true })
  exemplar!: Types.ObjectId | Exemplar;
}

export const EmprestimoSchema = SchemaFactory.createForClass(Emprestimo);
