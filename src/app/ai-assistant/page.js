"use client";
import React, { useRef } from 'react';
import HeaderButtons from '../../components/HeaderButtons';
import ChatbotPanel from '../../components/ChatbotPanel';

export default function AIAssistantPage(){
  const chatRef = useRef(null);

  return (
    <div className="ai-assistant-page app-surface page-fade-in">
      <header className="dashboard-header">
        <div className="container">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div className="brand-logo small">MC</div>
            <div className="brand-text">AI Community Assistant</div>
          </div>

          <div className="header-actions">
            <HeaderButtons />
          </div>
        </div>
      </header>

      <main className="container" style={{padding:'28px 0'}}>
        <section className="ai-hero card muted-pop">
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <div className="title-bar">
              <h1 className="page-header">AI Community Assistant</h1>
            </div>
            <p className="muted">Get instant help with waste management and community services — ask questions, report issues, or generate reports.</p>
          </div>
        </section>

        <div style={{marginTop:18}}>
          <div className="chat-page-header" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
            <div style={{fontWeight:800,fontSize:20}}>AI Community Assistant</div>
            <div>
              <button className="btn small clear-chat-btn" onClick={() => { if(chatRef.current && chatRef.current.clear) chatRef.current.clear(); }}>Clear Chat</button>
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

