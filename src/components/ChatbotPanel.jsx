"use client";
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const initialMessages = [
  {id:1, role:'assistant', text:"Hello! I'm your AI Community Assistant. I can help you with:\n• Waste collection schedules and pickup requests\n• Reporting community issues\n• Waste segregation guidelines\n• Community rules and regulations\nHow can I assist you today?"}
];

const ChatbotPanel = forwardRef(function ChatbotPanel(props, ref){
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef(null);

  const suggested = [
    'When is my next recycling pickup?',
    'How do I report an issue?',
    'What can I put in my recycling bin?',
    'My bin wasn\'t collected, what should I do?'
  ];

  useEffect(()=>{ // scroll to bottom on new messages
    if(listRef.current){
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  },[messages]);

  function pushMessage(role, text){
    setMessages(prev => [...prev, { id: Date.now()+Math.random(), role, text }]);
  }

  // expose imperative API to parent so it can clear the chat
  useImperativeHandle(ref, () => ({
    clear: () => setMessages(initialMessages)
  }));

  function mockAssistantReply(userText){
    // simple simulated reply logic for demo purposes
    setTimeout(()=>{
      let reply = 'Sorry, I did not understand. Try: "How do I report an issue?"';
      if(/pickup|next pickup|when/i.test(userText)) reply = 'Your next pickup is on Monday at 7:00 AM for your route.';
      if(/report|issue|illegal/i.test(userText)) reply = 'You can report issues using the Report form — we typically resolve within 48 hours.';
      if(/recycl/i.test(userText)) reply = 'Recyclable items include plastics #1-2, paper, cardboard, and glass bottles.';
      pushMessage('assistant', reply);
      setIsSending(false);
    }, 700 + Math.random()*600);
  }

  function handleSend(e){
    e && e.preventDefault();
    const text = input.trim();
    if(!text) return;
    pushMessage('user', text);
    setInput('');
    setIsSending(true);
    mockAssistantReply(text);
  }

  function handleSuggestion(text){
    setInput(text);
    // immediately send suggestion for a smoother demo
    setTimeout(()=>{
      pushMessage('user', text);
      setIsSending(true);
      mockAssistantReply(text);
    }, 180);
  }

  return (
    <>
    <div className="chat-layout" style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:18}}>
      <div className="chat-root">
        <div className="chat-header">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div className="brand-logo small">AI</div>
            <div>
              <div style={{fontWeight:800}}>Chat with AI Assistant</div>
              <div className="muted small">Ask questions about waste collection, reporting issues, or community guidelines</div>
            </div>
          </div>
          <div className="chat-actions" />
        </div>

        <div className="chat-body">
          <div className="chat-list pale" ref={listRef} aria-live="polite">
            {messages.map(m => (
              <div key={m.id} className={"message " + (m.role==='assistant'? 'assistant' : 'user') }>
                {m.role === 'assistant' && <div className="message-icon" aria-hidden>💬</div>}
                <div className="bubble">{m.text.split('\n').map((line,idx)=>(<div key={idx}>{line}</div>))}</div>
                {m.role === 'user' && <div style={{marginLeft:8,fontSize:12,color:'var(--text-700)'}}>JD</div>}
              </div>
            ))}
            {isSending && (
              <div className="message assistant">
                <div className="message-icon" aria-hidden>💬</div>
                <div className="bubble small muted">AI is typing...</div>
              </div>
            )}
          </div>

          <form className="chat-input" onSubmit={handleSend} aria-label="Send message">
            <input aria-label="Message input" placeholder="Type your message..." value={input} onChange={e=>setInput(e.target.value)} />
            <button type="submit" className="btn" style={{background:'var(--green-900)',color:'#fff',border:'none',padding:'10px 16px',borderRadius:8}} disabled={isSending} aria-disabled={isSending}>{isSending ? 'Sending...' : 'Send'}</button>
          </form>
        </div>
      </div>

      <aside>
        <div className="card" style={{padding:18,marginBottom:12}}>
          <h4 style={{margin:'0 0 8px'}}>Quick Actions</h4>
          <p className="muted small">Common questions and tasks</p>
          <div style={{marginTop:12,display:'grid',gap:10}}>
            <button className="btn small" style={{display:'flex',alignItems:'center',gap:10,justifyContent:'flex-start'}}>📅 Check pickup schedule</button>
            <button className="btn small" style={{display:'flex',alignItems:'center',gap:10,justifyContent:'flex-start'}}>⚠️ Report an issue</button>
            <button className="btn small" style={{display:'flex',alignItems:'center',gap:10,justifyContent:'flex-start'}}>♻️ Recycling guidelines</button>
            <button className="btn small" style={{display:'flex',alignItems:'center',gap:10,justifyContent:'flex-start'}}>🚚 Request special pickup</button>
            <button className="btn small" style={{display:'flex',alignItems:'center',gap:10,justifyContent:'flex-start'}}>📄 Community rules</button>
          </div>
        </div>

        <div className="card" style={{padding:18}}>
          <h4 style={{margin:'0 0 8px'}}>Suggested Questions</h4>
          <div className="muted small" style={{marginTop:8}}>
            {suggested.map(s => (
              <div key={s} style={{marginBottom:10}}>
                <button className="btn small" onClick={()=>handleSuggestion(s)} style={{width:'100%',textAlign:'left'}}>{`"${s}"`}</button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card ai-status-card" style={{padding:18,marginTop:12}}>
          <h4 style={{margin:'0 0 8px'}}>AI Status</h4>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span className="ai-status-dot" aria-hidden></span>
            <div style={{fontWeight:700,color:'var(--text-700)'}}>AI Assistant Online</div>
          </div>
          <div className="muted small" style={{marginTop:8}}>Response time: ~2 seconds</div>
        </div>
      </aside>
    </div>

    {/* Frequently Asked Questions — full width below chat */}
    <section className="faq-section" style={{marginTop:18}}>
      <div className="card" style={{padding:20}}>
        <h3 style={{margin:'0 0 8px',color:'var(--text-900)'}}>Frequently Asked Questions</h3>
        <p className="muted small">Common questions and instant answers</p>

        <div className="faq-grid" style={{marginTop:16,display:'grid',gap:12,gridTemplateColumns:'1fr 1fr'}}>
          <div className="faq-card" style={{padding:16}}>
            <h4 style={{margin:'0 0 8px'}}>What items can be recycled?</h4>
            <p className="muted small">Clean paper, cardboard, plastic bottles (1-7), glass containers, and aluminum/steel cans can be recycled. Make sure items are clean and dry.</p>
          </div>

          <div className="faq-card" style={{padding:16}}>
            <h4 style={{margin:'0 0 8px'}}>When should I put my bins out?</h4>
            <p className="muted small">Place bins at the curb by 7:00 AM on your collection day. Check your personalized schedule in the app for exact pickup times.</p>
          </div>

          <div className="faq-card" style={{padding:16}}>
            <h4 style={{margin:'0 0 8px'}}>How do I report a missed collection?</h4>
            <p className="muted small">Use the "Report Issue" feature in the app or call our support line within 24 hours of the missed collection. We'll reschedule your pickup.</p>
          </div>

          <div className="faq-card" style={{padding:16}}>
            <h4 style={{margin:'0 0 8px'}}>How do I dispose of hazardous waste?</h4>
            <p className="muted small">Never put hazardous materials in regular bins. Use designated drop-off locations or attend special collection events. Check the app for locations and dates.</p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
});

export default ChatbotPanel;
