import React, { Component } from 'react';
import { Button, Input, message as Toast, Tooltip } from 'antd';
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
      userInfo: getUserInfo(),
    };
  }
  componentDidMount() {
    this.init();
  }
  init = async () => {
    const socket = await getSocket();
    socket.on('auto_join', ({ roomId, roomData }) => {
      console.log('auto join');
      setSocketData({ roomId });
      this.setState({
        roomId,
        roomData,
      });
    });
    socket.on('reset', () => {
      console.log('reset');
      setSocketData({ roomId: null });
      this.setState({
        roomId: null,
        roomData: null,
      });
    });
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
    socket.on('connect', () => {
      console.log('connect');
    });
    socket.on('disconnect', () => {
      console.log('disconnect');
    });
    socket.on('reconnect_attempt', () => {
      console.log('reconnect_attempt');
    });
    socket.on('reconnect_error', () => {
      console.log('reconnect_error');
    });
    socket.on('reconnect_failed', () => {
      console.log('reconnect_failed');
    });
    socket.on('reconnect', () => {
      console.log('reconnect');
    });
  };
  handleChangeInput = (e) => {
    this.setState({
      inputValue: e.target.value,
    });
  };
  handleClickCreate = async () => {
    const { userInfo } = this.state;
    const socket = await getSocket();
    socket.emit('create_room', { userInfo });
  };
  handleClickJoin = async () => {
    const { inputValue, userInfo } = this.state;
    if (!inputValue) return;
    const socket = await getSocket();
    socket.emit('join_room', { roomId: inputValue.toLocaleLowerCase(), userInfo });
  };
  handleLeaveRoom = async () => {
    const socket = await getSocket();
    socket.disconnect();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  render() {
    const { roomId, inputValue, roomData, userInfo } = this.state;
    return (
      <div className="App">
        {roomId ? (
          <div className="home-main-container">
            <div className="home-main-header">
              <div className="home-title-roomid">
                <Tooltip placement="top" title="复制房间号发给好友加入游戏">
                  房间号: {roomId.toUpperCase()}
                </Tooltip>
              </div>
              <div className="flex-grow"></div>
              {roomData.owner.userId === userInfo.userId &&
                (roomData.users.length < 2 ? (
                  <Tooltip placement="top" title="至少两人才能开始游戏">
                    <Button type="primary" disabled={roomData.users.length < 2} size="large">
                      开始游戏
                    </Button>
                  </Tooltip>
                ) : (
                  <Button type="primary" disabled={roomData.users.length < 2} size="large">
                    开始游戏
                  </Button>
                ))}
              <Button size="large" onClick={this.handleLeaveRoom}>
                离开房间
              </Button>
            </div>
            <div className="home-main-content">
              <div className="room-part">
                {roomData.users.map((v) => {
                  return (
                    <div
                      key={v.userId}
                      className="member-box"
                      style={{ backgroundImage: `url('${v.avatarUrl}')` }}
                    >
                      {v.userId === roomData.owner.userId && (
                        <div className="member-label">房主</div>
                      )}
                      <div className="member-bottom-bar">{v.nickName}</div>
                    </div>
                  );
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
