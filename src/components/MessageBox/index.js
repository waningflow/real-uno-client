import React from 'react';
import {getSocket} from '../../socket'
import { Button } from 'antd';

class MessageBox extends React.Component {
  socket = null;
  componentDidMount() {
    this.init()
  }

  init = async () => {
    this.socket = await getSocket();
    this.socket.on('message', data => {
      console.log(data)
    })
  }

  handleSendMessage = () => {

  }

  render() {
    return (
      <div>
        <div></div>
        <div>

        </div>
      </div>
    );
  }
}

export default MessageBox;
