import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard { // usamos esta libreria de throttler para limitar el numero de peticiones que puede hacer un cliente a nuestra api
  /**
   * Identifica la petición de manera única.
   * Si posee un token de autorización Bearer, restringe por token.
   * Si es anónimo, restringe por la dirección IP de procedencia del cliente.
   */
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const authHeader = req.headers?.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        return `token:${token}`;
      }
    }

    const clientIp = req.headers?.['x-forwarded-for'] || req.ip || req.connection?.remoteAddress || 'unknown';
    return `ip:${clientIp}`;
  }
}
