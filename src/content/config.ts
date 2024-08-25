import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date().optional()
	}),
});

export const collections = { notes };
