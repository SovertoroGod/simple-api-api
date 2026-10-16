import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { AuthUser } from "./user.types";
import { ROLES_KEY } from "./role.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext) {
        const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!required || required.length === 0) {
            return true; // no roles required
        }

        const user = context.switchToHttp().getRequest().user as AuthUser | undefined;

        if (!user || !required.includes(user.role)) {
            return false; // -> 403 Forbidden
        }

        return true;
    }
}