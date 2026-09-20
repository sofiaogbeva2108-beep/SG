// api/generate.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
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

    // 100% бесплатные и активные модели OpenRouter
    const modelsToTry = [
      'deepseek/deepseek-r1:free',
      'google/gemini-2.0-flash-lite-preview-02-05:free',
      'qwen/qwen-2.5-72b-instruct:free',
      'mistralai/mistral-7b-instruct:free'
    ];

    let lastError = null;

    for (const model of modelsToTry) {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cleanKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://sg-jet.vercel.app',
          'X-Title': 'Mythos Studio',
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt || 'Привет' }],
        }),
      });

      const data = await response.json();

      if (response.ok && data.choices?.[0]?.message?.content) {
        return res.status(200).json({ text: data.choices[0].message.content });
      }

      lastError = data.error?.message || `Failed model ${model}`;
    }

    return res.status(400).json({ error: lastError });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server Internal Error' });
  }
}
