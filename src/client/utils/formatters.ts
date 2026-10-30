export const formatLKR = (amount: number): string => {
  return new Intl.NumberFormat('si-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
    .format(amount)
    .replace('LKR', 'රු.');
};

export const formatQty = (qty: number, unit: string): string => {
  if (unit === 'KG') {
    return `${qty.toFixed(3)} kg`;
  }
  if (unit === 'G') {
    return `${qty.toFixed(0)} g`;
  }
  return `${qty.toFixed(qty % 1 === 0 ? 0 : 2)} ${unit.toLowerCase()}`;
};

