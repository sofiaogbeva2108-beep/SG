// src/services/aiService.js

async function callTextApi(prompt) {
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

async function callImageApi(prompt) {
  const response = await fetch('/api/generate-image', {
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

  // Готовая data-URI строка ("data:image/png;base64,...."), можно сразу
  // подставлять в src картинки.
  return data.image;
}

export const runAiBetaReader = async (currentScene, currentCycle) => {
  if (!currentScene?.content) return 'Текст сцены пуст. Напишите пару абзацев в редакторе!';

  const prompt = `Ты — литературный бета-ридер. Проанализируй отрывок для книги "${currentCycle?.title || ''}":
"${currentScene.content}"

Дай краткий разбор:
🟢 Сильные стороны:
🟡 Ритм и темп:
🔴 Что стоит доработать:`;

  return await callTextApi(prompt);
};

export const runCharacterSim = async (simChar1, simChar2, simConflict, currentCycle) => {
  const prompt = `Смоделируй короткий диалог двух персонажей: ${simChar1} и ${simChar2}.
Причина взаимодействия: ${simConflict}.
Произведение: ${currentCycle?.title || ''}.
Напиши реплики и эмоции.`;

  return await callTextApi(prompt);
};

export const runBrainstorm = async (genCategory, currentCycle) => {
  // Для имён формат ужесточён отдельно — список без вступлений и нумерации
  // предложений, чтобы можно было аккуратно отрисовать как чипы, а не
  // сплошным абзацем.
  if (genCategory === 'names') {
    const prompt = `Придумай 12 подходящих имён и фамилий/родовых имён персонажей для произведения "${currentCycle?.title || ''}".
Формат ответа строго построчный список: каждое имя или фамилия — на отдельной строке, без нумерации, без вступления, без пояснений и без markdown-разметки — только сами имена.`;
    return await callTextApi(prompt);
  }

  let prompt = `Сгенерируй 5 креативных идей для произведения "${currentCycle?.title || ''}". `;
  if (genCategory === 'twists') prompt += 'Предложи 5 неожиданных сюжетных поворотов.';
  if (genCategory === 'locations') prompt += 'Предложи 5 атмосферных локаций.';

  return await callTextApi(prompt);
};

// Действия ИИ-ассистента над выделенным (или всем) текстом сцены прямо в
// редакторе: продолжить, сократить, оживить, добавить сенсорику, предложить
// варианты следующей реплики.
export const runTextAction = async (action, text, currentCycle) => {
  const instructions = {
    continue:
      'Продолжи этот текст естественным образом, в том же стиле, тоне и лице повествования — 2-4 новых предложения. Выведи только продолжение, без повтора исходного текста.',
    shorten:
      'Сократи этот текст примерно вдвое, сохранив ключевые детали, смысл и стиль. Выведи только сокращённую версию.',
    livelier:
      'Перепиши этот текст живее и динамичнее — добавь ритма и характера, не меняя сюжет и факты. Выведи только переписанный вариант.',
    senses:
      'Добавь в этот текст сенсорных деталей (звуки, запахи, тактильные ощущения, свет), не меняя сюжет и факты. Выведи только обновлённый текст.',
    nextLine:
      'Предложи 3 разных варианта того, как может звучать следующая фраза или реплика сразу после этого текста. Пронумеруй варианты 1-3, без лишних пояснений.',
  };

  const instruction = instructions[action] || instructions.continue;

  const prompt = `Ты — литературный редактор-соавтор. Произведение: "${currentCycle?.title || ''}".
${instruction}

Текст:
"""
${text}
"""`;

  return await callTextApi(prompt);
};

// Контекстный чат с ИИ прямо в рабочем пространстве сцены — можно спросить
// "что дальше", "где дыра в сцене", попросить проверить мотивацию и т.д.
export const runSceneChat = async (question, currentScene, currentCycle, history = []) => {
  const historyText = history
    .slice(-6)
    .map((m) => `${m.role === 'user' ? 'Автор' : 'Ассистент'}: ${m.content}`)
    .join('\n');

  const prompt = `Ты — ИИ-соавтор, который помогает автору прямо во время написания сцены. Отвечай кратко и по делу, как коллега рядом, а не как энциклопедия. Не повторяй вопрос в ответе.

Произведение: "${currentCycle?.title || ''}"
Название сцены: "${currentScene?.title || 'без названия'}"
Текст сцены на данный момент:
"""
${currentScene?.content || '(пока пусто)'}
"""
${historyText ? `\nПредыдущий разговор:\n${historyText}\n` : ''}
Вопрос автора: ${question}`;

  return await callTextApi(prompt);
};

// Генерация портрета персонажа на основе заполненных полей досье.
// Возвращает data-URI картинки, которую можно сразу сохранить как avatar.
export const generateCharacterPortrait = async (character, currentCycle) => {
  const details = [
    character?.role && `Роль в истории: ${character.role}`,
    character?.age && `Возраст: ${character.age}`,
    character?.appearance && `Внешность: ${character.appearance}`,
    character?.personality && `Характер: ${character.personality}`,
    character?.magicOrSkills && `Особенности/снаряжение: ${character.magicOrSkills}`,
  ]
    .filter(Boolean)
    .join('\n');

  const prompt = `Портретная иллюстрация персонажа книги "${currentCycle?.title || ''}" в стиле детализированного digital painting, вертикальная композиция, крупный план лица и плеч, кинематографичное освещение. Без текста и надписей на изображении.

Имя персонажа: ${character?.name || 'без имени'}
${details || 'Внешность не описана — придумай образ, который подходит роли и характеру персонажа.'}`;

  return await callImageApi(prompt);
};
