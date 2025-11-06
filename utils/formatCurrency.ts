
export const formatVND = (amount: number | string | undefined | null): string => {
  if (amount === undefined || amount === null) {
    return '0 ₫';
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) {
    return '0 ₫';
  }

  const formatted = numAmount.toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `${formatted} ₫`;
};

