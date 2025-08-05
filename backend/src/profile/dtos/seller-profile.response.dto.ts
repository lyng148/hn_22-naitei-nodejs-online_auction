import { AddressType, Role } from '@prisma/client';

export class SellerProfileResponseDto {
  fullName?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
}

export class SellerAddressResponseDto {
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  addressType?: AddressType;
}

export class SellerStatsDto {
  totalProductsSold!: number;
  averageRating?: number;
  followerCount!: number;
}

export class SellerAccountInfoDto {
  userId!: string;
  role!: Role;
  profile!: SellerProfileResponseDto[];
  addresses!: SellerAddressResponseDto[];
  stats!: SellerStatsDto;
  isFollowedByCurrentUser!: boolean;
}
