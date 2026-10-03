import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
    constructor(private readonly catsService: CatsService) { }
    
    @Get()
    findAll() {
        return this.catsService.findAll();
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.catsService.findOne(id);
    }

    @Post()
    create(@Body() body: { name: string, age: number }) {
        return this.catsService.create(body);
    }

    @Patch(":id")
    update(@Param("id", ParseIntPipe) id: number, @Body() body: { name?: string, age?: number }) {
        return this.catsService.update(id, body);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.catsService.remove(id);
    }
}
