export class RegisterResponseDto {
  user:
    | {
        id: string;
        email: string;
        accessToken: string;
        refreshToken: string;
      }
    | undefined;
}
