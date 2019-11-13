export default class SocketConnection {
  constructor(url) {
    let socket = io(url);
    return socket;
  }
}
