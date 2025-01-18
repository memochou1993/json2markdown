import { Converter } from '../dist';
import './style.css';

const output = Converter.toMarkdown({
  'Hello, World!': 'It works!',
}, (element) => {
  if (element.tag === 'heading') {
    element.level += 1;
  }
  return element;
});

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `<pre>${output}</pre>`;
