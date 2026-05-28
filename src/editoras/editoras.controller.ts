// import {
//   Body,
//   Controller,
//   Get,
//   Param,
//   Post,
//   Patch,
//   Delete,
//   ParseIntPipe,
// } from '@nestjs/common';
// import { EditorasService } from './editoras.service';
// import { CreateEditoraDto } from './dto/createEditora.dto';
// import { UpdateEditoraDto } from './dto/updateEditora.dto';

// import { Editoras } from './entities/editoras.entity';

// @Controller('editoras')
// export class EditorasController {
//   constructor(private readonly editorasService: EditorasService) {}

//   @Post()
//   async createEditora(@Body() createEditora: CreateEditoraDto) {
//     await this.editorasService.createEditora(createEditora);

//     return {
//       message: 'Editora criada com sucesso',
//     };
//   }

//   @Patch(':id')
//   async updateEditora(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateEditora: UpdateEditoraDto,
//   ) {
//     await this.editorasService.updateEditora(id, updateEditora);

//     return {
//       message: 'Editora atualizada com sucesso',
//     };
//   }

//   @Get(':id')
//   async getEditoraById(@Param('id', ParseIntPipe) id: number) {
//     return this.editorasService.getEditoraById(id);
//   }

//   @Get()
//   async getAllEditoras() {
//     return this.editorasService.getAllEditoras();
//   }

//   @Delete(':id')
//   async removeAutor(@Param('id', ParseIntPipe) id: number) {
//     await this.editorasService.removeEditora(id);

//     return {
//       message: 'Editora removida com sucesso',
//     };
//   }
// }
