import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Usuario } from '../../usuarios/schemas/usuario.schema';
import { Types } from 'mongoose';

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
  usuario!: Usuario;

  @Prop({ type: Date, default: Date.now })
  data_emprestimo!: Date;

  @Prop({ type: Date })
  data_devolucao!: Date;

  @Prop()
  ativo!: boolean;

  // fazer a relação de exemplar
}

export const EmprestimoSchema = SchemaFactory.createForClass(Emprestimo);

//   // um empréstimo pertence a um exemplar, mas um exemplar pode ter muitos empréstimos
//   @ManyToOne(() => Exemplares, (exemplares) => exemplares.emprestimos)
//   @JoinColumn({ name: 'exemplar_id' })
//   exemplar!: Exemplares;