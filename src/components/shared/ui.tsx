'use client';

import { ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

type Variant = 'default' | 'primary' | 'success' | 'danger';
type Size = 'md' | 'sm' | 'xs';

const variantClasses: Record<Variant, string> = {
  default: 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--surface2)]',
  primary: 'bg-[var(--brand)] text-white border-[var(--brand)] hover:bg-[var(--brand-dark)]',
  success: 'bg-[var(--green)] text-white border-[var(--green)] hover:bg-[var(--green-dark)]',
  danger: 'bg-[var(--red-light)] text-[var(--red-dark)] border-transparent',
};

const sizeClasses: Record<Size, string> = {
  md: 'px-4 py-[9px] text-[13px] md:px-4 md:py-[9px]',
  sm: 'px-[13px] py-[7px] text-xs',
  xs: 'px-2.5 py-[5px] text-[11px]',
};

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
}

export function Btn({ variant = 'default', size = 'md', full, className = '', children, ...rest }: BtnProps) {
  return (
    <button
      className={`inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border font-medium transition-[background,transform] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 max-md:px-4 max-md:py-[11px] max-md:text-sm ${
        variantClasses[variant]
      } ${sizeClasses[size]} ${full ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function FormGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[var(--text-muted)]">{label}</label>
      {children}
    </div>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return (
    <input
      className={`rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--text-hint)] focus:border-[var(--brand)] focus:shadow-[0_0_0_3px_rgba(127,119,221,0.15)] max-md:px-3.5 max-md:py-3 max-md:text-base ${className}`}
      {...rest}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = '', children, ...rest } = props;
  return (
    <select
      className={`appearance-none rounded-lg border border-[var(--border)] bg-[var(--surface)] bg-[right_12px_center] bg-no-repeat px-3 py-2.5 pr-9 text-sm text-[var(--text)] outline-none transition-[border-color,box-shadow] focus:border-[var(--brand)] focus:shadow-[0_0_0_3px_rgba(127,119,221,0.15)] max-md:px-3.5 max-md:py-3 max-md:text-base ${className}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b6980' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
      }}
      {...rest}
    >
      {children}
    </select>
  );
}

export function Hint({ children, show }: { children: ReactNode; show?: boolean }) {
  if (show === false) return null;
  return (
    <div className="mt-0.5 rounded-lg border border-[var(--hint-border)] bg-[var(--hint-bg)] px-3 py-2.5 text-[13px] text-[var(--hint-text)]">
      {children}
    </div>
  );
}

type BadgeColor = 'green' | 'red' | 'amber' | 'purple' | 'gray';
const badgeClasses: Record<BadgeColor, string> = {
  green: 'bg-[var(--green-light)] text-[var(--green-dark)]',
  red: 'bg-[var(--red-light)] text-[var(--red-dark)]',
  amber: 'bg-[var(--amber-light)] text-[var(--amber-dark)]',
  purple: 'bg-[var(--brand-light)] text-[var(--brand-dark)]',
  gray: 'bg-[var(--surface2)] text-[var(--text-muted)]',
};

export function Badge({ color, children }: { color: BadgeColor; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] font-medium ${badgeClasses[color]}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] md:p-[18px] ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, icon, action }: { title: string; icon: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3.5 flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text)]">
        <span className="text-[var(--brand)]">{icon}</span>
        {title}
      </span>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  sub,
  color,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  sub: string;
  color?: 'green' | 'red' | 'purple' | 'amber';
}) {
  const colorClass =
    color === 'green'
      ? 'text-[var(--green)]'
      : color === 'red'
        ? 'text-[var(--red)]'
        : color === 'purple'
          ? 'text-[var(--brand)]'
          : color === 'amber'
            ? 'text-[var(--amber)]'
            : 'text-[var(--text)]';
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[var(--shadow)] md:px-4 md:py-3.5">
      <div className="mb-[5px] flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-[var(--text-hint)]">
        {icon}
        {label}
      </div>
      <div className={`text-lg font-semibold md:text-xl ${colorClass}`}>{value}</div>
      <div className="mt-1 text-[11px] text-[var(--text-hint)]">{sub}</div>
    </div>
  );
}

export function LabelSpan(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} />;
}
