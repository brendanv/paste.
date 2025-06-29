<p align="center">
   <img src="src/lib/assets/logo.webp" height="125px">
</p>

# paste.

A semi-private paste service, self-hostable on the free tier of Cloudflare Workers and KV.

## Features

- **Privacy controls** - Straightforward controls for who can view your pastes (public, private, or logged-in users only)
- **Syntax highlighting** - Code formatting for ~all programming languages
- **Expiration options** - Set pastes to expire from 1 hour to 1 year, or keep forever
- **API access** - Simple JSON API for creating pastes programmatically
- **Serverless** - Built on Cloudflare Workers with KV storage
- **SSO Authentication** - Integration with Auth0 out of the box, but any providers supported by [Auth.js](https://authjs.dev/) are easy enough to add

## Setup

### Prerequisites

- [Bun](https://bun.sh) runtime
- Cloudflare account with Workers and KV access
- Auth0 account for authentication

### Development

1. Clone the repository:
2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.dev.vars` file with your Auth0 credentials. For production you'll need to do this in your Cloudflare dashboard.
   ```
   AUTH_SECRET="your-auth-secret-key-here"
   AUTH_AUTH0_ID=your-auth0-client-id
   AUTH_AUTH0_SECRET=your-auth0-client-secret
   ```

4. Update `wrangler.jsonc` with your Auth0 domain:
   ```json
   "vars": {
     "AUTH_AUTH0_DOMAIN": "https://your-auth0-domain.auth0.com",
     "GITHUB_REPO": "https://github.com/your-username/paste"
   }
   ```

5. Create a KV namespace and update the binding in `wrangler.jsonc`:
   ```bash
   wrangler kv:namespace create "PASTE_KV"
   ```

6. Start the development server:
   ```bash
   bun run dev
   ```

## License

MIT