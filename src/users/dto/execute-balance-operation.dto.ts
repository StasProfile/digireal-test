import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class ExecuteBalanceOperationDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiProperty({ example: '100' })
  @Transform(({ value }) => {
    const transformedValue = parseFloat(value);
    if (isNaN(transformedValue)) {
      return value;
    }
    return transformedValue;
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}
