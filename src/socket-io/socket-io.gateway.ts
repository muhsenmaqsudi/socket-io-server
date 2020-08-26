import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
  MessageBody,
  WsResponse,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Client, Socket } from 'socket.io';

@WebSocketGateway()
export class SocketIoGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  wss: Server;

  handleConnection(client: Client, ...args: any[]) {
    console.log(`Client with id ${client.id} has been connected to our wss`);
    this.wss.emit('customEmit', 'data passed from wss');
  }

  handleDisconnect(client: Client) {
    console.log(
      `Client with id ${client.id} has been disconnected from our wss`,
    );
  }

  @SubscribeMessage('msgToWss')
  onMessageEventHandler(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    client.emit(
      'msgToClient',
      `client's message with ${client.id} client id has been recieved`,
    );
    return { event: 'message', data };
  }
}
