import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { FFBaseEntity } from '../../common/entities/base.entity';

@Entity({ name: 'user-session' })
export class UserSessionEntity extends FFBaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'refresh_token', comment: 'hashed token' })
  refreshToken: string;

  @Column({ name: 'token', comment: 'hashed token' })
  token: string;

  @Column({ name: 'user_agent' })
  userAgent: string;

  @Column()
  ip: string;

  @Column({ default: false })
  invalidated: boolean;

  @Column({ name: 'invalidated_reason', nullable: true })
  invalidedReason?: string;

  @Column({ name: 'root_id', nullable: true, comment: 'The root UserToken id' })
  rootId?: string;

  @Column({ name: 'next_id', nullable: true })
  nextId?: string;

  // --  Relations

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => UserSessionEntity)
  @JoinColumn({ name: 'root_id' })
  rootSession: UserSessionEntity;

  @OneToOne(() => UserSessionEntity)
  @JoinColumn({ name: 'next_id' })
  nextSession: UserSessionEntity;
}
