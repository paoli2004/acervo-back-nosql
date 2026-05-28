// import {
//   ConflictException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Not, Repository } from 'typeorm';
// import { CreateLivroDto } from './dto/createLivro.dto';
// import { Livros } from './entities/livros.entity';
// import { Autores } from '../autores/entities/autores.entity';
// import { AutoresService } from '../autores/autores.service';
// import { CategoriasService } from '../categorias/categorias.service';
// import { UpdateLivroDto } from './dto/updateLivro.dto';

// @Injectable()
// export class LivrosService {
//   constructor(
//     @InjectRepository(Livros)
//     private readonly livrosRepository: Repository<Livros>,
//     private readonly AutoresService: AutoresService,
//     private readonly CategoriasService: CategoriasService,
//   ) {}

//   /**
//    *Executa uma Promise que busca uma entidade e lança erro caso não encontre.
//    *
//    * @template T Tipo da entidade esperada
//    * @param promise Promise que retorna a entidade ou null (ex: findOne do TypeORM)
//    * @param message Mensagem de erro caso a entidade não seja encontrada
//    * @returns A entidade encontrada (garantido que não é null)
//    */
//   private async findOrFail<T>(
//     promise: Promise<T | null>,
//     message: string,
//   ): Promise<T> {
//     const result = await promise;

//     if (!result) {
//       throw new NotFoundException(message);
//     }

//     return result;
//   }

//   /**
//    * Insere um novo livro.
//    * @param createLivro
//    * @returns Livro criado.
//    */
//   async createLivro(createLivro: CreateLivroDto): Promise<void> {
//     const isbnAlreadyExist = await this.livrosRepository.findOne({
//       where: { isbn: createLivro.isbn },
//     });

//     if (isbnAlreadyExist) {
//       throw new ConflictException(
//         'Já existe um livro cadastrado com este ISBN.',
//       );
//     }

//     const categorias = await Promise.all(
//       createLivro.categoria_id.map((id) =>
//         this.findOrFail(
//           this.CategoriasService.getCategoriaById(id),
//           `Categoria ${id} não encontrada`,
//         ),
//       ),
//     );

//     const autores = createLivro.autor_id?.length
//       ? await Promise.all(
//           createLivro.autor_id.map((id) =>
//             this.findOrFail(
//               this.AutoresService.getAutorById(id),
//               `Autor ${id} não encontrado`,
//             ),
//           ),
//         )
//       : [];

//     const livro = this.livrosRepository.create({
//       titulo: createLivro.titulo,
//       isbn: createLivro.isbn,
//       autor: autores,
//       categoria: categorias,
//     });

//     await this.livrosRepository.save(livro);
//   }

//   async updateLivro(id: number, updateLivro: UpdateLivroDto): Promise<void> {
//     const livro = await this.findOrFail(
//       this.getLivroById(id),
//       'Livro não encontrado',
//     );

//     if (updateLivro.isbn) {
//       const isbnAlreadyExist = await this.livrosRepository.findOne({
//         where: { isbn: updateLivro.isbn, id: Not(id) },
//       });

//       if (isbnAlreadyExist) {
//         throw new ConflictException(
//           'Já existe um livro cadastrado com este ISBN.',
//         );
//       }
//     }

//     if (updateLivro.autor_id?.length) {
//       livro.autor = await Promise.all(
//         updateLivro.autor_id.map((autorId) =>
//           this.findOrFail(
//             this.AutoresService.getAutorById(autorId),
//             `Autor ${autorId} não encontrado`,
//           ),
//         ),
//       );
//     }

//     if (updateLivro.categoria_id?.length) {
//       livro.categoria = await Promise.all(
//         updateLivro.categoria_id.map((catId) =>
//           this.findOrFail(
//             this.CategoriasService.getCategoriaById(catId),
//             `Categoria ${catId} não encontrada`,
//           ),
//         ),
//       );
//     }

//     Object.assign(livro, {
//       titulo: updateLivro.titulo ?? livro.titulo,
//       isbn: updateLivro.isbn ?? livro.isbn,
//     });

//     await this.livrosRepository.save(livro);
//   }

//   /**
//    * Remove um livro.
//    * @param id ID do livro.
//    * @returns Promise<void>.
//    */
//   async removeLivro(id: number): Promise<void> {
//     const livro = await this.findOrFail(
//       this.getLivroById(id),
//       'Livro não encontrado',
//     );

//     await this.livrosRepository.remove(livro);
//   }

//   /**
//    * Retorna todos os livros.
//    * @returns Lista de livros.
//    */
//   async getAllLivros(): Promise<any[]> {
//     const livros = await this.livrosRepository.find({
//       order: { id: 'ASC' },
//       relations: ['autor', 'categoria'],
//     });

//     return livros.map((livro) => ({
//       ...livro,
//       autor: livro.autor || null,
//       categoria: livro.categoria,
//     }));
//   }

//   /**
//    * Retorna um livro.
//    * @param id ID do livro.
//    * @returns Livro encontrado.
//    */
//   async getLivroById(id: number): Promise<any> {
//     const livro = await this.livrosRepository.findOne({
//       where: { id },
//       relations: ['autor', 'categoria'],
//     });

//     if (!livro) {
//       throw new NotFoundException('Livro não encontrado');
//     }

//     return {
//       id: livro.id,
//       titulo: livro.titulo,
//       isbn: livro.isbn,
//       autor: livro.autor || null,
//       categoria: livro.categoria,
//     };
//   }

//   async buscarAvancado(params: {
//     autor_id?: number;
//     categoria_id?: number;
//     onlyDisponiveis?: boolean;
//   }): Promise<any[]> {
//     const qb = this.livrosRepository
//       .createQueryBuilder('livro')
//       .leftJoinAndSelect('livro.autor', 'autor')
//       .leftJoinAndSelect('livro.categoria', 'categoria')
//       .leftJoinAndSelect('livro.exemplar', 'exemplar')
//       .leftJoinAndSelect(
//         'exemplar.emprestimos',
//         'emprestimo',
//         'emprestimo.ativo = :ativo',
//         { ativo: true },
//       );

//     if (params.autor_id) {
//       qb.andWhere('autor.id = :autor_id', { autor_id: params.autor_id });
//     }

//     if (params.categoria_id) {
//       qb.andWhere('categoria.id = :categoria_id', {
//         categoria_id: params.categoria_id,
//       });
//     }

//     if (params.onlyDisponiveis) {
//       qb.andWhere('exemplar.id IS NOT NULL').andWhere(
//         'emprestimo.ativo IS NOT TRUE',
//       );
//     }

//     const livros = await qb.orderBy('livro.id', 'ASC').getMany();

//     return livros.map((livro) => ({
//       id: livro.id,
//       titulo: livro.titulo,
//       isbn: livro.isbn,
//       autor: livro.autor ?? [],
//       categoria: livro.categoria ?? [],
//       temExemplarDisponivel:
//         (livro.exemplar?.length ?? 0) > 0 &&
//         livro.exemplar.some(
//           (e: any) =>
//             e.id != null && !e.emprestimos?.some((emp: any) => emp.ativo),
//         ),
//     }));
//   }
// }
