import React, { useState, useEffect } from 'react';
import Pubnub from 'pubnub';
import Greeter from './components/greeter';
import './App.css';
import ChatRoom from './components/chatRoom';

const pubnub = new Pubnub({
  publishKey: "pub-c-0241220c-a93d-4721-9e30-036ca326250f",
  subscribeKey: "sub-c-027dcb1c-c196-4cc1-9250-8d622b931903",
  userId: "myUniqueUserId",
});

const App = () => {

  // State vairable declarations
  const [userName, setUserName] = useState();
  const [messages, setMessages] = useState([]);
  const [incommingMessage, setIncommingMessage] = useState({});

  // useEffect(() => {
  //   if(incommingMessage?.body){
  //     console.log("messages", incommingMessage);
  //     setMessages([
  //       incommingMessage, 
  //       ...messages
  //     ])
  //   }
  // }, [incommingMessage])

  // add listener
  const listener = {
    status: (statusEvent) => {
      if (statusEvent.category === "PNConnectedCategory") {
        console.log("Connected");
      }
    },
    message: (messageEvent) => {
      const { message } = messageEvent;
      setMessages(currentMessages => ([
        message,
        ...currentMessages
      ]))
    },
    presence: (presenceEvent) => {
      // handle presence
    }
  };


  const leaveApplication = () => {
    pubnub.removeListener(listener);
    pubnub.unsubscribeAll()
  }

  useEffect(() => {

    pubnub.addListener(listener);
    // subscribe to a channel
    pubnub.subscribe({
      channels: ["chatapp"],
    });

    return leaveApplication

  }, [])

  return (
    <div className="App">
      <div className="App-header">
        <h1>Chat Room</h1>
        {
          !userName ? (
            <Greeter userName={userName} setUserName={setUserName} />
          ) : (
            <ChatRoom userName={userName} messages={messages} setMessages={setMessages} pubnub={pubnub} />
          )
        }
      </div>
    </div>
  );
}

export default App;
