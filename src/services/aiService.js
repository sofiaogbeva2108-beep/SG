// src/services/aiService.js

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
    throw new Error(data.error || `Ошибка сервера: ${response.status}`);
  }

  return data.text;
}

export const runAiBetaReader = async (currentScene, currentCycle) => {
  if (!currentScene?.content) return 'Текст сцены пуст. Напишите пару абзацев в редакторе!';
  
  const prompt = `Ты — литературный бета-ридер. Проанализируй отрывок для книги "${currentCycle?.title || ''}":
"${currentScene.content}"

Дай краткий разбор:
🟢 Сильные стороны:
🟡 Ритм и темп:
🔴 Что стоит доработать:`;

  return await callGeminiApi(prompt);
};

export const runCharacterSim = async (simChar1, simChar2, simConflict, currentCycle) => {
  const prompt = `Смоделируй короткий диалог двух персонажей: ${simChar1} и ${simChar2}.
Причина взаимодействия: ${simConflict}.
Произведение: ${currentCycle?.title || ''}.
Напиши реплики и эмоции.`;

  return await callGeminiApi(prompt);
};

export const runBrainstorm = async (genCategory, currentCycle) => {
  let prompt = `Сгенерируй 5 креативных идей для произведения "${currentCycle?.title || ''}". `;
  if (genCategory === 'names') prompt += 'Предложи 10 интересных имён персонажей и названий родов.';
  if (genCategory === 'twists') prompt += 'Предложи 5 неожиданных сюжетных поворотов.';
  if (genCategory === 'locations') prompt += 'Предложи 5 атмосферных локаций.';

  return await callGeminiApi(prompt);
};
