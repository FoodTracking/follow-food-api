import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { FFBaseEntity } from '../../common/entities/base.entity';
import {Identity} from "../../identity/entities/identity.entity";

@Entity({ name: 'identity-session' })
export class IdentitySessionEntity extends FFBaseEntity {
  @Column({ name: 'identity_id' })
  identityId: string;

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

  @ManyToOne(() => Identity)
  @JoinColumn({ name: 'identity_id' })
  identity: Identity;

  @OneToOne(() => IdentitySessionEntity)
  @JoinColumn({ name: 'root_id' })
  rootSession: IdentitySessionEntity;

  @OneToOne(() => IdentitySessionEntity)
  @JoinColumn({ name: 'next_id' })
  nextSession: IdentitySessionEntity;
}
