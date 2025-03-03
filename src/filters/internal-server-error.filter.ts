import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class InternalServerErrorFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        if (exception instanceof HttpException) {
            // Gérer les exceptions HTTP spécifiques
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            // Vérifier si c'est une exception BadRequestException ou autre avec un message
            const message =
                typeof exceptionResponse === 'string'
                    ? exceptionResponse
                    : exceptionResponse['message'] || 'Une erreur inconnue a eu lieu';

            if (status === HttpStatus.UNAUTHORIZED) {
                response.status(status).json({
                    success: false,
                    error: true,
                    invalidToken: true,
                    message: message,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
            } else {
                response.status(status).json({
                    success: false,
                    error: true,
                    message: message,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
            }
            return;
        }

        // Gérer les erreurs internes (non `HttpException`)
        console.error('Erreur interne détectée :', exception);

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: true,
            message: 'Erreur interne du serveur',
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
