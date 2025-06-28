import { SvelteKitAuth } from '@auth/sveltekit';
import Auth0 from '@auth/sveltekit/providers/auth0';

export const { handle, signIn } = SvelteKitAuth((event) => {
	const authOptions = {
		providers: [
			Auth0({
				issuer: event.platform.env.AUTH_AUTH0_DOMAIN,
				clientId: event.platform.env.AUTH_AUTH0_ID,
				clientSecret: event.platform.env.AUTH_AUTH0_SECRET
			})
		],
		secret: event.platform.env.AUTH_SECRET,
		trustHost: true,
		callbacks: {
			jwt({ token, profile }) {
				if (profile) {
					token.id = profile.sub;
				}
				return token;
			},
			session({ session, token }) {
				if (session.user) {
					session.user.id = token.id as string;
				}
				return session;
			}
		}
	};
	return authOptions;
});
