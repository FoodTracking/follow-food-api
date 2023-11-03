import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Identity } from '../identity/entities/identity.entity';
import { Role } from '../auth/enum/user-role.dto';
import { Order } from './entities/order.entity';
import { plainToInstance } from 'class-transformer';
import { OrderOverviewDto } from './dto/order-overview.dto';

@WebSocketGateway({ namespace: 'orders' })
export class OrdersGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  // Jwt Authentication by middleware (socket-io.adapter.ts)
  // https://github.com/nestjs/nest/issues/882 (guard aren't supported)
  handleConnection(client: Socket & { user: Partial<Identity> }) {
    if (client.user.role !== Role.RESTAURANT) client.disconnect();
    console.log(`Client ${client.id} has connected`);
    client.join(client.user.id);
    console.log(`Client ${client.id} has joined room ${client.user.id}`);
  }

  newOrder(id: string, order: Order) {
    console.log('order', order);
    const data = plainToInstance(OrderOverviewDto, order, {
      excludeExtraneousValues: true,
    });
    this.server.to(id).emit('newOrder', data);
  }

  updateOrder(id: string, order: Order) {
    this.server.to(id).emit('updateOrder', order);
  }
}
