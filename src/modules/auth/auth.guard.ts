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
import { CharacterInterface } from 'lib/interfaces/character.interface';
import { UserInterface } from 'lib/interfaces/user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    let journal = false;
    let battleReport = false;
    let inventory = false;

    // extract headers and cookies
    const token = this.extractTokenFromRequest(request);
    const journalHeader = this.extractHeader(request, 'journal');
    const battleReportHeader = this.extractHeader(request, 'battle');
    const inventoryHeader = this.extractHeader(request, 'inventory');

    const routePath = request.route.path;

    if (journalHeader === 'true') journal = true;

    if (battleReportHeader === 'true') battleReport = true;

    if (inventoryHeader === 'true') inventory = true;

    if (
      routePath === '/api/characters/enemy' ||
      routePath === '/api/characters/battle' ||
      routePath === '/api/characters/battle/:id' ||
      routePath === '/api/characters/arena/:id'
    ) {
      journal = true;
    }

    if (routePath === '/api/users') {
      inventory = true;
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const { id } = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const result = await axios.get(`${BASE_API_URL}/users/${id}`, {
        withCredentials: true,
        headers: {
          journal: journal ? 'true' : 'false',
          battle: battleReport ? 'true' : 'false',
        },
      });

      const user = <UserInterface>result.data;

      const response = await axios.put(
        `${BASE_API_URL}/items`,
        {
          character: user.character,
        },
        { headers: { inventory: inventory ? 'true' : 'false' } },
      );

      const populatedCharacter = <CharacterInterface>response.data;

      user.character = populatedCharacter;

      request['user'] = user;
    } catch (error) {
      console.log(error);
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

  private extractHeader(
    request: Request,
    headerName: string,
  ): string | undefined {
    const headerValue = request.headers[headerName];
    if (typeof headerValue === 'string') {
      return headerValue.toLowerCase();
    }
    return undefined;
  }
}
