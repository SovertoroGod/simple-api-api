import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { db } from "./db";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await db.connect();
    }

    async onModuleDestroy() {
        await db.close();
    }

    readonly todo = db.orm.public.Todo;
}