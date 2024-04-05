import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Pagination {
  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  total: number;

  @ApiPropertyOptional()
  skip?: number;
}

export class Paginate<TData> {
  @ApiProperty()
  pagination: Pagination;

  @ApiProperty()
  items: TData[];

  constructor(items: TData[], pagination: Pagination) {
    this.items = items;
    this.pagination = pagination;
  }
}
