import { CURRENCY_ALIASES, STATUS_MAP, SUPPORTED_CURRENCIES, VALID_STATUSES } from '../config/rules';

const normalizeText = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const getValueByAliases = (record, aliases) => {
  for (const alias of aliases) {
    if (Object.prototype.hasOwnProperty.call(record, alias)) {
      return record[alias];
    }
  }
  return undefined;
};

const cleanAmountString = (value) => {
  let text = normalizeText(value)
    .replace(/[$€£]/g, '')
    .replace(/\s+/g, '')
    .replace(/\u00A0/g, '');

  if (!text) {
    throw new Error('campo obligatorio faltante');
  }

  if (text.includes('(') && text.includes(')')) {
    text = `-${text.replace(/[()]/g, '')}`;
  }

  if (text.includes(',')) {
    const hasDot = text.includes('.');
    if (hasDot) {
      text = text.replace(/,/g, '');
    } else {
      text = text.replace(',', '.');
    }
  }

  text = text.replace(/[^\d.\-]/g, '');

  if (!text || Number.isNaN(Number(text))) {
    throw new Error('monto no válido');
  }

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed.toFixed(2) : '0.00';
};

const detectSource = (record = {}) => {
  const keys = Object.keys(record);

  if (keys.some((key) => ['transaction_id', 'total', 'currency_code', 'created_at', 'state'].includes(key))) {
    return 'alternate';
  }

  if (keys.some((key) => ['ref', 'date', 'result'].includes(key))) {
    return 'reference';
  }

  if (keys.some((key) => ['id', 'amount', 'currency', 'timestamp', 'status'].includes(key))) {
    return 'standard';
  }

  return 'unknown';
};

const normalizeCurrency = (value, amountText) => {
  const direct = normalizeText(value);
  const sourceText = normalizeText(amountText);

  const candidate = direct || sourceText.match(/[A-Za-z]{3}/)?.[0] || '';
  const aliasKey = candidate.toLowerCase();

  if (CURRENCY_ALIASES[aliasKey]) {
    const normalized = CURRENCY_ALIASES[aliasKey];
    if (SUPPORTED_CURRENCIES.includes(normalized)) {
      return normalized;
    }
  }

  const symbolMatch = sourceText.match(/[$€£]/);
  if (symbolMatch) {
    const symbol = symbolMatch[0];
    const normalized = CURRENCY_ALIASES[symbol];
    if (normalized && SUPPORTED_CURRENCIES.includes(normalized)) {
      return normalized;
    }
  }

  if (direct && !SUPPORTED_CURRENCIES.includes(direct.toUpperCase())) {
    throw new Error('moneda no soportada');
  }

  if (!direct && !candidate) {
    throw new Error('campo obligatorio faltante');
  }

  return direct.toUpperCase();
};

const normalizeStatus = (value) => {
  const text = normalizeText(value);
  if (!text) {
    throw new Error('campo obligatorio faltante');
  }

  const lower = text.toLowerCase();
  if (lower === 'ok') {
    return 'OK';
  }

  if (VALID_STATUSES.includes(text)) {
    return text;
  }

  if (STATUS_MAP[lower]) {
    return STATUS_MAP[lower];
  }

  throw new Error('estado no válido');
};

