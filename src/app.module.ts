import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TodoListsModule } from './todoLists/todo-lists.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DATABASE_ADMIN}:${process.env.DATABASE_PASSWORD}${process.env.DATABASE_HOST}`,
    ),
    TodoListsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
