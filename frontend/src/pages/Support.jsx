import axios from 'axios';
import React, { useState } from 'react';
import "../css/Support.css";

const Support = () => {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [loading,setLoading] = useState(false);

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
      setChat([...newChat, { sender: 'bot', text: response.data }]);
    } catch (error) {
      setChat([...newChat, { sender: 'bot', text: "Error getting response. Please try again." }]);
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
