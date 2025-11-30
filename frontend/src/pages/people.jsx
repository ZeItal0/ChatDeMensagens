import React from "react";
import "../assets/peoples.css";
import backgroundImg from "../background/background.png";
import { Link } from "react-router-dom";
import user from "../icons/user.png";
import send from "../icons/send.png";
import gear from "../icons/gear.png";
import logout from "../icons/log-out.png";

const ChatItem = ({ username, time, isActive }) => (
    <div className={`chat-item ${isActive ? 'active' : ''}`}>
        <img src={user} className="user-icon"/>
        <span className="username">{username}</span>
        <span className="time">{time}</span>
    </div>
);


const MessageBubble = ({ text, time, type }) => (
    <div className={`message-row ${type}`}>
        {type === 'received' && <img src={user} className="user-icon"/>}
        <div className="message-bubble">
            {text}
            <div className="message-time">{time}</div>
        </div>
    </div>
);

export default function Peoples() {

    const chatList = [
        { id: 1, username: "nome do usuario", time: "00:00", active: true },
        { id: 2, username: "nome do usuario", time: "00:00", active: false },
        { id: 3, username: "nome do usuario", time: "00:00", active: false },
        { id: 4, username: "nome do usuario", time: "00:00", active: false },
    ];

    const messages = [
        { id: 1, text: "assunto da conversa", time: "00:00", type: "received" },
        { id: 2, text: "assunto da conversa", time: "00:00", type: "sent" },
    ];

    return (
        <div className="peoples-container">
            <div className="sidebar-left">
                <Link to="/profile" className="nav-icon"><img src={user} className="user-icon"/></Link>
                <Link to="/settings" className="nav-icon"><img src={gear} className="user-icon"/></Link>
                <Link to="/" className="nav-icon"><img src={logout} className="user-icon"/></Link>
            </div>

            <div className="main-content" style={{ backgroundImage: `url(${backgroundImg})` }}>
                
                <div className="chat-header">
                    <div className="chat-header-info">
                        <img src={user} className="user-icon"/>
                        <span className="username">nome do usuario</span>
                    </div>
                </div>

                <div className="chat-messages">
                    {messages.map(msg => (
                        <MessageBubble 
                            key={msg.id} 
                            text={msg.text} 
                            time={msg.time} 
                            type={msg.type} 
                        />
                    ))}
                </div>

                <div className="message-input-area">
                    <input type="text" placeholder="Digite sua mensagem..." />
                    <img src={send} className="send-icon"/>
                </div>
            </div>

            <div className="sidebar-right">
                <div className="sidebar-right-header">
                    Bubbies
                </div>
                <div className="chat-list">
                    {chatList.map(chat => (
                        <ChatItem 
                            key={chat.id} 
                            username={chat.username} 
                            time={chat.time} 
                            isActive={chat.active} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
