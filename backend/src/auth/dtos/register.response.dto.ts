export class RegisterResponseDto {
  user:
    | {
        id: string;
        email: string;
        role: string;
        accessToken: string;
        refreshToken: string;
      }
    | undefined;
}
