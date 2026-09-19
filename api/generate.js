// api/generate.js
const https = require('https');

module.exports = async (req, res) => {
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

    const postData = JSON.stringify({
      model: 'google/gemini-flash-1.5',
      messages: [{ role: 'user', content: prompt || 'Привет' }],
    });

    const options = {
      hostname: 'openrouter.ai',
      port: 443,
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Length': Buffer.byteLength(postData),
        'HTTP-Referer': 'https://sg-jet.vercel.app',
        'X-Title': 'Mythos Studio',
      },
    };

    const request = https.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (response.statusCode >= 200 && response.statusCode < 300) {
            const generatedText = parsed.choices?.[0]?.message?.content || 'Пустой ответ.';
            return res.status(200).json({ text: generatedText });
          } else {
            return res.status(response.statusCode).json({
              error: parsed.error?.message || 'OpenRouter Error',
              details: parsed,
            });
          }
        } catch (e) {
          return res.status(500).json({ error: 'Failed to parse OpenRouter response', raw: data });
        }
      });
    });

    request.on('error', (error) => {
      return res.status(500).json({ error: error.message });
    });

    request.write(postData);
    request.end();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
