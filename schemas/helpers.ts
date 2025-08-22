const normalizeWhitespace = (s: string) => s.replace(/\s+/g, ' ').trim();
const stripPhone = (s: string) => s.replace(/[^\d+]/g, '');

export { normalizeWhitespace, stripPhone };
