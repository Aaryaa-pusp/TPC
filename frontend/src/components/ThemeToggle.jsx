import React from 'react';
import { Moon, Sun } from 'lucide-react';
import useTheme from '../hooks/useTheme';

export default function ThemeToggle({ className = '' }) {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 bg-white/90 text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:bg-slate-900/90 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 ${className}`}
        >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
