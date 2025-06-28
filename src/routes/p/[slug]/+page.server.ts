import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, platform }) => {
    const { slug } = params;
    const session = await locals.auth();

    let pasteData;
    try {
        const pasteJson = await platform?.env?.PASTE_KV?.get(`paste-${slug}`);
        if (!pasteJson) {
            throw redirect(302, '/paste-not-found');
        }
        pasteData = JSON.parse(pasteJson);
    } catch (parseError) {
        throw redirect(302, '/paste-not-found');
    }

    if (pasteData.expiration && Date.now() > pasteData.expiration) {
        throw redirect(302, '/paste-not-found');
    }

    if (pasteData.visibility === 'private') {
        if (!session?.user || session.user.id !== pasteData.userId) {
            throw redirect(302, '/paste-not-found');
        }
    } else if (pasteData.visibility === 'logged_in') {
        // Any logged-in user can view
        if (!session?.user) {
            throw redirect(302, '/paste-not-found');
        }
    }

    return {
        paste: pasteData,
        session
    };
};
