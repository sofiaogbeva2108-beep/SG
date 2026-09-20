import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Пустой или некорректный prompt' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Ключ API не найден в настройках Vercel' });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

    // Модель для генерации изображений (Nano Banana). Если Google снова
    // ограничит доступ к ней для новых ключей — попробуйте заменить на
    // 'gemini-3.1-flash-image'.
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const parts = result?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p) => p.inlineData);

    if (!imagePart) {
      return res.status(500).json({
        error: 'Модель не вернула изображение. Попробуйте изменить описание персонажа.',
      });
    }

    const mimeType = imagePart.inlineData.mimeType || 'image/png';
    const base64 = imagePart.inlineData.data;

    return res.status(200).json({ image: `data:${mimeType};base64,${base64}` });
  } catch (error) {
    console.error('Gemini image API error:', error);
    return res.status(500).json({ error: error.message || 'Gemini Image API Error' });
  }
}
