import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema({
  timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
  collection: 'usuarios',
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
export class Usuario {
  @Prop({ required: true, maxlength: 100 })
  nome!: string;

  @Prop({ required: true, maxlength: 100 })
  email!: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

// adicionar no schema de emprestimos, propriedade apontando para o usuário
// Exemplo de como ficará a referência dentro do seu emprestimo.schema.ts:
// @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true })
// usuario: Usuario;

//   @OneToMany(() => Emprestimos, (emprestimos) => emprestimos.usuario)
//   emprestimos!: Emprestimos[];
