import axios, { type AxiosInstance } from "axios";
import matter from "gray-matter";
import { Marked, type MarkedInstance } from './marked';
import type { GitLabTreeItem, QueryCallbackParams } from "../interfaces";

export class Repository {
	private readonly baseUrl = `https://gitlab.com/api/v4/projects/${import.meta.env.NOTES_PROJECT_ID}/repository`;
	private instance: AxiosInstance;
	private marked: MarkedInstance;

	constructor() {
		if (
			!import.meta.env.NOTES_PROJECT_ID ||
			!import.meta.env.NOTES_ACCESS_TOKEN
		) {
			throw Error("Missing environment variables");
		}

		this.instance = axios.create({
			baseURL: this.baseUrl,
			headers: {
				"PRIVATE-TOKEN": import.meta.env.NOTES_ACCESS_TOKEN,
			},
		});

		const marked = new Marked();
		this.marked = marked.get();
	};

	public async getAll<CallbackResult>(
		directory: string,
		callback: (params: QueryCallbackParams) => CallbackResult | undefined
	): Promise<CallbackResult[]> {
		try {
			const response = await this.instance.get<GitLabTreeItem[]>("/tree", {
				params: { ref: "main", recursive: false, path: directory },
			});


			const paths = response.data
				.filter((file) => file.type === "blob" && file.path.endsWith(".md") && file.name !== "_template.md")
				.map(({ name, path }) => ({ slug: name.replace(".md", ""), path }));

			const content = await Promise.all(
				paths.map(async ({ slug, path }) => {
					const rawFile = await this.get(path);

					if (rawFile) {
						const file = matter(rawFile);
						const content = await this.marked(file.content);

						return callback({ slug, data: file.data, content });
					}

					return undefined;
				})
			);

			const fileteredContent = content.filter(Boolean) as CallbackResult[];

			return fileteredContent;
		} catch (error) {

			throw error;
		}
	}

	private async get(filePath: string) {
		try {
			const encodedFilePath = encodeURIComponent(filePath);
			const url = `/files/${encodedFilePath}/raw`;
			const response = await this.instance.get<string>(url, {
				params: { ref: "main" },
			});

			return response.data;
		} catch (error) {
			console.error(error);

			return undefined;
		}
	}
}
