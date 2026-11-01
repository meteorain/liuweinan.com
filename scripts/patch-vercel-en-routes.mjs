/**
 * After removing astro-i18n-aut, Vercel only registers unprefixed page routes.
 * Locale middleware rewrites /en/* → /* but never runs if /en hits the static
 * 404 catch-all first. Insert /en → _render routes before that catch-all.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function patchVercelEnRoutes(cwd = process.cwd()) {
	const configPath = resolve(cwd, '.vercel/output/config.json');

	if (!existsSync(configPath)) {
		console.warn(`[patch-vercel-en-routes] skip: ${configPath} not found`);
		return false;
	}

	const config = JSON.parse(readFileSync(configPath, 'utf8'));
	const routes = Array.isArray(config.routes) ? config.routes : [];

	const enRoute = {
		src: '^/en(?:/(.*))?/$',
		dest: '_render',
	};

	const alreadyPatched = routes.some(
		(route) =>
			route.dest === '_render' &&
			typeof route.src === 'string' &&
			route.src.includes('/en'),
	);

	if (alreadyPatched) {
		console.log('[patch-vercel-en-routes] /en routes already present');
		return true;
	}

	const catchAllIndex = routes.findIndex(
		(route) => route.status === 404 && route.dest === '/404.html',
	);

	if (catchAllIndex === -1) {
		routes.push(enRoute);
	} else {
		routes.splice(catchAllIndex, 0, enRoute);
	}

	config.routes = routes;
	writeFileSync(configPath, `${JSON.stringify(config, null, '\t')}\n`, 'utf8');
	console.log('[patch-vercel-en-routes] inserted /en → _render before 404 catch-all');
	return true;
}

const isDirectRun = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isDirectRun) {
	patchVercelEnRoutes();
}
