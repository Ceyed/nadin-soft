import { Body, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { NadinController, NadinModulesEnum, RouteTypeEnum } from 'libs/src';
import { RefreshTokenDto } from '../../../libs/src/lib/dto/refresh-token.dto';
import { AuthenticationService } from './auth.service';

@NadinController(NadinModulesEnum.Auth, 'auth', RouteTypeEnum.NORMAL)
export class AuthNormalController {
  constructor(private readonly _authenticationService: AuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this._authenticationService.refreshTokens(refreshTokenDto);
  }
}
