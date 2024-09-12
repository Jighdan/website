import axios, { type AxiosInstance } from 'axios';
import { marked } from 'marked';
import matter from 'gray-matter';
import { type Note, type GitLabTreeItem } from './interfaces';

class Service {
	private readonly PROJECT_ID = import.meta.env.NOTES_PROJECT_ID || '';
	private readonly BASE_URL = `https://gitlab.com/api/v4/projects/${this.PROJECT_ID}/repository`
	private INSTANCE: AxiosInstance;

	constructor() {
		this.INSTANCE = axios.create({
			baseURL: this.BASE_URL,
			headers: {
				'PRIVATE-TOKEN': import.meta.env.NOTES_ACCESS_TOKEN
			}
		})
	}

	public async getAll(): Promise<Note[]> {
		const response = await this.INSTANCE.get<GitLabTreeItem[]>('/tree');
		const slugs = response.data.filter(({path}) => path.endsWith('.md')).map(({ path }) => path.replace('.md', ''));
		
		const notes = await Promise.all(slugs.map(async (slug) => {
			const rawFile = await this.get(slug);
			const file = matter(rawFile);
			const content = await marked(file.content);

			const note: Note = {
				slug,
				title: file.data.title || '',
				description: file.data.description || '',
				content,
				date: new Date(file.data.createdAt || undefined)
			};

			return note;
		}));

		const sortedNotes = notes.sort((a, b) => b.date.getTime() - a.date.getTime());

		return sortedNotes;
	}

	public async get(slug: string) {
		const filePath = `${slug}.md`;
    const encodedFilePath = encodeURIComponent(filePath);
		const url = `/files/${encodedFilePath}/raw`;

		const response = await this.INSTANCE.get<string>(url, { params: { ref: 'main' } });

		return response.data;
	}
}

export const NOTES_SERVICE = new Service();
export { type Note } from './interfaces';
