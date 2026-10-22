import { useId, type ReactNode } from 'react'

type Option<T extends string> = { value: T; label: ReactNode; title?: string }

type Props<T extends string> = {
  legend: string
  value: T
  options: readonly Option<T>[]
  onChange: (value: T) => void
}

/** A generic, controlled radio group styled as pill buttons. `T` is inferred from `options`. */
export function ChoiceGroup<T extends string>({ legend, value, options, onChange }: Props<T>) {
  const name = useId()

  return (
    <fieldset>
      <legend className="mb-2 font-mono text-xs font-bold tracking-widest text-muted uppercase">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} title={option.title} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className="inline-block rounded-md border-2 border-line px-3.5 py-1.5 font-medium transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-ink hover:border-ink">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
