import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Point,
  PrimaryColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { FFBaseEntity } from '../../common/entities/base.entity';
import { Identity } from '../../identity/entities/identity.entity';

@Entity()
export class Restaurant extends FFBaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;

  @Column({ default: false })
  approved: boolean;

  // Relations
  @OneToOne(() => Identity, (user) => user.id)
  identityId: Identity;

  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.restaurants)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
