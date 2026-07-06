interface TableProps {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="p-table-wrap">
      <table className={`p-table ${className}`}>{children}</table>
    </div>
  )
}

export function Thead({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>
}

export function Tbody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>
}

export function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <th className={className}>{children}</th>
}

export function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={className}>{children}</td>
}

export function Tr({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <tr className={className}>{children}</tr>
}
