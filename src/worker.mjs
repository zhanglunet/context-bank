const ORIGIN = 'https://zhanglunet.github.io';
const PREFIX = '/context-bank';
export default {
  async fetch(request) {
    if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed', {status:405,headers:{Allow:'GET, HEAD'}});
    const url = new URL(request.url);
    const upstream = new URL(ORIGIN);
    upstream.pathname = PREFIX + url.pathname;
    upstream.search = url.search;
    let response;
    try { response = await fetch(upstream, {method:request.method, redirect:'manual', headers:{Accept:request.headers.get('Accept') || '*/*'}, cf:{cacheTtl:0}}); }
    catch { return new Response('网站源站暂不可用，请稍后重试。', {status:502,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}}); }
    const headers = new Headers(response.headers);
    const location = headers.get('Location');
    if (location) {
      const target = new URL(location, upstream);
      if (target.origin === ORIGIN && (target.pathname === PREFIX || target.pathname.startsWith(PREFIX+'/'))) {
        target.host = url.host;target.protocol=url.protocol;target.pathname=target.pathname.slice(PREFIX.length)||'/';headers.set('Location',target.href);
      }
    }
    headers.set('Cache-Control','public, max-age=0, must-revalidate');
    headers.set('X-Content-Type-Options','nosniff');
    headers.set('Referrer-Policy','strict-origin-when-cross-origin');
    headers.set('X-Frame-Options','DENY');
    headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
    headers.delete('Set-Cookie');
    return new Response(request.method==='HEAD'?null:response.body,{status:response.status,headers});
  }
};
