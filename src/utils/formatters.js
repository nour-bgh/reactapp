export function formatPrice(value, { unit = 'mois' } = {}) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return 'Prix sur demande';
  }

  const formatted = new Intl.NumberFormat('fr-TN', {
    maximumFractionDigits: 0,
  }).format(amount);

  return unit === 'mois' ? `${formatted} DT/mois` : `${formatted} DT`;
}
