import { Column, Entity, OneToOne } from 'typeorm';
import { FFBaseEntity } from '../../common/entities/base.entity';
import { Role } from '../../auth/enum/user-role.dto';
import { User } from '../../users/entities/user.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

@Entity({ name: 'identity' })
export class Identity extends FFBaseEntity {
  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password', select: false })
  password: string;

  @Column({ name: 'avatar', nullable: true })
  avatar: string;

  @Column({ name: 'role', enum: Role, default: Role.USER })
  role: Role;

  // Relations
  @OneToOne(() => User, (u) => u.identity, { cascade: true })
  user: User;

  @OneToOne(() => Restaurant, (r) => r.identity, { cascade: true })
  restaurant: Restaurant;

  // Functions
  isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }
}
