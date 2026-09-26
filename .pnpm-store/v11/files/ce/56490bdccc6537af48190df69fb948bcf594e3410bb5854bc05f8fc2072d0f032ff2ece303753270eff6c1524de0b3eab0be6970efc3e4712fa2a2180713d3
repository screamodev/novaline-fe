import { parseURL } from 'ufo';

function isUnlocalizedLocalePage(page) {
  return page._tag === "unlocalized" && typeof page.path === "string";
}
function matchesUnlocalizedLocalePage(page, path) {
  if (matchPagePattern(page.path, path))
    return true;
  if (!page.subtree)
    return false;
  const subtreePattern = `${page.path === "/" ? "" : page.path.replace(/\/$/, "")}/[...__nuxtSeoSubtree]`;
  return !!matchPagePattern(subtreePattern, path);
}
function normalizeHost(value) {
  const input = value.trim();
  return parseURL(input.startsWith("//") ? `https:${input}` : input.includes("://") ? input : `https://${input}`).host?.toLowerCase() || "";
}
function localeDomains(locale) {
  return [...locale.domains || [], ...locale.domain ? [locale.domain] : []];
}
function resolveI18nDomain(host, i18n) {
  const normalizedHost = host ? normalizeHost(host) : "";
  const domains = i18n.locales.map((locale) => ({
    locale,
    hosts: localeDomains(locale).map(normalizeHost),
    defaults: locale.defaultForDomains?.map(normalizeHost) || []
  }));
  const matches = normalizedHost ? domains.filter((entry) => entry.hosts.includes(normalizedHost) || entry.defaults.includes(normalizedHost)) : [];
  if (!matches.length)
    return { _tag: "unknown", defaultLocale: i18n.defaultLocale, locales: i18n.locales };
  const defaultLocale = matches.find((entry) => entry.defaults.includes(normalizedHost))?.locale || (matches.length === 1 ? matches[0].locale : void 0);
  return {
    _tag: "known",
    defaultLocale: defaultLocale?.code || i18n.defaultLocale,
    locales: domains.filter((entry) => !entry.hosts.length || entry.hosts.includes(normalizedHost)).map((entry) => entry.locale)
  };
}
function firstLocaleDomain(locale) {
  return locale?.defaultForDomains?.[0] || locale?.domain || locale?.domains?.[0];
}
function resolveCanonicalLocaleDomain(locale, defaultLocale) {
  return firstLocaleDomain(locale) || firstLocaleDomain(defaultLocale);
}
function splitRouteSuffix(route) {
  const suffixIndex = route.search(/[?#]/);
  const rawPathname = suffixIndex === -1 ? route : route.slice(0, suffixIndex);
  return {
    pathname: rawPathname ? rawPathname.startsWith("/") ? rawPathname : `/${rawPathname}` : "/",
    suffix: suffixIndex === -1 ? "" : route.slice(suffixIndex)
  };
}
function resolveLocaleFromRoute(route, i18n, context = {}) {
  const { pathname, suffix } = splitRouteSuffix(route);
  if (i18n.strategy !== "no_prefix") {
    const segments = pathname.split("/").filter(Boolean);
    const first = segments[0];
    const matched = first ? i18n.locales.find((l) => l.code === first) : void 0;
    if (matched) {
      const rest = segments.slice(1).join("/");
      const trailingSlash = rest && pathname.endsWith("/") ? "/" : "";
      return { locale: matched.code, basePath: `${rest ? `/${rest}${trailingSlash}` : "/"}${suffix}` };
    }
  }
  const contextLocale = context.locale ? i18n.locales.find((locale) => locale.code === context.locale) : void 0;
  const domain = resolveI18nDomain(context.host, i18n);
  const hostLocales = domain._tag === "known" ? domain.locales.filter((locale) => [...localeDomains(locale), ...locale.defaultForDomains || []].some((host) => normalizeHost(host) === normalizeHost(context.host))) : [];
  const hostLocale = hostLocales.find((locale) => locale.code === domain.defaultLocale) || hostLocales[0];
  return { locale: contextLocale?.code || hostLocale?.code || domain.defaultLocale, basePath: `${pathname}${suffix}` };
}
function localePath(basePath, locale, i18n, context = {}) {
  const { pathname, suffix } = splitRouteSuffix(basePath);
  if (i18n.strategy === "no_prefix")
    return `${pathname}${suffix}`;
  const domain = resolveI18nDomain(context.host, i18n);
  const isDefault = locale === domain.defaultLocale;
  const isDomainDefault = i18n.differentDomains || domain._tag === "known" && isDefault;
  if (i18n.strategy === "prefix_except_default" && (isDefault || i18n.differentDomains))
    return `${pathname}${suffix}`;
  if (i18n.strategy === "prefix_and_default" && isDomainDefault)
    return `${pathname}${suffix}`;
  if (pathname === "/")
    return `/${locale}${suffix}`;
  return `/${locale}${pathname}${suffix}`;
}
function toSegments(path) {
  return path.split("/").filter(Boolean);
}
const PAGE_PARAM_PATTERN = /\[\[(\.\.\.)?([^[\]]+)\]\]|\[(\.\.\.)?([^[\]]+)\]|:(\w+)(?:\((\.\*)?\))?([?*+]?)/g;
function parsePageSegment(segment) {
  const tokens = [];
  let offset = 0;
  for (const match of segment.matchAll(PAGE_PARAM_PATTERN)) {
    const index = match.index;
    if (index > offset)
      tokens.push({ _tag: "static", value: segment.slice(offset, index) });
    if (match[2]) {
      tokens.push({ _tag: "param", param: { name: match[2], catchAll: !!match[1], optional: true } });
    } else if (match[4]) {
      tokens.push({ _tag: "param", param: { name: match[4], catchAll: !!match[3], optional: false } });
    } else {
      const modifier = match[7];
      const routePattern = match[6];
      tokens.push({
        _tag: "param",
        param: {
          name: match[5],
          catchAll: !!routePattern?.includes(".*") || modifier === "*" || modifier === "+",
          optional: modifier === "?" || modifier === "*"
        }
      });
    }
    offset = index + match[0].length;
  }
  if (offset < segment.length)
    tokens.push({ _tag: "static", value: segment.slice(offset) });
  return tokens.length ? tokens : [{ _tag: "static", value: segment }];
}
function wholeSegmentParam(tokens) {
  return tokens.length === 1 && tokens[0]?._tag === "param" ? tokens[0].param : null;
}
function segmentRanks(pattern) {
  return toSegments(pattern).map((segment) => {
    const tokens = parsePageSegment(segment);
    const params = tokens.filter((token) => token._tag === "param");
    if (!params.length)
      return 6;
    const hasStatic = tokens.some((token) => token._tag === "static");
    if (hasStatic)
      return params.some((token) => token.param.optional) ? 3 : 4;
    const param = params[0].param;
    if (param.catchAll)
      return param.optional ? -1 : 0;
    return param.optional ? 1 : 2;
  });
}
function compareSpecificity(a, b) {
  const length = Math.min(a.length, b.length);
  for (let i = 0; i < length; i++) {
    const diff = b[i] - a[i];
    if (diff !== 0)
      return diff;
  }
  return a.length - b.length;
}
function matchSegmentTokens(tokens, path) {
  const failedStates = /* @__PURE__ */ new Set();
  function visit(index, offset, params) {
    const state = index * (path.length + 1) + offset;
    if (failedStates.has(state))
      return null;
    if (index === tokens.length) {
      if (offset === path.length)
        return params;
      failedStates.add(state);
      return null;
    }
    const token = tokens[index];
    if (token._tag === "static") {
      const matched = path.startsWith(token.value, offset) ? visit(index + 1, offset + token.value.length, params) : null;
      if (!matched)
        failedStates.add(state);
      return matched;
    }
    const minimumEnd = token.param.optional ? offset : offset + 1;
    for (let end = minimumEnd; end <= path.length; end++) {
      const value = path.slice(offset, end);
      const nextParams = value ? { ...params, [token.param.name]: value } : params;
      const matched = visit(index + 1, end, nextParams);
      if (matched)
        return matched;
    }
    failedStates.add(state);
    return null;
  }
  return visit(0, 0, {});
}
function matchPagePattern(pattern, path) {
  const patternSegments = toSegments(pattern);
  const pathSegments = toSegments(path);
  const failedStates = /* @__PURE__ */ new Set();
  function visit(patternIndex, pathIndex, params) {
    const state = patternIndex * (pathSegments.length + 1) + pathIndex;
    if (failedStates.has(state))
      return null;
    if (patternIndex === patternSegments.length) {
      if (pathIndex === pathSegments.length)
        return params;
      failedStates.add(state);
      return null;
    }
    const tokens = parsePageSegment(patternSegments[patternIndex]);
    const param = wholeSegmentParam(tokens);
    if (param?.catchAll) {
      const minimumEnd = param.optional ? pathIndex : pathIndex + 1;
      for (let end = pathSegments.length; end >= minimumEnd; end--) {
        const value = pathSegments.slice(pathIndex, end).join("/");
        const nextParams = value ? { ...params, [param.name]: value } : params;
        const matched2 = visit(patternIndex + 1, end, nextParams);
        if (matched2)
          return matched2;
      }
      failedStates.add(state);
      return null;
    }
    const segment = pathSegments[pathIndex];
    if (segment !== void 0) {
      const segmentParams = matchSegmentTokens(tokens, segment);
      if (segmentParams) {
        const matched2 = visit(patternIndex + 1, pathIndex + 1, { ...params, ...segmentParams });
        if (matched2)
          return matched2;
      }
    }
    const matched = param?.optional ? visit(patternIndex + 1, pathIndex, params) : null;
    if (!matched)
      failedStates.add(state);
    return matched;
  }
  return visit(0, 0, {});
}
function fillPagePattern(pattern, params) {
  const filled = [];
  for (const segment of toSegments(pattern)) {
    const tokens = parsePageSegment(segment);
    let value = "";
    for (const token of tokens) {
      if (token._tag === "static") {
        value += token.value;
        continue;
      }
      const paramValue = params[token.param.name];
      if (paramValue === void 0) {
        if (token.param.optional)
          continue;
        return null;
      }
      value += paramValue;
    }
    if (value)
      filled.push(value);
  }
  if (!filled.length)
    return "/";
  return `/${filled.join("/")}${pattern.endsWith("/") ? "/" : ""}`;
}
function alternatesForEntry(localePaths, params, i18n, context) {
  const untranslated = localePaths[i18n.defaultLocale];
  const alternates = [];
  const defaultLocale = i18n.locales.find((locale) => locale.code === i18n.defaultLocale);
  const locales = context.domainMode === "request" ? resolveI18nDomain(context.host, i18n).locales : i18n.locales;
  for (const l of locales) {
    const pattern = localePaths[l.code] ?? untranslated;
    if (localePaths[l.code] === false)
      continue;
    if (typeof pattern !== "string")
      continue;
    const path = fillPagePattern(pattern, params);
    if (path === null)
      continue;
    const domain = context.domainMode === "request" ? void 0 : resolveCanonicalLocaleDomain(l, defaultLocale);
    alternates.push({
      code: l.code,
      hreflang: l.hreflang || l.code,
      path: localePath(path, l.code, i18n, { host: domain || context.host }),
      ...domain ? { domain } : {}
    });
  }
  return alternates;
}
function alternatesFromPages(basePath, routePath, locale, i18n, context) {
  const pages = i18n.pages;
  const hasDomainLocales = i18n.differentDomains || i18n.multiDomainLocales;
  const hasContextLocale = !!context.locale && i18n.locales.some((locale2) => locale2.code === context.locale);
  if (!pages)
    return null;
  const allowLocalized = i18n.strategy !== "no_prefix" || hasDomainLocales || hasContextLocale;
  const matches = [];
  for (const page of Object.values(pages)) {
    if (!page)
      continue;
    if (isUnlocalizedLocalePage(page)) {
      if (matchesUnlocalizedLocalePage(page, routePath))
        matches.push({ _tag: "unlocalized", ranks: segmentRanks(page.path) });
      continue;
    }
    if (!allowLocalized)
      continue;
    const pattern = page[locale];
    if (!pattern)
      continue;
    const params = matchPagePattern(pattern, basePath);
    if (params)
      matches.push({ _tag: "localized", ranks: segmentRanks(pattern), localePaths: page, params });
  }
  matches.sort((a, b) => compareSpecificity(a.ranks, b.ranks));
  for (const match of matches) {
    if (match._tag === "unlocalized") {
      const defaultCode = context.domainMode === "request" ? resolveI18nDomain(context.host, i18n).defaultLocale : i18n.defaultLocale;
      const defaultLocale = i18n.locales.find((locale2) => locale2.code === defaultCode);
      if (defaultLocale) {
        const domain = context.domainMode === "request" ? void 0 : resolveCanonicalLocaleDomain(defaultLocale);
        return [{
          code: defaultLocale.code,
          hreflang: defaultLocale.hreflang || defaultLocale.code,
          path: routePath,
          ...domain ? { domain } : {}
        }];
      }
      continue;
    }
    return alternatesForEntry(match.localePaths, match.params, i18n, context);
  }
  return null;
}
function resolveLocaleAlternates(route, i18n, context = {}) {
  const { locale, basePath } = resolveLocaleFromRoute(route, i18n, context);
  const { pathname, suffix } = splitRouteSuffix(basePath);
  const { pathname: routePathname } = splitRouteSuffix(route);
  const translated = alternatesFromPages(pathname, routePathname, locale, i18n, context);
  if (translated) {
    return {
      _tag: "pages",
      alternates: translated.map((alternate) => ({ ...alternate, path: `${alternate.path}${suffix}` }))
    };
  }
  const defaultLocale = i18n.locales.find((locale2) => locale2.code === i18n.defaultLocale);
  return {
    _tag: "strategy",
    alternates: (context.domainMode === "request" ? resolveI18nDomain(context.host, i18n).locales : i18n.locales).map((l) => {
      const domain = context.domainMode === "request" ? void 0 : resolveCanonicalLocaleDomain(l, defaultLocale);
      return {
        code: l.code,
        hreflang: l.hreflang || l.code,
        path: localePath(basePath, l.code, i18n, { host: domain || context.host }),
        ...domain ? { domain } : {}
      };
    })
  };
}
function computeLocaleAlternates(route, i18n, context = {}) {
  return resolveLocaleAlternates(route, i18n, context).alternates;
}

export { computeLocaleAlternates, localePath, resolveCanonicalLocaleDomain, resolveI18nDomain, resolveLocaleAlternates, resolveLocaleFromRoute };
