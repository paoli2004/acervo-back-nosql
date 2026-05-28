// import {
//   Body,
//   Controller,
//   Get,
//   Param,
//   Patch,
//   Post,
//   Delete,
//   ParseIntPipe,
// } from '@nestjs/common';
// import { CategoriasService } from './categorias.service';
// import { CreateCategoriaDto } from './dto/createCategoria.dto';
// import { UpdateCategoriaDto } from './dto/updateCategoria.dto';

// @Controller('categorias')
// export class CategoriasController {
//   constructor(private readonly categoriasService: CategoriasService) {}

//   @Post()
//   async createCategoria(@Body() createCategoria: CreateCategoriaDto) {
//     await this.categoriasService.createCategoria(createCategoria);

//     return {
//       message: 'Categoria criada com sucesso',
//     };
//   }

//   @Patch(':id')
//   async updateCategoria(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateCategoria: UpdateCategoriaDto,
//   ) {
//     await this.categoriasService.updateCategoria(id, updateCategoria);

//     return {
//       message: 'Categoria atualizada com sucesso',
//     };
//   }

//   @Get()
//   async getAllCategorias() {
//     return this.categoriasService.getAllCategorias();
//   }

//   @Get(':id')
//   async getCategoriaById(@Param('id', ParseIntPipe) id: number) {
//     return this.categoriasService.getCategoriaById(id);
//   }

//   @Delete(':id')
//   async removeCategoria(@Param('id', ParseIntPipe) id: number) {
//     await this.categoriasService.removeCategoria(id);

//     return {
//       message: 'Categoria removida com sucesso',
//     };
//   }
// }
