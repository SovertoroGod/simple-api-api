import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TodoParamDto } from './dto/todo-param.dto';

@Injectable()
export class TodosService {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  create(dto: CreateTodoDto) {
    return this.prisma.todo.create({
      title: dto.title,
      completed: dto.completed ?? false
    });
  }

  findAll() {
    return this.prisma.todo.all();
  }

  async findOne(params: TodoParamDto) {
    const todo = await this.prisma.todo.where({ id: params.id }).first();
    if (!todo) {
      throw new NotFoundException(`Todo with id "${params.id}" not found`)
    };
    return todo;
  }

  async update(params: TodoParamDto, dto: UpdateTodoDto) {
    await this.findOne(params);
    return this.prisma.todo.where({ id: params.id }).update({
      title: dto.title,
      completed: dto.completed
    })
  }

  async remove(params: TodoParamDto) {
    await this.findOne(params);
    await this.prisma.todo.where({ id: params.id }).delete();
    return { message: `Todo ${params.id} deleted` };
  }

  removeAll() {
    return this.prisma.todo.where({}).deleteAll();
  }

  async createOwn(userId: string, dto: CreateTodoDto) {
    const todo = await this.prisma.todo.create({
      title: dto.title,
      completed: dto.completed ?? false,
      userId: userId
    });
    return todo;
  }

  async findOwn(userId: string) {
    return this.prisma.todo.where({ userId }).orderBy((model) => model.createdAt.desc()).all();
  }

  async deleteOwn(userId: string, id: string) {

    const exitTodo = await this.prisma.todo.where({ id: id, userId: userId }).first();

    if (!exitTodo) {
      throw new NotFoundException("Todo not found");
    }

    if (exitTodo.userId !== userId) {
      throw new UnauthorizedException("You are not authorized to delete this todo");
    }

    await this.prisma.todo.where({ id: id, userId: userId }).delete();
    return { message: "Todo deleted successfully" };
  }
}
