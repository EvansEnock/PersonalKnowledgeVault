import { useState, useCallback } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Search your vault...' }) {
  const [value, setValue] = useState('');

  const handleChange = useCallback((e) => {
    const v = e.target.value;
    setValue(v);
    onSearch(v);
  }, [onSearch]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <span className="search-icon">⌕</span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="search-input"
      />
      {value && (
        <button className="search-clear" onClick={handleClear}>✕</button>
      )}
    </div>
  );
}
