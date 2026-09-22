import type { APIRoute } from 'astro';

export const prerender = false;

const USERNAME_PATTERN = /^(?=.{1,39}$)[a-z\d](?:[a-z\d-]*[a-z\d])?$/i;
const CACHE_CONTROL = 'public, max-age=0, s-maxage=300, stale-while-revalidate=60';
const UPSTREAM_TIMEOUT_MS = 10_000;

function jsonError(status: number, error: string, headers?: HeadersInit): Response {
	return new Response(JSON.stringify({ error }), {
		status,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'no-store',
			...headers
		}
	});
}

export const GET: APIRoute = async ({ params }) => {
	const username = params.username?.trim();

	if (!username || !USERNAME_PATTERN.test(username)) {
		return jsonError(400, 'Username must be a valid GitHub username.');
	}

	const headers = new Headers({
		Accept: 'application/json'
	});
	const token = process.env.GITHUB_TOKEN?.trim();

	if (token) {
		headers.set('Authorization', `Bearer ${token}`);
	}

	let upstreamResponse: Response;

	try {
		upstreamResponse = await fetch(`https://github.com/${encodeURIComponent(username)}.contribs`, {
			headers,
			signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
		});
	} catch {
		return jsonError(503, 'GitHub contribution data is temporarily unavailable.');
	}

	if (upstreamResponse.status === 404) {
		return jsonError(404, 'GitHub user was not found.');
	}

	if (
		upstreamResponse.status === 429 ||
		upstreamResponse.headers.get('x-ratelimit-remaining') === '0'
	) {
		const retryAfter = upstreamResponse.headers.get('retry-after');

		return jsonError(
			503,
			'GitHub contribution data is temporarily unavailable due to rate limiting.',
			retryAfter ? { 'Retry-After': retryAfter } : undefined
		);
	}

	if (!upstreamResponse.ok) {
		return jsonError(502, 'GitHub contribution data could not be fetched.');
	}

	const responseBody = await upstreamResponse.text();

	try {
		JSON.parse(responseBody);
	} catch {
		return jsonError(502, 'GitHub returned an invalid contribution data response.');
	}

	return new Response(responseBody, {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': CACHE_CONTROL
		}
	});
};
