import rss from '@astrojs/rss';
import { NOTES_SERVICE } from '~/services/notes';

export async function GET(context) {
	const notes = await NOTES_SERVICE.getAll();

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
