// src/services/aiService.js

// Функция отправки запроса на наш Vercel Serverless бэкенд
async function callGeminiApi(prompt) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Ошибка Vercel API:", data);
    throw new Error(data.error || `Ошибка сервера: ${response.status}`);
  }

  return data.text;
}

export const runAiBetaReader = async (currentScene, currentCycle) => {
  if (!currentScene?.content) return 'Текст сцены пуст. Напишите пару абзацев!';
  
  const prompt = `Ты — профессиональный литературный бета-ридер и редактор. 
Проанализируй текст сцены для книги "${currentCycle?.title || ''}".

Контекст мира: ${currentCycle?.description || ''}

Текст сцены:
"${currentScene.content}"

Структура ответа:
🟢 **Сильные стороны:**
🟡 **Ритм и темп сцены:**
🔴 **Замечания к стилю, повторам и ООС:**`;

  return await callGeminiApi(prompt);
};

export const runCharacterSim = async (simChar1, simChar2, simConflict, currentCycle) => {
  const prompt = `Смоделируй диалог-столкновение двух персонажей фэнтези.
Персонаж 1: ${simChar1}
Персонаж 2: ${simChar2}
Причина конфликта: ${simConflict}
Мир/Книга: ${currentCycle?.title || ''}

Напиши напряженный диалог с описанием эмоций и жестов, а в конце дай вердикт ИИ о химии персонажей.`;

  return await callGeminiApi(prompt);
};

export const runBrainstorm = async (genCategory, currentCycle) => {
  let prompt = `Сгенерируй 5 креативных идей для произведения "${currentCycle?.title || ''}". `;
  
  if (genCategory === 'names') prompt += 'Предложи 10 атмосферных имён персонажей и названий родов с краткой характеристикой.';
  if (genCategory === 'twists') prompt += 'Предложи 5 неожиданных сюжетных поворотов (Plot Twists).';
  if (genCategory === 'locations') prompt += 'Предложи 5 уникальных локаций с их секретами.';

  return await callGeminiApi(prompt);
};
