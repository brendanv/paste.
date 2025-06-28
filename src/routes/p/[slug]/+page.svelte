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

<div class="container">
    <header>
        <h1>{paste.title || 'Untitled Paste'}</h1>
        <div class="metadata">
            <p>Created: {formatDate(paste.createdAt)}</p>
            <p>Visibility: {paste.visibility}</p>
            <p>Slug: {paste.slug}</p>
        </div>
    </header>
    
    <main>
        <div class="content">
            <pre>{paste.content}</pre>
        </div>
    </main>
    
    <nav>
        <a href="/">Create New Paste</a>
        <button on:click={copyContent}>Copy Content</button>
        <button on:click={copyLink}>Copy Link</button>
    </nav>
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }
    
    header h1 {
        margin-bottom: 10px;
    }
    
    .metadata {
        margin-bottom: 20px;
        color: #666;
    }
    
    .metadata p {
        margin: 5px 0;
    }
    
    .content {
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 15px;
        margin-bottom: 20px;
    }
    
    .content pre {
        margin: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
        font-family: 'Courier New', monospace;
    }
    
    nav {
        display: flex;
        gap: 15px;
    }
    
    nav a {
        color: #007bff;
        text-decoration: none;
    }
    
    nav a:hover {
        text-decoration: underline;
    }
    
    nav button {
        background: #007bff;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    }
    
    nav button:hover {
        background: #0056b3;
    }
</style>
