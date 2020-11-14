import { useState, useEffect } from 'react';
import '../styles/style.css';
import Chat from './Chat';
import Videoplayer from './Videoplayer';

import io from 'socket.io-client';
let socket;


function Broadcast (props) {

  const [msg, setMsg] = useState('');
  const [broadcast, setBroadcast] = useState({});

  useEffect ( () => {
    //Connect to room-specific socket
    socket = io.connect();
    socket.emit('join', window.location.pathname);

    // Listens for new chat messages from server
    socket.on('chat message to client', msg => {
      setMsg(msg);
    });

    // On component unmount, close socket
    return () => {
      socket.close();
    }
  }, []);


  useEffect ( () => {
    //Get broadcast object for this room from backend server
    props.getBroadcast(window.location.pathname.slice(3));
  }, [props]);

  useEffect ( () => {
    // Store broadcast object as state when getting response from backend server
    setBroadcast(props.broadcast);
  }, [props.broadcast]);



  // Sends new message (from groupchat) to server
  const emitMsg = (msg) => {
    socket.emit('chat message to server', {room: window.location.pathname, msg: msg});
  };

  return (
    <div className="broadcast">
      <Videoplayer broadcast={broadcast}/>
      <Chat emitMsg={emitMsg} msg={msg}/>
    </div>
  )
}

export default Broadcast;