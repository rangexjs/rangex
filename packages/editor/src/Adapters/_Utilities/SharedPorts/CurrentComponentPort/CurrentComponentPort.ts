import type {
	CreateCurrentComponentPortResult,
	CurrentComponentConfigPort,
	CurrentComponentInternals,
	CurrentComponentPublicPort,
	OnCurrentComponentUpdateCallbackFn,
	UpdateStateParams,
} from "./CurrentComponentPort-types";

export const createCurrentComponentPort =
	(): CreateCurrentComponentPortResult => {
		const internals: CurrentComponentInternals = {
			currentComponent: null,
		};

		// PublicPort
		const onCurrentComponentUpdateListeners: Set<OnCurrentComponentUpdateCallbackFn> =
			new Set();

		const updateState = ({ currentComponent }: UpdateStateParams) => {
			if (currentComponent !== undefined) {
				internals.currentComponent = currentComponent;

				for (const listener of onCurrentComponentUpdateListeners) {
					listener(internals.currentComponent);
				}
			}
		};

		const configPort: CurrentComponentConfigPort = {
			setCurrentComponent(currentComponent) {
				updateState({ currentComponent });
			},
		};

		const publicPort: CurrentComponentPublicPort = {
			get currentComponent() {
				return internals.currentComponent;
			},

			onCurrentComponentUpdate(callback) {
				onCurrentComponentUpdateListeners.add(callback);
				return () => onCurrentComponentUpdateListeners.delete(callback);
			},
		};

		return { configPort, publicPort };
	};
