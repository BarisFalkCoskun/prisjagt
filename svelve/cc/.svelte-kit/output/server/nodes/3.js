import * as server from '../entries/pages/product/_id_/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/product/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/product/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.NN4ivM2Z.js","_app/immutable/chunks/BA2mS0jv.js","_app/immutable/chunks/B-Dm36DL.js","_app/immutable/chunks/I0MiNX4F.js","_app/immutable/chunks/DY2Q3msz.js","_app/immutable/chunks/B3dssT05.js","_app/immutable/chunks/CbSktHAd.js","_app/immutable/chunks/DjeIREH4.js","_app/immutable/chunks/Dp1pzeXC.js"];
export const stylesheets = ["_app/immutable/assets/3.BUvj8sgx.css"];
export const fonts = [];
