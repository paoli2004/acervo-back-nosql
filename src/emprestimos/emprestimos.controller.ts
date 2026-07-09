import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { EmprestimosService } from './emprestimos.service';
import { CreateEmprestimoDto } from './dto/createEmprestimo.dto';
import { EmprestimoDocument } from './schemas/emprestimo.schema';

@Controller('emprestimos')
export class EmprestimosController {
  constructor(private readonly emprestimosService: EmprestimosService) {}

  @Get('busca')
  async buscarAvancado(
    @Query('livro') livro?: string,
    @Query('usuario') usuario?: string,
    @Query('exemplar') exemplar?: string,
    @Query('data_inicio') data_inicio?: Date,
    @Query('data_fim') data_fim?: Date,
    @Query('ativo') ativo?: string,
  ): Promise<EmprestimoDocument[]> {
    const isAtivo = ativo !== undefined ? ativo === 'true' : undefined;

    return this.emprestimosService.buscarAvancado({
      livro,
      usuario,
      exemplar,
      data_inicio,
      data_fim,
      ativo: isAtivo,
    });
  }

  @Get(':emprestimoId')
  async findEmprestimo(
    @Param('emprestimoId') emprestimoId: string,
  ): Promise<EmprestimoDocument> {
    return this.emprestimosService.findEmprestimo({ _id: emprestimoId });
  }

  @Get()
  async findAllEmprestimos(): Promise<EmprestimoDocument[]> {
    return this.emprestimosService.findAllEmprestimos();
  }

  @Post()
  async create(@Body() createEmprestimoDto: CreateEmprestimoDto) {
    const novoEmprestimo =
      await this.emprestimosService.createEmprestimo(createEmprestimoDto);

    return {
      message: 'Empréstimo criado com sucesso',
      emprestimo: novoEmprestimo,
    };
  }

  @Put(':exemplarId/devolucao')
  async devolveExemplar(
    @Param('exemplarId') exemplarId: string,
  ): Promise<EmprestimoDocument> {
    return this.emprestimosService.devolveExemplar({ _id: exemplarId });
  }

  @Delete(':emprestimoId')
  async deleteEmprestimo(@Param('emprestimoId') emprestimoId: string) {
    await this.emprestimosService.deleteEmprestimo({ _id: emprestimoId });

    return {
      message: 'Empréstimo removido com sucesso',
    };
  }
}
