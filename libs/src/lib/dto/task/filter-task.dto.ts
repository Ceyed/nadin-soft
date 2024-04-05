import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterTasksDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  searchTerm?: string;
}
