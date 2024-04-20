import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TodoListRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public text: string;

  @ApiProperty()
  public done: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  public updatedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  public createdAt?: Date;
}
