import { objKeys } from './mappings';

export const buildQueryString = <T extends object>(model: T) => {
  const joined = objKeys(model)
    .map(key => {
      const data = model[key] as Array<unknown> | object | string;
      if (data == null || typeof data === 'undefined' || (typeof data === 'string' && data === '')) return null;

      let value: string = '';
      if (Array.isArray(data)) {
        value = data.length > 1 ? data.join(`&${String(key)}=`) : data[0];
      } else if (typeof data === 'object') {
        value = JSON.stringify(data);
      } else {
        value = encodeURIComponent(data as unknown as string);
      }

      return `${String(key)}=${String(value)}`;
    })
    .filter(Boolean)
    .join('&');
  return joined.length > 0 ? '?' + joined : '';
};
