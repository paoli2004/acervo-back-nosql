// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Delete,
//   Param,
//   ParseIntPipe,
//   Patch,
//   Query,
// } from '@nestjs/common';
// import { EmprestimosService } from './emprestimos.service';
// import { CreateEmprestimoDto } from './dto/createEmprestimo.dto';

// @Controller('emprestimos')
// export class EmprestimosController {
//   constructor(private readonly emprestimosService: EmprestimosService) {}

//   @Post()
//   async createEmprestimo(@Body() createEmprestimoDto: CreateEmprestimoDto) {
//     await this.emprestimosService.createEmprestimo(createEmprestimoDto);

//     return {
//       message: 'Empréstimo criado com sucesso',
//     };
//   }

//   @Patch(':id/devolucao')
//   async devolveEmprestivo(@Param('id', ParseIntPipe) id: number) {
//     await this.emprestimosService.devolveExemplar(id);

//     return {
//       message: 'Empréstimo devolvido com sucesso',
//     };
//   }

//   @Delete(':id')
//   async removeEmprestimo(@Param('id', ParseIntPipe) id: number) {
//     await this.emprestimosService.removeEmprestimo(id);

//     return {
//       message: 'Empréstimo removido com sucesso',
//     };
//   }

//   @Get()
//   async getAllEmprestimos() {
//     return this.emprestimosService.getAllEmprestimos();
//   }

//   @Get('busca')
//   async buscarAvancado(
//     @Query('livro_id') livro_id?: number,
//     @Query('usuario_id') usuario_id?: number,
//     @Query('exemplar_id') exemplar_id?: number,
//     @Query('data_inicio') data_inicio?: string,
//     @Query('data_fim') data_fim?: string,
//     @Query('ativo') ativo?: string,
//   ): Promise<any[]> {
//     return this.emprestimosService.buscarAvancado({
//       livro_id: livro_id ? Number(livro_id) : undefined,
//       usuario_id: usuario_id ? Number(usuario_id) : undefined,
//       exemplar_id: exemplar_id ? Number(exemplar_id) : undefined,
//       data_inicio: data_inicio ? new Date(data_inicio) : undefined,
//       data_fim: data_fim ? new Date(data_fim) : undefined,
//       ativo: ativo === 'true' ? true : ativo === 'false' ? false : undefined,
//     });
//   }

//   @Get(':id')
//   async getEmprestimoById(id: number) {
//     return this.emprestimosService.getEmprestimoById(id);
//   }
// }
