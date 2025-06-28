import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

function generateApiKey(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
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
