<script lang="ts">
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';
    
    export let data: PageData;
    export let form: any;
    
    $: apiKey = form?.deleted ? null : (data.apiKey || form?.apiKey);
    
    function copyToClipboard() {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey);
        }
    }
</script>

<svelte:head>
    <title>Manage Account - paste.</title>
</svelte:head>

<header>
    <hgroup>
        <h1>Manage Account</h1>
        {#if data.session?.user}
            <p>Welcome, {data.session.user.name}! Manage your pastes and account settings</p>
        {:else}
            <p>Please sign in to manage your account.</p>
        {/if}
    </hgroup>
</header>

<section>
    {#if data.session?.user}
        <article>
            <header>
                <h3>API Key</h3>
                <p class="secondary">Use your API key to create pastes using external tools.</p>
            </header>
            
            {#if form?.error}
                <div class="error">
                    {form.error}
                </div>
            {/if}
            
            {#if form?.success && !form?.deleted}
                <div class="success">
                    API key generated successfully!
                </div>
            {/if}
            
            {#if form?.success && form?.deleted}
                <div class="success">
                    API key deleted successfully!
                </div>
            {/if}
            
            {#if apiKey}
                <p>✅ You have an API key saved</p>
                
                <div class="grid">
                    <button type="button" onclick={copyToClipboard}>
                        Copy API Key
                    </button>
                    
                    <form method="POST" action="?/generateApiKey" use:enhance>
                        <button type="submit" class="secondary">
                            Regenerate
                        </button>
                    </form>
                    
                    <form method="POST" action="?/deleteApiKey" use:enhance>
                        <button type="submit" class="outline contrast">
                            Delete
                        </button>
                    </form>
                </div>
                
                <small class="help-text">
                    Warning: Regenerating or deleting your API key will invalidate the current one.
                </small>
            {:else}
                <form method="POST" action="?/generateApiKey" use:enhance>
                    <button type="submit">
                        Generate API Key
                    </button>
                </form>
                
                <small class="help-text">
                    Generate an API key to create pastes programmatically via API calls.
                </small>
            {/if}
        </article>
        
    {:else}
        <p>Please sign in to manage your account.</p>
    {/if}
</section>
