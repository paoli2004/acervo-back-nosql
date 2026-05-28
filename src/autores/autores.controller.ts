// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
// } from '@nestjs/common';
// import { AutoresService } from './autores.service';
// import { CreateAutorDto } from './dto/createAutor.dto';
// import { Autores } from './entities/autores.entity';
// import { UpdateAutorDto } from './dto/updateAutor.dto';

// @Controller('autores')
// export class AutoresController {
//   constructor(private readonly autoresService: AutoresService) {}

//   @Post()
//   async createAutor(@Body() createAutor: CreateAutorDto) {
//     await this.autoresService.createAutor(createAutor);

//     return {
//       message: 'Autor criado com sucesso',
//     };
//   }

//   @Patch(':id')
//   async updateAutor(
//     @Param('id') id: number,
//     @Body() updateAutor: UpdateAutorDto,
//   ) {
//     await this.autoresService.updateAutor(id, updateAutor);

//     return {
//       message: 'Autor atualizado com sucesso',
//     };
//   }

//   @Delete(':id')
//   async removeAutor(@Param('id') id: number) {
//     await this.autoresService.removeAutor(id);

//     return {
//       message: 'Autor removido com sucesso',
//     };
//   }

//   @Get(':id')
//   async getAutorById(@Param('id') id: number): Promise<Autores | null> {
//     return this.autoresService.getAutorById(id);
//   }

//   @Get()
//   async getAllAutores(): Promise<Autores[]> {
//     return this.autoresService.getAllAutores();
//   }
// }
