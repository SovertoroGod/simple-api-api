import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoParamDto } from './dto/todo-param.dto';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Roles } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/role.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { AuthUser } from 'src/auth/user.types';

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

  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param() params: TodoParamDto) {
    return this.todosService.remove(params);
  }

  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Delete()
  removeAll() {
    return this.todosService.removeAll();
  }

  @Get('own')
  findOwn(@CurrentUser() user: AuthUser) {
    return this.todosService.findOwn(user.id);
  }

  @Post("own")
  createOwn(@CurrentUser() user: AuthUser, @Body() dto: CreateTodoDto) {
    return this.todosService.createOwn(user.id, dto);
  }

  @Delete('own/:id')
  deleteOwn(@CurrentUser() user: AuthUser, @Param() params: TodoParamDto) {
    return this.todosService.deleteOwn(user.id, params.id!);
  }
}
