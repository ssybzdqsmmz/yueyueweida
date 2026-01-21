/*
 * @Author: Lincong-pro
 * @Date: 2023-03-28 11:03:14
 * @LastEditors: Lincong-pro
 * @LastEditTime: 2023-03-30 18:52:24
 * @FilePath: \geoproject2.0\src\utils\Network\WebSocket.ts
 * @Description: 用于和后端进行通信
 * Copyright (c) 2023 by VGE, All Rights Reserved.
 */
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client/build/esm/socket';

interface SocketOptionInterface {
  connect: (socket: Socket) => void;
  disconnect: (socket: Socket) => void;
  logging: (socket: Socket) => void;
}

/**
 * @description: DWebSocket
 * @return {*}
 */
class DWebSocket {
  private io: Socket;

  public constructor(options: SocketOptionInterface) {
    this.io = io('ws://localhost:8082', {
      withCredentials: false,
      reconnection: true,
    });
    this.bindEvents(options);
  }

  bindEvents(options) {
    //* ///////////////////////////////////////////////////// bind callback fucntion /////////////////////////////////////////////////////// *//
    this.io.on('connect', options.connect);
    this.io.on('disconnect', options.disconnect);

    this.io.on('logging', options.logging);
  }

  public getSocket() {
    return this.io;
  }
}

export default DWebSocket;
