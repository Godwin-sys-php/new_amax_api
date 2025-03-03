import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcrypt';
import {User} from "../entities/user.entity";

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService,
                private readonly usersService: UsersService) {}


    async validateUser(username: string, pass: string): Promise<any> {
        console.log("lolcat", username);
        const user = await this.usersService.findByUsername(username);

        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        const isPasswordValid = await bcrypt.compare(pass, user.password);

        if (!isPasswordValid) {
            throw new BadRequestException('Mot de passe incorrect');
        }

        return user;
    }


    async login(user: User) {
        const payload = { sub: user.id, name: user.name,  username: user.username, type: user.type };

        const userExceptPassword = { ...user, password: undefined };

        return {
            success: true,
            error: false,
            access_token: this.jwtService.sign(payload),
            message: "Connexion réussie",
            data: userExceptPassword,
        };
    }

    async verifyToken(token: string): Promise<any> {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw new UnauthorizedException('Token invalide');
        }
    }

    async validateUserFromToken(token: string): Promise<any> {
        const payload = await this.verifyToken(token);
        const user = await this.usersService.findOneById(payload.sub);

        if (!user) {
            throw new UnauthorizedException('Utilisateur non trouvé');
        }

        return user;
    }



}
