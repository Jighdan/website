import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date().optional()
	}),
});

// const projects = defineCollection({
// 	type: 'content',
// 	schema: z.object({
// 		title: z.string(),
// 		description: z.string(),
// 		date: z.coerce.date(),
// 		tags: z.array(z.string()),
// 		createdAt: z.coerce.date(),
// 		updatedAt: z.coerce.date().optional()
// 	})
// })

export const collections = {
	notes,
	// projects
};
