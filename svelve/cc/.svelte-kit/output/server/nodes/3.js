import * as server from '../entries/pages/product/_id_/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/product/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/product/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.CVWQVYls.js","_app/immutable/chunks/D6JVuOWV.js","_app/immutable/chunks/jznUQfAd.js","_app/immutable/chunks/CEH0wINy.js","_app/immutable/chunks/DbItlYgE.js","_app/immutable/chunks/CRLMKAi_.js","_app/immutable/chunks/BLwUsVw6.js","_app/immutable/chunks/CKTHLUtX.js","_app/immutable/chunks/Dp1pzeXC.js"];
export const stylesheets = ["_app/immutable/assets/3.BUvj8sgx.css"];
export const fonts = [];
