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
      return res.status(500).json({ error: 'Ключ API не найден в настройках Vercel' });
    }

    const cleanKey = apiKey.trim();

    // Запрос к гарантированно бесплатной и стабильной модели в OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://sg-jet.vercel.app',
        'X-Title': 'Mythos Studio',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [{ role: 'user', content: prompt || 'Привет' }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'Ошибка OpenRouter',
        details: data,
      });
    }

    const generatedText = data.choices?.[0]?.message?.content || 'Пустой ответ.';
    return res.status(200).json({ text: generatedText });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Внутренняя ошибка сервера' });
  }
}
