import { IsUUID } from "class-validator";

export class TodoParamDto {
    @IsUUID()
    id?: string;
}

