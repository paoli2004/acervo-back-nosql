import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { EditorasService } from './editoras.service';
import { CreateEditoraDto } from './dto/createEditora.dto';
import { UpdateEditoraDto } from './dto/updateEditora.dto';

@Controller('editoras')
export class EditorasController {
  constructor(private readonly editorasService: EditorasService) {}

  @Get(':editoraId')
  async findEditora(@Param('editoraId') editoraId: string) {
    return this.editorasService.findEditora({ _id: editoraId });
  }

  @Get()
  async findAllEditoras() {
    return this.editorasService.findAllEditoras();
  }

  @Post()
  async createEditora(@Body() createEditora: CreateEditoraDto) {
    const novaEditora = await this.editorasService.createEditora(createEditora);

    return {
      message: 'Editora criada com sucesso',
      editora: novaEditora,
    };
  }

  @Patch(':editoraId')
  async findOneAndUpdateEditora(
    @Param('editoraId') editoraId: string,
    @Body() updateEditora: UpdateEditoraDto,
  ) {
    const editoraAtualizada =
      await this.editorasService.findOneAndUpdateEditora(
        { _id: editoraId },
        updateEditora,
      );

    return {
      message: 'Editora atualizada com sucesso',
      editora: editoraAtualizada,
    };
  }

  @Delete(':editoraId')
  async deleteEditora(@Param('editoraId') editoraId: string) {
    await this.editorasService.deleteEditora({
      _id: editoraId,
    });

    return {
      message: 'Editora removida com sucesso',
    };
  }
}
