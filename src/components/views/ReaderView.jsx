import React from 'react';

export default function ReaderView({ currentBook }) {
  return (
    <div className="h-full p-8 overflow-y-auto max-w-2xl mx-auto font-serif leading-relaxed">
      <h1 className="text-2xl font-bold font-sans text-center mb-6">{currentBook?.title}</h1>
      {currentBook?.chapters?.map(ch => (
        <div key={ch.id} className="mb-6">
          <h2 className="text-lg font-bold font-sans mb-3">{ch.title}</h2>
          {ch.scenes.map(sc => (
            <p key={sc.id} className="whitespace-pre-wrap text-base mb-4">{sc.content}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
