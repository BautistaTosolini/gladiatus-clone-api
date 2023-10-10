import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class ModuleGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractHeader(request, 'authorization');

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const { password } = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      if (password !== process.env.MODULE_PASSWORD) {
        throw new UnauthorizedException();
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractHeader(
    request: Request,
    headerName: string,
  ): string | undefined {
    const headerValue = request.headers[headerName];

    if (typeof headerValue === 'string') {
      const tokenParts = headerValue.split(' ');
      if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
        return tokenParts[1];
      }

      return headerValue;
    }

    return undefined;
  }
}
