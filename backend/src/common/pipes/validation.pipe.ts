import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  ValidationError,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ERROR_BAD_REQUEST } from '@common/constants/error.constant';

@Injectable()
export default class ValidationPipe implements PipeTransform {
  private options = {
    transform: true,
    validate: true,
    transformOptions: { enableImplicitConversion: true },
    validateOptions: { whitelist: true, forbidNonWhitelisted: true },
  };

  private toValidate(metatype: new (...args: unknown[]) => unknown): boolean {
    const types: Array<new (...args: unknown[]) => unknown> = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metatype);
  }

  async transform(
    value: unknown,
    metadata: ArgumentMetadata,
  ): Promise<unknown> {
    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object: unknown = plainToInstance(
      metatype,
      value,
      this.options.transformOptions,
    );
    if (object instanceof Object) {
      const errors = await validate(object, this.options.validateOptions);
      if (errors.length > 0) {
        const errorMessages = this.formatErrors(errors);
        throw new BadRequestException({
          ...ERROR_BAD_REQUEST,
          message: errorMessages,
        });
      }
    }

    return object;
  }

  private formatErrors(errors: ValidationError[]): string[] {
    const messages: string[] = [];

    errors.forEach((err) => {
      const constraints = err.constraints ?? {};
      Object.values(constraints).forEach((message: string) => {
        messages.push(message);
      });
    });
    return messages;
  }
}
