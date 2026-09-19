import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

export const exportToDocx = (currentBook, currentCycle) => {
  if (!currentBook) return;
  const docChildren = [
    new Paragraph({ text: currentBook.title, heading: HeadingLevel.TITLE }),
    new Paragraph({ text: `Цикл: ${currentCycle?.title || ''}`, heading: HeadingLevel.SUBTITLE }),
    new Paragraph({ text: '' })
  ];

  currentBook.chapters.forEach(ch => {
    docChildren.push(new Paragraph({ text: ch.title, heading: HeadingLevel.HEADING_1 }));
    ch.scenes.forEach(sc => {
      docChildren.push(new Paragraph({ text: sc.title, heading: HeadingLevel.HEADING_2 }));
      docChildren.push(new Paragraph({ text: sc.content }));
      docChildren.push(new Paragraph({ text: '' }));
    });
  });

  const doc = new Document({ sections: [{ children: docChildren }] });
  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `${currentBook.title}.docx`);
  });
};
