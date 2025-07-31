import { Global, Module } from '@nestjs/common';
import HttpExceptionFilter from '@common/filters/http-exception.filter';
import AllExceptionsFilter from '@common/filters/all-exception.filter';
import TokenService from '@common/services/token.service';
import { JwtModule } from '@nestjs/jwt';
import JwtAuthGuard from '@common/guards/jwt.guard';
import PrismaService from '@common/services/prisma.service';
import ValidationPipe from '@common/pipes/validation.pipe';
import PasswordService from '@common/services/password.service';

const service = [TokenService, PrismaService, PasswordService];

@Global()
@Module({
  imports: [JwtModule],
  providers: [
    ...service,
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionsFilter,
    },
    {
      provide: 'APP_FILTER',
      useClass: HttpExceptionFilter,
    },
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
    {
      provide: 'APP_PIPE',
      useClass: ValidationPipe,
    },
  ],
  exports: [...service],
})
export class CommonModule {}
