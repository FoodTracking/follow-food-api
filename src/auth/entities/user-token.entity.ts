import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user-token' })
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // --  Relations

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => UserToken)
  @JoinColumn({ name: 'initial_id' })
  rootToken: UserToken;

  @OneToOne(() => UserToken)
  @JoinColumn({ name: 'next_id' })
  nextToken: UserToken;
}
