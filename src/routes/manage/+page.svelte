<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
</script>

<svelte:head>
    <title>Manage Account - paste.</title>
</svelte:head>

<header>
    <hgroup>
        <h1>Manage Account</h1>
        <p class="secondary">Manage your pastes and account settings</p>
    </hgroup>
</header>

<section>
    {#if data.session?.user}
        <p>Welcome, {data.session.user.name}!</p>
        <p>This is the manage account page where you can view and manage your pastes.</p>
        <!-- TODO: Add paste management functionality -->
    {:else}
        <p>Please sign in to manage your account.</p>
    {/if}
</section>
