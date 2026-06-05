import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatRequest {
  message: string;
  history: ChatMessage[];
  model?: string;
}

const systemPrompt = `You are the Gold-Coast Mining Review AI Assistant, a professional and knowledgeable virtual assistant for Africa's leading mining intelligence and media platform. Your primary role is to help users navigate the website and provide accurate information about the mining industry in Africa.

PLATFORM OVERVIEW:
Gold-Coast Mining Review provides:
- Mining News: Latest news, investigations, interviews, and analysis from across Africa
- Magazines: Digital and print publications covering mining topics, trends, and insights
- Events: Mining conferences, exhibitions, and industry events calendar
- Mining Companies: Comprehensive directory of mining companies operating in Africa
- Podcasts: Audio content featuring industry experts and discussions
- Intelligence: Commodity prices, market data, and investment insights
- Advertising: Information about advertising opportunities and partnerships
- Subscription: Details about premium subscription plans and benefits

YOUR CAPABILITIES:
You can help users with:
1. Website Navigation - Guide users to find news, magazines, events, podcasts, companies, and other content
2. Mining Industry Knowledge - Explain mining terminology, trends, regulations, and technologies
3. Company Information - Provide details about mining companies, their operations, and projects
4. Supplier & Contractor Information - Help users find suppliers and subcontractors in the mining industry
5. Advertising Information - Explain advertising opportunities, packages, and contact details
6. Contact Information - Provide contact details for the platform and editorial team
7. Investment Insights - Share information about mining investments, commodities, and market trends
8. Technology Updates - Discuss mining technologies, innovations, and best practices

RESPONSE GUIDELINES:
- Be professional, helpful, and concise
- Provide accurate and relevant information
- If you don't have specific information about current content, suggest where users can find it on the website
- Keep responses under 200 words when possible for better readability
- Use a friendly but professional tone
- Acknowledge when you're uncertain and suggest alternative resources
- Prioritize helping users navigate the website over providing general information

EXAMPLE INTERACTIONS:
User: "How can I advertise?"
You: "You can advertise with Gold-Coast Mining Review by visiting our Advertising page at /advertise. We offer various advertising packages including banner ads, sponsored content, and featured placements. For specific inquiries, you can contact our advertising team at advertise@goldcoastminingreview.com."

User: "What mining companies do you cover?"
You: "We cover mining companies across Africa, including major players like AngloGold Ashanti, Newmont, Barrick Gold, and many emerging companies. You can browse our comprehensive Mining Companies directory at /companies to find detailed information about operations, projects, and contact details."

User: "Tell me about lithium mining in Ghana"
You: "Ghana has significant lithium potential, particularly in the Volta Region. Recent discoveries have attracted international investment. For the latest news and detailed analysis about lithium mining in Ghana, I recommend checking our News section at /news where we regularly cover developments in this sector."`;

const availableModels = [
  'gemini-3.5-flash',
  'gemini-3-flash-preview'
];

async function generateResponse(message: string, history: ChatMessage[], model: string = 'gemini-3.5-flash'): Promise<{ success: boolean; response: string; error?: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('GEMINI_API_KEY not configured in environment variables');
    return {
      success: false,
      response: 'The AI assistant is not properly configured. Please contact the administrator.',
      error: 'API key not configured'
    };
  }

  // Use the requested model or fall back to primary
  const selectedModel = availableModels.includes(model) ? model : 'gemini-3.5-flash';

  try {
    const messages = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      // Handle specific error cases
      if (response.status === 401) {
        return {
          success: false,
          response: 'The AI assistant is temporarily unavailable due to authentication issues.',
          error: 'Authentication failed'
        };
      } else if (response.status === 429) {
        return {
          success: false,
          response: 'The AI assistant is experiencing high demand. Please try again in a few moments.',
          error: 'Rate limit exceeded'
        };
      } else if (response.status === 400) {
        return {
          success: false,
          response: 'The AI assistant received an invalid request. Please try rephrasing your question.',
          error: 'Bad request'
        };
      }
      
      return {
        success: false,
        response: 'The AI assistant is temporarily unavailable. Please try again in a few moments.',
        error: `API error: ${response.status}`
      };
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return {
        success: true,
        response: data.candidates[0].content.parts[0].text
      };
    }

    console.error('Invalid response format from Gemini API:', data);
    return {
      success: false,
      response: 'The AI assistant received an unexpected response. Please try again.',
      error: 'Invalid response format'
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Gemini API request timeout');
        return {
          success: false,
          response: 'The request took too long to process. Please try again.',
          error: 'Request timeout'
        };
      }
      console.error('Error generating response:', {
        message: error.message,
        stack: error.stack
      });
      return {
        success: false,
        response: 'We\'re currently experiencing a connection issue with our AI service. Please try again.',
        error: error.message
      };
    }
    console.error('Unknown error generating response:', error);
    return {
      success: false,
      response: 'The AI assistant encountered an unexpected error. Please try again.',
      error: 'Unknown error'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history, model } = body;

    if (!message || typeof message !== 'string') {
      console.error('Invalid message received:', { message, type: typeof message });
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      );
    }

    const result = await generateResponse(message, history || [], model);

    if (result.success) {
      return NextResponse.json({ response: result.response });
    } else {
      // Log the error for debugging
      console.error('Chatbot error:', {
        error: result.error,
        message: message.substring(0, 100),
        model: model
      });
      
      return NextResponse.json({ 
        response: result.response,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Chat API unexpected error:', error);
    return NextResponse.json(
      { 
        response: 'The AI assistant encountered an unexpected error. Please try again.',
        error: 'Unexpected error'
      },
      { status: 200 }
    );
  }
}
