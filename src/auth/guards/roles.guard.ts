import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  // eslint-disable-next-line prettier/prettier
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // eslint-disable-next-line prettier/prettier
    const allowedRoles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!allowedRoles) {
      return true; // No specific roles required for the route, allow access by default
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming you attach the user object (including role) in the AuthGuard

    if (!user || !user.role) {
      return false; // User not authenticated or missing role information, deny access
    }

    // Check if the user's role matches any of the allowed roles for the route
    const hasRole = allowedRoles.some((role) => role === user.role);

    return hasRole;
  }
}
