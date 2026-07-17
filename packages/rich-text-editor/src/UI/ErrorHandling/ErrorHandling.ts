export const assertNever = (type: never): never => {
	throw new Error("Every type has to be handled.", type);
};
