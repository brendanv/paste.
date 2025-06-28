import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();
    if (!session) {
        throw redirect(302, '/welcome');
    }
    return {
        session
    };
};

export const actions: Actions = {
    createPaste: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) {
            throw redirect(302, '/welcome');
        }

        const data = await request.formData();
        const content = data.get('content') as string;
        const visibility = data.get('visibility') as string;
        const expiration = data.get('expiration') as string;
        const title = data.get('title') as string;
        const customSlug = data.get('customSlug') as string;

        if (!content || content.trim() === '') {
            return fail(400, { error: 'Content is required' });
        }

        if (!['public', 'private', 'logged_in'].includes(visibility)) {
            return fail(400, { error: 'Invalid visibility option' });
        }

        if (!['never', '1hour', '1day', '1week', '1month', '6months', '1year'].includes(expiration)) {
            return fail(400, { error: 'Invalid expiration option' });
        }

        if (customSlug) {
            if (customSlug.length < 3 || customSlug.length > 50) {
                return fail(400, { error: 'Custom URL slug must be between 3 and 50 characters' });
            }
            if (!/^[a-zA-Z0-9_-]+$/.test(customSlug)) {
                return fail(400, { error: 'Custom URL slug can only contain letters, numbers, hyphens, and underscores' });
            }
        }

        console.log('Creating paste:', {
            content,
            visibility,
            expiration,
            title: title || null,
            customSlug: customSlug || null,
            userId: session.user.id
        });

        return { success: true };
    }
};
