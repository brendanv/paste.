export interface CreatePasteOptions {
	content: string;
	visibility: 'public' | 'private' | 'logged_in';
	expiration: 'never' | '1hour' | '1day' | '1week' | '1month' | '6months' | '1year';
	title?: string;
	customSlug?: string;
	userId: string;
}

export interface CreatePasteResult {
	success: boolean;
	slug?: string;
	error?: string;
}

function generateRandomSlug(): string {
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	for (let i = 0; i < 5; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

function getExpirationTtl(expiration: string): number | null {
	if (expiration === 'never') return null;

	const durations = {
		'1hour': 60 * 60,
		'1day': 24 * 60 * 60,
		'1week': 7 * 24 * 60 * 60,
		'1month': 30 * 24 * 60 * 60,
		'6months': 6 * 30 * 24 * 60 * 60,
		'1year': 365 * 24 * 60 * 60
	};

	return durations[expiration as keyof typeof durations] || null;
}

export async function createPaste(
	options: CreatePasteOptions,
	kv: any
): Promise<CreatePasteResult> {
	const { content, visibility, expiration, title, customSlug, userId } = options;

	if (!content || content.trim() === '') {
		return { success: false, error: 'Content is required' };
	}

	if (!['public', 'private', 'logged_in'].includes(visibility)) {
		return { success: false, error: 'Invalid visibility option' };
	}

	if (!['never', '1hour', '1day', '1week', '1month', '6months', '1year'].includes(expiration)) {
		return { success: false, error: 'Invalid expiration option' };
	}

	if (customSlug) {
		if (customSlug.length < 3 || customSlug.length > 50) {
			return { success: false, error: 'Custom URL slug must be between 3 and 50 characters' };
		}
		if (!/^[a-zA-Z0-9_-]+$/.test(customSlug)) {
			return {
				success: false,
				error: 'Custom URL slug can only contain letters, numbers, hyphens, and underscores'
			};
		}
	}

	let slug = customSlug;
	if (!slug) {
		// Generate random slug and check availability
		let attempts = 0;
		do {
			slug = generateRandomSlug();
			const existing = await kv?.get(`paste-${slug}`);
			if (!existing) break;
			attempts++;
		} while (attempts < 10);

		if (attempts >= 10) {
			return { success: false, error: 'Unable to generate unique slug, please try again' };
		}
	} else {
		// Check if custom slug is available
		const existing = await kv?.get(`paste-${slug}`);
		if (existing) {
			return { success: false, error: 'This custom URL slug is already in use' };
		}
	}

	const metadata = {
		title: title || null,
		visibility,
		createdAt: Date.now(),
		userId,
		slug
	};

	const expirationTtl = getExpirationTtl(expiration);
	const putOptions: any = { metadata };

	if (expirationTtl) {
		putOptions.expirationTtl = expirationTtl;
	}

	try {
		await kv?.put(`paste-${slug}`, content, putOptions);
		return { success: true, slug };
	} catch (error) {
		console.error('Failed to store paste:', error);
		return { success: false, error: 'Failed to create paste' };
	}
}
