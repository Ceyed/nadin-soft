import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRoleEnum } from '../../enums';

export class FilterUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({ type: 'enum', enum: UserRoleEnum })
  @IsOptional()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;
}
