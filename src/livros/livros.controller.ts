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

@Controller('livros')
export class LivrosController {
  constructor(private readonly livrosService: LivrosService) {}

  @Get(':livroId')
  async findLivro(@Param('livroId') livroId: string) {
    return this.livrosService.findLivro({ _id: livroId });
  }

  @Get('busca')
  async buscarAvancado(
    @Query('autores') autores?: string,
    @Query('categorias') categorias?: string,
    @Query('onlyDisponiveis') onlyDisponiveis?: string,
  ): Promise<any[]> {
    return this.livrosService.buscarAvancado({
      autor_id: autores,
      categoria_id: categorias,
      onlyDisponiveis: onlyDisponiveis === 'true',
    });
  }

  @Get()
  async findAllLivros() {
    return this.livrosService.findAllLivros();
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
    const updatedBook = await this.livrosService.findOneAndUpdateLivro(
      { _id: livroId },
      updateLivroDto,
    );

    return {
      message: 'Livro atualizado com sucesso',
      livro: updatedBook,
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
