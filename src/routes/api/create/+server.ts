import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createPaste } from '$lib/paste';

export const POST: RequestHandler = async ({ request, platform, locals }) => {
    try {
        const apiUser = locals.apiUser;
        if (!apiUser) {
            return json({ error: 'Authentication required' }, { status: 401 });
        }

        const body = await request.json();
        const { content, visibility = 'private', expiration = '1week', title, customSlug } = body;

        const result = await createPaste({
            content,
            visibility,
            expiration,
            title,
            customSlug,
            userId: apiUser.id
        }, platform?.env?.PASTE_KV);

        if (!result.success) {
            return json({ error: result.error }, { status: 400 });
        }

        return json({ 
            success: true, 
            slug: result.slug,
            url: `/p/${result.slug}`
        });

    } catch (error) {
        console.error('API create paste error:', error);
        return json({ error: 'Invalid request body' }, { status: 400 });
    }
};
