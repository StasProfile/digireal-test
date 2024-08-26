import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { User, PaymentHistory } from './entities';
import { EBalanceOperationType } from './types';
import Decimal from 'decimal.js';
import { ExecuteBalanceOperationDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PaymentHistory)
    private readonly historyRepository: Repository<PaymentHistory>,
  ) {}
  async executeBalanceOperation({
    userId,
    amount,
    action,
  }: ExecuteBalanceOperationDto & {
    action: EBalanceOperationType;
  }) {
    return await this.userRepository.manager.transaction(
      async (manager: EntityManager) => {
        // Start transaction with lock
        const user = await manager
          .createQueryBuilder(User, 'user')
          .setLock('pessimistic_write') // Lock the row for writing
          .where('user.id = :id', { id: userId })
          .getOne();

        if (!user) {
          throw new NotFoundException('User not found');
        }

        // Convert balance and amount to Decimal instances
        const currentBalance = new Decimal(user.balance);
        const operationAmount = new Decimal(amount);

        if (
          action === EBalanceOperationType.DECREASE &&
          currentBalance.lessThan(operationAmount)
        ) {
          throw new BadRequestException(
            'Insufficient balance for this operation',
          );
        }

        const newBalance =
          action === EBalanceOperationType.DECREASE
            ? currentBalance.minus(operationAmount)
            : currentBalance.plus(operationAmount);

        // Update user's balance
        user.balance = newBalance.toFixed();

        await manager.save(user);

        // Record the payment history
        const history = new PaymentHistory({
          user,
          action,
          amount: operationAmount.toFixed(),
        });

        await manager.save(history);

        return user;
      },
    );
  }
}
