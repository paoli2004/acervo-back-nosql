// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Post,
//   ParseIntPipe,
//   Patch,
//   Query,
// } from '@nestjs/common';
// import { ExemplaresService } from './exemplares.service';
// import { CreateExemplarDto } from './dto/createExemplar.dto';
// import { UpdateExemplarDto } from './dto/updateExemplar.dto';
// import { Exemplares } from './entities/exemplares.entity';

// @Controller('exemplares')
// export class ExemplaresController {
//   constructor(private readonly exemplaresService: ExemplaresService) {}

//   @Post()
//   async createExemplar(@Body() createExemplar: CreateExemplarDto) {
//     await this.exemplaresService.createExemplar(createExemplar);

//     return {
//       message: 'Exemplar criado com sucesso',
//     };
//   }

//   @Patch(':id')
//   async updateExemplar(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateExemplar: UpdateExemplarDto,
//   ) {
//     await this.exemplaresService.updateExemplar(id, updateExemplar);

//     return {
//       message: 'Exemplar atualizado com sucesso',
//     };
//   }

//   @Delete(':id')
//   async removeExemplar(@Param('id', ParseIntPipe) id: number) {
//     await this.exemplaresService.removeExemplar(id);

//     return {
//       message: 'Exemplar removido com sucesso',
//     };
//   }

//   @Get('disponiveis')
//   async getExemplaresDisponiveis(): Promise<any[]> {
//     return this.exemplaresService.getExemplaresDisponiveis();
//   }

//   @Get(':id')
//   async getExemplarById(
//     @Param('id', ParseIntPipe) id: number,
//   ): Promise<Exemplares | null> {
//     return this.exemplaresService.getExemplarById(id);
//   }

//   @Get()
//   async getAllExemplares(): Promise<Exemplares[]> {
//     return this.exemplaresService.getAllExemplares();
//   }

//   @Get('livro/:livro_id')
//   getByLivro(
//     @Param('livro_id') livro_id: number,
//     @Query('onlyDisponiveis') onlyDisponiveis?: string,
//   ) {
//     return this.exemplaresService.getExemplaresByLivro(
//       livro_id,
//       onlyDisponiveis === 'true',
//     );
//   }
// }
