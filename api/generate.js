// api/generate.js
export default async function handler(req, res) {
  // Настройка CORS заголовок
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Ключ VITE_GEMINI_API_KEY не установлен в Vercel.' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Промпт не передан.' });
    }

    // Для ключей AQ. используем заголовок x-goog-api-key или Bearer
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    const headers = {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey.trim()
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Ошибка от Google Gemini:', data);
      
      // Запасная попытка через Authorization Bearer, если x-goog-api-key сбросился
      const altResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const altData = await altResponse.json();

      if (altResponse.ok) {
        const text = altData.candidates?.[0]?.content?.parts?.[0]?.text || 'Пустой ответ';
        return res.status(200).json({ text });
      }

      return res.status(response.status).json({ 
        error: data.error?.message || altData.error?.message || 'Ошибка генерации Google Gemini' 
      });
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Пустой ответ';
    return res.status(200).json({ text: generatedText });

  } catch (err) {
    console.error('Ошибка сервера:', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера: ' + err.message });
  }
}
