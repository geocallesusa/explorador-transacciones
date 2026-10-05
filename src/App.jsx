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
          <p className="eyebrow">Normalización y exploración</p>
          <h1>Explorador de transacciones</h1>
        </div>

        <div className="action-group">
          <label className="upload-button">
            Cargar JSON
            <input type="file" accept=".json,application/json" multiple onChange={handleLoadFiles} />
          </label>
          <button type="button" className="secondary-button" onClick={handleLoadExamples}>
            Cargar ejemplos
          </button>
        </div>
      </header>

      {error ? <div className="alert-box">{error}</div> : null}

      <section className="stats-grid">
        <article className="stat-card total">
          <span>Total procesado</span>
          <strong>{metrics.totalRead || 0}</strong>
        </article>
        <article className="stat-card valid">
          <span>Registros válidos</span>
          <strong>{metrics.valid || 0}</strong>
        </article>
        <article className="stat-card invalid">
          <span>Registros inválidos</span>
          <strong>{metrics.invalid || 0}</strong>
        </article>
        <article className="stat-card percent">
          <span>Porcentaje válido</span>
          <strong>{metrics.percentageValid ? `${metrics.percentageValid.toFixed(1)}%` : '0%'}</strong>
        </article>
      </section>

      <section className="panel controls-panel">
        <div className="field-group">
          <label htmlFor="search">Buscar</label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por ID, monto o estado..."
          />
        </div>

        <div className="field-group">
          <label htmlFor="status-filter">Estado</label>
          <select id="status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">Todos</option>
            {VALID_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="currency-filter">Moneda</label>
          <select id="currency-filter" value={currencyFilter} onChange={(event) => setCurrencyFilter(event.target.value)}>
            <option value="all">Todas</option>
            {availableCurrencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="panel table-panel">
        <div className="panel-header">
          <h2>Transacciones válidas</h2>
          <span>{filteredTransactions.length} resultados</span>
        </div>

        {filteredTransactions.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ID fuente</th>
                  <th>Monto</th>
                  <th>Moneda</th>
                  <th>Timestamp</th>
                  <th>Estado</th>
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
                      <span className="status-badge">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-state">No hay transacciones válidas para mostrar.</p>
        )}
      </section>

      <section className="panel invalid-panel">
        <div className="panel-header">
          <h2>Transacciones rechazadas</h2>
          <span>{invalidTransactions.length} registros</span>
        </div>

        {invalidTransactions.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Archivo</th>
                  <th>Motivo</th>
                  <th>Registro</th>
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
          <p className="empty-state">No hay registros inválidos.</p>
        )}
      </section>
    </div>
  );
}

export default App;
