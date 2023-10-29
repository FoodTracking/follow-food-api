import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_item')
export class OrderItem {
  @PrimaryColumn({ name: 'order_id' })
  orderId: string;

  @PrimaryColumn({ name: 'product_id' })
  productId: string;

  @Column()
  quantity: number;

  // Relations
  @ManyToOne(() => Order, (order) => order.products)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
