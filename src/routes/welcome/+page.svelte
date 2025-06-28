<script lang="ts">
  import { signIn } from "@auth/sveltekit/client";
</script>

<h1>Welcome</h1>
<p>Please sign in to continue.</p>
<button on:click={() => signIn('auth0', { callbackUrl: '/' })}>Sign In with Auth0</button>
