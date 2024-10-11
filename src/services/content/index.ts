import type { JournalEntry, Project, QueryCallbackParams } from "./interfaces";
import { Repository } from "./utilities/repository";

class Service {
  private repository: Repository;

  constructor() {
    this.repository = new Repository();
  }

  public async getJournalEntries() {
    function callback({ slug, data, content }: QueryCallbackParams) {
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

    try {
      const notes = await this.repository.getAll("notes", callback);

      return notes.sort((a, b) => b.date.getTime() - a.date.getTime());

    } catch (error) {
      console.error(error);

      return [];
    }
  }

  public async getProjects() {
    function callback({ slug, data, content }: QueryCallbackParams) {
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

    try {
      const projects = await this.repository.getAll("projects", callback);

      return projects.sort((a, b) => b.year_start - a.year_start);
    } catch (error) {
      console.error(error);

      return [];
    }
  }
}

export const CONTENT_SERVICE = new Service();
export type { JournalEntry, Project } from "./interfaces";
