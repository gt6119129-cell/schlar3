import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { applyThemeToDom, getStoredActiveColors } from './theme/themeEngine';

// Apply active / default theme tokens to DOM immediately
applyThemeToDom(getStoredActiveColors());

createRoot(document.getElementById('root')!).render(<App />);
