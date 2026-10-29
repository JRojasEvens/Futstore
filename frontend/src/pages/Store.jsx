import { useMemo } from 'react'
import { Alert, Col, Container, Form, Row } from 'react-bootstrap'
import FilterSidebar from '../components/FilterSidebar.jsx'
import Loader from '../components/Loader.jsx'
import Pagination from '../components/Pagination.jsx'
import PostGrid from '../components/PostGrid.jsx'
import useFetch from '../hooks/useFetch.js'
import usePostFilters from '../hooks/usePostFilters.js'
import { api, getErrorMessage } from '../services/index.js'
import { PAGE_SIZE, SORT_OPTIONS } from '../utils/constants.js'

export default function Store() {
  const { filters, setFilters, reset } = usePostFilters()
  const page = Number(filters.page) || 1

  // Parámetros enviados a GET /posts (sin los vacíos)
  const query = useMemo(() => {
    const all = { ...filters, page, limit: PAGE_SIZE }
    return Object.fromEntries(Object.entries(all).filter(([, v]) => v !== ''))
  }, [filters, page])

  const { data, loading, error } = useFetch(() => api.getPosts(query), [query])

  const apply = ({ sort: _sort, page: _page, ...rest }) => setFilters(rest)

  return (
    <Container className="py-4">
      <Row className="g-4">
        <Col lg={3}>
          <FilterSidebar key={JSON.stringify(filters)} filters={filters} onApply={apply} onReset={reset} />
        </Col>
        <Col lg={9}>
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
            <div>
              <h1 className="h3 mb-0">Tienda de cartas</h1>
              <p className="text-secondary mb-0" aria-live="polite">
                {data ? `${data.total} ${data.total === 1 ? 'publicación' : 'publicaciones'}` : 'Buscando…'}
              </p>
            </div>
            <Form.Group controlId="sort" className="d-flex align-items-center gap-2">
              <Form.Label className="mb-0 text-nowrap">Ordenar por</Form.Label>
              <Form.Select value={filters.sort} onChange={(e) => setFilters({ sort: e.target.value })}>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>

          {loading && <Loader label="Buscando cartas…" />}
          {error && <Alert variant="danger">{getErrorMessage(error, 'No pudimos cargar la tienda.')}</Alert>}
          {data && !loading && (
            <>
              <PostGrid
                posts={data.results}
                empty={{ title: 'No hay cartas con esos filtros', text: 'Prueba quitando algún filtro o buscando otro jugador.' }}
              />
              <Pagination page={data.page} total={data.total} limit={data.limit} onChange={(p) => setFilters({ page: String(p) })} />
            </>
          )}
        </Col>
      </Row>
    </Container>
  )
}
