// import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// import { Exemplares } from '../../exemplares/entities/exemplares.entity';

// @Entity({ name: 'editoras' })
// export class Editoras {
//   @PrimaryGeneratedColumn()
//   id!: number;

//   @Column({ length: 100 })
//   nome!: string;

//   @Column({ length: 100 })
//   cidade!: string;

//   // um livro tem apenas uma editora, mas uma editora pode ter muitos livros
//   @OneToMany(() => Exemplares, (exemplares) => exemplares.editora)
//   exemplares!: Exemplares[];
// }
