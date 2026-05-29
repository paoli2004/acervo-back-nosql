import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
} from '@nestjs/common';
import { ExemplaresService } from './exemplares.service';
import { CreateExemplarDto } from './dto/createExemplar.dto';
import { UpdateExemplarDto } from './dto/updateExemplar.dto';

@Controller('exemplares')
export class ExemplaresController {
  constructor(private readonly exemplaresService: ExemplaresService) {}

  @Get(':livroId')
  async findExemplar(@Param('livroId') livroId: string) {
    return this.exemplaresService.findExemplar({ _id: livroId });
  }

  @Get()
  async findAllExemplares() {
    return this.exemplaresService.findAllExemplares();
  }

  @Get('disponiveis')
  async findAllExemplaresDisponiveis() {
    return this.exemplaresService.findAllExemplaresDisponiveis();
  }

  @Get('livro/:livroId')
  async getExemplaresByLivro(
    @Param('livroId') livroId: string,
    @Query('onlyDisponiveis') onlyDisponiveis?: string,
  ) {
    return this.exemplaresService.getExemplaresByLivro(
      livroId,
      onlyDisponiveis === 'true',
    );
  }

  @Post()
  async createExemplar(@Body() createExemplarDto: CreateExemplarDto) {
    const newExemplary =
      await this.exemplaresService.createExemplar(createExemplarDto);

    return {
      message: 'Exemplar criado com sucesso',
      exemplar: newExemplary,
    };
  }

  @Patch(':livroId')
  async updateExemplar(
    @Param('livroId') livroId: string,
    @Body() updateExemplarDto: UpdateExemplarDto,
  ) {
    const updatedExemplary =
      await this.exemplaresService.findOneAndUpdateExemplar(
        { _id: livroId },
        updateExemplarDto,
      );

    return {
      message: 'Exemplar atualizado com sucesso',
      exemplar: updatedExemplary,
    };
  }

  @Delete(':livroId')
  async deleteExemplar(@Param('livroId') livroId: string) {
    const deletedExemplary = await this.exemplaresService.deleteExemplar({
      _id: livroId,
    });

    return {
      message: 'Exemplar removido com sucesso',
      exemplar: deletedExemplary,
    };
  }
}
