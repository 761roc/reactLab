import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type PropsWithChildren,
  type ReactNode,
  type TextareaHTMLAttributes
} from 'react';

type ClassValue = string | false | null | undefined;

function cn(...values: ClassValue[]) {
  return values.filter(Boolean).join(' ');
}

const buttonVariantClass = {
  default: 'border-slate-900 bg-slate-900 text-white shadow-[0_20px_55px_-32px_rgba(15,23,42,0.85)] hover:bg-slate-800',
  secondary: 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
  outline: 'border-slate-300 bg-white/75 text-slate-700 hover:border-slate-400 hover:bg-white',
  ghost: 'border-transparent bg-transparent text-slate-700 hover:bg-slate-100',
  destructive: 'border-rose-200 bg-rose-600 text-white hover:bg-rose-500'
} as const;

const buttonSizeClass = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3 text-xs',
  lg: 'h-11 rounded-xl px-6 text-sm',
  icon: 'h-10 w-10'
} as const;

type ButtonVariant = keyof typeof buttonVariantClass;
type ButtonSize = keyof typeof buttonSizeClass;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        buttonVariantClass[variant],
        buttonSizeClass[size],
        className
      )}
      type={type}
      {...props}
    />
  );
}

const badgeVariantClass = {
  default: 'border-slate-200 bg-slate-100 text-slate-700',
  outline: 'border-slate-300 bg-white text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  accent: 'border-sky-200 bg-sky-50 text-sky-700'
} as const;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariantClass;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]',
        badgeVariantClass[variant],
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white/90 text-slate-950 shadow-[0_24px_80px_-54px_rgba(15,23,42,0.55)] backdrop-blur',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm leading-6 text-slate-500', className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        className={cn(
          'flex min-h-[112px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
}

export function Progress({ className, value, ...props }: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-slate-100', className)}
      {...props}
    >
      <div
        className="h-full rounded-full bg-slate-900 transition-all duration-300"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}

interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
}

export function Checkbox({
  checked,
  defaultChecked = false,
  disabled = false,
  onCheckedChange,
  label,
  description
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const resolvedChecked = checked ?? internalChecked;

  const toggle = () => {
    if (disabled) {
      return;
    }

    const nextValue = !resolvedChecked;
    if (checked === undefined) {
      setInternalChecked(nextValue);
    }
    onCheckedChange?.(nextValue);
  };

  return (
    <button
      aria-checked={resolvedChecked}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition-colors hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50',
        resolvedChecked && 'border-slate-900 bg-slate-50'
      )}
      disabled={disabled}
      onClick={toggle}
      role="checkbox"
      type="button"
    >
      <span
        className={cn(
          'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border text-[11px] font-bold',
          resolvedChecked ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-transparent'
        )}
      >
        ✓
      </span>
      <span className="grid gap-1">
        {label ? <span className="text-sm font-medium text-slate-900">{label}</span> : null}
        {description ? <span className="text-xs leading-5 text-slate-500">{description}</span> : null}
      </span>
    </button>
  );
}

interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function Switch({ checked, defaultChecked = false, disabled = false, onCheckedChange }: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const resolvedChecked = checked ?? internalChecked;

  const toggle = () => {
    if (disabled) {
      return;
    }

    const nextValue = !resolvedChecked;
    if (checked === undefined) {
      setInternalChecked(nextValue);
    }
    onCheckedChange?.(nextValue);
  };

  return (
    <button
      aria-checked={resolvedChecked}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        resolvedChecked ? 'border-slate-900 bg-slate-900' : 'border-slate-300 bg-slate-200'
      )}
      disabled={disabled}
      onClick={toggle}
      role="switch"
      type="button"
    >
      <span
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform',
          resolvedChecked ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  initials: string;
  colorClassName?: string;
}

export function Avatar({ className, initials, colorClassName, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-slate-900 text-sm font-semibold text-white shadow-sm',
        colorClassName,
        className
      )}
      {...props}
    >
      {initials}
    </div>
  );
}

export function Separator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('h-px w-full bg-slate-200', className)} {...props} />;
}

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(componentName: string) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Tabs.`);
  }

  return context;
}

interface TabsProps extends PropsWithChildren {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ children, className, defaultValue, onValueChange, value }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const resolvedValue = value ?? internalValue;

  const contextValue = useMemo(
    () => ({
      value: resolvedValue,
      setValue: (nextValue: string) => {
        if (value === undefined) {
          setInternalValue(nextValue);
        }
        onValueChange?.(nextValue);
      }
    }),
    [onValueChange, resolvedValue, value]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn('grid gap-4', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'inline-flex h-11 items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1 text-slate-500',
        className
      )}
      {...props}
    />
  );
}

interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({ className, value, ...props }: TabsTriggerProps) {
  const { setValue, value: activeValue } = useTabsContext('TabsTrigger');
  const isActive = activeValue === value;

  return (
    <button
      className={cn(
        'inline-flex min-w-[112px] items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2',
        isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800',
        className
      )}
      onClick={() => setValue(value)}
      type="button"
      {...props}
    />
  );
}

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({ className, value, ...props }: TabsContentProps) {
  const { value: activeValue } = useTabsContext('TabsContent');

  if (activeValue !== value) {
    return null;
  }

  return <div className={cn('outline-none', className)} {...props} />;
}

interface FieldProps extends PropsWithChildren {
  label: string;
  hint?: string;
  htmlFor?: string;
}

export function Field({ children, hint, htmlFor, label }: FieldProps) {
  return (
    <label className="grid gap-2" htmlFor={htmlFor}>
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      {children}
      {hint ? <span className="text-xs leading-5 text-slate-500">{hint}</span> : null}
    </label>
  );
}
