export class LoginResponseDto {
  user:
    | {
        id: string;
        email: string;
        accessToken: string;
        refreshToken: string;
      }
    | undefined;
}
