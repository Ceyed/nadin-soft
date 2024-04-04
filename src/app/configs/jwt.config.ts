import { registerConfig } from '@nadin/libs';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

enum JwtConfigEnum {
  JWT_SECRET = 'JWT_SECRET',
  JWT_TOKEN_AUDIENCE = 'JWT_TOKEN_AUDIENCE',
  JWT_TOKEN_ISSUER = 'JWT_TOKEN_ISSUER',
  JWT_ACCESS_TOKEN_TTL = 'JWT_ACCESS_TOKEN_TTL',
  JWT_REFRESH_TOKEN_TTL = 'JWT_REFRESH_TOKEN_TTL',
}

export class JwtConfig {
  @IsString()
  @IsNotEmpty()
  jwtSecret: string;

  @IsString()
  @IsNotEmpty()
  jwtTokenAudience: string;

  @IsString()
  @IsNotEmpty()
  jwtTokenIssuer: string;

  @IsNumber()
  jwtAccessTokenTtl: number;

  @IsNumber()
  jwtRefreshTokenTtl: number;

  constructor(obj: Partial<JwtConfig>) {
    Object.assign(this, obj);
  }
}

export const jwtConfig = registerConfig(JwtConfig, () => {
  return new JwtConfig({
    jwtSecret: process.env[JwtConfigEnum.JWT_SECRET],
    jwtTokenAudience: process.env[JwtConfigEnum.JWT_TOKEN_AUDIENCE],
    jwtTokenIssuer: process.env[JwtConfigEnum.JWT_TOKEN_ISSUER],
    jwtAccessTokenTtl: parseInt(process.env[JwtConfigEnum.JWT_ACCESS_TOKEN_TTL] ?? '3600', 10),
    jwtRefreshTokenTtl: parseInt(process.env[JwtConfigEnum.JWT_REFRESH_TOKEN_TTL] ?? '86400', 10),
  });
});
