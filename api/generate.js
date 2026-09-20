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

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Ключ API не найден в настройках Vercel' });
    }

    // OpenRouter иногда возвращает 429/5xx, если выбранная бесплатная модель
    // временно перегружена — делаем до 3 попыток с паузой перед ошибкой.
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey.trim()}`,
            'Content-Type': 'application/json',
            // Необязательные заголовки — помогают OpenRouter связать запросы
            // с приложением в статистике, на работу не влияют.
            'HTTP-Referer': 'https://sg-jet.vercel.app',
            'X-Title': 'Mythos Studio',
          },
          body: JSON.stringify({
            // "openrouter/free" сам выбирает доступную бесплатную модель и
            // переключается, если одна из них отвалится или будет снята с
            // бесплатного доступа — не нужно вручную гоняться за именами моделей.
            // Когда захочешь более стабильное/качественное поведение — замени
            // на конкретную платную модель, например 'anthropic/claude-3.5-haiku'.
            model: 'openrouter/free',
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const message = data?.error?.message || `Ошибка сервера: ${response.status}`;
          const isRetryable = response.status === 429 || response.status >= 500;
          if (isRetryable && attempt < 3) {
            lastError = new Error(message);
            await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
            continue;
          }
          return res.status(response.status).json({ error: message });
        }

        const text = data?.choices?.[0]?.message?.content;
        if (!text) {
          return res.status(500).json({ error: 'Модель не вернула ответ. Попробуйте ещё раз.' });
        }

        return res.status(200).json({ text });
      } catch (err) {
        lastError = err;
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
          continue;
        }
      }
    }

    throw lastError || new Error('Не удалось получить ответ от OpenRouter');
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return res.status(500).json({ error: error.message || 'OpenRouter API Error' });
  }
}
