// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import { ws } from "./Components/Redux/API";
import { SetWebSocketDataAction } from "./Components/Redux/RMSAction";
import MainRoutes from "./Components/Routes/MainRoutes";
import { Decompressed } from "./Components/Utilities/Utilities";
export var WebsocketConnect
export var socketClose
export var ReConnectFlag = true
function App() {
  const dispatch = useDispatch()
  const [websocket, setWebsocket] = useState();

  WebsocketConnect = () => {
    console.log("call socket -----------------------");
    let socket = new WebSocket(ws + "/ws/rms");
    setWebsocket(socket);

    // setsocket(socket)
    // setNotifyData((data) => ({ ...data, loadingFlag: true }))
    socket.onopen = function (e) {
      console.log("Connected");
    };

    socket.onmessage = function (e) {
      // let data = JSON.parse(e.data);
      // console.log('data',data);
      // console.log(e);
      // let size1 = (new TextEncoder().encode(e.data).length) / 1024
      // console.log('befor Socket Data Size', size1, 'KB');
      let data = Decompressed(e.data);
      // console.log(data);
      // let size = (new TextEncoder().encode(JSON.stringify(data)).length) / 1024
      // console.log('after Socket Data Size', size, 'KB');



      if (data !== undefined) {
        if (data.length !== 0) {
          dispatch(SetWebSocketDataAction(data));
        }
      }

    };

    socket.onclose = function (e) {
      console.log("closed");
      // socket.close()
      // console.log('socket state',socket.readyState())
      // setSocketData([]);
      if (ReConnectFlag) {
        if (socket.readyState == 3) {
          setTimeout(() => {
            console.log("Reconnect*****", socket.readyState);
            WebsocketConnect()
          }, 2000);
        }
      }
    };
    socket.onerror = function (e) {
      // setSocketData([]);
      console.log("error");
    };
  };

  socketClose = () => {
    if (websocket.readyState == 1) {
      ReConnectFlag = false;
      websocket.close();
    }
  };



  return (
    <div className="mainBody">
      <MainRoutes />
    </div>
  );
}
export default App;
