'use client'

interface SegmentedControlProps {
  options: string[]
  value: string
  onChange: (v: string) => void
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="p-segmented" role="group">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          className={`p-segmented-btn${value === opt ? ' active' : ''}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
