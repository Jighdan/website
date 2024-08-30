import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
	const notes = await getCollection('notes');

	return rss({
		title: "Reinny's notes",
		description: "about everything",
		site: context.site,
		items: notes.map((note) => ({
			title: note.data.title,
			description: note.data.description,
			link: `/notes/${note.slug}/`,
			pubDate: note.data.createdAt,
			content: note.body
		})),
	});
}
