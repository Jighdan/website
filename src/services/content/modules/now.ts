import type { NowEntry, QueryCallbackParams } from "../interfaces";
import { Repository } from "../utilities/repository";

class Module {
	private repository: Repository;

	constructor() {
		this.repository = new Repository();
	};

	public async get() {
		try {
			const entries = await this.getAll();

			return entries.at(0);
		} catch (error) {
			console.error(error);

			return undefined;
		}
	}

	public async getAllExcludingLatest() {
		try {
			const entries = await this.getAll();

			return entries.slice(1);
		} catch (error) {
			console.error(error);

			return [];
		}
	}

	/** returns from newest to oldest. */
	public async getAll() {
    try {
      const entries = await this.repository.getAll("now", this.parseEntry);

			// slugs are numerical, so the most recent entry will have the highest slug
			return entries.sort((a, b) => Number(b.slug) - Number(a.slug));
    } catch (error) {
      console.error(error);

      return [];
    }
	};

	private parseEntry({ slug, data, content }: QueryCallbackParams) {
		if (!data.date || !data.location) {
			return undefined;
		}

		const entry: NowEntry = {
			slug,
			date: new Date(data.date),
			location: data.location,
			content
		};

		return entry;
	}
};

export const MODULE_NOW = new Module();
