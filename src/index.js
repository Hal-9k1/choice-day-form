import App from './App.js';
import { createRoot } from 'react-dom/client';

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementsByTagName('body')[0]).render(<App />);
});
