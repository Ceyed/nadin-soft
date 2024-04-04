import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Auth } from '../../../../libs/src/lib/decorators/auth.decorator';
import { RefreshTokenDto } from '../../../../libs/src/lib/dto/refresh-token.dto';
import { SignInDto } from '../../../../libs/src/lib/dto/sign-in.dto';
import { SignUpDto } from '../../../../libs/src/lib/dto/sign-up.dto';
import { AuthType } from '../../../../libs/src/lib/enums/auth-type.enum';
import { AuthenticationService } from './authentication.service';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly _authenticationService: AuthenticationService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this._authenticationService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this._authenticationService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in-cookie')
  async signInInCookie(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
  ) {
    const accessToken = await this._authenticationService.signIn(signInDto);
    response.cookie('accessToken', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this._authenticationService.refreshTokens(refreshTokenDto);
  }
}
