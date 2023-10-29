import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { FFBaseEntity } from '../../common/entities/base.entity';
import { Identity } from '../../identity/entities/identity.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity({ name: 'user' })
export class User extends FFBaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  // Relations

  @OneToOne(() => Identity, (user) => user.id)
  @JoinColumn({ name: 'id' })
  identity: Identity;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
