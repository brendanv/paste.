<script lang="ts">
  import { signIn } from "@auth/sveltekit/client";
</script>

<svelte:head>
    <title>Welcome - paste.</title>
</svelte:head>

<header>
    <hgroup>
        <h1>Welcome to paste.</h1>
        <p>A semi-private paste service for sharing code and text</p>
    </hgroup>
</header>

<section>
    <article>
        <p>Creation of new pastes is only available to logged in users. You can 
            view an <a href="/p/welcome">example paste</a> to see how it works.</p>
        <p>Otherwise, please 
            <button type="button" class="outline" on:click={() => signIn('auth0', { callbackUrl: '/' })}>
                sign in
            </button>
        </p>
    </article>
</section>
