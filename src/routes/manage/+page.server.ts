import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

function generateApiKey(): string {
	// Generate a more secure API key using crypto.getRandomValues
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	if (!session?.user) {
		return {
			session,
			apiKey: null
		};
	}

	// Fetch existing API key
	const existingApiKey = await event.platform?.env?.PASTE_KV?.get(`apikey-${session.user.id}`);

	return {
		session,
		apiKey: existingApiKey
	};
};

export const actions: Actions = {
	generateApiKey: async ({ locals, platform }) => {
		const session = await locals.auth();
		if (!session?.user) {
			return fail(401, { error: 'Not authenticated' });
		}

		const newApiKey = generateApiKey();

		try {
			await platform?.env?.PASTE_KV?.put(`apikey-${session.user.id}`, newApiKey);
			return { success: true, apiKey: newApiKey };
		} catch (error) {
			console.error('Failed to store API key:', error);
			return fail(500, { error: 'Failed to generate API key' });
		}
	},

	deleteApiKey: async ({ locals, platform }) => {
		const session = await locals.auth();
		if (!session?.user) {
			return fail(401, { error: 'Not authenticated' });
		}

		try {
			await platform?.env?.PASTE_KV?.delete(`apikey-${session.user.id}`);
			return { success: true, deleted: true };
		} catch (error) {
			console.error('Failed to delete API key:', error);
			return fail(500, { error: 'Failed to delete API key' });
		}
	}
};
