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
      <legend className="mb-2 text-sm font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
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
            <span className="inline-block rounded-full border-2 border-slate-300 px-3.5 py-1.5 font-semibold transition-colors peer-checked:border-amber-400 peer-checked:bg-amber-400 peer-checked:text-ink peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-amber-400 hover:border-amber-400 dark:border-slate-600">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
