import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Wand2, Scissors, Eye, CornerDownRight, MessageCircle,
  Send, Bot, User, Loader2, ClipboardCopy, PlusSquare, Replace
} from 'lucide-react';
import { runTextAction, runSceneChat } from '../../services/aiService';

const ACTIONS = [
  { id: 'continue', label: 'Продолжить', icon: CornerDownRight },
  { id: 'shorten', label: 'Сократить', icon: Scissors },
  { id: 'livelier', label: 'Переписать живее', icon: Sparkles },
  { id: 'senses', label: 'Добавить сенсорику', icon: Eye },
  { id: 'nextLine', label: '3 варианта следующей фразы', icon: Wand2 },
];

const QUICK_QUESTIONS = [
  'Что дальше?',
  'Где дыра в сцене?',
  'Проверь мотивацию героя',
  'Как усилить конфликт?',
];

export default function AiAssistantPanel({
  selectedText,
  sceneContent,
  currentScene,
  currentCycle,
  onReplaceSelection,
  onAppendText
}) {
  const [tab, setTab] = useState('actions');

  // --- Действия над текстом ---
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [result, setResult] = useState(null); // { text, hadSelection }

  const runAction = async (actionId) => {
    const hadSelection = !!selectedText?.trim();
    const text = (selectedText?.trim() || sceneContent?.trim() || '');

    if (!text) {
      setActionError('Сначала напишите хотя бы пару предложений в сцене (или выделите фрагмент).');
      return;
    }

    setActionLoading(true);
    setActionError('');
    setResult(null);

    try {
      const output = await runTextAction(actionId, text, currentCycle);
      setResult({ text: output, hadSelection });
    } catch (err) {
      setActionError(err.message || 'Не удалось выполнить запрос');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Чат ---
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Сбрасываем чат при переключении сцены — контекст другой
  useEffect(() => {
    setMessages([]);
  }, [currentScene?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  const sendMessage = async (presetText) => {
    const question = (presetText ?? chatInput).trim();
    if (!question || chatLoading) return;

    const nextMessages = [...messages, { role: 'user', content: question }];
    setMessages(nextMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const answer = await runSceneChat(question, currentScene, currentCycle, nextMessages);
      setMessages([...nextMessages, { role: 'assistant', content: answer }]);
    } catch (err) {
      setMessages([...nextMessages, {
        role: 'assistant',
        content: 'Не удалось получить ответ: ' + (err.message || 'ошибка сети')
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const tabBtnClass = (t) =>
    `flex-1 py-2 text-xs font-semibold border-b-2 transition flex items-center justify-center gap-1.5 ${
      tab === t
        ? 'border-emerald-600 text-emerald-800'
        : 'border-transparent text-slate-400 hover:text-slate-600'
    }`;

  return (
    <div className="w-80 border-l border-emerald-100 bg-white flex flex-col shrink-0 hidden xl:flex">

      {/* Шапка */}
      <div className="p-4 border-b border-emerald-100">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Bot className="w-4 h-4 text-emerald-700" /> ИИ-ассистент
        </h3>
        <p className="text-[10px] text-slate-400 mt-0.5">Рядом с вами на протяжении всей сцены</p>
      </div>

      {/* Вкладки */}
      <div className="flex border-b border-emerald-100">
        <button onClick={() => setTab('actions')} className={tabBtnClass('actions')}>
          <Wand2 className="w-3.5 h-3.5" /> Действия
        </button>
        <button onClick={() => setTab('chat')} className={tabBtnClass('chat')}>
          <MessageCircle className="w-3.5 h-3.5" /> Чат
        </button>
      </div>

      {/* ВКЛАДКА ДЕЙСТВИЙ */}
      {tab === 'actions' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <p className="text-[11px] text-slate-500 mb-2">
              {selectedText?.trim()
                ? <>Работаем с выделенным фрагментом (<strong>{selectedText.trim().length}</strong> симв.)</>
                : 'Ничего не выделено — ИИ возьмёт всю сцену целиком'}
            </p>
            <div className="space-y-1.5">
              {ACTIONS.map(a => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.id}
                    onClick={() => runAction(a.id)}
                    disabled={actionLoading}
                    className="w-full text-left px-3 py-2 bg-emerald-50/60 hover:bg-emerald-100 border border-emerald-100 rounded-xl text-xs font-medium text-emerald-900 flex items-center gap-2 transition disabled:opacity-50"
                  >
                    <Icon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>

          {actionLoading && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-4">
              <Loader2 className="w-4 h-4 animate-spin" /> Думаю...
            </div>
          )}

          {actionError && (
            <p className="text-[11px] text-rose-500 bg-rose-50 border border-rose-100 rounded-lg p-2">
              {actionError}
            </p>
          )}

          {result && !actionLoading && (
            <div className="border border-emerald-100 rounded-xl p-3 bg-slate-50 space-y-2">
              <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">{result.text}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.hadSelection && (
                  <button
                    onClick={() => onReplaceSelection(result.text)}
                    className="text-[10px] font-semibold px-2 py-1 bg-emerald-700 text-white rounded-lg flex items-center gap-1 hover:bg-emerald-800"
                  >
                    <Replace className="w-3 h-3" /> Заменить выделенное
                  </button>
                )}
                <button
                  onClick={() => onAppendText(result.text)}
                  className="text-[10px] font-semibold px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg flex items-center gap-1 hover:bg-emerald-200"
                >
                  <PlusSquare className="w-3 h-3" /> В конец сцены
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(result.text)}
                  className="text-[10px] font-semibold px-2 py-1 bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 hover:bg-slate-300"
                >
                  <ClipboardCopy className="w-3 h-3" /> Скопировать
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ВКЛАДКА ЧАТА */}
      {tab === 'chat' && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400">Спросите что-нибудь о сцене, или выберите один из вариантов:</p>
                {QUICK_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="w-full text-left px-3 py-2 bg-emerald-50/60 hover:bg-emerald-100 border border-emerald-100 rounded-xl text-xs text-emerald-900 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                )}
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Печатает...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="p-3 border-t border-emerald-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Спросите ИИ-соавтора..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
