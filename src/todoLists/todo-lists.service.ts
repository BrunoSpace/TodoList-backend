import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITodoList, TodoListDto } from './dto/todo-list.dto';
import { BaseQueryDto } from '@/core/base/base-query';
import { BaseRepository } from '@/core/base/base-repository';
import { ErrorMessages } from '@/core/error-messages.constants';
import { isUUID } from 'class-validator';
import { SMS_MESSAGE, UUID_VERSION } from '@/core/base/constants';
import { ModelSchemaNames } from '@/core/base/enums';
import { TodoListRequestDto } from './dto/todo-list-request.dto';
import { areDatesDifferent } from '@/core/utils/dates.util';
import { ChannelService } from '@/infrastructure/channels/channel.service';

@Injectable()
export class TodoListsService extends BaseRepository<ITodoList> {
  constructor(
    @InjectModel(ModelSchemaNames.Todo) private readonly repo: Model<ITodoList>,
    private readonly channelService: ChannelService,
  ) {
    super(repo);
  }

  public async create(
    todoList: Pick<TodoListDto, 'text' | 'done'>,
  ): Promise<TodoListDto> {
    const createdTodoList = await this.repo.create(todoList);

    return TodoListDto.mapFrom(createdTodoList);
  }

  public async findAll(query?: BaseQueryDto): Promise<TodoListDto[]> {
    const { sortDirection, limit, page } = query;

    const list = await this.repo
      .find()
      .sort({ text: sortDirection === 'ASC' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return list.map(TodoListDto.mapFrom);
  }

  public async findOneTodoList(todoListId: string): Promise<TodoListDto> {
    this.isValidUUID(todoListId);

    const todoList = await this.findOne({
      criteria: { _id: todoListId },
      throwOnNotFound: true,
      errorMessage: ErrorMessages.TODO_LIST_DOESNT_EXIST,
    });

    return TodoListDto.mapFrom(todoList);
  }

  public async updateTodoList(
    todoListId: string,
    { text, updatedAt, createdAt, done }: TodoListRequestDto,
  ): Promise<TodoListDto> {
    let shouldUpdate = false;
    const todoList = await this.findOneTodoList(todoListId);
    const createdAtDate = new Date(createdAt);
    const updatedAtDate = new Date(updatedAt);

    if (text && text !== todoList.text) {
      shouldUpdate = true;
      todoList.text = text;
    }

    if (createdAt && areDatesDifferent(createdAtDate, todoList.createdAt)) {
      shouldUpdate = true;
      todoList.createdAt = createdAtDate;
    }

    if (updatedAt && areDatesDifferent(updatedAtDate, todoList.updatedAt)) {
      shouldUpdate = true;
      todoList.updatedAt = updatedAtDate;
    }

    // This is only if we change done, then set done to true and send sms
    if (done) {
      shouldUpdate = true;
      todoList.done = true;
    }

    if (shouldUpdate) {
      await this.updateOne(todoListId, todoList);
    }

    if (todoList.done) {
      await this.channelService.send(
        process.env.INFOBIP_RECIPIENT,
        SMS_MESSAGE,
      );
    }

    return todoList;
  }

  private async updateOne(
    todoListId: string,
    todoList: TodoListDto,
  ): Promise<void> {
    try {
      await this.repo.updateOne({ _id: todoListId }, todoList);
    } catch (error) {
      throw new Error(`${ErrorMessages.TODO_LIST_UPDATE_ERROR}: ${error}`);
    }
  }

  // for this example is here like private function (but also can be in utils folder)
  // this function is private but here is public I dont want to create new function for testing!
  public isValidUUID(uuid: string): void {
    if (!isUUID(uuid, UUID_VERSION)) {
      throw new BadRequestException(ErrorMessages.ID_PARAM_IS_NO_TYPE_OF_UUID);
    }
  }
}
