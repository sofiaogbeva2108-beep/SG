export default async function handler(req, res) {
  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured on server' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    const headers = {
      'Content-Type': 'application/json',
    };

    // Если токен нового формата (AQ...), передаем Bearer, иначе передаем ключ
    if (apiKey.startsWith('AQ')) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    } else {
      headers['x-goog-api-key'] = apiKey;
    }

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
      console.error('Google API Error:', data);
      return res.status(response.status).json({ 
        error: data.error?.message || 'Error from Google Gemini API' 
      });
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Пустой ответ от модели.';

    return res.status(200).json({ text: generatedText });

  } catch (error) {
    console.error('Server Function Error:', error);
    return res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
}
