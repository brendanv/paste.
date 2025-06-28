<script lang="ts">
  import { signIn } from "@auth/sveltekit/client";
</script>

<svelte:head>
    <title>Welcome - Paste Service</title>
</svelte:head>

<main class="container">
    <header>
        <hgroup>
            <h1>Welcome to Paste Service</h1>
            <p class="secondary">A semi-private paste service for sharing code and text</p>
        </hgroup>
    </header>
    
    <article>
        <p>Please sign in to create and manage your pastes.</p>
        <button type="button" on:click={() => signIn('auth0', { callbackUrl: '/' })}>
            Sign In with Auth0
        </button>
    </article>
</main>

<footer>
    <small class="secondary">
        Semi-private paste service • Made with <a href="https://picocss.com" target="_blank">Pico CSS</a>
    </small>
</footer>
