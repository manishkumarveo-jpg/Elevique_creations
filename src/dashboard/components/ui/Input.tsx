import { InputHTMLAttributes, type Ref } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  ref?: Ref<HTMLInputElement>
}

export function Input({ label, error, id, className = '', ref, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-white/60 uppercase tracking-widest">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`w-full rounded-lg border bg-white/4 px-3 py-2.5 text-sm text-white/90 placeholder-white/25 transition focus:outline-none focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6]/50 disabled:opacity-40 disabled:cursor-not-allowed ${error ? 'border-red-500/40' : 'border-white/10'} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
