import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { FFBaseEntity } from '../../common/entities/base.entity';
import { Identity } from '../../identity/entities/identity.entity';

@Entity({ name: 'client' })
export class Client extends FFBaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @OneToOne(() => Identity, (user) => user.id)
  @JoinColumn({ name: 'id' })
  user: Identity;
}
