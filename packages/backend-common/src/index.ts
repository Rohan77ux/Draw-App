export const JWT_SECRET = (globalThis as typeof globalThis & {
	process?: { env?: { JWT_SECRET?: string } };
}).process?.env?.JWT_SECRET || "123123";
