/**
 * 獲取公共資源的完整路徑
 * 考慮 Vite 的 base URL 配置
 */
export function getPublicPath(filename) {
  const baseUrl = import.meta.env.BASE_URL;
  return `${baseUrl}${filename}`;
}
