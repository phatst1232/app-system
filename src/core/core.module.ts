import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { User } from 'src/users/user.entity';
import { UserModule } from 'src/users/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { jwtConstants } from 'src/common/constants';
import { HttpCacheInterceptor } from 'src/common/interceptors/http-cache.interceptor';
import { AllExceptionsFilter } from 'src/common/filters/global-http-ex.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      //docker run --name some-postgres -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres
      type: 'postgres',
      host: 'localhost', // Change this to the IP address of your Docker container (e.g., 172.17.0.2)
      port: 5432,
      username: 'postgres',
      password: '123212',
      database: 'postgres',
      entities: [User],
      synchronize: true, // Use `false` in production to avoid automatic database schema changes
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    UserModule,
    AuthModule,
    CacheModule.register(),
  ],
  providers: [
    {
      //App exception filter
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
})
export class CoreModule {}
