import { marked, Renderer, Parser } from "marked";

/** Custom `marked` instance. */
class Marked {
	private marked: typeof marked;
	private renderer: Renderer;
	private parser: Parser;

	constructor() {
		/** initialize marked */
		this.marked = marked;
		this.renderer = new Renderer();
		this.parser = new Parser();

		/** set custom node renderers. */
		this.renderer.link = this.renderLink;

		/** add the custom renderer to the `marked` instance. */
		this.marked.setOptions({ renderer: this.renderer });
	}

	public get() {
		return this.marked;
	}

	private renderLink({ href, title, tokens }: Parameters<Renderer['link']>[0]): ReturnType<Renderer['link']> {
		function cleanUrl(href: string) {
			try {
				href = encodeURI(href).replace(/%25/g, '%');
			} catch {
				return null;
			}
	
			return href;
		}

		const text = this.parser.parseInline(tokens);
		const cleanHref = cleanUrl(href);
		const isExternal = cleanHref && cleanHref.startsWith('http');

		if (cleanHref === null) {
			return text;
		}

		href = cleanHref;
		let out = '<a href="' + href + '"';

		if (title) {
			out += ' title="' + title + '"';
		}

		if (isExternal) {
			out += ' target="_blank" rel="noopener noreferrer"';
		}

		out += '>' + text + '</a>';

		return out;
	};
};

export const MARKED = new Marked()
