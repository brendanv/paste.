<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
    
    const { paste, session } = data;
    
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
    
</script>

<svelte:head>
    <title>{paste.title || 'Untitled Paste'} - Paste Service</title>
</svelte:head>

<main class="container">
    <header>
        <hgroup>
            <h1>{paste.title || 'Untitled Paste'}</h1>
            <p class="secondary">
                Created: {formatDate(paste.createdAt)} • 
                Visibility: {paste.visibility} • 
                Slug: {paste.slug}
            </p>
        </hgroup>
    </header>
    
    <article>
        <pre><code>{paste.content}</code></pre>
    </article>
    
    <div class="grid">
        <a href="/" role="button" class="secondary">← Create New Paste</a>
        <button type="button" on:click={copyContent}>Copy Content</button>
        <button type="button" on:click={copyLink} class="outline">Copy Link</button>
    </div>
</main>

<footer>
    <small class="secondary">
        Semi-private paste service • Made with <a href="https://picocss.com" target="_blank">Pico CSS</a>
    </small>
</footer>
