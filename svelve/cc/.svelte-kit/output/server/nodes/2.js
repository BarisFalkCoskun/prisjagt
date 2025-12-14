import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.unOvCDLL.js","_app/immutable/chunks/D6JVuOWV.js","_app/immutable/chunks/jznUQfAd.js","_app/immutable/chunks/CEH0wINy.js","_app/immutable/chunks/DbItlYgE.js","_app/immutable/chunks/CRLMKAi_.js","_app/immutable/chunks/BLwUsVw6.js","_app/immutable/chunks/CKTHLUtX.js","_app/immutable/chunks/Dtq01MJd.js","_app/immutable/chunks/CrWOoOuV.js"];
export const stylesheets = ["_app/immutable/assets/2.ByMObGxi.css"];
export const fonts = [];
