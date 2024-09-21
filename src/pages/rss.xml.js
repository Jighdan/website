import rss from '@astrojs/rss';
import { CONTENT_SERVICE } from '~/services/content';

export async function GET(context) {
	const notes = await CONTENT_SERVICE.getNotes();

	return rss({
		title: "Reinny's notes",
		description: "about everything",
		site: context.site,
		items: notes.map((note) => ({
			title: note.title,
			description: note.description,
			link: `/notes/${note.slug}/`,
			pubDate: note.date,
			content: note.content
		})),
	});
}
