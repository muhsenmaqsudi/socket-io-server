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
  @WebSocketServer() private wss: Server;

  handleConnection(client: Client, ...args: any[]) {
    console.log(`Client with id ${client.id} has been connected to our wss`);
    this.wss.emit('connectedToWss', 'data passed to client from wss');
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

  @SubscribeMessage('userIsTypingToWss')
  onUserIsTypingEventHandler(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
  ) {
    client.emit('userIsTypeingToClient', 'user is typing');
  }

  @SubscribeMessage('userIsNoLongerTyping')
  onUserIsNoLongerTypingEventHandler(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
  ) {
    client.emit('userIsNoLongerTypingToClient', 'user is no longer typing');
  }
}
