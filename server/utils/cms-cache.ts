/** CMS reads are cached for 60 s with stale-while-revalidate and purged by the Strapi webhook (/api/revalidate). */
export function cachedCms<A extends unknown[], T>(name: string, fn: (...args: A) => Promise<T>) {
  return defineCachedFunction(fn, {
    group: 'cms',
    name,
    maxAge: 60,
    swr: true,
    getKey: (...args: A) => args.map(String).join(':') || 'default',
  })
}
