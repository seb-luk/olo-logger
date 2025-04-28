export const DefaultJsonLogFilter = (obj: any) => {
  const context = JSON.parse(JSON.stringify(obj));

  return {
    request: typeof context.request === 'object' ? context.request : {},
    response: typeof context.response === 'object' ? context.response : {},
  };
};
