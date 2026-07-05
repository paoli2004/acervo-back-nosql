import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AutoresService } from './autores.service';
import { CreateAutorDto } from './dto/createAutor.dto';
import { UpdateAutorDto } from './dto/updateAutor.dto';
import { Autor } from './schemas/autor.schema';

@Controller('autores')
export class AutoresController {
  constructor(private readonly autoresService: AutoresService) {}

  @Get(':autorId')
  async findAutor(@Param('autorId') autorId: string): Promise<Autor | null> {
    return this.autoresService.findAutor({ _id: autorId });
  }

  @Get()
  async findAllAutores(): Promise<Autor[]> {
    return this.autoresService.findAllAutores();
  }

  @Post()
  async createAutor(@Body() createAutor: CreateAutorDto) {
    const novoAutor = await this.autoresService.createAutor(createAutor);

    return {
      message: 'Autor criado com sucesso',
      autor: novoAutor,
    };
  }

  @Patch(':autorId')
  async findoneAndUpdateAutor(
    @Param('autorId') autorId: string,
    @Body() updateAutor: UpdateAutorDto,
  ) {
    const autorAtualizado = await this.autoresService.findOneAndUpdateAutor(
      { _id: autorId },
      updateAutor,
    );

    return {
      message: 'Autor atualizado com sucesso',
      autor: autorAtualizado,
    };
  }

  @Delete(':autorId')
  async deleteAutor(@Param('autorId') autorId: string) {
    await this.autoresService.deleteAutor({ _id: autorId });

    return {
      message: 'Autor removido com sucesso',
    };
  }
}
