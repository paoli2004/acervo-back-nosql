// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
//   OneToMany,
//   ManyToMany,
//   JoinTable,
// } from 'typeorm';
// import { Editoras } from '../../editoras/entities/editoras.entity';
// import { Exemplares } from '../../exemplares/entities/exemplares.entity';
// import { Autores } from '../../autores/entities/autores.entity';
// import { Categorias } from '../../categorias/entities/categorias.entity';

// @Entity({ name: 'livros' })
// export class Livros {
//   @PrimaryGeneratedColumn()
//   id!: number;

//   @Column({ length: 150 })
//   titulo!: string;

//   @Column({ unique: true })
//   isbn!: string;

//   // um livro pode ter muitos exemplares, mas um exemplar tem apenas um livro
//   @OneToMany(() => Exemplares, (exemplares) => exemplares.livro)
//   exemplar!: Exemplares[];

//   @ManyToMany(() => Autores, (autor) => autor.livros)
//   @JoinTable({
//     name: 'livros_autores',
//     joinColumn: { name: 'livro_id', referencedColumnName: 'id' },
//     inverseJoinColumn: { name: 'autor_id', referencedColumnName: 'id' },
//   })
//   autor?: Autores[];

//   @ManyToMany(() => Categorias, (categoria) => categoria.livros)
//   @JoinTable({
//     name: 'livros_categorias',
//     joinColumn: { name: 'livro_id', referencedColumnName: 'id' },
//     inverseJoinColumn: { name: 'categoria_id', referencedColumnName: 'id' },
//   })
//   categoria!: Categorias[];
// }
