export const tryCatch = async <T>(promise: Promise<T>) => {
  try {
    const data = await promise;

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
};
