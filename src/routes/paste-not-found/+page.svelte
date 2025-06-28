<svelte:head>
    <title>Paste Not Found - Paste Service</title>
</svelte:head>

<div class="container">
    <h1>Paste Not Found</h1>
    <p>The paste you're looking for doesn't exist, has expired, or you don't have permission to view it.</p>
    
    <div class="actions">
        <a href="/">Create a New Paste</a>
        <a href="/welcome">Back to Welcome</a>
    </div>
</div>

<style>
    .container {
        max-width: 600px;
        margin: 100px auto;
        padding: 20px;
        text-align: center;
    }
    
    h1 {
        color: #dc3545;
        margin-bottom: 20px;
    }
    
    p {
        margin-bottom: 30px;
        color: #666;
        font-size: 16px;
    }
    
    .actions {
        display: flex;
        gap: 20px;
        justify-content: center;
    }
    
    .actions a {
        display: inline-block;
        padding: 10px 20px;
        background: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    
    .actions a:hover {
        background: #0056b3;
    }
</style>
