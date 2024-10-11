import type { Project, QueryCallbackParams } from "../interfaces";
import { Repository } from "../utilities/repository";

class Module {
	private repository: Repository;

	constructor() {
		this.repository = new Repository();
	};

	public async getAll() {
		try {
      const projects = await this.repository.getAll("projects", this.parseEntry);

      return projects.sort((a, b) => b.year_start - a.year_start);
    } catch (error) {
      console.error(error);

      return [];
    }
	};

	private parseEntry({ slug, data, content }: QueryCallbackParams) {
		if (!data.title || !data.description || !data.year_start || !data.tags) {
			return undefined;
		}

		const project: Project = {
			slug,
			title: data.title,
			description: data.description,
			year_start: data.year_start,
			year_end: data.year_end,
			tags: data.tags,
			archived: !!data.archived,
			updatedAt: new Date(data.updatedAt),
			content,
		};

		return project;
	}
};

export const MODULE_PROJECTS = new Module();
