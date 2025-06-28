<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
    
    const { paste, session } = data;
    
    function formatDate(timestamp: number): string {
        return new Date(timestamp).toLocaleString();
    }
    
    function getExpirationText(expiration: number | null): string {
        if (!expiration) return 'Never';
        const now = Date.now();
        if (expiration <= now) return 'Expired';
        
        const diff = expiration - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
        return 'Less than 1 hour';
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
            <p>Expires: {getExpirationText(paste.expiration)}</p>
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
</style>
