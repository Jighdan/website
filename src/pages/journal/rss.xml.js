import rss from '@astrojs/rss';
import { CONTENT_SERVICE } from '~/services/content';

export async function GET(context) {
	const entries = await CONTENT_SERVICE.modules('journal').getAll();

	return rss({
		title: "Reinny's Journal",
		description: "about everything",
		site: context.site,
		items: entries.map((entry) => ({
			title: entry.title,
			description: entry.description,
			link: `/journal/${entry.slug}/`,
			pubDate: entry.date,
			content: entry.content
		})),
	});
}
