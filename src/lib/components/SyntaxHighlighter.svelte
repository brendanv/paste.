<script lang="ts">
    import { onMount } from 'svelte';
    import { codeToHtml } from 'shiki';
    import type { BundledLanguage, BundledTheme } from 'shiki';

    export let code: string;
    export let language: BundledLanguage;
    export let theme: BundledTheme = 'github-dark';

    let highlightedCode = '';
    let loading = true;
    let error = '';

    onMount(async () => {
        try {
            highlightedCode = await codeToHtml(code, {
                lang: language,
                theme: theme
            });
            loading = false;
        } catch (err) {
            console.error('Failed to highlight code:', err);
            error = 'Failed to highlight code';
            loading = false;
        }
    });
</script>

{#if loading}
    <div class="loading">Loading syntax highlighting...</div>
{:else if error}
    <div class="error">
        <p>{error}</p>
        <pre><code>{code}</code></pre>
    </div>
{:else}
    <div class="highlighted-code">
        {@html highlightedCode}
    </div>
{/if}

<style>
    .loading {
        padding: 1rem;
        text-align: center;
        color: var(--pico-muted-color);
    }

    .error {
        padding: 1rem;
        border: 1px solid var(--pico-del-color);
        border-radius: var(--pico-border-radius);
        background-color: var(--pico-del-background-color);
    }

    .error p {
        margin-top: 0;
        color: var(--pico-del-color);
    }

    .highlighted-code {
        margin-bottom: 1rem;
    }

    :global(.highlighted-code pre) {
        margin: 0;
        overflow-x: auto;
    }

    :global(.highlighted-code code) {
        display: block;
        padding: 1rem;
        line-height: 1.5;
    }
</style>