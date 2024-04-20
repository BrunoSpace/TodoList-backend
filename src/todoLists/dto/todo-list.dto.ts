import { ApiProperty } from '@nestjs/swagger';

export interface ITodoList {
  _id: string;
  text: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class TodoListDto {
  @ApiProperty()
  public todoListId: string;

  @ApiProperty()
  public text: string;

  @ApiProperty()
  public done: boolean;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;

  public static mapFrom(todoList: ITodoList): TodoListDto {
    const dto = new TodoListDto();

    dto.todoListId = todoList._id;
    dto.text = todoList.text;
    dto.done = todoList.done;
    dto.createdAt = todoList.createdAt;
    dto.updatedAt = todoList.updatedAt;

    return dto;
  }
}
