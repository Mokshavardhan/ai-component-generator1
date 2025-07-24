// src/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AiService {
  private readonly apiKey: string;
  // 👇 Corrected Google AI API URL
  private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY is not defined in the environment variables');
    }
    this.apiKey = apiKey;
  }

  async generateComponentCode(prompt: string): Promise<{ jsx: string; css: string }> {
    const systemPrompt = `You are an expert React developer.
    Your response MUST be a single, raw JSON object with two keys: "jsx" and "css".
    Do not include any other text, explanations, or markdown formatting like \`\`\`json.
    The jsx code should be a self-contained TSX component. The css should be standard CSS.`;

    // 👇 Corrected payload structure for the Gemini API
    const payload = {
      contents: [{
        parts: [{ text: `${systemPrompt}\n\nUser request: "${prompt}"` }]
      }],
      generationConfig: {
        response_mime_type: 'application/json',
      },
    };
    
    console.log('--- Sending payload to Google AI ---');

    try {
      const response = await axios.post(
        `${this.apiUrl}?key=${this.apiKey}`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      
      const content = response.data.candidates[0].content.parts[0].text;
      console.log('--- Received Google AI Response ---', content);

      return JSON.parse(content);

    } catch (error) {
      console.error('Error calling Google AI service:', error.response?.data?.error || error.message);
      throw new Error('Failed to generate component from Google AI.');
    }
  }
}   