import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, includeWebSearch } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('AI Tutor request received:', { messageCount: messages.length, includeWebSearch });

    // Enhanced system prompt for educational tutoring
    const systemPrompt = `You are an expert AI tutor with deep knowledge across all subjects. Your goal is to help students learn effectively by:

1. Breaking down complex concepts into simple, understandable explanations
2. Providing step-by-step solutions with clear reasoning
3. Encouraging critical thinking by asking guiding questions
4. Using real-world examples and analogies
5. Adapting your teaching style to the student's level
6. Being patient, encouraging, and supportive
7. Citing sources when using web research

When solving problems:
- Show each step clearly
- Explain the reasoning behind each step
- Point out common mistakes to avoid
- Provide practice suggestions

When explaining concepts:
- Start with the big picture
- Use simple language first, then introduce technical terms
- Use examples and analogies
- Check for understanding

${includeWebSearch ? 'You have access to current web information. Use it to provide accurate, up-to-date facts and real-world examples.' : ''}

Be conversational but professional. Format your responses with clear sections when appropriate.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: false,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. Please wait a moment before trying again.',
            type: 'rate_limit' 
          }), 
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: 'AI credits exhausted. Please contact support.',
            type: 'payment_required' 
          }), 
          { 
            status: 402, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('AI response received successfully');

    return new Response(
      JSON.stringify({ 
        content: data.choices[0].message.content,
        model: data.model,
        usage: data.usage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in ai-tutor function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        type: 'server_error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});