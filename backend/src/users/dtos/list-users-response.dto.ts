export interface UserListItemDto {
  userId: string;
  email: string;
  role: string;
  isBanned: boolean;
  isVerified: boolean;
  warningCount: number;
  createdAt: Date;
  updatedAt: Date;
  profile?: {
    fullName?: string;
    phoneNumber?: string;
    profileImageUrl?: string;
  };
}

export interface PaginationMetaDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ListUsersResponseDto {
  users: UserListItemDto[];
  pagination: PaginationMetaDto;
  filteredByRole?: string;
}
