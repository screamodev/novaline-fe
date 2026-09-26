import { resolveI18nDomain } from "nuxtseo-shared/i18n-runtime";
import { parseURL } from "ufo";
import { createPathFilter, resolveI18nRouteEntries, resolveI18nSitemapLocaleKey, splitForLocales } from "../../../utils-pure.js";
import { preNormalizeEntry } from "../urlset/normalise.js";
function isGeneratedAlternative(alternative) {
  return alternative._i18nGenerated !== void 0 && alternative._i18nGenerated === JSON.stringify([alternative.hreflang, alternative.href.toString()]);
}
export function resolveSitemapEntries(sitemap, urls, runtimeConfig, resolvers, baseURL) {
  const {
    autoI18n: configuredI18n,
    isI18nMapped
  } = runtimeConfig;
  const requestHost = configuredI18n?.multiDomainLocales && resolvers ? parseURL(resolvers.canonicalUrlResolver("/")).host : void 0;
  const domain = configuredI18n?.multiDomainLocales ? resolveI18nDomain(requestHost, configuredI18n) : void 0;
  const autoI18n = configuredI18n && domain ? { ...configuredI18n, defaultLocale: domain.defaultLocale } : configuredI18n;
  const availableLocales = domain?.locales || autoI18n?.locales;
  const hasFilters = !!sitemap.include?.length || !!sitemap.exclude?.length;
  const filterPath = hasFilters ? createPathFilter({
    include: sitemap.include,
    exclude: sitemap.exclude
  }, baseURL || "/") : void 0;
  const domainLocaleCodes = autoI18n?.multiDomainLocales && autoI18n.strategy !== "no_prefix" ? new Set(autoI18n.locales.map((l) => l.code)) : void 0;
  const domainLocaleKeys = autoI18n?.multiDomainLocales ? autoI18n.locales.map((l) => l._sitemap) : [];
  const _urls = [];
  const unavailableEntries = /* @__PURE__ */ new Set();
  for (const _e of urls) {
    const e = preNormalizeEntry(_e, resolvers);
    if (autoI18n && domainLocaleCodes && !e._abs && !e._i18nTransform && !e._i18nUnlocalized) {
      const prefix = splitForLocales(e._path?.pathname || "/", domainLocaleCodes)[0];
      const localeCode = prefix || autoI18n.defaultLocale;
      const sitemapLocale = isI18nMapped && typeof e._sitemap === "string" ? resolveI18nSitemapLocaleKey(e._sitemap, domainLocaleKeys) : null;
      const locale = autoI18n.locales.find((l) => l.code === localeCode);
      if (locale && availableLocales && !availableLocales.includes(locale))
        continue;
      if (autoI18n.strategy === "prefix_except_default" && prefix === autoI18n.defaultLocale)
        continue;
      if (sitemapLocale && sitemapLocale !== locale?._sitemap)
        continue;
      if (e.alternatives?.some(isGeneratedAlternative)) {
        const alternatives = e.alternatives.filter((alternative) => {
          if (!isGeneratedAlternative(alternative))
            return true;
          if (alternative.hreflang === "x-default")
            return false;
          const alternateLocale = autoI18n.locales.find((l) => l._hreflang === alternative.hreflang);
          if (!alternateLocale)
            return true;
          if (availableLocales && !availableLocales.includes(alternateLocale))
            return false;
          const alternatePrefix = splitForLocales(parseURL(alternative.href.toString()).pathname || "/", domainLocaleCodes)[0];
          if (["prefix_except_default", "prefix_and_default"].includes(autoI18n.strategy) && alternatePrefix === autoI18n.defaultLocale)
            return false;
          return (alternatePrefix || autoI18n.defaultLocale) === alternateLocale.code;
        });
        const defaultHreflang = autoI18n.locales.find((l) => l.code === autoI18n.defaultLocale)?._hreflang;
        const defaultAlternative = alternatives.find((a) => a.hreflang === defaultHreflang);
        e.alternatives = defaultAlternative && !alternatives.some((alternative) => alternative.hreflang === "x-default") ? [...alternatives, { ...defaultAlternative, hreflang: "x-default" }] : alternatives;
      }
    }
    const needsExpansion = e._i18nTransform && autoI18n && autoI18n.strategy !== "no_prefix";
    if (e.loc && (needsExpansion || !filterPath || filterPath(e.loc, e._path?.pathname)))
      _urls.push(e);
  }
  const withoutPrefixPaths = {};
  if (autoI18n && autoI18n.strategy !== "no_prefix") {
    const localeCodes = new Set(autoI18n.locales.map((l) => l.code));
    const localeByCode = new Map(autoI18n.locales.map((l) => [l.code, l]));
    const defaultLocale = autoI18n.defaultLocale;
    const hasDifferentDomains = !!autoI18n.differentDomains;
    const validI18nUrlsForTransform = [];
    for (let i = 0; i < _urls.length; i++) {
      const _e = _urls[i];
      if (_e._abs && !_e._i18nTransform)
        continue;
      const split = _e._i18nUnlocalized ? [null, _e._relativeLoc] : splitForLocales(_e._relativeLoc, localeCodes);
      let localeCode = split[0];
      const pathWithoutPrefix = split[1];
      if (!localeCode)
        localeCode = defaultLocale;
      const e = _e;
      e._pathWithoutPrefix = pathWithoutPrefix;
      const locale = localeByCode.get(localeCode);
      if (!locale)
        continue;
      e._locale = locale;
      e._index = i;
      e._key = `${e._sitemap || ""}${e._path?.pathname || "/"}${e._path?.search || ""}`;
      withoutPrefixPaths[pathWithoutPrefix] = withoutPrefixPaths[pathWithoutPrefix] || [];
      if (!e._i18nTransform && !e._i18nUnlocalized && !withoutPrefixPaths[pathWithoutPrefix].some((e2) => e2._locale.code === locale.code))
        withoutPrefixPaths[pathWithoutPrefix].push(e);
      validI18nUrlsForTransform.push(e);
    }
    for (const e of validI18nUrlsForTransform) {
      if (!e._i18nTransform && !e.alternatives?.length) {
        const alternatives = [];
        for (const u of e._i18nUnlocalized ? [e] : withoutPrefixPaths[e._pathWithoutPrefix] || []) {
          if (autoI18n.multiDomainLocales && availableLocales && !availableLocales.includes(u._locale))
            continue;
          if (u._locale.code === defaultLocale) {
            alternatives.push({
              href: u.loc,
              hreflang: "x-default"
            });
          }
          alternatives.push({
            href: u.loc,
            hreflang: u._locale._hreflang || defaultLocale
          });
        }
        if (alternatives.length)
          e.alternatives = alternatives;
      } else if (e._i18nTransform) {
        delete e._i18nTransform;
        const routeEntries = resolveI18nRouteEntries(e._relativeLoc, autoI18n, (href) => !filterPath || filterPath(href), autoI18n.multiDomainLocales ? { host: requestHost || "", domainMode: "request" } : {});
        if (autoI18n.multiDomainLocales) {
          if (!routeEntries.length) {
            unavailableEntries.add(e);
            continue;
          }
          if (autoI18n.strategy === "prefix_and_default") {
            const defaultEntry = routeEntries.find((entry) => entry.locale.code === defaultLocale);
            if (defaultEntry) {
              routeEntries.push({ ...defaultEntry, loc: `/${defaultLocale}${defaultEntry.loc === "/" ? "" : defaultEntry.loc}` });
            }
          }
        }
        if (hasDifferentDomains) {
          e.alternatives = routeEntries[0]?.alternatives;
        } else {
          const sourceLocaleAvailable = routeEntries.some((entry) => entry.locale.code === e._locale.code);
          for (const { alternatives, locale: l, loc } of routeEntries) {
            const _sitemap = isI18nMapped ? l._sitemap : void 0;
            const { _index: _, ...rest } = e;
            const newEntry = preNormalizeEntry({
              _sitemap,
              ...rest,
              _key: `${_sitemap || ""}${loc || "/"}`,
              _locale: l,
              loc,
              alternatives
            }, resolvers);
            if (e._index !== void 0 && (e._locale.code === newEntry._locale.code || !sourceLocaleAvailable)) {
              _urls[e._index] = newEntry;
              e._index = void 0;
            } else {
              _urls.push(newEntry);
            }
          }
        }
      }
      if (isI18nMapped) {
        e._sitemap = e._sitemap || e._locale._sitemap;
        e._key = `${e._sitemap || ""}${e.loc || "/"}${e._path?.search || ""}`;
      }
      if (e._index)
        _urls[e._index] = e;
    }
  }
  return _urls.filter((entry) => !unavailableEntries.has(entry) && (!filterPath || filterPath(entry.loc, entry._path?.pathname)));
}
