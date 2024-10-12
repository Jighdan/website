import rss from '@astrojs/rss';
import { CONTENT_SERVICE } from '~/services/content';
import { formatDate } from "~/utilities/date";

export async function GET(context) {
	const entries = await CONTENT_SERVICE.modules('now').getAll();

	return rss({
		title: "Reinny's 'Now' Open Letters",
		description: "sharing what's going on",
		site: context.site,
		items: entries.map((entry) => {
			const date = entry?.date ? formatDate(entry.date) : undefined;
			const title = `Now | ${date}`;
			const description = `What happened at ${date} in ${entry?.location}.`;

			return {
				title,
				description,
				link: `/now/archive/${entry.slug}/`,
				pubDate: entry.date,
				content: entry.content
			}
		}),
	});
}
