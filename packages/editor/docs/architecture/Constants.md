# Constants

The editor's own names and values, shared across the package: component names, attribute names, part names, and the
selectors built from them. `src/Constants/` (alias `#constants`).

| Folder | What it holds |
|---|---|
| `ComponentsName/` | `componentsName` (inline and block), `isInlineComponentName` / `isBlockComponentName`, the part names (`createPart`, `todoCheckboxPart`) and their types |
| `AttrNames/` | The attributes the editor sets and styles: `blockAlignAttr`, `blockWidthAttr`, `objectFitAttr`, `aspectRatioAttr` |
| `CreateComponentSelector/` | `createComponentSelector(name)`: the attribute selector of a component's name |
| `GlyphFormatterInlineTagsOrder/` | `glyphFormatterInlineTagsOrder`: the fixed order inline tags nest in (see [SnapshotValidation](SnapshotValidation.md#what-it-does)) |
| `RootTypes/` | `rootTypes`, `isRootType` and `rootDefinitions`: the kinds of root and the state of each (see [SnapshotValidation](SnapshotValidation.md#the-root)) |
| `ComponentDefinitions/` | The state of a component's nodes, which its `create*` builds with and its snapshot validator matches against, so the two can't drift apart: `accordionItemDefinition`, `blockQuoteDefinition`, `codeBlockDefinition`, `linkDefinition`, `listDefinition`, `mediaCaptionDefinition` (Image, Video, Audio, Embed), `mentionDefinition`, `templateVariableDefinition`, `todoListDefinition` and `tableDefinition` (with `defaultTableLimits`, `maxTableHeight` and `resolveTableLimits`, its size limits). Every `allowedComponents` lists each allowed component by name, never `null`, so a new component isn't allowed anywhere until it's added. `NestedEditableDefinition` is the shared type of a NestedEditable's state |

## Rules

- **DOM-free at import time.** The snapshot validation imports `#constants` on a server (through `#dom-attrs` and its
  component validators), so nothing here may touch the DOM when it's imported. Only import `@rangex/core`,
  `#utilities` and other modules of `#constants`.
- **Only what several parts of the package share.** A value that only one module uses stays in that module (e.g. the
  storage ids in `Storage/_Constants/`, which are the format tags of stored data, not component names).
