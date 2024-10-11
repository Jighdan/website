import type { JournalEntry, QueryCallbackParams } from "../interfaces";
import { Repository } from "../utilities/repository";

class Module {
	private repository: Repository;

	constructor() {
		this.repository = new Repository();
	};

	public async getAll() {
		try {
      const notes = await this.repository.getAll("notes", this.parseEntry);

      return notes.sort((a, b) => b.date.getTime() - a.date.getTime());

    } catch (error) {
      console.error(error);

      return [];
    }
	};

	private parseEntry({ slug, data, content }: QueryCallbackParams) {
		if (!data.title || !data.description || !data.createdAt) {
			return undefined;
		}

		const note: JournalEntry = {
			slug,
			title: data.title,
			description: data.description,
			content,
			date: new Date(data.createdAt),
		};

		return note;
	}
};

export const MODULE_JOURNAL_ENTRIES = new Module();
