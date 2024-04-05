import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class FilterTasksDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  @IsDate()
  @Type(() => Date)
  fromDate?: Date;

  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  @IsDate()
  @Type(() => Date)
  toDate?: Date;
}
