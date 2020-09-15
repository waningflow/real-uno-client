import React from 'react';
import { getSocket } from '../../socket';
import { Input } from 'antd';
import './index.less';

class MessageBox extends React.Component {
  socket = null;
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      messageList: [],
    };
  }
  componentDidMount() {
    this.init();
  }

  init = async () => {
    this.socket = await getSocket();
    this.socket.on('message', (data) => {
      this.pushMessage(data);
    });
  };

  pushMessage = (newMessage) => {
    const { messageList } = this.state;
    messageList.push(newMessage);
    this.setState({ messageList });
  };

  handleSendMessage = () => {
    const { inputValue } = this.state;
    const data = {
      msg: inputValue,
    };
    this.socket.send(data);
    this.setState({
      inputValue: '',
    });
  };

  handleChangeInput = (e) => {
    this.setState({
      inputValue: e.target.value,
    });
  };

  render() {
    const { inputValue, messageList } = this.state;
    return (
      <div className="message-box-container">
        <div className="message-box-list">
          {messageList.map((v) => {
            return (
              <div key={v.msgId}>
                <span className="nickname">{v.userInfo.nickName}:</span> {v.msg}
              </div>
            );
          })}
        </div>
        <div className="message-box-sender">
          <Input.Search
            placeholder=""
            enterButton="发送"
            // size="large"
            onSearch={(value) => this.handleSendMessage(value)}
            value={inputValue}
            onChange={this.handleChangeInput}
          ></Input.Search>
        </div>
      </div>
    );
  }
}

export default MessageBox;
