export type PickType<T, K extends keyof T> = Pick<T, K>[K];
