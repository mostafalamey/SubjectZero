# Copilot Instructions for SubjectZero Maze Project

## Project Overview
- This project is a narrative-driven maze game prototype, currently implemented as a static HTML/JavaScript editor for a 16x16 room grid.
- The main file is `index.html`, which provides a visual grid for editing room types, IDs, and descriptions. The map is based on the design in `map.md`.
- There is no build system, backend, or external dependencies; all logic is in the HTML and JavaScript in `index.html`.

## Key Files
- `index.html`: Main interactive editor for the maze. All UI, logic, and data are in this file.
- `map.md`: Contains the original maze design, room types, and narrative notes. Use this as the source of truth for room types and story structure.

## Patterns & Conventions
- The maze is a 16x16 grid. Each room has:
  - `id` (e.g., `0x3`),
  - `type` (N, T, S, C, E, R),
  - `desc` (editable description).
- Room data is initialized from the `initialMap` array in JavaScript, matching the layout in `map.md`.
- All editing is done client-side; there is no persistence or export by default.
- UI is intentionally simple but visually clear, using color-coded room types.

## Extending Functionality
- To add features (e.g., save/export, import from `map.md`, or advanced navigation), extend `maze.html` and keep UI minimalistic.
- When adding new room types or properties, update both the `initialMap` and the editor UI.
- If introducing persistence, prefer JSON export/import for room data.

## Example: Adding a New Room Type
1. Add the new type to the `initialMap` and update the color/style in the CSS.
2. Add an `<option>` in the room type `<select>` in the editor.
3. Update any logic that depends on room types.

## No Build or Test Workflow
- There are no build scripts, tests, or package managers. All changes are made directly to the HTML/JS.
- To test, open `maze.html` in a browser.

## Integration Points
- None currently. All logic is self-contained.

## Special Notes
- The map and editor are for development only and should not be exposed to end users.
- The narrative and room logic are driven by the structure in `map.md`.

---

If you add new files or workflows, update this document to keep future AI agents productive.
