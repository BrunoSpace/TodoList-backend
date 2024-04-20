import { Test, TestingModule } from '@nestjs/testing';
import { TodoListsService } from '@/todoLists/todo-lists.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoListDto } from '@/todoLists/dto/todo-list.dto';
import { ErrorMessages } from '@/core/error-messages.constants';
import { ChannelService } from '@/infrastructure/channels/channel.service';
import { ModelSchemaNames } from '@/core/base/enums';
import { faker } from '@faker-js/faker';

describe('TodoListsService', () => {
  let service: TodoListsService;
  let mockTodoListModel: Partial<Model<TodoListDto>>;
  let validation: jest.SpyInstance;

  const TodoList = {
    _id: faker.string.uuid(),
    text: faker.internet.userName(),
    done: false,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };

  beforeAll(async () => {
    mockTodoListModel = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoListsService,
        {
          provide: getModelToken(ModelSchemaNames.Todo),
          useValue: mockTodoListModel,
        },
        {
          provide: ChannelService,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TodoListsService>(TodoListsService);

    validation = jest.spyOn(service, 'isValidUUID');
  });

  it('should define the service', () => {
    expect(service).toBeDefined();
  });

  it('should return todoList', async () => {
    const mockFindOne = jest.spyOn(service, 'findOne');
    mockFindOne.mockResolvedValue(TodoList);

    const result = await service.findOneTodoList(TodoList._id);
    expect(validation).toHaveBeenCalledWith(TodoList._id);

    expect(mockFindOne).toHaveBeenCalledWith({
      criteria: { _id: TodoList._id },
      throwOnNotFound: true,
      errorMessage: ErrorMessages.TODO_LIST_DOESNT_EXIST,
    });

    expect(result.todoListId).toBe(TodoList._id);
    expect(result.text).toBe(TodoList.text);
  });

  it('should throw error if id is not uuid', async () => {
    jest.clearAllMocks();

    try {
      await service.findOneTodoList('wrong-id');
    } catch (error) {
      expect(validation).toHaveBeenCalledWith('wrong-id');
      expect(service.findOne).toHaveBeenCalledTimes(0);
      expect(error.message).toEqual(ErrorMessages.ID_PARAM_IS_NO_TYPE_OF_UUID);
    }
  });

  // if needed I can done more unit test and write some e2e test!
});
