import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Pagination } from '../../classes/paginate';

export class PaginationDto {
  @ApiProperty()
  @IsNumber()
  page = 0;

  @ApiProperty()
  @IsNumber()
  size = 100;

  get skip() {
    return (this.page - 1) * this.size;
  }

  getPagination(total): Pagination {
    const pagination: Pagination = new Pagination();
    pagination.page = this.page;
    pagination.size = this.size;
    pagination.skip = this.skip;
    pagination.total = total;
    return pagination;
  }

  constructor(obj?: Partial<PaginationDto>) {
    if (obj) Object.assign(this, obj);
  }
}
