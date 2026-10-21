import React, { useState, useEffect, useRef } from 'react';
import { getStorageData, setStorageData } from './utils/storage';
import { defaultIcons } from './icons';

export default function App() {
  const [query, setQuery] = useState('');
  const [searchEngine, setSearchEngine] = useState('https://www.google.com/search?q=');
  const [shortcuts, setShortcuts] = useState([]);
  const [theme, setTheme] = useState('dark');
  const searchInputRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      const savedTheme = await getStorageData('chevron_theme', 'dark');
      const savedShortcuts = await getStorageData('chevron_shortcuts', [
        { name: 'GitHub', url: 'https://github.com', icon: 'github' },
        { name: 'YouTube', url: 'https://youtube.com', icon: 'youtube' },
        { name: 'ChatGPT', url: 'https://chatgpt.com', icon: 'chatgpt' }
      ]);
      setTheme(savedTheme);
      setShortcuts(savedShortcuts);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    loadData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `${searchEngine}${encodeURIComponent(query)}`;
  };

  const toggleTheme = async () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    await setStorageData('chevron_theme', nextTheme);
  };

  const exportConfig = () => {
    const configData = JSON.stringify({ theme, shortcuts }, null, 2);
    const blob = new Blob([configData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chevron-backup.json';
    a.click();
  };

  return (
    <div className={`app-container theme-${theme}`}>
      <header className="top-bar">
        <button onClick={toggleTheme} className="btn-icon" title="Toggle Mode">
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
        <button onClick={exportConfig} className="btn-secondary">
          Export Config
        </button>
      </header>

      <main className="main-content">
        <h1 className="brand-title">Chevron</h1>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Cari sesuatu atau tekan '/'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <div className="shortcuts-grid">
          {shortcuts.map((sc, idx) => (
            <a key={idx} href={sc.url} className="shortcut-card">
              <div className="icon-wrapper">
                {defaultIcons[sc.icon] || defaultIcons['default']}
              </div>
              <span className="shortcut-label">{sc.name}</span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}