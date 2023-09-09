import { Window as KeplrWindow } from '@keplr-wallet/types';


// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	type Window = KeplrWindow

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
