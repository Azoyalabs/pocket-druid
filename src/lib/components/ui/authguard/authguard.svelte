<script lang="ts">
	export let isAuth: boolean;
</script>

{#if isAuth}
	<slot name="auth" />
{:else}
	<slot />
{/if}
