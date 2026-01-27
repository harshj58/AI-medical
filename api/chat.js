export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { messages, apiKey, model } = req.body;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Use the model sent from frontend, or default to llama-3.3
        model: model || 'llama-3.3-70b-versatile',
        messages: [
          { role: "system", content: "You are a professional medical assistant. Provide clear, accurate, and empathetic medical information. Always end with a disclaimer that you are an AI and not a doctor." },
          ...messages
        ],
        temperature: 0.6,
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
}
