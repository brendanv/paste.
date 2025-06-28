<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { signIn } from '@auth/sveltekit/client';
	import type { LayoutData } from './$types';
	import logo from '$lib/assets/logo_small.webp';
	
	export let data: LayoutData;
	
	$: session = data.session;
</script>

<header class="container">
	<nav>
		<ul>
			<li>
				<a href="/" class="brand">
					 <img src="{logo}" alt="paste." />
					<strong>paste.</strong>
				</a>
			</li>
		</ul>
		<ul>
			{#if session?.user}
				<li><a href="/manage">Manage</a></li>
			{:else}
				<li>
					<button type="button" class="outline" on:click={() => signIn('auth0', { callbackUrl: '/' })}>
						Sign In
					</button>
				</li>
			{/if}
		</ul>
	</nav>
</header>

<main class="container">
	<slot />
</main>

<footer class="container">
	<small class="secondary">
		Made with <a href="https://picocss.com" target="_blank">Pico CSS</a> and <a href="https://svelte.dev" target="_blank">SvelteKit</a> • <a href="https://github.com/brendanv/paste" target="_blank">Available on GitHub</a>
	</small>
</footer>

<style>
	.brand {
		font-size: 1.2em;
		text-decoration: none;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	
	.brand img {
		height: 1.5em;
		width: auto;
	}
	
	footer {
		text-align: center;
		margin-top: 2rem;
	}
	
	.error {
		background-color: var(--pico-color-red-100);
		border: 1px solid var(--pico-color-red-500);
		color: var(--pico-color-red-700);
		padding: 1rem;
		border-radius: var(--pico-border-radius);
		margin-bottom: 1rem;
	}
</style>
