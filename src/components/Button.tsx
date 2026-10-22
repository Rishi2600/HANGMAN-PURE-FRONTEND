import type { ComponentProps } from 'react'

const VARIANTS = {
  primary: 'bg-amber-400 text-ink shadow-amber-600 hover:bg-amber-300',
  secondary:
    'bg-white text-ink shadow-slate-300 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-100 dark:shadow-slate-950 dark:hover:bg-slate-600',
  success: 'bg-emerald-500 text-white shadow-emerald-700 hover:bg-emerald-400',
}

type Props = ComponentProps<'button'> & { variant?: keyof typeof VARIANTS }

/** A chunky "pressable" button. Any extra props (onClick, disabled, aria-*) pass straight through. */
export function Button({ variant = 'primary', className = '', type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-display text-lg font-semibold shadow-[0_4px_0] transition-[transform,box-shadow,background-color] duration-100 enabled:active:translate-y-1 enabled:active:shadow-[0_0_0] disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...rest}
    />
  )
}
