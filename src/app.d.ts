import { KVNamespace } from '@cloudflare/workers-types';

declare global {
	namespace App {
		interface Platform {
			env?: {
				PASTE_KV: KVNamespace;
			};
		}
	}
}

export {};
