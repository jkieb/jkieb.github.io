import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const ideen = defineCollection({
	loader: glob({ pattern: ['*.md', '!_*', '!README.md'], base: './ideen' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		bereich: z.string(),
		status: z.enum(['Roh', 'Skizze', 'Prüfen', 'Aktiv', 'Verworfen']),
	}),
});

export const collections = { ideen };
