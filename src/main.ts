import { Converter } from '../dist';
import './style.css';

const markdown = Converter.toMarkdown({
  title: 'Hello, World!',
});

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `<pre>${markdown}</pre>`;
