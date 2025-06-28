<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
    
    const { paste } = data;
    
    function formatDate(timestamp: number): string {
        return new Date(timestamp).toLocaleString();
    }
    
    async function copyContent() {
        try {
            await navigator.clipboard.writeText(paste.content);
        } catch (err) {
            console.error('Failed to copy content: ', err);
            alert('Failed to copy content');
        }
    }
    
    async function copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);
        } catch (err) {
            console.error('Failed to copy link: ', err);
            alert('Failed to copy link');
        }
    }
    
    async function deletePaste() {
        if (!confirm('Are you sure you want to delete this paste? This action cannot be undone.')) {
            return;
        }
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '?/delete';
        document.body.appendChild(form);
        form.submit();
    }
    
    $: isOwner = data.session?.user?.id === paste.userId;
</script>

<svelte:head>
    <title>{paste.title || 'Untitled Paste'} - paste.</title>
</svelte:head>

<header>
    <hgroup>
        <h1>{paste.title || 'Untitled Paste'}</h1>
        <p>
            Created: {formatDate(paste.createdAt)} • 
            Visibility: {paste.visibility}
        </p>
    </hgroup>
</header>

<section>
        <pre><code>{paste.content}</code></pre>
    
    <div role="group">
        <button type="button" on:click={copyContent}>Copy Content</button>
        <button type="button" on:click={copyLink} class="secondary">Copy Link</button>
        {#if isOwner}
            <button type="button" on:click={deletePaste} class="contrast outline">Delete</button>
        {/if}
    </div>
</section>
