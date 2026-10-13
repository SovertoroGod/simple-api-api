import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoParamDto } from './dto/todo-param.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) { }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: TodoParamDto) {
    return this.todosService.findOne(params);
  }

  @Patch(':id')
  update(@Param() params: TodoParamDto, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(params, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param() params: TodoParamDto) {
    return this.todosService.remove(params);
  }

  @Delete()
  removeAll() {
    return this.todosService.removeAll();
  }
}
