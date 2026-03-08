import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.C6FisRYm.js","_app/immutable/chunks/BA2mS0jv.js","_app/immutable/chunks/B-Dm36DL.js","_app/immutable/chunks/I0MiNX4F.js","_app/immutable/chunks/DY2Q3msz.js","_app/immutable/chunks/B3dssT05.js","_app/immutable/chunks/CbSktHAd.js","_app/immutable/chunks/DjeIREH4.js","_app/immutable/chunks/6dyq798-.js","_app/immutable/chunks/B-9fefoS.js"];
export const stylesheets = ["_app/immutable/assets/2.ByMObGxi.css"];
export const fonts = [];
