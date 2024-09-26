import { Converter } from '../dist';
import './style.css';

const markdown = Converter.toMarkdown({
  'Hello, World!': 'It works!',
});

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `<pre>${markdown}</pre>`;
