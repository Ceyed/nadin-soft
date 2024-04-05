import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateResultModel {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  status: boolean;
}
