export function formatDate(value: string) {
  return value.slice(0, 10).replaceAll('-', '.');
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : '요청을 처리하지 못했어요.';
}
