export const handlerError = (e: any) => {
  if (e instanceof Error && e.message) return e.message;
  return "неизвестная ошибка";
};
