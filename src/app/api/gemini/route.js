import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error('[Gemini API] Missing GOOGLE_API_KEY environment variable');
      return NextResponse.json({ 
        error: 'Missing GOOGLE_API_KEY', 
        message: 'Please add GOOGLE_API_KEY to your .env.local file and restart the server.' 
      }, { status: 500 });
    }

    const body = await request.json();
    const { messages, userText } = body || {};
    
    if (!userText || !userText.trim()) {
      return NextResponse.json({ error: 'Missing or empty userText' }, { status: 400 });
    }

    console.log('[Gemini API] Processing request with', messages?.length || 0, 'previous messages');

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-pro - the standard, widely supported model
    // If this doesn't work, try: 'gemini-1.5-pro-latest' or 'gemini-1.5-flash-latest'
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Convert messages to Gemini format, excluding the initial greeting message
    const conversationHistory = Array.isArray(messages)
      ? messages
          .filter(m => {
            // Skip the initial greeting message (first assistant message with id 1)
            if (m.id === 1 && m.role === 'assistant') return false;
            return true;
          })
          .map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(m.text || '') }],
          }))
      : [];

    // System instruction as first message in history
    const systemInstruction = {
      role: 'user',
      parts: [{
        text: `You are the AI Community Assistant for a municipal waste services portal.
Respond accurately and concisely about:
- Waste collection schedules and pickup requests
- Reporting community issues (missed collection, illegal dumping, etc.)
- Waste segregation and recycling guidelines
- Community rules and regulations
If information is uncertain, clearly state limitations and suggest next steps.`
      }]
    };

    // Build history: system instruction first, then conversation
    const history = [systemInstruction, ...conversationHistory];

    console.log('[Gemini API] Starting chat with history length:', history.length);

    // Start chat with history
    const chat = model.startChat({ history });
    
    // Send the user's message
    const result = await chat.sendMessage(userText.trim());
    const reply = result?.response?.text() || 'Sorry, I could not generate a response.';

    console.log('[Gemini API] Successfully got response');
    return NextResponse.json({ reply }, { status: 200 });

  } catch (err) {
    console.error('[Gemini API] Error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    const errorMessage = err.message || String(err);
    
    // Provide more helpful error messages
    let userMessage = 'Failed to get response from AI.';
    if (errorMessage.includes('API_KEY') || errorMessage.includes('API key')) {
      userMessage = 'Invalid API key. Please check your GOOGLE_API_KEY in .env.local';
    } else if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      userMessage = 'API quota exceeded. Please check your Google Cloud billing.';
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      userMessage = 'Network error. Please check your internet connection.';
    } else if (errorMessage.includes('not found') || errorMessage.includes('404')) {
      userMessage = 'Model not available. The API may have changed. Try updating the model name in the code.';
    }

    return NextResponse.json({ 
      error: 'Server error', 
      details: errorMessage,
      message: userMessage
    }, { status: 500 });
  }
}