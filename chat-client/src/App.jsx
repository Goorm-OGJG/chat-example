import React, {useEffect, useRef, useState} from "react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './App.css';

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sender, setSender] = useState('anonymous');

    const clientRef = useRef(null);
    useEffect(() => {
        if (clientRef.current === null) {
            const socket = new SockJS('http://localhost:8080/chat');
            const client = Stomp.over(socket);

            console.log(client);

            client.connect({}, () => {
                client.subscribe('/topic/message', message => {
                    console.log('sub message: ', message);
                    handleReceiveMessage(JSON.parse(message.body));
                })
            });

            clientRef.current = client;
            // setStompClient(client);
        }
    }, []);

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleEnterName = (e) => {
        setSender(e.target.value);
    }

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const messageContent = JSON.stringify({
            sender: sender,
            content: newMessage
        })

        clientRef.current.send('/app/chat', {}, messageContent);

        // setMessages(prevMessages => [...prevMessages, {text: newMessage, sender: sender}]);
        setNewMessage('');
    };

    const handleReceiveMessage = (message) => {
        setMessages(prevMessages => [...prevMessages, {text: message.content, sender: message.sender}]);
    };

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    }

    return (
        <div className="chat-room">
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender === 'You' ? 'sent' : 'received'}`}>
                        <span>{message.sender}: </span>
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={sender}
                    onChange={handleEnterName}
                    placeholder="Type your name..."
                />
                <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyUp={handleKeyPress}
                    placeholder="Type your message..."
                />
                <button type="button" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;