import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from './constants';

export class BaseQueryDto {
  @ApiProperty({ type: 'number', default: DEFAULT_PAGE_SIZE, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  public limit = DEFAULT_PAGE_SIZE;

  @ApiProperty({
    type: 'number',
    default: DEFAULT_PAGE_NUMBER,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  public page = DEFAULT_PAGE_NUMBER;

  @ApiPropertyOptional({ default: 'DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  public sortDirection: 'ASC' | 'DESC' = 'DESC';
}
