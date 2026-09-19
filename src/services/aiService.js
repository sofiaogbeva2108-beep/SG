import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ VITE_GEMINI_API_KEY не найден!");
}

const genAI = new GoogleGenerativeAI(apiKey || '');

// Используем актуальное имя модели
const MODEL_NAME = 'gemini-2.5-flash';

export const runAiBetaReader = async (currentScene, currentCycle) => {
  if (!currentScene?.content) return 'Текст сцены пуст.';
  
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = `Проведи детальный анализ литературного отрывка как бета-ридер и стилист.
        
Контекст мира: ${currentCycle?.description || ''}
Персонажи: ${currentCycle?.lore?.characters?.map(c => c.name + ': ' + c.bio).join('; ') || 'Нет'}

Текст сцены:
"${currentScene.content}"

Структура ответа:
🟢 **Сильные стороны:**
🟡 **Ритм и темп сцены:**
🔴 **Замечания к стилю, повторам и ООС (выходу из характера):**`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Ошибка Gemini API (runAiBetaReader):", error);
    throw error;
  }
};

export const runCharacterSim = async (simChar1, simChar2, simConflict, currentCycle) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = `Смоделируй диалог-столкновение двух персонажей фэнтези.
Персонаж 1: ${simChar1}
Персонаж 2: ${simChar2}
Причина конфликта: ${simConflict}
Мир: ${currentCycle?.description || ''}

Напиши напряженный диалог с описанием эмоций и жестов, а в конце дай вердикт ИИ о химии персонажей.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Ошибка Gemini API (runCharacterSim):", error);
    throw error;
  }
};

export const runBrainstorm = async (genCategory, currentCycle) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    let prompt = `Сгенерируй 5 креативных идей для фэнтези мира "${currentCycle?.title || ''}". Описание мира: ${currentCycle?.description || ''}. `;
    
    if (genCategory === 'names') prompt += 'Предложи 10 атмосферных имён персонажей и названий древних родов с краткой характеристикой.';
    if (genCategory === 'twists') prompt += 'Предложи 5 неожиданных сюжетных поворотов (Plot Twists) для текущей сюжетной арки.';
    if (genCategory === 'locations') prompt += 'Предложи 5 уникальных волшебных или мрачных локаций с их секретами.';

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Ошибка Gemini API (runBrainstorm):", error);
    throw error;
  }
};
