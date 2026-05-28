// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Autores } from './entities/autores.entity';
// import { CreateAutorDto } from './dto/createAutor.dto';
// import { UpdateAutorDto } from './dto/updateAutor.dto';

// @Injectable()
// export class AutoresService {
//   constructor(
//     @InjectRepository(Autores)
//     private autoresRepository: Repository<Autores>,
//   ) {}

//   /**
//    * Insere um novo autor.
//    * @param createAutor - Dados do autor.
//    * @returns Autor criado.
//    */
//   async createAutor(createAutor: CreateAutorDto): Promise<void> {
//     await this.autoresRepository.save(createAutor);
//   }

//   /**
//    * Atualiza um autor existente.
//    * @param id - ID do autor.
//    * @param updateAutor - Dados para atualização de autor.
//    * @returns Autor atualizado.
//    */
//   async updateAutor(id: number, updateAutor: UpdateAutorDto): Promise<void> {
//     const autor = await this.getAutorById(id);

//     if (!autor) {
//       throw new NotFoundException('Autor não encontrado');
//     }

//     Object.assign(autor, updateAutor);

//     await this.autoresRepository.save(autor);
//   }

//   /**
//    * Remove um autor.
//    * @param id ID do autor.
//    */
//   async removeAutor(id: number): Promise<void> {
//     const autor = await this.getAutorById(id);

//     if (!autor) {
//       throw new NotFoundException('Autor não encontrado');
//     }

//     await this.autoresRepository.remove(autor);
//   }

//   /**
//    * Retorna um autor.
//    * @param id - ID do autor.
//    * @returns Autor encontrado.
//    */
//   async getAutorById(id: number): Promise<Autores | null> {
//     if (!id) {
//       throw new NotFoundException('Autor não encontrado');
//     }
//     return this.autoresRepository.findOne({ where: { id } });
//   }

//   /**
//    * Retorna todos os autores registrados.
//    * @returns Lista de autores.
//    */
//   async getAllAutores(): Promise<Autores[]> {
//     return this.autoresRepository.find({
//       order: { id: 'ASC' },
//     });
//   }
// }
