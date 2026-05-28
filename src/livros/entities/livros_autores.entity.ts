// import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
// import { Livros } from './livros.entity';
// import { Autores } from '../../autores/entities/autores.entity';

// // Entidade associativa
// // Armazena a relação muitos-para-muitos entre Livros e Autores
// @Entity('livros_autores')
// export class LivroAutor {
//   @PrimaryColumn()
//   livro_id!: number;

//   @PrimaryColumn()
//   autor_id!: number;

//   @ManyToOne(() => Livros)
//   @JoinColumn({ name: 'livro_id' })
//   livro!: Livros;

//   @ManyToOne(() => Autores)
//   @JoinColumn({ name: 'autor_id' })
//   autor!: Autores;
// }
