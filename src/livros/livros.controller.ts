import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { LivrosService } from './livros.service';
import { CreateLivroDto } from './dto/createLivro.dto';
import { UpdateLivroDto } from './dto/updateLivro.dto';
import { LivroDocument } from './schemas/livro.schema';
import { Types } from 'mongoose';

@Controller('livros')
export class LivrosController {
  constructor(private readonly livrosService: LivrosService) {}

  @Get()
  async findAllLivros(): Promise<LivroDocument[]> {
    return this.livrosService.findAllLivros();
  }

  @Get('busca')
  async buscarAvancado(
    @Query('autores') autores?: string,
    @Query('categorias') categorias?: string,
    @Query('editoras') editoras?: string,
    @Query('onlyDisponiveis') onlyDisponiveis?: string,
  ) {
    return this.livrosService.buscarAvancado({
      autores: autores,
      categorias: categorias,
      editoras: editoras,
      onlyDisponiveis: onlyDisponiveis === 'true',
    });
  }

  @Get(':livroId')
  async findLivro(@Param('livroId') livroId: string): Promise<LivroDocument> {
    return this.livrosService.findLivro({ _id: livroId });
  }

  @Post()
  async createLivro(@Body() createLivroDto: CreateLivroDto) {
    const newBook = await this.livrosService.createLivro(createLivroDto);

    return {
      message: 'Livro criado com sucesso',
      livro: newBook,
    };
  }

  @Patch(':livroId')
  async findOneAndUpdateLivro(
    @Param('livroId') livroId: string,
    @Body() updateLivroDto: UpdateLivroDto,
  ) {
    const livroAtualizado = await this.livrosService.findOneAndUpdateLivro(
      { _id: livroId },
      updateLivroDto,
    );

    return {
      message: 'Livro atualizado com sucesso',
      livro: livroAtualizado,
    };
  }

  @Delete(':livroId')
  async deleteLivro(@Param('livroId') livroId: string) {
    await this.livrosService.deleteLivro({ _id: livroId });

    return {
      message: 'Livro removido com sucesso',
    };
  }
}
