import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { FFBaseEntity } from '../../common/entities/base.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

@Entity('product')
export class Product extends FFBaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  price: number;

  // Relation

  @Column({ name: 'restaurant_id' })
  restaurantId: string;

  @ManyToOne(() => Restaurant, (r) => r.products)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;


}
