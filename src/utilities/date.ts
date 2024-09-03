export function formatDate(date: Date): string {
	const options: Intl.DateTimeFormatOptions = {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	};
	
	return new Intl.DateTimeFormat('en-GB', options).format(date);
}