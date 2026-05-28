// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   CreateDateColumn,
//   ManyToOne,
//   JoinColumn,
//   Column,
// } from 'typeorm';
// import { Usuarios } from '../../usuarios/schemas/usuario.schema';
// import { Exemplares } from '../../exemplares/entities/exemplares.entity';

// @Entity({ name: 'emprestimos' })
// export class Emprestimos {
//   @PrimaryGeneratedColumn()
//   id!: number;

//   // um empréstimo pertence a um usuário, mas um usuário pode ter muitos empréstimos
//   @ManyToOne(() => Usuarios, (usuarios) => usuarios.emprestimos)
//   @JoinColumn({ name: 'usuario_id' })
//   usuario!: Usuarios;

//   // um empréstimo pertence a um exemplar, mas um exemplar pode ter muitos empréstimos
//   @ManyToOne(() => Exemplares, (exemplares) => exemplares.emprestimos)
//   @JoinColumn({ name: 'exemplar_id' })
//   exemplar!: Exemplares;

//   @CreateDateColumn()
//   data_emprestimo!: Date;

//   @CreateDateColumn()
//   data_devolucao!: Date;

//   @Column()
//   ativo!: boolean;
// }
