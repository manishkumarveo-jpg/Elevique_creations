import { TextareaHTMLAttributes, type Ref } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  ref?: Ref<HTMLTextAreaElement>
}

export function Textarea({ label, error, id, className = '', ref, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)' }}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={3}
        className={`w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none resize-none ${className}`}
        style={{ background: '#161d2e', borderColor: error ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.11)', color: 'rgba(255,255,255,0.88)', outline: 'none' }}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
