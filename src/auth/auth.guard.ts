import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {User} from "../entities/user.entity";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('L\'en-tête d\'autorisation est manquant');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Le token est absent');
        }

        const user: User = await this.authService.validateUserFromToken(token);

        request.user = user; // Ajoute l'utilisateur validé à la requête
        return true;
    }
}
