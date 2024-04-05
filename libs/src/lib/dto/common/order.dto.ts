import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty()
  orderBy: string;

  @ApiProperty()
  order: string;

  constructor(obj?: Partial<OrderDto>) {
    if (obj) Object.assign(this, obj);
  }
}
