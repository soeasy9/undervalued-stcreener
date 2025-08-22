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

    console.log('Received messages:', JSON.stringify(messages, null, 2));

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Get the system message and the last user message
    const systemMessage = messages.find(msg => msg.role === 'system');
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    
    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 }
      );
    }
    
    // Create a simple prompt with system context
    let prompt = lastUserMessage.content;
    if (systemMessage) {
      // Simplify the system message to avoid potential issues
      const stockInfo = systemMessage.content.split('\n')[0]; // Just get the first line
      prompt = `You are a financial analyst. ${stockInfo}\n\nUser Question: ${lastUserMessage.content}\n\nProvide a brief financial analysis.`;
    }
    
    console.log('Sending prompt to Gemini:', prompt);
    console.log('Prompt length:', prompt.length);
    
    // Use generateContent with safety checks and timeout
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Gemini API timeout')), 30000)
      )
    ]) as any;
    
    if (!result || !result.response) {
      throw new Error('No response received from Gemini API');
    }
    
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }
    
    console.log('Received response from Gemini, length:', text.length);

    return NextResponse.json({ response: text });

  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Return more specific error information for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Provide a fallback response instead of an error
    const fallbackResponse = `I apologize, but I'm having trouble accessing my analysis tools right now. Based on the stock data available, I can provide some general insights:

- P/E Ratio: This measures how much investors are willing to pay for each dollar of earnings
- P/B Ratio: This compares the stock price to the company's book value
- Dividend Yield: This shows the annual dividend as a percentage of the stock price

For specific analysis, please try again in a moment or consult with a financial advisor.`;
    
    return NextResponse.json({ 
      response: fallbackResponse,
      error: `API Error: ${errorMessage}`,
      fallback: true
    });
  }
}
