import axios, { type AxiosInstance } from "axios";
import { MARKED } from "./utilities/marked";
import matter from "gray-matter";
import type {
  Note,
  GitLabTreeItem,
  Project,
  QueryCallbackParams,
} from "./interfaces";

class Service {
  private readonly BASE_URL = `https://gitlab.com/api/v4/projects/${import.meta.env.NOTES_PROJECT_ID}/repository`;
  private INSTANCE: AxiosInstance;
  private marked = MARKED.get();

  constructor() {
    if (
      !import.meta.env.NOTES_PROJECT_ID ||
      !import.meta.env.NOTES_ACCESS_TOKEN
    ) {
      throw Error("Missing environment variables");
    }

    this.INSTANCE = axios.create({
      baseURL: this.BASE_URL,
      headers: {
        "PRIVATE-TOKEN": import.meta.env.NOTES_ACCESS_TOKEN,
      },
    });
  }

  public async getNotes() {
    function callback({ slug, data, content }: QueryCallbackParams) {
      if (!data.title || !data.description || !data.createdAt) {
        return undefined;
      }

      const note: Note = {
        slug,
        title: data.title,
        description: data.description,
        content,
        date: new Date(data.createdAt),
      };

      return note;
    }

    try {
      const notes = await this.getAll("notes", callback);

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
        content,
      };

      return project;
    }

    try {
      const projects = await this.getAll("projects", callback);

      return projects.sort((a, b) => b.year_start - a.year_start);
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  private async getAll<CallbackResult>(
    directory: string,
    callback: (params: QueryCallbackParams) => CallbackResult | undefined
  ): Promise<CallbackResult[]> {
    try {
      const response = await this.INSTANCE.get<GitLabTreeItem[]>("/tree", {
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
      const encodedFilePath  = encodeURIComponent(filePath); 
      const url = `/files/${encodedFilePath}/raw`;
      const response = await this.INSTANCE.get<string>(url, {
        params: { ref: "main" },
      });

      return response.data;
    } catch (error) {
      console.error(error);

      return undefined;
    }
  }
}

export const CONTENT_SERVICE = new Service();
export type { Note, Project } from "./interfaces";
