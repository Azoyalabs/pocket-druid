<script lang="ts">
	import WalletButton from '../WalletButton/WalletButton.svelte';
	import Authguard from './authguard.svelte';

	export let address: string | null = null;
</script>

<Authguard isAuth={address !== null}>
	<div class="h-[200px] border rounded-md flex flex-col items-center justify-center">
		<div class="text-sm">Can't interact while disconnected</div>
		<WalletButton class="mt-2" />
	</div>
	<slot name="auth" slot="auth" />
</Authguard>
