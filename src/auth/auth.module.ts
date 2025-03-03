import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import {RoleGuard} from "./role.guard";

@Module({
    imports: [
        forwardRef(() => UsersModule), // Utilise forwardRef pour résoudre la dépendance circulaire
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secretKey',
            signOptions: { expiresIn: '168h' },
        }),
    ],
    providers: [AuthService, AuthGuard, RoleGuard],
    exports: [AuthService, AuthGuard, RoleGuard],
    controllers: [AuthController],
})
export class AuthModule {}
