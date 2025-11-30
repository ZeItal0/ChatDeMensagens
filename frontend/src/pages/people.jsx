import React, { useState, useEffect } from "react";
import "../assets/peoples.css";
import backgroundImg from "../background/background.png";
import { Link } from "react-router-dom";
import userIcon from "../icons/user.png";
import sendIcon from "../icons/send.png";
import gearIcon from "../icons/gear.png";
import logoutIcon from "../icons/log-out.png";
import bell from "../icons/bell.png";
import socket from "../components/socket";
import happy from "../icons/happy.png";
import EmojiPickerComponent from "../components/EmojiPickerComponent";

const ChatItem = ({ id, username, isActive, onClick, hasNotification }) => (
    <div className={`chat-item ${isActive ? 'active' : ''}`} onClick={() => onClick(id)}>
        <img src={userIcon} className="user-icon" />
        <span className="username">{username}</span>
        <img
            src={bell}
            className={`bell-icon ${hasNotification ? 'bell-animate' : ''}`}
        />
    </div>
);

const MessageBubble = ({ text, time, type }) => (
    <div className={`message-row ${type}`}>
        {type === 'received' && <img src={userIcon} className="user-icon" />}
        <div className="message-bubble">
            {text}
            <div className="message-time">{time}</div>
        </div>
    </div>
);

export default function Peoples() {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [activeChatId, setActiveChatId] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [notifications, setNotifications] = useState({});

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const handleEmojiClick = (emoji) => {
        setCurrentMessage(prev => prev + emoji);
    };

    useEffect(() => {
        if (!currentUser) return;
        fetch(`http://localhost:3000/users/${currentUser.id}`)
            .then(res => res.json())
            .then(data => setUsers(data));
    }, []);

    useEffect(() => {
        if (!currentUser) return;
        socket.emit("join", currentUser.id);

        socket.on("new_message", (msg) => {
            if (msg.senderId === activeChatId || msg.receiverId === activeChatId) {
                setMessages(prev => [...prev, { ...msg, type: msg.senderId === currentUser.id ? "sent" : "received" }]);
            } else {
                setNotifications(prev => ({ ...prev, [msg.senderId]: true }));
            }
        });


        return () => socket.off("new_message");
    }, [activeChatId, currentUser]);

    const loadMessages = async (userId) => {
        setActiveChatId(userId);
        setNotifications(prev => ({ ...prev, [userId]: false }));

        const res = await fetch(`http://localhost:3000/messages/${currentUser.id}/${userId}`);
        const msgs = await res.json();
        setMessages(msgs.map(m => ({
            ...m,
            type: m.senderId === currentUser.id ? "sent" : "received"
        })));
    };

    const sendMessage = async () => {
        if (!currentMessage || !activeChatId) return;

        const msgData = {
            senderId: currentUser.id,
            receiverId: activeChatId,
            content: currentMessage,
        };

        await fetch("http://localhost:3000/message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(msgData),
        });

        setMessages(prev => [
            ...prev,
            { ...msgData, type: "sent", id: Date.now(), createdAt: new Date() },
        ]);

        setCurrentMessage("");
    };

    return (
        <div className="peoples-container">
            <div className="sidebar-left">
                <Link to="/profile" className="nav-icon"><img src={userIcon} className="user-icon" /></Link>
                <Link to="/settings" className="nav-icon"><img src={gearIcon} className="user-icon" /></Link>
                <Link to="/login" className="nav-icon"><img src={logoutIcon} className="user-icon" /></Link>
            </div>

            <div className="main-content" style={{ backgroundImage: `url(${backgroundImg})` }}>
                <div className="chat-header">
                    <div className="chat-header-info">
                        <img src={userIcon} className="user-icon" />
                        <span className="username">{users.find(u => u.id === activeChatId)?.name || "Selecione um usuário"}</span>
                    </div>
                </div>

                <div className="chat-messages">
                    {messages.map(msg => (
                        <MessageBubble
                            key={msg.id}
                            text={msg.content || msg.text}
                            time={new Date(msg.createdAt).toLocaleTimeString().slice(0, 5)}
                            type={msg.type}
                        />
                    ))}
                </div>

                <div className="message-input-area">
                    <button className="emoji-button" onClick={() => setShowEmojiPicker(prev => !prev)}>
                        <img src={happy} className="emoji-icon" />
                    </button>
                    <input
                        type="text"
                        placeholder="Digite sua mensagem..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <img src={sendIcon} className="send-icon" onClick={sendMessage} />
                </div>

                {showEmojiPicker && <EmojiPickerComponent onSelectEmoji={handleEmojiClick} />}
            </div>

            <div className="sidebar-right">
                <div className="sidebar-right-header">Bubbies</div>
                <div className="chat-list">
                    {users.map(user => (
                        <ChatItem
                            key={user.id}
                            id={user.id}
                            username={user.name}
                            isActive={user.id === activeChatId}
                            onClick={loadMessages}
                            hasNotification={notifications[user.id]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
