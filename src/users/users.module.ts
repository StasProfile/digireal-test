import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, PaymentHistory } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, PaymentHistory])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
