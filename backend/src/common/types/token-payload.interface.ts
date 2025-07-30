export interface TokenPayloadInput {
  id: string;

  email: string;
}

export interface TokenPayload extends TokenPayloadInput {
  iat: number;

  exp: number;
}
