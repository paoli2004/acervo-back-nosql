// import { Livros } from '../../livros/entities/livros.entity';
// import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

// @Entity({ name: 'categorias' })
// export class Categorias {
//   @PrimaryGeneratedColumn()
//   id!: number;

//   @Column({ length: 50 })
//   nome!: string;

//   @Column({ length: 400, nullable: true })
//   descricao?: string;

//   @OneToMany(() => Livros, (livro) => livro.categoria)
//   livros!: Livros[];
// }
