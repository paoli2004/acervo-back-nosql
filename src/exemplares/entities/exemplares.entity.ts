// import {
//   Check,
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   OneToMany,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { Livros } from '../../livros/entities/livros.entity';
// import { Emprestimos } from '../../emprestimos/entities/emprestimos.entity';
// import { Editoras } from 'src/editoras/entities/editoras.entity';

// @Entity({ name: 'exemplares' })
// export class Exemplares {
//   @PrimaryGeneratedColumn()
//   id!: number;

//   // um exemplar pertence a um livro, mas um livro pode ter muitos exemplares
//   @ManyToOne(() => Livros, (livro) => livro.exemplar)
//   @JoinColumn({ name: 'livro_id' })
//   livro!: Livros;

//   @Column({ unique: true })
//   codigo_patrimonio!: number;

//   @Column()
//   ano_publicacao!: number;

//   // um exemplar pode ter muitos empréstimos, mas um empréstimo pertence a um exemplar
//   @OneToMany(() => Emprestimos, (emprestimos) => emprestimos.exemplar)
//   emprestimos!: Emprestimos[];

//   // uma editora pode ter muitos livros, mas um livro tem apenas uma editora
//   @ManyToOne(() => Editoras, (editoras) => editoras.exemplares)
//   @JoinColumn({ name: 'editora_id' })
//   editora!: Editoras;
// }
