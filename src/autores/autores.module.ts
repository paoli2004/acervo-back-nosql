import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Autor, AutorSchema } from './schemas/autor.schema';
import { AutoresController } from './autores.controller';
import { AutoresService } from './autores.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Autor.name, schema: AutorSchema }]),
  ],
  controllers: [AutoresController],
  providers: [AutoresService],
  exports: [AutoresService],
})
export class AutoresModule {}
