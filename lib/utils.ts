//Calculate electric fee
export const calculateTierFee = (usage: number, tiers : {limit: number, price: number}[]) => {
  let remainingUsage = usage;
  let total = 0;
  let previousLimit = 0;
  for (let i = 0; i < tiers.length; i++) {
    const { limit, price } = tiers[i];
    const isLastTier = i === tiers.length - 1;
    const tierUsage = isLastTier
      ? remainingUsage
      : Math.min(remainingUsage, limit - previousLimit);
    if (tierUsage <= 0) break;
    total += tierUsage * price;
    remainingUsage -= tierUsage;
    previousLimit = limit;
  }
  return total;
};
//Check tier validity
export const isTierAscending = (tiers: { limit: number; price: number }[]) => {
  for (let i = 1; i < tiers.length - 1; i++) {
    if (tiers[i].limit <= tiers[i - 1].limit) {
      return false;
    }
  }
  return true;
};