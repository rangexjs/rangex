import { ReadOnly, Table } from "@rangex/solid";
import { createMemo, createSignal, createUniqueId, For } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

interface Cell {
	rowIndex: number;
	colIndex: number;
	isActive: boolean;
}

type Grid = Cell[][];

const createGrid = (rows: number, cols: number): Grid => {
	return Array.from({ length: rows }, (_rowVal, rowIndex) => {
		return Array.from({ length: cols }, (_colVal, colIndex) => {
			return { rowIndex, colIndex, isActive: false };
		});
	});
};

export const TableToolbarButton = () => {
	const editor = useEditorContext();
	const { table, readOnly } = editor;

	if (!table) {
		throw new Error("Table can't be undefined.");
	}

	const $table = Table(table);
	const $readOnly = ReadOnly(readOnly);

	const rows = 10;
	const cols = 10;
	const size = 12;

	const [checked, setChecked] = createSignal(false);
	const [grid, setGrid] = createSignal<Grid>(createGrid(rows, cols));
	const [selectedCellPos, setSelectedCellPos] = createSignal({
		row: 0,
		col: 0,
	});

	const popoverId = createUniqueId();

	let gridElement: HTMLDivElement | undefined;

	const dataRowIndex = "data-row-index";
	const dataColIndex = "data-col-index";

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");

		if (newState === "closed") {
			const clonedGrid = structuredClone(grid());

			for (const row of clonedGrid) {
				for (const cell of row) {
					cell.isActive = false;
				}
			}

			setGrid(clonedGrid);
			setSelectedCellPos({ row: 0, col: 0 });
		}
	};

	const getCellPos = (event: Event) => {
		const { currentTarget } = event;

		if (!(currentTarget instanceof HTMLButtonElement)) {
			throw new Error("CurrentTarget's type is invalid.");
		}

		const rowIndexAttr = currentTarget.getAttribute(dataRowIndex);
		const colIndexAttr = currentTarget.getAttribute(dataColIndex);

		if (rowIndexAttr === null || colIndexAttr === null) {
			throw new Error("Indexes can't be null.");
		}

		return { row: +rowIndexAttr + 1, col: +colIndexAttr + 1 };
	};

	const onPopoverFocusOut = (event: FocusEvent) => {
		const { currentTarget, relatedTarget } = event;

		if (!(currentTarget instanceof HTMLElement)) {
			throw new Error("CurrentTarget's type is invalid.");
		}

		if (!(relatedTarget instanceof Node)) {
			return;
		}

		if (currentTarget.contains(relatedTarget)) {
			return;
		}

		currentTarget.hidePopover();
	};

	const updateCellsState = (event: Event) => {
		const cellPos = getCellPos(event);

		setSelectedCellPos(cellPos);

		setGrid((prev) => {
			const clonedGrid = structuredClone(prev);

			for (let rowIndex = 0; rowIndex < clonedGrid.length; rowIndex++) {
				const row = clonedGrid[rowIndex];

				for (let colIndex = 0; colIndex < row.length; colIndex++) {
					row[colIndex].isActive =
						rowIndex < cellPos.row && colIndex < cellPos.col;
				}
			}

			return clonedGrid;
		});
	};

	const insertTable = (event: MouseEvent) => {
		const cellPos = getCellPos(event);

		table.insert({ row: cellPos.row, column: cellPos.col });
	};

	const arrowKeyOffsets: Record<string, { row: number; col: number }> = {
		ArrowUp: { row: -1, col: 0 },
		ArrowDown: { row: 1, col: 0 },
		ArrowLeft: { row: 0, col: -1 },
		ArrowRight: { row: 0, col: 1 },
	};

	const navigateCells = (event: KeyboardEvent) => {
		const offset = arrowKeyOffsets[event.key];

		if (!offset) {
			return;
		}

		event.preventDefault();

		const cellPos = getCellPos(event);
		const nextRowIndex = Math.min(
			Math.max(cellPos.row - 1 + offset.row, 0),
			rows - 1,
		);
		const nextColIndex = Math.min(
			Math.max(cellPos.col - 1 + offset.col, 0),
			cols - 1,
		);

		const nextCell = gridElement?.querySelector<HTMLButtonElement>(
			`[${dataRowIndex}="${nextRowIndex}"][${dataColIndex}="${nextColIndex}"]`,
		);

		nextCell?.focus();
	};

	const disabled = createMemo(
		() => !$table.canInsert() || !!$readOnly?.checked(),
	);

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				hasChevron={true}
				commandfor={popoverId}
				command="toggle-popover"
			>
				<Icon name="Table" title="Table" class="size-4" />
			</ToolbarButton>
			<div
				id={popoverId}
				popover="auto"
				role="dialog"
				aria-label="Insert table"
				class="absolute mt-1 rounded-sm bg-white p-1 shadow-md [position-area:center_bottom] dark:bg-neutral-900"
				onToggle={onPopoverToggle}
				onFocusOut={onPopoverFocusOut}
			>
				<div
					ref={gridElement}
					class="mb-1 grid leading-0"
					style={{
						"grid-template-rows": `repeat(${rows}, ${size}px)`,
						"grid-template-columns": `repeat(${cols}, ${size}px)`,
					}}
				>
					<For each={grid()} keyed={false}>
						{(row) => (
							<For each={row()} keyed={false}>
								{(cell) => {
									return (
										<button
											type="button"
											popovertarget={popoverId}
											popovertargetaction="hide"
											class="p-px"
											aria-label={`Insert ${cell().rowIndex + 1} x ${cell().colIndex + 1} table`}
											{...{
												[dataRowIndex]: cell().rowIndex,
												[dataColIndex]: cell().colIndex,
											}}
											onPointerEnter={updateCellsState}
											onFocus={updateCellsState}
											onClick={insertTable}
											onKeyDown={navigateCells}
										>
											<span
												class={[
													"pointer-events-none inline-block h-full w-full rounded-xs border transition-colors",
													{
														"border-neutral-300 dark:border-neutral-600":
															!cell().isActive,
														"border-primary-500 bg-primary-500/20":
															cell().isActive,
													},
												]}
											/>
										</button>
									);
								}}
							</For>
						)}
					</For>
				</div>
				<div
					aria-hidden="true"
					class="flex justify-center gap-2 font-mono font-semibold text-neutral-700 text-xs dark:text-neutral-300"
				>
					<span>Col: {selectedCellPos().col}</span>
					<span>Row: {selectedCellPos().row}</span>
				</div>
			</div>
		</span>
	);
};
