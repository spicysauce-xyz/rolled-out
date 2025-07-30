export const filterExpiredInvitations = <T extends { expiresAt: Date }>(
  items: T[]
) => {
  return items.filter((item) => {
    return item.expiresAt > new Date();
  });
};
