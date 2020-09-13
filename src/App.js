import React, { Component } from 'react';
import logo from './logo.svg';
import './App.less';
import { getSocket } from './socket';
import { Button } from 'antd';

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
    socket.emit('create_room');
    socket.on('create_room_success', (roomId) => {
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
