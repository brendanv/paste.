<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<div>
	<button on:click={signIn('auth0')}>Sign In</button>
</div>
