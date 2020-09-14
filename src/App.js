import React, { Component } from 'react';
import logo from './logo.svg';
import './App.less';
import { getSocket, setSocketData } from './socket';
import { Button, Input, message as Toast } from 'antd';
import MessageBox from './components/MessageBox';
import { getNickName } from './utils';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: '',
      inputValue: '',
    };
  }
  componentDidMount() {
    this.init();
  }
  init = async () => {
    const socket = await getSocket();
    socket.on('create_room_result', ({ code, roomId, message }) => {
      if (code === 0) {
        setSocketData({ roomId });
        this.setState({
          roomId,
        });
      } else {
        console.log(message);
        Toast.error(message);
      }
    });
    socket.on('join_room_result', ({ code, roomId, message }) => {
      if (code === 0) {
        setSocketData({ roomId });
        this.setState({
          roomId,
        });
      } else {
        console.log(message);
        Toast.error(message);
      }
    });
  };
  handleChangeInput = (e) => {
    this.setState({
      inputValue: e.target.value,
    });
  };
  handleClickCreate = async () => {
    const socket = await getSocket();
    socket.emit('create_room', { nickName: getNickName() });
  };
  handleClickJoin = async () => {
    const { inputValue } = this.state;
    if (!inputValue) return;
    const socket = await getSocket();
    socket.emit('join_room', { roomId: inputValue, nickName: getNickName() });
  };
  render() {
    const { roomId, inputValue } = this.state;
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
          <div className="home-container">
            <div className="home-create">
              <Button onClick={this.handleClickCreate} size="large" type="primary">
                创建房间
              </Button>
            </div>
            <div className="home-or">或者</div>
            <div className="home-join">
              <Input
                value={inputValue}
                onChange={this.handleChangeInput}
                size="large"
                placeholder="输入房间号"
                onPressEnter={this.handleClickJoin}
                maxLength={5}
              ></Input>
              <Button onClick={this.handleClickJoin} size="large" type="primary">
                加入房间
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
