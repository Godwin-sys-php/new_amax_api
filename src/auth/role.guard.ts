import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from './role.decorator';
import { User } from '../entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.get<string>(ROLE_KEY, context.getHandler());

        // Si aucun rôle requis, autoriser l'accès
        if (!requiredRole) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: User = request.user;
        
        // Vérifier si l'utilisateur est défini
        if (!user) {
            throw new ForbiddenException('Utilisateur non connecté');
        }

        // Si le rôle requis est "solo", vérifier que l'utilisateur accède à sa propre ressource
        if (requiredRole === 'solo') {
            const resourceId = request.params?.id; // Assure-toi que params existe
            if (!resourceId || resourceId !== String(user.id)) {
                throw new ForbiddenException('Vous ne pouvez avoir accès qu\'à vos propres ressources');
            }
            return true;
        }

        // Vérifier si l'utilisateur a le rôle requis
        if (user.type !== requiredRole) {
            throw new ForbiddenException(`Vous avez besoin du role ${requiredRole} pour avoir accès à la ressource`);
        }

        return true; // Autoriser si toutes les conditions sont respectées
    }
}
