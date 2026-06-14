import { createSignal, createUniqueId, Index } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";

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
	const rows = 10;
	const cols = 10;
	const size = 12;

	const { toolbarButtonsActionManager, nodeInsertionButtonsStateManager } =
		useToolbarButtonManagersContext();

	const { table } = nodeInsertionButtonsStateManager;

	const [checked, setChecked] = createSignal(false);
	const [disabled, setDisabled] = createSignal(table.disabled);
	const [grid, setGrid] = createSignal<Grid>(createGrid(rows, cols));
	const [selectedCellPos, setSelectedCellPos] = createSignal({
		row: 0,
		col: 0,
	});

	nodeInsertionButtonsStateManager.subscribe({
		type: toolbarButtonsName.table,
		callback: (state) => {
			setDisabled(state.disabled);
		},
	});

	const popoverId = createUniqueId();

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

	const updateCellsState = (event: PointerEvent) => {
		const { currentTarget } = event;

		if (!(currentTarget instanceof HTMLButtonElement)) {
			throw new Error("CurrentTarget's type is invalid.");
		}

		const rowIndexAttr = currentTarget.getAttribute(dataRowIndex);
		const colIndexAttr = currentTarget.getAttribute(dataColIndex);

		if (rowIndexAttr === null || colIndexAttr === null) {
			throw new Error("Indexes can't be null.");
		}

		const currentRowIndex = +rowIndexAttr;
		const currentColIndex = +colIndexAttr;

		setSelectedCellPos({ row: currentRowIndex + 1, col: currentColIndex + 1 });

		setGrid((prev) => {
			const clonedGrid = structuredClone(prev);

			for (let rowIndex = 0; rowIndex < clonedGrid.length; rowIndex++) {
				const row = clonedGrid[rowIndex];

				for (let colIndex = 0; colIndex < row.length; colIndex++) {
					row[colIndex].isActive =
						rowIndex <= currentRowIndex && colIndex <= currentColIndex;
				}
			}

			return clonedGrid;
		});
	};

	const emitTableInsertionInfo = () => {
		toolbarButtonsActionManager.emitNodeInsertionChange({
			type: toolbarButtonsName.table,
			row: selectedCellPos().row,
			column: selectedCellPos().col,
		});
	};

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				hasChevron={true}
				commandfor={popoverId}
				command="toggle-popover"
			>
				<Icon name="Table" class="size-4" />
			</ToolbarButton>
			<div
				id={popoverId}
				popover="auto"
				class="absolute top-[anchor(bottom)] mt-1 rounded-sm bg-white p-1 shadow-md [justify-self:anchor-center]"
				on:toggle={onPopoverToggle}
			>
				<div
					class="mb-1 grid leading-0"
					style={{
						"grid-template-rows": `repeat(${rows}, ${size}px)`,
						"grid-template-columns": `repeat(${cols}, ${size}px)`,
					}}
				>
					<Index each={grid()}>
						{(row) => (
							<Index each={row()}>
								{(cell) => {
									return (
										<button
											type="button"
											popovertarget={popoverId}
											popovertargetaction="hide"
											class="p-px"
											{...{
												[dataRowIndex]: cell().rowIndex,
												[dataColIndex]: cell().colIndex,
											}}
											on:pointerenter={updateCellsState}
											on:click={emitTableInsertionInfo}
										>
											<span
												class="pointer-events-none inline-block h-full w-full rounded-xs border transition-colors"
												classList={{
													"border-neutral-300": !cell().isActive,
													"border-primary-500 bg-primary-500/20":
														cell().isActive,
												}}
											></span>
										</button>
									);
								}}
							</Index>
						)}
					</Index>
				</div>
				<div class="flex justify-center gap-2 font-mono font-semibold text-xs">
					<span>Col: {selectedCellPos().col}</span>
					<span>Row: {selectedCellPos().row}</span>
				</div>
			</div>
		</span>
	);
};
