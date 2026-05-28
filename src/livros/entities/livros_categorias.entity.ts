// import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
// import { Livros } from './livros.entity';
// import { Categorias } from '../../categorias/entities/categorias.entity';

// // Entidade associativa
// // Armazena a relação muitos-para-muitos entre Livros e Categorias
// @Entity('livros_categorias')
// export class LivroCategoria {
//   @PrimaryColumn()
//   livro_id!: number;

//   @PrimaryColumn()
//   autor_id!: number;

//   @ManyToOne(() => Livros)
//   @JoinColumn({ name: 'livro_id' })
//   livro!: Livros;

//   @ManyToOne(() => Categorias)
//   @JoinColumn({ name: 'categoria_id' })
//   categoria!: Categorias;
// }
