import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  UseGuards, 
  Param, 
  UseInterceptors, 
  UploadedFile, 
  Body,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import JwtAuthGuard from '@common/guards/jwt.guard';
import { RoleGuard } from '@common/guards/role.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { UploadImageDto, UploadImageResponseDto } from './dtos/upload-image.dto';
import { CreateMultipleProductsDto } from './dtos/create-product.body.dto';
import { User } from '@prisma/client';
import { CurrentUser } from '@common/decorators/user.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, RoleGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Upload product image endpoint
  @Post('upload')
  @Roles(Role.ADMIN, Role.SELLER)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadImageDto?: UploadImageDto,
  ): Promise<UploadImageResponseDto> {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }
    
    return await this.productsService.uploadProductImage(file, uploadImageDto);
  }
  
  @Post()
  async createMultipleProducts(@CurrentUser() currentUser: User, @Body() createMultipleProductsDto: CreateMultipleProductsDto) {
    console.log('Current User:', currentUser);
    return this.productsService.createMultipleProducts(currentUser,createMultipleProductsDto.products);
  }
}
