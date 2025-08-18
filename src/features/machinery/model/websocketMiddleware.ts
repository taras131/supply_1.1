import { Middleware } from "redux";
import { updateMachineryList, wsConnected, wsDisconnected } from "./slice";

const WEBSOCKET_URL = "wss://mylittleserver.ru/api/v1/machinery/ws";

export const machineryWebsocketMiddleware: Middleware = (store) => {
  let socket: WebSocket | null = null;

  const connectWebSocket = () => {
    socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => {
      store.dispatch(wsConnected());
      console.log("WebSocket Connected");
    };

    socket.onmessage = (event) => {
      const machinery = JSON.parse(event.data);
      console.log(machinery);
      // Игнорируем сообщения "ping"
      if (machinery.length) {
        store.dispatch(updateMachineryList(machinery));
      }
    };

    socket.onclose = () => {
      store.dispatch(wsDisconnected());
      console.log("WebSocket Disconnected");
      // Переподключение через 5 секунд
      setTimeout(() => {
        connectWebSocket();
      }, 5000);
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
      socket?.close();
    };
  };

  connectWebSocket();

  return (next) => (action) => next(action);
};
