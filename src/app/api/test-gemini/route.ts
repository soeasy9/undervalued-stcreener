import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    console.log('API Key found:', apiKey.substring(0, 10) + '...');

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Simple test prompt
    const prompt = 'Hello! Can you respond with "API is working" if you receive this message?';
    
    console.log('Testing Gemini API with prompt:', prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini response:', text);

    return NextResponse.json({ 
      success: true, 
      response: text,
      apiKeyConfigured: !!apiKey 
    });

  } catch (error) {
    console.error('Error testing Gemini API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false,
        error: `Gemini API test failed: ${errorMessage}`,
        apiKeyConfigured: !!process.env.GEMINI_API_KEY
      },
      { status: 500 }
    );
  }
}
