import { useMemo, useState } from 'react';
import { VALID_STATUSES } from './config/rules';
import { loadExampleBatch, processTransactionFiles } from './lib/transactions';
import './App.css';

const emptyMetrics = {
  totalRead: 0,
  valid: 0,
  invalid: 0,
  total: 0,
  percentageValid: 0,
  percentageInvalid: 0,
};

function App() {
  const [validTransactions, setValidTransactions] = useState([]);
  const [invalidTransactions, setInvalidTransactions] = useState([]);
  const [metrics, setMetrics] = useState(emptyMetrics);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [error, setError] = useState('');

  const availableCurrencies = useMemo(
    () => [...new Set(validTransactions.map((item) => item.currency))],
    [validTransactions],
  );

  const filteredTransactions = useMemo(() => {
    const text = search.trim().toLowerCase();

    return validTransactions.filter((item) => {
      const matchesSearch =
        !text ||
        [item.id, item.id_fuente, item.amount, item.currency, item.timestamp, item.status]
          .join(' ')
          .toLowerCase()
          .includes(text);

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesCurrency = currencyFilter === 'all' || item.currency === currencyFilter;

      return matchesSearch && matchesStatus && matchesCurrency;
    });
  }, [validTransactions, search, statusFilter, currencyFilter]);

  const hasActiveFilters = Boolean(search.trim()) || statusFilter !== 'all' || currencyFilter !== 'all';
  const hasProcessedBatch = metrics.totalRead > 0 || metrics.invalid > 0;

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setCurrencyFilter('all');
  };

  const handleLoadFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      const result = await processTransactionFiles(files);
      setValidTransactions(result.validTransactions);
      setInvalidTransactions(result.invalidTransactions);
      setMetrics(result.metrics);
      setError('');
    } catch (loadError) {
      setError(loadError.message || 'No fue posible procesar los archivos.');
    }

    event.target.value = '';
  };

  const handleLoadExamples = async () => {
    try {
      const result = await loadExampleBatch();
      setValidTransactions(result.validTransactions);
      setInvalidTransactions(result.invalidTransactions);
      setMetrics(result.metrics);
      setError('');
    } catch (loadError) {
      setError(loadError.message || 'No fue posible cargar los ejemplos.');
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Explorador de transacciones</h1>
          <p className="page-intro">
            Carga archivos JSON para revisar transacciones válidas, detectar registros rechazados y explorar los
            resultados.
          </p>
        </div>

        <div className="action-group">
          <label className="upload-button" htmlFor="transaction-files">
            Seleccionar archivos JSON
            <input
              id="transaction-files"
              type="file"
              accept=".json,application/json"
              multiple
              aria-describedby="upload-help"
              onChange={handleLoadFiles}
            />
          </label>
          <button type="button" className="secondary-button" onClick={handleLoadExamples}>
            Cargar ejemplos
          </button>
          <p id="upload-help" className="upload-help">
            Puedes seleccionar varios archivos a la vez.
          </p>
        </div>
      </header>

      {error ? (
        <div className="alert-box" role="alert">
          {error}
        </div>
      ) : null}

      <section className="stats-section" aria-labelledby="summary-heading" aria-live="polite">
        <h2 id="summary-heading">Resumen de la carga</h2>
        <div className="stats-grid">
          <article className="stat-card total">
            <span>Total de registros</span>
            <strong>{metrics.totalRead || 0}</strong>
          </article>
          <article className="stat-card valid">
            <span>Válidos</span>
            <strong>{metrics.valid || 0}</strong>
          </article>
          <article className="stat-card invalid">
            <span>Rechazados</span>
            <strong>{metrics.invalid || 0}</strong>
          </article>
          <article className="stat-card percent">
            <span>Porcentaje válido</span>
            <strong>{metrics.percentageValid ? `${metrics.percentageValid.toFixed(1)}%` : '0%'}</strong>
          </article>
        </div>
      </section>

      <section className="panel filter-panel" aria-labelledby="filters-heading">
        <div className="panel-heading">
          <div>
            <h2 id="filters-heading">Buscar y filtrar</h2>
            <p>Refina la lista por ID, monto, fecha, estado o moneda.</p>
          </div>
          <button
            type="button"
            className="clear-filters-button"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
          >
            Limpiar filtros
          </button>
        </div>

        <div className="controls-panel">
          <div className="field-group">
            <label htmlFor="search">Buscar transacciones</label>
            <input
              id="search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Por ejemplo, tx_001 o 100.50"
            />
          </div>

          <div className="field-group">
            <label htmlFor="status-filter">Filtrar por estado</label>
            <select id="status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">Todos los estados</option>
              {VALID_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="currency-filter">Filtrar por moneda</label>
            <select
              id="currency-filter"
              value={currencyFilter}
              onChange={(event) => setCurrencyFilter(event.target.value)}
            >
              <option value="all">Todas las monedas</option>
              {availableCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="panel table-panel" aria-labelledby="valid-heading">
        <div className="panel-header">
          <h2 id="valid-heading">Transacciones válidas</h2>
          <span aria-live="polite">
            {filteredTransactions.length} de {validTransactions.length} registros
          </span>
        </div>

        {filteredTransactions.length ? (
          <div className="table-wrap">
            <table>
              <caption className="sr-only">Lista de transacciones que pasaron la validación</caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">ID de origen</th>
                  <th scope="col">Monto</th>
                  <th scope="col">Moneda</th>
                  <th scope="col">Fecha y hora</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((item) => (
                  <tr key={`${item.id}-${item.id_fuente}`}>
                    <td>{item.id}</td>
                    <td>{item.id_fuente}</td>
                    <td>{item.amount}</td>
                    <td>{item.currency}</td>
                    <td>{item.timestamp}</td>
                    <td>
                      <span className={`status-badge status-${item.status.toLowerCase()}`}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-state" role="status">
            {hasActiveFilters
              ? 'No hay resultados con estos filtros. Prueba otros criterios o límpialos.'
              : hasProcessedBatch
                ? 'No se encontraron transacciones válidas en los archivos cargados.'
                : 'Carga archivos JSON o usa los ejemplos para ver las transacciones aquí.'}
          </p>
        )}
      </section>

      <section className="panel invalid-panel" aria-labelledby="rejected-heading">
        <div className="panel-header">
          <h2 id="rejected-heading">Registros rechazados</h2>
          <span>{invalidTransactions.length} registros</span>
        </div>

        {invalidTransactions.length ? (
          <div className="table-wrap">
            <table>
              <caption className="sr-only">Lista de registros rechazados y el motivo de cada rechazo</caption>
              <thead>
                <tr>
                  <th scope="col">Archivo</th>
                  <th scope="col">Motivo del rechazo</th>
                  <th scope="col">Datos recibidos</th>
                </tr>
              </thead>
              <tbody>
                {invalidTransactions.map((item, index) => (
                  <tr key={`${item.origin}-${index}`}>
                    <td>{item.origin}</td>
                    <td>{item.motivo}</td>
                    <td className="invalid-cell">
                      {item.raw ? (
                        <code>{JSON.stringify(item.raw)}</code>
                      ) : (
                        <span>Sin detalle</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-state">
            {hasProcessedBatch
              ? 'No se rechazaron registros en esta carga.'
              : 'Los registros rechazados aparecerán aquí después de cargar archivos.'}
          </p>
        )}
      </section>
    </div>
  );
}

export default App;
