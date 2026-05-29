import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/createCategoria.dto';
import { UpdateCategoriaDto } from './dto/updateCategoria.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get(':categoryId')
  async findCategoria(@Param('categoryId') categoryId: string) {
    return this.categoriasService.findCategoria({ _id: categoryId });
  }

  @Get()
  async findAllCategorias() {
    return this.categoriasService.findAllCategorias();
  }

  @Post()
  async createCategoria(@Body() createCategoria: CreateCategoriaDto) {
    const newCategory =
      await this.categoriasService.createCategoria(createCategoria);

    return {
      message: 'Categoria criada com sucesso',
      categoria: newCategory,
    };
  }

  @Patch(':categoryId')
  async findOneAndUpdateCategoria(
    @Param('categoryId') categoryId: string,
    @Body() updateCategoria: UpdateCategoriaDto,
  ) {
    const updatedCategory =
      await this.categoriasService.findOneAndUpdateCategoria(
        { _id: categoryId },
        updateCategoria,
      );

    return {
      message: 'Categoria atualizada com sucesso',
      categoria: updatedCategory,
    };
  }

  @Delete(':categoryId')
  async deleteCategoria(@Param('categoryId') categoryId: string) {
    await this.categoriasService.deleteCategoria({
      _id: categoryId,
    });

    return {
      message: 'Categoria removida com sucesso',
    };
  }
}
