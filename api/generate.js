// api/generate.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body || {};
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key is missing in Vercel settings' });
    }

    const cleanKey = apiKey.trim();

    // Запрос к OpenRouter с точным названием модели
    let response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://sg-jet.vercel.app',
        'X-Title': 'Mythos Studio',
      },
      body: JSON.stringify({
        model: 'google/gemini-1.5-flash',
        messages: [{ role: 'user', content: prompt || 'Привет' }],
      }),
    });

    let data = await response.json();

    // Резервный вызов на случай другого ID модели в OpenRouter
    if (!response.ok && data.error?.code === 404) {
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cleanKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://sg-jet.vercel.app',
          'X-Title': 'Mythos Studio',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [{ role: 'user', content: prompt || 'Привет' }],
        }),
      });
      data = await response.json();
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'OpenRouter Error',
        details: data,
      });
    }

    const generatedText = data.choices?.[0]?.message?.content || 'Пустой ответ.';
    return res.status(200).json({ text: generatedText });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server Internal Error' });
  }
}
