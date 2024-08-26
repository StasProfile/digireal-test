import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { EBalanceOperationType } from './types';
import { ExecuteBalanceOperationDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('balance/increase')
  increaseBalance(@Body() { userId, amount }: ExecuteBalanceOperationDto) {
    return this.usersService.executeBalanceOperation({
      userId,
      amount,
      action: EBalanceOperationType.INCREASE,
    });
  }

  @Post('balance/decrease')
  decreaseBalance(@Body() { userId, amount }: ExecuteBalanceOperationDto) {
    return this.usersService.executeBalanceOperation({
      userId,
      amount,
      action: EBalanceOperationType.DECREASE,
    });
  }
}
