import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PaymentHistory } from './payment-history.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  balance: string;

  @OneToMany(() => PaymentHistory, (paymentHistory) => paymentHistory.user)
  paymentHistories: PaymentHistory[];
}
