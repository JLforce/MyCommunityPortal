import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GOOGLE_API_KEY' }, { status: 500 });
    }

    const body = await request.json();
    const { messages, userText } = body || {};
    if (!userText) {
      return NextResponse.json({ error: 'Missing userText' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const history = Array.isArray(messages)
      ? messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.text }],
        }))
      : [];

    const systemPreamble = {
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

    const chat = model.startChat({ history: [systemPreamble, ...history] });
    const result = await chat.sendMessage(userText);
    const reply = result?.response?.text() || 'Sorry, I could not generate a response.';

    return NextResponse.json({ reply }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error', details: String(err) }, { status: 500 });
  }
}