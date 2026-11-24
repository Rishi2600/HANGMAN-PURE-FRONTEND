import type { ComponentProps } from 'react'

const VARIANTS = {
  primary: 'border-ink bg-kernel text-kernel-ink shadow-hard',
  secondary: 'border-ink bg-surface text-ink shadow-hard hover:bg-wash',
  // For use on an ink-coloured panel: border and shadow flip to the ground colour so the edge still shows.
  inverse: 'border-paper bg-kernel text-kernel-ink shadow-[4px_4px_0_var(--paper)]',
}

type Props = ComponentProps<'button'> & { variant?: keyof typeof VARIANTS }

/** A flat, bordered button that "presses" into its hard shadow. Extra props (onClick, disabled, aria-*) pass through. */
export function Button({ variant = 'primary', className = '', type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-md border-2 px-5 py-3 font-display text-base font-semibold tracking-tight transition-[transform,box-shadow,background-color] duration-100 enabled:active:translate-x-1 enabled:active:translate-y-1 enabled:active:shadow-none disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...rest}
    />
  )
}
