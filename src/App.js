import React, { Component } from 'react';
import logo from './logo.svg';
import './App.less';
import { getSocket, setSocketData } from './socket';
import { Button } from 'antd';
import MessageBox from './components/MessageBox';
import { getNickName } from './utils';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: '',
    };
  }
  componentDidMount() {
    // this.init();
  }
  // init = async () => {
  //   const socket = await getSocket();
  // };
  handleClickCreate = async () => {
    const socket = await getSocket();
    socket.emit('create_room', { nickName: getNickName() });
    socket.on('create_room_success', (roomId) => {
      setSocketData({ roomId });
      this.setState({
        roomId,
      });
    });
  };
  render() {
    const { roomId } = this.state;
    return (
      <div className="App">
        {roomId ? (
          <div>
            <div>room id: {roomId}</div>
            <div className="message-part">
              <MessageBox />
            </div>
          </div>
        ) : (
          <div>
            <Button onClick={this.handleClickCreate}>create room</Button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
