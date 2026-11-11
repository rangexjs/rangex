import type { Component } from "@rangex/core";
import {
	type ComponentAttrs,
	type ComponentAttrsShape,
	mergeComponentAttrs,
	readComponentAttrs,
	validateComponentAttrs,
	validateComponentAttrsPatch,
	writeComponentAttrs,
} from "#dom-attrs";
import type {
	CreateDOMAttrsObserverParams,
	CreateDOMAttrsObserverResult,
	DOMAttrsObserverInternals,
	HandleDOMAttrsParams,
} from "./HandleDOMAttrs-types";

const getAttrNames = (componentAttrsShape: ComponentAttrsShape) => {
	const attrNames = new Set<string>();

	for (const elementAttrsShape of Object.values(componentAttrsShape)) {
		for (const attrName of Object.keys(elementAttrsShape)) {
			attrNames.add(attrName);
		}
	}

	return [...attrNames];
};

/*
 * Observes one component at a time and updates the port's domAttrs from it: when it starts being observed, and
 * whenever its structure or one of the shape's attributes changes (e.g. by undo/redo). An element outside the
 * component (e.g. its BlockComponentLine) is observed too, for its attributes only.
 */
const createDOMAttrsObserver = <
	TComponent extends Component,
	TShape extends ComponentAttrsShape,
>({
	domAttrsPort,
	componentAttrsShape,
	readDOMAttrs,
	resolveElements,
}: CreateDOMAttrsObserverParams<
	TComponent,
	TShape
>): CreateDOMAttrsObserverResult<TComponent> => {
	const internals: DOMAttrsObserverInternals<TComponent> = {
		observedComponent: null,
	};

	const attributeFilter = getAttrNames(componentAttrsShape);

	const observer = new MutationObserver(() => {
		const { observedComponent } = internals;

		if (!observedComponent?.$$rootEditable) {
			return;
		}

		const domAttrs = readDOMAttrs(observedComponent);

		domAttrsPort.updateDOMAttrs(domAttrs);
	});

	return {
		get observedComponent() {
			return internals.observedComponent;
		},

		observe(component) {
			observer.disconnect();

			internals.observedComponent = component;

			if (!component) {
				domAttrsPort.updateDOMAttrs(null);
				return;
			}

			const domAttrs = readDOMAttrs(component);

			domAttrsPort.updateDOMAttrs(domAttrs);

			// The structure too, as an element with attributes can be added, removed or replaced
			observer.observe(component, {
				subtree: true,
				childList: true,
				attributes: true,
				attributeFilter,
			});

			const componentElements = resolveElements(component);

			for (const element of Object.values(componentElements)) {
				if (component.contains(element)) {
					continue;
				}

				observer.observe(element, { attributes: true, attributeFilter });
			}
		},

		disconnect() {
			observer.disconnect();
		},
	};
};

/*
 * Keeps the port's domAttrs in sync with the current component: they're read when the current component changes, and
 * again whenever its structure or one of the shape's attributes changes (e.g. by undo/redo). Registers the port's
 * validateDOMAttrs and changeDOMAttrs: both normalize the attributes first. validateDOMAttrs checks only the given
 * attributes; changeDOMAttrs checks all of them once merged, writes the valid ones, then registers a snapshot boundary.
 * Returns a cleanup function.
 */
export const handleDOMAttrs = <
	TComponent extends Component,
	TShape extends ComponentAttrsShape,
>({
	currentComponentPort,
	domAttrsPort,
	editorAPI,
	componentAttrsShape,
	componentAttrValidators,
	normalizeDOMAttrs = (domAttrs) => domAttrs,
	resolveElements,
}: HandleDOMAttrsParams<TComponent, TShape>) => {
	const readDOMAttrs = (component: TComponent) => {
		const componentElements = resolveElements(component);

		return readComponentAttrs({ componentElements, componentAttrsShape });
	};

	const validateNormalizedDOMAttrs = (domAttrs: ComponentAttrs<TShape>) =>
		validateComponentAttrs({
			componentAttrs: domAttrs,
			componentAttrsShape,
			componentAttrValidators,
		});

	const domAttrsObserver = createDOMAttrsObserver({
		domAttrsPort,
		componentAttrsShape,
		readDOMAttrs,
		resolveElements,
	});

	domAttrsObserver.observe(currentComponentPort.currentComponent);

	const unsubscribeCurrentComponentUpdate =
		currentComponentPort.onCurrentComponentUpdate((currentComponent) => {
			domAttrsObserver.observe(currentComponent);
		});

	domAttrsPort.registerValidateDOMAttrs((patch) => {
		const normalizedPatch = normalizeDOMAttrs(patch);

		return validateComponentAttrsPatch({
			componentAttrsPatch: normalizedPatch,
			componentAttrsShape,
			componentAttrValidators,
		});
	});

	domAttrsPort.registerChangeDOMAttrs((patch) => {
		const { observedComponent } = domAttrsObserver;
		const { domAttrs } = domAttrsPort;

		if (!(observedComponent && domAttrs)) {
			throw new Error("No component is currently open.");
		}

		const mergedDOMAttrs = mergeComponentAttrs({
			componentAttrs: domAttrs,
			componentAttrsPatch: patch,
		});

		const normalizedDOMAttrs = normalizeDOMAttrs(mergedDOMAttrs);

		const mismatch = validateNormalizedDOMAttrs(normalizedDOMAttrs);

		if (mismatch) {
			return mismatch;
		}

		const componentElements = resolveElements(observedComponent);

		writeComponentAttrs({
			componentElements,
			componentAttrs: normalizedDOMAttrs,
		});

		// Read back right away: the Sanitizer can reject an attribute, and the observer only updates the domAttrs later
		const writtenDOMAttrs = readDOMAttrs(observedComponent);

		domAttrsPort.updateDOMAttrs(writtenDOMAttrs);

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		return null;
	});

	return () => {
		unsubscribeCurrentComponentUpdate();
		domAttrsObserver.disconnect();
	};
};
