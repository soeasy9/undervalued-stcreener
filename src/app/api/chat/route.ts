import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: Message[];
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const { messages }: ChatRequest = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Get the system message and user messages
    const systemMessage = messages.find(msg => msg.role === 'system');
    const userMessages = messages.filter(msg => msg.role === 'user');
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    
    // Build the conversation history
    const history = [];
    for (let i = 0; i < Math.min(userMessages.length - 1, assistantMessages.length); i++) {
      history.push({
        role: 'user',
        parts: [{ text: userMessages[i].content }]
      });
      history.push({
        role: 'model',
        parts: [{ text: assistantMessages[i].content }]
      });
    }
    
    // Create the chat
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Get the last user message
    const lastUserMessage = userMessages[userMessages.length - 1];
    
    // Create the prompt with system message if available
    let prompt = lastUserMessage.content;
    if (systemMessage) {
      prompt = `${systemMessage.content}\n\nUser: ${lastUserMessage.content}`;
    }
    
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });

  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Return more specific error information for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: `Failed to process chat request: ${errorMessage}` },
      { status: 500 }
    );
  }
}
