import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
	const notes = await getCollection('notes');

	return rss({
		site: context.site,
		items: notes.map((note) => ({
			...note.data,
			link: `/notes/${note.slug}/`,
		})),
	});
}
