import ReactDOM from 'react-dom/client';
import { App } from './components/App';

document.body.style.margin = '0';

ReactDOM
    .createRoot(document.getElementById('root') as HTMLElement)
    .render(<App />);