const normalizeTimestamp = (value) => {
  const text = normalizeText(value);
  if (!text) {
    throw new Error('campo obligatorio faltante');
  }

  let candidate = text.replace(/Z$/i, '').trim();
  candidate = candidate.replace('T', ' ');

  let parsed;
  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(:\d{2})?$/.test(candidate)) {
    const [datePart, timePart] = candidate.split(' ');
    const [year, month, day] = datePart.split('-');
    const time = timePart || '00:00:00';
    const [hour, minute, second = '00'] = time.split(':');
    parsed = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
  } else if (/^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}(:\d{2})?$/.test(candidate)) {
    const [datePart, timePart] = candidate.split(' ');
    const [day, month, year] = datePart.split('/');
    const time = timePart || '00:00:00';
    const [hour, minute, second = '00'] = time.split(':');
    parsed = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
  } else if (/^\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}(:\d{2})?$/.test(candidate)) {
    const [datePart, timePart] = candidate.split(' ');
    const [day, month, year] = datePart.split('-');
    const time = timePart || '00:00:00';
    const [hour, minute, second = '00'] = time.split(':');
    parsed = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
  } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(candidate)) {
    candidate = candidate.replace('T', ' ');
    parsed = new Date(candidate);
  } else {
    parsed = new Date(candidate);
  }

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('fecha inválida');
  }

  const year = String(parsed.getFullYear());
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  const hour = String(parsed.getHours()).padStart(2, '0');
  const minute = String(parsed.getMinutes()).padStart(2, '0');
  const second = String(parsed.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const getNextSequentialId = () => {
  if (!globalThis.__transactionSequence) {
    globalThis.__transactionSequence = 1;
  }

  const current = globalThis.__transactionSequence;
  globalThis.__transactionSequence += 1;
  return String(current).padStart(4, '0');
};

export const normalizeTransactionRecord = (record) => {
  const source = detectSource(record);

  if (source === 'unknown') {
    return {
      ok: false,
      reason: 'estructura no reconocida',
    };
  }

  const rawId = getValueByAliases(record, ['id', 'transaction_id', 'ref']);
  const rawAmount = getValueByAliases(record, ['amount', 'total']);
  const rawCurrency = getValueByAliases(record, ['currency', 'currency_code']);
  const rawTimestamp = getValueByAliases(record, ['timestamp', 'created_at', 'date']);
  const rawStatus = getValueByAliases(record, ['status', 'state', 'result']);

  if ([rawId, rawAmount, rawCurrency, rawTimestamp, rawStatus].some((value) => value === undefined || value === null || value === '')) {
    return {
      ok: false,
      reason: 'campo obligatorio faltante',
    };
  }

  try {
    const amount = cleanAmountString(rawAmount);
    const currency = normalizeCurrency(rawCurrency, String(rawAmount));
    const timestamp = normalizeTimestamp(rawTimestamp);
    const status = normalizeStatus(rawStatus);

    return {
      ok: true,
      transaction: {
        id: getNextSequentialId(),
        id_fuente: normalizeText(rawId),
        amount,
        currency,
        timestamp,
        status,
      },
    };
  } catch (error) {
    return {
      ok: false,
      reason: error.message,
    };
  }
};

const extractRecords = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.transactions)) return payload.transactions;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && typeof payload === 'object') return [payload];
  return [];
};

export const processTransactionFiles = async (files) => {
  globalThis.__transactionSequence = 1;

  const validTransactions = [];
  const invalidTransactions = [];
  let totalRead = 0;

  for (const file of files) {
    const text = await file.text();
    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      invalidTransactions.push({
        origin: file.name,
        motivo: 'JSON malformado o estructura no reconocida',
      });
      continue;
    }

    const records = extractRecords(parsed);

    if (!records.length) {
      invalidTransactions.push({
        origin: file.name,
        motivo: 'Archivo sin registros',
      });
      continue;
    }

    for (const record of records) {
      totalRead += 1;

      if (!record || typeof record !== 'object' || Array.isArray(record)) {
        invalidTransactions.push({
          origin: file.name,
          motivo: 'estructura no reconocida',
          raw: record,
        });
        continue;
      }

      const result = normalizeTransactionRecord(record);
      if (result.ok) {
        validTransactions.push(result.transaction);
      } else {
        invalidTransactions.push({
          origin: file.name,
          motivo: result.reason,
          raw: record,
        });
      }
    }
  }

  const totalValid = validTransactions.length;
  const totalInvalid = invalidTransactions.length;

  return {
    validTransactions,
    invalidTransactions,
    metrics: {
      totalRead,
      valid: totalValid,
      invalid: totalInvalid,
      total: totalRead,
      percentageValid: totalRead ? (totalValid / totalRead) * 100 : 0,
      percentageInvalid: totalRead ? (totalInvalid / totalRead) * 100 : 0,
    },
  };
};

export const loadExampleBatch = async () => {
  const paths = [
    '/transacciones-validas-1.json',
    '/transacciones-validas-2.json',
    '/transacciones-invalidas.json',
  ];

  const files = await Promise.all(
    paths.map(async (path) => {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`No se pudo cargar ${path}`);
      }
      const blob = await response.blob();
      return new File([blob], path.replace('/', 'sample-'), { type: 'application/json' });
    }),
  );

  return processTransactionFiles(files);
};
