export const prerender = false;

const systemPrompt = `You are COMI, an AI assistant for ComHub, a community hub for Rialo.
Answer briefly, friendly, and informatively about Rialo, the community, and related topics.
If asked about something off-topic, still answer politely but steer back to community topics.`;

export async function POST({ request }) {
  const { message, history } = await request.json();
  const apiKey = import.meta.env.GEMINI_API_KEY;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: "Hi, I'm COMI. How can I help you?" }] },
            ...(history || []),
            { role: 'user', parts: [{ text: message }] }
          ]
        })
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't answer that.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to reach AI' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
