import { Auth } from '@common/decorators/auth.decorator';
import { AuthType } from '@common/types/auth-type.enum';
import { CustomDecorator } from '@nestjs/common';

export const Public = (): CustomDecorator => Auth(AuthType.NONE);
