import ZAI from 'z-ai-web-dev-sdk';

let zaiInstance: ZAI | null = null;

export async function getAI(): Promise<ZAI> {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export interface ChatMsg {
  role: 'assistant' | 'user';
  content: string;
}

export async function chatCompletion(
  systemPrompt: string,
  userMessage: string,
  history?: ChatMsg[]
): Promise<string> {
  const zai = await getAI();

  const messages: ChatMsg[] = [
    { role: 'assistant', content: systemPrompt },
    ...(history || []),
    { role: 'user', content: userMessage },
  ];

  const completion = await zai.chat.completions.create({
    messages,
    thinking: { type: 'disabled' },
  });

  return completion.choices[0]?.message?.content || '';
}

export async function chatWithMessages(messages: ChatMsg[]): Promise<string> {
  const zai = await getAI();

  const completion = await zai.chat.completions.create({
    messages,
    thinking: { type: 'disabled' },
  });

  return completion.choices[0]?.message?.content || '';
}

export function parseJSONResponse<T>(text: string): T | null {
  try {
    // Try direct parse first
    return JSON.parse(text) as T;
  } catch {
    // Try extracting JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim()) as T;
      } catch {
        return null;
      }
    }
    // Try finding JSON array or object in the text
    const arrayMatch = text.match(/(\[[\s\S]*\])/);
    if (arrayMatch) {
      try {
        return JSON.parse(arrayMatch[1]) as T;
      } catch {
        // ignore
      }
    }
    const objectMatch = text.match(/(\{[\s\S]*\})/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[1]) as T;
      } catch {
        // ignore
      }
    }
    return null;
  }
}
