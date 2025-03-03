import { Request } from 'express';
import { User } from '../../entities/user.entity'; // Ajustez le chemin si nécessaire

export interface AuthenticateRequestInterface extends Request {
    user: User;
}