import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { bundledLanguages, type BundledLanguage } from 'shiki';

// Get supported languages from Shiki
const supportedLanguages = Object.keys(bundledLanguages) as BundledLanguage[];

export const load: PageServerLoad = async ({ params, locals, platform }) => {
    const { slug, lang } = params;
    const session = await locals.auth();

    // Validate language parameter if provided
    if (lang && !supportedLanguages.includes(lang as BundledLanguage)) {
        throw redirect(302, `/p/${slug}`);
    }

    let pasteResult;
    try {
        pasteResult = await platform?.env?.PASTE_KV?.getWithMetadata(`paste-${slug}`);
        if (!pasteResult?.value || !pasteResult?.metadata) {
            throw redirect(302, '/paste-not-found');
        }
    } catch (error) {
        throw redirect(302, '/paste-not-found');
    }

    const content = pasteResult.value;
    const metadata = pasteResult.metadata as any;

    if (metadata.visibility === 'private') {
        if (!session?.user || session.user.id !== metadata.userId) {
            throw redirect(302, '/paste-not-found');
        }
    } else if (metadata.visibility === 'logged_in') {
        // Any logged-in user can view
        if (!session?.user) {
            throw redirect(302, '/paste-not-found');
        }
    }

    return {
        paste: {
            content,
            title: metadata.title,
            visibility: metadata.visibility,
            createdAt: metadata.createdAt,
            userId: metadata.userId,
            slug: metadata.slug
        },
        session,
        language: lang as BundledLanguage | undefined
    };
};

export const actions: Actions = {
    delete: async ({ params, locals, platform }) => {
        const { slug } = params;
        const session = await locals.auth();

        if (!session?.user) {
            return fail(401, { error: 'Not authenticated' });
        }

        let pasteResult;
        try {
            pasteResult = await platform?.env?.PASTE_KV?.getWithMetadata(`paste-${slug}`);
            if (!pasteResult?.value || !pasteResult?.metadata) {
                return fail(404, { error: 'Paste not found' });
            }
        } catch (error) {
            return fail(404, { error: 'Paste not found' });
        }

        const metadata = pasteResult.metadata as any;

        if (session.user.id !== metadata.userId) {
            return fail(403, { error: 'Not authorized to delete this paste' });
        }

        try {
            await platform?.env?.PASTE_KV?.delete(`paste-${slug}`);
        } catch (error) {
            return fail(500, { error: 'Failed to delete paste' });
        }

        throw redirect(303, '/');
    }
};