import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodosService {

  constructor(
    private readonly prisma : PrismaService
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

  async findOne(id: string) {
    const todo = await this.prisma.todo.where({ id }).first();
    if (!todo) {
      throw new NotFoundException(`Todo with id "${id}" not found`)
    };
    return todo;
  }

  async update(id: string, dto: UpdateTodoDto) {
    await this.findOne(id);
    return this.prisma.todo.where({ id }).update({
      title: dto.title,
      completed: dto.completed
    })
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.todo.where({ id }).delete();
    return { message: `Todo ${id} deleted` };
  }

  removeAll() {
    return this.prisma.todo.where({}).deleteAll();
  }
}
