import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TodoListsController } from './todo-lists.controller';
import { TodoListsService } from './todo-lists.service';
import { TodoSchema } from './todo-list.entity';
import { ModelSchemaNames } from '@/core/base/enums';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelSchemaNames.Todo, schema: TodoSchema },
    ]),
    InfrastructureModule,
  ],
  controllers: [TodoListsController],
  providers: [TodoListsService],
})
export class TodoListsModule {}
