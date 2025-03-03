import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export function ImageFileInterceptor(field: string, ressource: string) {
    return FileInterceptor(field, {
        storage: diskStorage({
            destination: `./uploads/${ressource}`,
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                callback(null, `${ressource}-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                return callback(new BadRequestException('Uniquement les images sont acceptées (.jpg, .jpeg, .png)'), false);
            }
            callback(null, true);
        },
    });
}
