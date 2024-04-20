import { TodoListsController } from '@/todoLists/todo-lists.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoListsService } from '@/todoLists/todo-lists.service';
import { faker } from '@faker-js/faker';
import { TodoListDto } from '@/todoLists/dto/todo-list.dto';

const createFakeTodoList = (n: number): TodoListDto[] => {
  const todoListItems: TodoListDto[] = [];
  for (let i = 0; i < n; i++) {
    const todoListItem: TodoListDto = {
      todoListId: faker.string.uuid(),
      text: faker.internet.userName(),
      done: false,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };
    todoListItems.push(todoListItem);
  }
  return todoListItems;
};

const todoList = createFakeTodoList(1);
const todoLists = createFakeTodoList(5);

describe('TodoListsController', () => {
  let controller: TodoListsController;

  const mockTodoListsService = {
    create: jest.fn(() => {
      return todoList[0];
    }),

    findAll: jest.fn(() => {
      return todoLists;
    }),

    updateTodoList: jest.fn(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          todoList[0].text = 'Update';
          todoList[0].done = true;
          resolve(todoList[0]);
        }, 100);
      });
    }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoListsController],
      providers: [TodoListsService],
    })
      .overrideProvider(TodoListsService)
      .useValue(mockTodoListsService)
      .compile();

    controller = module.get<TodoListsController>(TodoListsController);
  });

  it('should define the controller', () => {
    expect(controller).toBeDefined();
  });

  it('should create todoList', () => {
    expect(
      controller.create({ text: todoList[0].text, done: false }),
    ).resolves.toEqual(todoList[0]);

    expect(mockTodoListsService.create).toHaveBeenCalledTimes(1);
  });

  it('should find all todoList', async () => {
    const result = await controller.findAllTodoLists();

    expect(result).toHaveLength(5);

    result.forEach((item, index) => {
      expect(item).toEqual(expect.objectContaining(todoLists[index]));
    });

    expect(mockTodoListsService.findAll).toHaveBeenCalledTimes(1);
  });

  it('should update todoList', () => {
    return controller
      .updateTodoList(todoList[0].todoListId, {
        text: 'Update',
        done: true,
      })
      .then((body) => {
        expect(mockTodoListsService.updateTodoList).toHaveBeenCalledTimes(1);

        expect(body.todoListId).toBe(todoList[0].todoListId);
        expect(body.done).toBe(true);
        expect(body.text).toBe('Update');
      });
  });
});
