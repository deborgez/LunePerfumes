'use client';

import { useEffect, useRef, useState } from 'react';
import { IconX } from '@tabler/icons-react';

export interface SearchSelectOption {
  value: number;
  label: string;
  sublabel?: string;
}

interface SearchSelectProps {
  options: SearchSelectOption[];
  value: number | '';
  onChange: (value: number | '') => void;
  placeholder?: string;
  emptyMessage?: string;
  allowClear?: boolean;
  maxResults?: number;
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export default function SearchSelect({
  options,
  value,
  onChange,
  placeholder,
  emptyMessage,
  allowClear = false,
  maxResults = 50,
}: SearchSelectProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) setQuery(selected ? selected.label : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only resync display text when closed, not on every keystroke
  }, [value, selected?.label, open]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const q = normalize(query.trim());
  const filtered = q
    ? options.filter((o) => normalize(o.label).includes(q) || (o.sublabel && normalize(o.sublabel).includes(q)))
    : options;
  const shown = filtered.slice(0, maxResults);

  function selectOption(o: SearchSelectOption) {
    onChange(o.value);
    setQuery(o.label);
    setOpen(false);
  }
  function clear() {
    onChange('');
    setQuery('');
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          value={query}
          placeholder={placeholder}
          onFocus={(e) => {
            setOpen(true);
            e.target.select();
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && shown[0]) {
              selectOption(shown[0]);
              e.preventDefault();
            }
            if (e.key === 'Escape') {
              setOpen(false);
              setQuery(selected ? selected.label : '');
              inputRef.current?.blur();
            }
          }}
          className={`w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--text-hint)] focus:border-[var(--brand)] focus:shadow-[0_0_0_3px_rgba(127,119,221,0.15)] max-md:px-3.5 max-md:py-3 max-md:text-base ${
            allowClear && selected ? 'pr-8' : ''
          }`}
        />
        {allowClear && selected && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={clear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-hint)] hover:text-[var(--text)]"
          >
            <IconX size={14} />
          </button>
        )}
      </div>
      {open && (
        <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
          {!shown.length ? (
            <div className="px-3 py-2 text-[13px] text-[var(--text-hint)]">{emptyMessage || 'Nada encontrado'}</div>
          ) : (
            shown.map((o) => (
              <button
                key={o.value}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectOption(o)}
                className="block w-full px-3 py-2 text-left text-[13px] text-[var(--text)] hover:bg-[var(--tbl-hover)]"
              >
                {o.label}
                {o.sublabel && <span className="ml-1.5 text-[11px] text-[var(--text-hint)]">{o.sublabel}</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
