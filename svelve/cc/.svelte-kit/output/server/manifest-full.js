export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.KqScFwIE.js",app:"_app/immutable/entry/app.yIrgWmcp.js",imports:["_app/immutable/entry/start.KqScFwIE.js","_app/immutable/chunks/B-9fefoS.js","_app/immutable/chunks/B-Dm36DL.js","_app/immutable/chunks/I0MiNX4F.js","_app/immutable/entry/app.yIrgWmcp.js","_app/immutable/chunks/Dp1pzeXC.js","_app/immutable/chunks/B-Dm36DL.js","_app/immutable/chunks/BA2mS0jv.js","_app/immutable/chunks/I0MiNX4F.js","_app/immutable/chunks/DY2Q3msz.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/products",
				pattern: /^\/api\/products\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/products/_server.ts.js'))
			},
			{
				id: "/product/[id]",
				pattern: /^\/product\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/savings",
				pattern: /^\/savings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/stores",
				pattern: /^\/stores\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
