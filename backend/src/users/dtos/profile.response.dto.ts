import { AddressType, Role } from '@prisma/client';

export class AddressResponseDto {
  addressId?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  addressType?: AddressType;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProfileResponseDto {
  fullName?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserAccountInfoDto {
  userId!: string;
  email!: string;
  role!: Role;
  isBanned!: boolean;
  isVerified!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  profile!: ProfileResponseDto[];
  addresses!: AddressResponseDto[];
}
