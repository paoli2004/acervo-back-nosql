// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Editoras } from './entities/editoras.entity';
// import { CreateEditoraDto } from './dto/createEditora.dto';
// import { UpdateEditoraDto } from './dto/updateEditora.dto';

// @Injectable()
// export class EditorasService {
//   constructor(
//     @InjectRepository(Editoras)
//     private editorasRepository: Repository<Editoras>,
//   ) {}

//   /**
//    * Insere um nova editora.
//    * @param createEditora - Dados da editora.
//    * @returns Editora criada.
//    */
//   async createEditora(createEditora: CreateEditoraDto): Promise<Editoras> {
//     return this.editorasRepository.save(createEditora);
//   }

//   /**
//    * Atualiza uma editora existente.
//    * @param id - ID da editora.
//    * @param updateEditora - Dados para atualização da editora.
//    * @returns Editora atualizada.
//    */
//   async updateEditora(
//     id: number,
//     updateEditora: UpdateEditoraDto,
//   ): Promise<Editoras | null> {
//     await this.getEditoraById(id);

//     await this.editorasRepository.update(id, updateEditora);

//     return this.getEditoraById(id);
//   }

//   /**
//    * Retorna uma Editora.
//    * @param id - ID da Editora.
//    * @returns Editora encontrada.
//    */
//   async getEditoraById(id: number): Promise<Editoras | null> {
//     const editora = await this.editorasRepository.findOne({ where: { id } });

//     if (!editora) {
//       throw new NotFoundException('Editora não encontrada');
//     }

//     return editora;
//   }

//   /**
//    * Retorna todos as Editoras registradas.
//    * @returns Lista das Editoras.
//    */
//   async getAllEditoras(): Promise<Editoras[]> {
//     return this.editorasRepository.find();
//   }

//   /**
//    * Remove uma Editora.
//    * @param id ID da Editora.
//    */
//   async removeEditora(id: number): Promise<void> {
//     const editora = await this.getEditoraById(id);
//     if (editora) await this.editorasRepository.remove(editora);
//   }
// }
