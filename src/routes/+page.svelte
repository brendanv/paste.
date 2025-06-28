<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

{#if data.session?.user}
	<h1>Hello, {data.session.user.name}!</h1>
	<form method="POST" action="/auth/signout">
		<button>Sign Out</button>
	</form>
{:else}
	<p>Not signed in.</p>
{/if}

