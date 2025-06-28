import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, platform }) => {
    const { slug } = params;
    const session = await locals.auth();

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
        session
    };
};
