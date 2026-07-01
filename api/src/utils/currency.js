export function parsePrice(value, { required = true } = {}) {
  if (value === undefined || value === null || value === '') {
    if (required) {
      throw new Error('Price is required');
    }
    return 0;
  }

  const price = Number(value);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error('Price must be a non-negative number');
  }

  return Math.round(price * 100) / 100;
}

export function formatCurrency(amount, currency = 'CAD') {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
  }).format(value);
}
