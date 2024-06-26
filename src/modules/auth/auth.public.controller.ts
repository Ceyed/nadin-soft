import { Body, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  AccessTokenAndRefreshTokenDto,
  NadinController,
  NadinModulesEnum,
  RouteTypeEnum,
  UpdateResultModel,
} from 'libs/src';
import { SignInDto } from '../../../libs/src/lib/dto/auth/sign-in.dto';
import { SignUpDto } from '../../../libs/src/lib/dto/auth/sign-up.dto';
import { AuthenticationService } from './auth.service';

@NadinController(NadinModulesEnum.Auth, 'auth', RouteTypeEnum.PUBLIC)
export class AuthPublicController {
  constructor(private readonly _authenticationService: AuthenticationService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto): Promise<UpdateResultModel> {
    return this._authenticationService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto): Promise<AccessTokenAndRefreshTokenDto> {
    return this._authenticationService.signIn(signInDto);
  }
}
