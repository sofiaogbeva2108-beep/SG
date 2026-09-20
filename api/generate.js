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

    // Модель Gemini иногда отвечает 503 ("high demand") — это временная
    // перегрузка на стороне Google, а не ошибка запроса. Делаем до 3
    // попыток с небольшой паузой перед тем, как показать ошибку пользователю.
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const result = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: prompt,
        });
        return res.status(200).json({ text: result.text });
      } catch (error) {
        lastError = error;
        const isOverloaded = error?.status === 503 || /503|overloaded|high demand/i.test(error?.message || '');
        if (!isOverloaded || attempt === 3) break;
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }

    throw lastError;
  } catch (error) {
    console.error('Gemini API error:', error);
    const isOverloaded = error?.status === 503 || /503|overloaded|high demand/i.test(error?.message || '');
    const message = isOverloaded
      ? 'Сервис Gemini сейчас перегружен запросами. Попробуйте ещё раз через минуту.'
      : error.message || 'Gemini API Error';
    return res.status(isOverloaded ? 503 : 500).json({ error: message });
  }
}
