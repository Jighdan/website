import rss from '@astrojs/rss';
import { CONTENT_SERVICE } from '~/services/content';

export async function GET(context) {
	const entries = await CONTENT_SERVICE.modules('projects').getAll();

	return rss({
		title: "Reinny's Efforts",
		description: "the work I care about",
		site: context.site,
		items: entries.map((entry) => ({
			title: entry.title,
			description: entry.description,
			link: `/efforts/${entry.slug}/`,
			pubDate: entry.updatedAt,
			content: entry.content
		})),
	});
}
