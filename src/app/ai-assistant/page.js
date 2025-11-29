"use client";
import React, { useRef } from 'react';
import HeaderButtons from '../../components/HeaderButtons';
import ChatbotPanel from '../../components/ChatbotPanel';
import Brand from '../../components/Brand';

export default function AIAssistantPage(){
  const chatRef = useRef(null);

  return (
    <div className="ai-assistant-page app-surface page-fade-in">
      <header className="dashboard-header">
        <div className="container">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <Brand />
          </div>

          <div className="header-actions">
            <HeaderButtons />
          </div>
        </div>
      </header>

      <main className="container" style={{padding:'28px 0'}}>
        <div style={{marginTop:18}}>
          <div className="chat-page-header" style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:12}}>
            <div>
              <button className="btn clear-chat-btn" onClick={() => { if(chatRef.current && chatRef.current.clear) chatRef.current.clear(); }}>Clear Chat</button>
            </div>
          </div>
          <div style={{marginTop:12}}>
            <ChatbotPanel ref={chatRef} />
          </div>
        </div>
      </main>
    </div>
  );
}

