import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CatsService {
    private cats = [
        { id: 1, name: "Tom", age: 12 },
        { id: 2, name: "Jerry", age: 10 },
    ];


    findAll() {
        return this.cats;
    }
    
    findOne(id: number) {
        const cat = this.cats.find((c) => c.id === id);
        if (!cat) throw new NotFoundException(`cat with id ${id} is not found`);
        return cat;
    }

    create(input: { name: string, age: number }) {
        const newCat = { id: this.cats.length + 1, ...input };
        this.cats.push(newCat);
        return newCat;
    }

    update(id: number, input: { name?: string, age?: number }) {
        const cat = this.findOne(id);
        Object.assign(cat, input);
        return cat;
    }

    remove(id: number) {
        const index = this.cats.findIndex((c) => c.id === id);
        console.log("hehe", index);
        if (index === -1) {
            throw new NotFoundException(`cat with this id ${id} is not found`);
        }
        return this.cats.splice(index, 1);
    }
}
