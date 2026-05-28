// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Categorias } from './entities/categorias.entity';
// import { CreateCategoriaDto } from './dto/createCategoria.dto';
// import { UpdateCategoriaDto } from './dto/updateCategoria.dto';

// @Injectable()
// export class CategoriasService {
//   constructor(
//     @InjectRepository(Categorias)
//     private categoriasRepository: Repository<Categorias>,
//   ) {}

//   /**
//    * Insere uma nova categoria.
//    * @param createCategoria - Dados da categoria.
//    * @returns Categoria criada.
//    */
//   async createCategoria(
//     createCategoria: CreateCategoriaDto,
//   ): Promise<Categorias> {
//     return this.categoriasRepository.save(createCategoria);
//   }

//   /**
//    * Atualiza uma categoria existente.
//    * @param id - ID do categoria.
//    * @param updateCategoria - Dados para atualização da categoria.
//    * @returns Categoria atualizada.
//    */
//   async updateCategoria(
//     id: number,
//     updateCategoria: UpdateCategoriaDto,
//   ): Promise<Categorias> {
//     const categoria = await this.getCategoriaById(id);

//     if (!categoria) {
//       throw new NotFoundException('Categoria não encontrada');
//     }

//     Object.assign(categoria, updateCategoria);

//     return this.categoriasRepository.save(categoria);
//   }

//   /**
//    * Retorna uma categoria.
//    * @param id - ID da categoria.
//    * @returns Categoria encontrada.
//    */
//   async getCategoriaById(id: number): Promise<Categorias | null> {
//     if (!id) {
//       throw new NotFoundException('Categoria não encontrada');
//     }
//     return this.categoriasRepository.findOne({ where: { id } });
//   }

//   /**
//    * Retorna todos os categorias registrados.
//    * @returns Lista de categorias.
//    */
//   async getAllCategorias(): Promise<Categorias[]> {
//     return this.categoriasRepository.find({
//       order: { id: 'ASC' },
//     });
//   }

//   async removeCategoria(id: number): Promise<void> {
//     const categoria = await this.getCategoriaById(id);
//     if (!categoria) {
//       throw new NotFoundException('Categoria não encontrada');
//     }
//     await this.categoriasRepository.remove(categoria);
//   }
// }
