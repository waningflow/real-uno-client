import React, { Component } from 'react';
import { Button, Input, message as Toast } from 'antd';
import MessageBox from './components/MessageBox';
import { getSocket, setSocketData } from './socket';
import { getUserInfo } from './utils';
import './App.less';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: '',
      inputValue: '',
      roomData: [],
    };
  }
  componentDidMount() {
    this.init();
  }
  init = async () => {
    const socket = await getSocket();
    socket.on('create_room_result', ({ code, roomId, roomData, message }) => {
      if (code === 0) {
        setSocketData({ roomId });
        this.setState({
          roomId,
          roomData,
        });
      } else {
        Toast.error(message);
      }
    });
    socket.on('join_room_result', ({ code, roomId, roomData, message }) => {
      if (code === 0) {
        setSocketData({ roomId });
        this.setState({
          roomId,
          roomData,
        });
      } else {
        Toast.error(message);
      }
    });
    socket.on('update_room', ({ code, roomData, message }) => {
      if (code === 0) {
        this.setState({
          roomData,
        });
      } else {
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
    socket.emit('create_room', { userInfo: getUserInfo() });
  };
  handleClickJoin = async () => {
    const { inputValue } = this.state;
    if (!inputValue) return;
    const socket = await getSocket();
    socket.emit('join_room', { roomId: inputValue.toLocaleLowerCase(), userInfo: getUserInfo() });
  };
  render() {
    const { roomId, inputValue, roomData } = this.state;
    return (
      <div className="App">
        {roomId ? (
          <div className="home-main-container">
            <div className="home-main-header">
              <div className="home-title-roomid">房间号: {roomId.toUpperCase()}</div>
            </div>
            <div className="home-main-content">
              <div className="room-part">
                {roomData.map((v) => {
                  return <div key={v.userInfo.userId}>{v.userInfo.nickName}</div>;
                })}
              </div>
              <div className="message-part">
                <MessageBox />
              </div>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    );
  }
}

export default App;
