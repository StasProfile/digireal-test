import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { EBalanceOperationType } from '../types';

@Entity()
export class PaymentHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.paymentHistories)
  user: User;

  @Column()
  action: string;

  @Column()
  amount: string;

  @CreateDateColumn()
  ts: Date;

  constructor({
    user,
    action,
    amount,
  }: {
    user?: User;
    action?: EBalanceOperationType;
    amount?: string;
  } = {}) {
    this.user = user;
    this.action = action;
    this.amount = amount;
    this.ts = new Date();
  }
}
