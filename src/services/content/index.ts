import { MODULE_PROJECTS } from "./modules/projects";
import { MODULE_JOURNAL_ENTRIES } from "./modules/journal-entries";
import { MODULE_NOW } from "./modules/now";
import type { Modules } from "./interfaces";

type ReturnModule = typeof MODULE_PROJECTS | typeof MODULE_JOURNAL_ENTRIES | typeof MODULE_NOW;

class Service {
  public modules(module: "projects"): typeof MODULE_PROJECTS;
  public modules(module: "journal"): typeof MODULE_JOURNAL_ENTRIES;
  public modules(module: "now"): typeof MODULE_NOW;
  public modules(module: Modules): ReturnModule {
    switch (module) {
      case "projects":
        return MODULE_PROJECTS;

      case "journal":
        return MODULE_JOURNAL_ENTRIES;

      case "now":
        return MODULE_NOW;

      default:
        throw new Error(`Module ${module} not found.`);
    }
  }
}

export const CONTENT_SERVICE = new Service();
export type { JournalEntry, Project, NowEntry } from "./interfaces";
