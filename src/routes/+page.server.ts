import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { createPaste } from '$lib/paste';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();
	return {
		session
	};
};

export const actions: Actions = {
	createPaste: async ({ request, locals, platform }) => {
		const session = await locals.auth();
		if (!session?.user) {
			// This should not happen due to the hook, but as a safeguard:
			throw redirect(302, '/welcome');
		}

		const data = await request.formData();
		const content = data.get('content') as string;
		const visibility = data.get('visibility') as string;
		const expiration = data.get('expiration') as string;
		const title = data.get('title') as string;
		const customSlug = data.get('customSlug') as string;

		const result = await createPaste(
			{
				content,
				visibility: visibility as any,
				expiration: expiration as any,
				title,
				customSlug,
				userId: session.user.id
			},
			platform?.env?.PASTE_KV
		);

		if (!result.success) {
			return fail(400, { error: result.error });
		}

		throw redirect(303, `/p/${result.slug}`);
	}
};
