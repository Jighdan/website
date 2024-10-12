export function isLinkActive(pathname: string, href: string) {
	if (href === "/") {
		return pathname === href;
	};

	return pathname.startsWith(href);
};
