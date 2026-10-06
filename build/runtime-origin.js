const CSP_HEADER = 'Content-Security-Policy';

function isPrivateHostname(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (
    host === 'localhost'
    || host.endsWith('.localhost')
    || host.endsWith('.local')
    || host.endsWith('.internal')
    || host.endsWith('.invalid')
    || host.endsWith('.test')
    || host.endsWith('.example')
    || (!host.includes('.') && !host.includes(':'))
  ) {
    return true;
  }

  const octets = host.split('.').map(Number);
  if (
    octets.length === 4
    && octets.every((part) => Number.isInteger(part) && part >= 0 && part <= 255)
  ) {
    const [first, second] = octets;
    return (
      first === 0
      || first === 10
      || first === 127
      || (first === 100 && second >= 64 && second <= 127)
      || (first === 169 && second === 254)
      || (first === 172 && second >= 16 && second <= 31)
      || (first === 192 && second === 168)
      || first >= 224
    );
  }

  return host.includes(':') && (
    host === '::'
    || host === '::1'
    || host.startsWith('fc')
    || host.startsWith('fd')
    || host.startsWith('fe8')
    || host.startsWith('fe9')
    || host.startsWith('fea')
    || host.startsWith('feb')
  );
}

export function requireProductionRuntime(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    throw new Error('VITE_API_BASE is required for production builds');
  }

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error('VITE_API_BASE must be an absolute HTTPS URL');
  }
  if (parsed.protocol !== 'https:') {
    throw new Error('VITE_API_BASE must use HTTPS for production builds');
  }
  if (isPrivateHostname(parsed.hostname)) {
    throw new Error('VITE_API_BASE must use a public gateway hostname');
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error('VITE_API_BASE must not contain credentials, a query, or a fragment');
  }

  const pathname = parsed.pathname.replace(/\/+$/, '');
  return {
    baseUrl: `${parsed.origin}${pathname === '/' ? '' : pathname}`,
    origin: parsed.origin
  };
}

export function injectConnectSource(config, runtimeOrigin) {
  const copied = structuredClone(config);
  const policy = copied?.globalHeaders?.[CSP_HEADER];
  if (typeof policy !== 'string') {
    throw new Error(`Azure Static Web Apps config is missing ${CSP_HEADER}`);
  }

  const directives = policy
    .split(';')
    .map((directive) => directive.trim())
    .filter(Boolean);
  const index = directives.findIndex((directive) => (
    directive === 'connect-src' || directive.startsWith('connect-src ')
  ));
  if (index < 0) {
    throw new Error('Azure Static Web Apps CSP is missing connect-src');
  }

  const sources = directives[index].split(/\s+/);
  if (!sources.includes(runtimeOrigin)) sources.push(runtimeOrigin);
  directives[index] = sources.join(' ');
  copied.globalHeaders[CSP_HEADER] = `${directives.join('; ')};`;
  return copied;
}
