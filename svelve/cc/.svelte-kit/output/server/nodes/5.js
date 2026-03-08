

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/stores/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.DMn-0ke4.js","_app/immutable/chunks/BA2mS0jv.js","_app/immutable/chunks/B-Dm36DL.js","_app/immutable/chunks/BHCf6lVR.js","_app/immutable/chunks/B3dssT05.js","_app/immutable/chunks/CbSktHAd.js"];
export const stylesheets = ["_app/immutable/assets/5.BdKb6TaM.css"];
export const fonts = [];
