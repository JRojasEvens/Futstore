import { Pagination as BsPagination } from 'react-bootstrap'

export default function Pagination({ page, total, limit, onChange }) {
  const pages = Math.ceil(total / limit)
  if (pages <= 1) return null
  return (
    <BsPagination className="justify-content-center mt-4 mb-0" aria-label="Paginación">
      <BsPagination.Prev disabled={page <= 1} onClick={() => onChange(page - 1)} />
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <BsPagination.Item key={n} active={n === page} onClick={() => onChange(n)}>
          {n}
        </BsPagination.Item>
      ))}
      <BsPagination.Next disabled={page >= pages} onClick={() => onChange(page + 1)} />
    </BsPagination>
  )
}
