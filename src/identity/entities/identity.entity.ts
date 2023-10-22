import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FFBaseEntity } from '../../common/entities/base.entity';
import { Role } from '../../auth/enum/user-role.dto';
import { Client } from '../../users/entities/user.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

@Entity({ name: 'identity' })
export class Identity extends FFBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password', select: false })
  password: string;

  @Column({ name: 'role', enum: Role, default: Role.USER })
  role: Role;

  // Relations
  @OneToOne(() => Client, (client) => client.id, { cascade: true })
  client: Client;

  @OneToOne(() => Restaurant, (restaurant) => restaurant.id, { cascade: true })
  restaurant: Restaurant;
}
