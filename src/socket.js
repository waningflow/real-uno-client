import io from 'socket.io-client';
import { getUserInfo } from './utils';

const socketUrl = 'http://localhost:9013';

let socket = null;
const getSocket = () => {
  return new Promise((resolve) => {
    if (!socket) {
      socket = io(socketUrl, {
        query: { userInfo: JSON.stringify(getUserInfo()) },
      });
      // socket.on('connect', () => {
      //   resolve(socket);
      // });
    }
    resolve(socket);
  });
};

const setSocketData = (obj = {}) => {
  socket._data = Object.assign(socket._data || {}, obj);
};

export { getSocket, setSocketData };
