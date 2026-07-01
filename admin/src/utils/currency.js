export function formatCurrency(amount, currency = 'CAD') {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
  }).format(value);
}
