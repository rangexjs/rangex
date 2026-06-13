declare module "*.css";

declare module "*?worker" {
	const WorkerConstructor: new () => Worker;
	export default WorkerConstructor;
}

declare module "*.css?inline" {
	const styles: string;

	export default styles;
}
