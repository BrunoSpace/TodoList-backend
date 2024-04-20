import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
import { TodoListsService } from './todo-lists.service';
import { TodoListRequestDto } from './dto/todo-list-request.dto';
import { TodoListDto } from './dto/todo-list.dto';
import { BaseQueryDto } from '@/core/base/base-query';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';

@ApiTags('todoLists')
@Controller('api/todos')
export class TodoListsController {
  constructor(private readonly TodoListsService: TodoListsService) {}

  @ApiBody({ type: TodoListRequestDto })
  @ApiOkResponse({ type: TodoListDto })
  @ApiParam({ name: 'id', type: 'string' })
  @Patch(':id')
  public updateTodoList(
    @Param('id') todoListId: string,
    @Body() payload: TodoListRequestDto,
  ): Promise<TodoListDto> {
    return this.TodoListsService.updateTodoList(todoListId, payload);
  }

  @ApiOkResponse({ type: TodoListDto })
  @ApiParam({ name: 'id', type: 'string' })
  @Get(':id')
  public findOneTodoList(
    @Param('id') todoListId: string,
  ): Promise<TodoListDto> {
    return this.TodoListsService.findOneTodoList(todoListId);
  }

  @ApiOkResponse({ type: TodoListDto, isArray: true })
  @ApiQuery({ type: BaseQueryDto })
  @Get()
  public findAllTodoLists(
    @Query() query?: BaseQueryDto,
  ): Promise<TodoListDto[]> {
    return this.TodoListsService.findAll(query);
  }

  @ApiBody({ type: OmitType(TodoListRequestDto, ['updatedAt', 'createdAt']) })
  @ApiCreatedResponse({ type: TodoListDto })
  @Post()
  async create(
    @Body() payload: Omit<TodoListRequestDto, 'updatedAt' | 'createdAt'>,
  ): Promise<TodoListDto> {
    return this.TodoListsService.create(payload);
  }
}
