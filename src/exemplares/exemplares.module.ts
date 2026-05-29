import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exemplar, ExemplarSchema } from './schemas/exemplar.schema';
import { ExemplaresController } from './exemplares.controller';
import { ExemplaresService } from './exemplares.service';
import { LivrosModule } from '../livros/livros.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exemplar.name, schema: ExemplarSchema },
    ]),
    LivrosModule
  ],
  controllers: [ExemplaresController],
  providers: [ExemplaresService],
  exports: [ExemplaresService],
})
export class ExemplaresModule {}
