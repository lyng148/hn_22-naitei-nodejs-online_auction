import { Injectable, BadRequestException } from '@nestjs/common';
import { UploadFileServiceS3 } from '@common/services/file.service';
import { UploadImageDto, UploadImageResponseDto } from './dtos/upload-image.dto';
import { CreateMultipleProductsDto, CreateProductDto } from './dtos/create-product.body.dto';
import PrismaService from '@common/services/prisma.service';
import { User } from '@prisma/client';
import { CreateMultipleProductsResponseDto, CreateProductResponseDto } from './dtos/create-product.response.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly uploadFileService: UploadFileServiceS3, private prisma: PrismaService) {}

  async uploadProductImage(
    file: Express.Multer.File,
    uploadImageDto?: UploadImageDto,
  ): Promise<UploadImageResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type (only images)
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only image files are allowed');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    try {
      const fileName = uploadImageDto?.fileName || file.originalname;
      const imageUrl = await this.uploadFileService.uploadFileToPublicBucket(
        'products',
        {
          file,
          file_name: fileName,
        },
      );

      return {
        imageUrl,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new BadRequestException(`Failed to upload image: ${errorMessage}`);
    }
  }

  async createMultipleProducts(currUser: User, products: CreateProductDto[]): Promise<CreateMultipleProductsResponseDto> {
    const createdProducts: CreateProductResponseDto[] = [];
    for (const product of products) {
        const createdProd = await this.prisma.product.create({
          data: {
            name: product.name,
            description: product.description,
            stockQuantity: product.stockQuantity,
            status: 'INACTIVE',
            seller: {
                connect: { userId: (currUser as any).id || currUser.userId }, 
            }, 
          },
        });

        if (product.imageUrls && product.imageUrls.length > 0) {
          const imageData = product.imageUrls.map((url, index) => ({
            productId: createdProd.productId,
            imageUrl: url,
            isPrimary: index === 0, // Ảnh đầu tiên làm primary
          }));

        await this.prisma.productImage.createMany({
          data: imageData,
        });

        const createdProductWithImages = await this.prisma.product.findUnique({
          where: { productId: createdProd.productId },
          select: {
            productId: true,
            name: true,
            description: true,
            stockQuantity: true,
            status: true,
            images: {
              select: {
                imageUrl: true,
                isPrimary: true,
              },
            },
          }
        });

        if (createdProductWithImages) {
          createdProducts.push({
            ...createdProductWithImages,
            description: createdProductWithImages.description ?? undefined,
          });
        }
      }
    }

    return {
      products: createdProducts,
      count: createdProducts.length,
      message: 'Products created successfully',
    };
  }
}
