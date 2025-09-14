export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Try to fetch the asset from the static files
    try {
      // Remove trailing slashes
      let pathname = url.pathname;
      if (pathname.endsWith('/') && pathname !== '/') {
        pathname = pathname.slice(0, -1);
      }
      
      // Try exact path first
      let response = await env.ASSETS.fetch(request);
      
      // If that fails and it's not a file with an extension, try index.html
      if (response.status === 404 && !pathname.includes('.')) {
        const indexRequest = new Request(new URL('/index.html', url.origin));
        response = await env.ASSETS.fetch(indexRequest);
      }
      
      return response;
    } catch (e) {
      // Fall back to index.html for everything else
      const indexRequest = new Request(new URL('/index.html', url.origin));
      return env.ASSETS.fetch(indexRequest);
    }
  }
};
