// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Delete,
//   Patch,
//   ParseIntPipe,
//   Query,
// } from '@nestjs/common';
// import { LivrosService } from './livros.service';
// import { CreateLivroDto } from './dto/createLivro.dto';
// import { UpdateLivroDto } from './dto/updateLivro.dto';

// @Controller('livros')
// export class LivrosController {
//   constructor(private readonly livrosService: LivrosService) {}

//   @Post()
//   async createLivro(@Body() createLivroDto: CreateLivroDto) {
//     await this.livrosService.createLivro(createLivroDto);

//     return {
//       message: 'Livro criado com sucesso',
//     };
//   }

//   @Patch(':id')
//   async updateLivro(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateLivroDto: UpdateLivroDto,
//   ) {
//     await this.livrosService.updateLivro(id, updateLivroDto);

//     return {
//       message: 'Livro atualizado com sucesso',
//     };
//   }

//   @Delete(':id')
//   async removeLivro(@Param('id', ParseIntPipe) id: number) {
//     await this.livrosService.removeLivro(id);

//     return {
//       message: 'Livro removido com sucesso',
//     };
//   }

//   @Get()
//   async getAllLivros() {
//     return this.livrosService.getAllLivros();
//   }

//   @Get('busca')
//   async buscarAvancado(
//     @Query('autor_id') autor_id?: number,
//     @Query('categoria_id') categoria_id?: number,
//     @Query('onlyDisponiveis') onlyDisponiveis?: string,
//   ): Promise<any[]> {
//     return this.livrosService.buscarAvancado({
//       autor_id: autor_id ? Number(autor_id) : undefined,
//       categoria_id: categoria_id ? Number(categoria_id) : undefined,
//       onlyDisponiveis: onlyDisponiveis === 'true',
//     });
//   }

//   @Get(':id')
//   async getLivroById(@Param('id') id: number) {
//     return this.livrosService.getLivroById(id);
//   }
// }
