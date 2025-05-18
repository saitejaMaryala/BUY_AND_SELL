import axios from 'axios';
import React, { useState, useEffect } from 'react';
import "../css/Support.css";

const Support = () => {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const CHAT_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

  // Function to save chat to local storage with timestamp
  const saveChatToLocalStorage = (chatHistory) => {
    const chatData = {
      messages: chatHistory,
      timestamp: new Date().getTime(), // Save current timestamp
    };
    localStorage.setItem("chatHistory", JSON.stringify(chatData));
  };

  // Function to load chat from local storage
  const loadChatFromLocalStorage = () => {
    const storedChat = localStorage.getItem("chatHistory");
    if (storedChat) {
      const chatData = JSON.parse(storedChat);
      const currentTime = new Date().getTime();
      
      // Check if the stored chat is older than 1 hour
      if (currentTime - chatData.timestamp < CHAT_EXPIRY_TIME) {
        setChat(chatData.messages);
      } else {
        localStorage.removeItem("chatHistory"); // Remove expired chat
      }
    }
  };

  // Load chat history on component mount
  useEffect(() => {
    loadChatFromLocalStorage();
  }, []);

  const getAnswer = async () => {
    setLoading(true);
    if (!question.trim()) return;

    const newChat = [...chat, { sender: 'user', text: question }];
    setChat(newChat);
    setQuestion('');

    try {
      const response = await axios.post("http://localhost:3001/api/generate", {
        prompt: question
      });
      const botResponse = { sender: 'bot', text: response.data };

      const updatedChat = [...newChat, botResponse];
      setChat(updatedChat);
      saveChatToLocalStorage(updatedChat); // Save updated chat history

    } catch (error) {
      const errorMessage = { sender: 'bot', text: "Error getting response. Please try again." };
      const updatedChat = [...newChat, errorMessage];
      setChat(updatedChat);
      saveChatToLocalStorage(updatedChat);
    }

    setLoading(false);
  };

  return (
    <div className="support-container">
      <h3>My Chat Bot</h3>
      <div className="chat-container">
        <div className="chat-box">
          {chat.map((msg, index) => (
            <div key={index} className={msg.sender === 'user' ? 'chat-message user' : 'chat-message bot'}>
              <p>{msg.text}</p>
            </div>
          ))}
          {loading && <div><p>loading</p></div>}  
        </div>
        <div className="input-container">
          <textarea
            className="chat-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question..."
          ></textarea>
          <button className="send-button" onClick={getAnswer}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Support;
