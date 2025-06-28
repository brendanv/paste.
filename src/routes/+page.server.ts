import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

function generateRandomSlug(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function getExpirationTimestamp(expiration: string): number | null {
    if (expiration === 'never') return null;
    
    const now = Date.now();
    const durations = {
        '1hour': 60 * 60 * 1000,
        '1day': 24 * 60 * 60 * 1000,
        '1week': 7 * 24 * 60 * 60 * 1000,
        '1month': 30 * 24 * 60 * 60 * 1000,
        '6months': 6 * 30 * 24 * 60 * 60 * 1000,
        '1year': 365 * 24 * 60 * 60 * 1000
    };
    
    return now + (durations[expiration as keyof typeof durations] || 0);
}

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
    createPaste: async ({ request, locals, platform }) => {
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

        // Generate or use custom slug
        let slug = customSlug;
        if (!slug) {
            // Generate random slug and check availability
            let attempts = 0;
            do {
                slug = generateRandomSlug();
                const existing = await platform?.env?.PASTE_KV?.get(`paste-${slug}`);
                if (!existing) break;
                attempts++;
            } while (attempts < 10);
            
            if (attempts >= 10) {
                return fail(500, { error: 'Unable to generate unique slug, please try again' });
            }
        } else {
            // Check if custom slug is available
            const existing = await platform?.env?.PASTE_KV?.get(`paste-${slug}`);
            if (existing) {
                return fail(400, { error: 'This custom URL slug is already in use' });
            }
        }

        const pasteData = {
            content,
            title: title || null,
            visibility,
            expiration: getExpirationTimestamp(expiration),
            createdAt: Date.now(),
            userId: session.user.id,
            slug
        };

        try {
            await platform?.env?.PASTE_KV?.put(`paste-${slug}`, JSON.stringify(pasteData));
        } catch (error) {
            console.error('Failed to store paste:', error);
            return fail(500, { error: 'Failed to create paste' });
        }

        throw redirect(303, `/p/${slug}`);
    }
};
