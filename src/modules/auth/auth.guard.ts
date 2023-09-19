import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { Request } from 'express';
import { BASE_API_URL } from 'lib/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);
    const journalHeader = this.extractJournalHeader(request);
    const battleReportHeader = this.extractBattleReportHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const { id } = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const result = await axios.get(`${BASE_API_URL}/users/${id}`, {
        headers: {
          journal: journalHeader === 'true' ? 'true' : 'false',
          battle: battleReportHeader === 'true' ? 'true' : 'false',
        },
      });

      const user = result.data;

      request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const tokenFromCookies = request.cookies['AuthToken'];

    // if cookies not found, tries to find it in headers
    if (tokenFromCookies) {
      return tokenFromCookies;
    } else {
      const tokenFromHeaders =
        request.headers['authorization'] || request.headers['Authorization'];
      if (tokenFromHeaders) {
        if (typeof tokenFromHeaders === 'string') {
          const parts = tokenFromHeaders.split(' ');
          if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
            return parts[1];
          }
        }
      }
    }

    return undefined;
  }

  private extractJournalHeader(request: Request): string | undefined {
    const journalHeader = request.headers['journal'];
    if (typeof journalHeader === 'string') {
      return journalHeader.toLowerCase();
    }
    return undefined;
  }

  private extractBattleReportHeader(request: Request): string | undefined {
    const battleReport = request.headers['battle'];
    if (typeof battleReport === 'string') {
      return battleReport.toLowerCase();
    }
    return undefined;
  }
}
