
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/products" | "/product" | "/product/[id]" | "/savings" | "/stores";
		RouteParams(): {
			"/product/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/api": Record<string, never>;
			"/api/products": Record<string, never>;
			"/product": { id?: string };
			"/product/[id]": { id: string };
			"/savings": Record<string, never>;
			"/stores": Record<string, never>
		};
		Pathname(): "/" | "/api/products" | `/product/${string}` & {} | "/savings" | "/stores";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.png" | string & {};
	}
}