Maze Structure: 16x16 Grid (256 Rooms)

Legend:

* N = Neutral Room (Filler, atmosphere, minor clues)
* T = Trap Room (Lethal or harmful events)
* S = Story Room (Major lore, characters, or plot progress)
* C = Character Room (Introduces or highlights a person)
* E = Ending Trigger (Final outcomes based on route)
* R = Reset Room (Death resets door locks)

Grid Layout (Each cell is a room type):

Row 0:   N  T  N  S  N  N  T  C  N  N  T  N  S  N  N  N
Row 1:   C  N  N  T  N  S  N  N  T  C  N  N  T  N  C  N
Row 2:   N  N  S  N  N  T  N  R  S  N  N  N  T  S  N  T
Row 3:   N  T  C  N  N  S  T  N  N  C  N  N  R  T  N  N
Row 4:   N  N  N  T  S  N  N  T  N  S  N  C  T  N  N  N
Row 5:   T  N  N  N  C  N  R  N  T  N  N  N  N  T  S  N
Row 6:   N  C  T  N  N  T  S  N  C  N  N  T  N  N  N  R
Row 7:   N  N  N  C  T  N  N  S  T  R  N  C  N  S  N  T
Row 8:   S  N  T  N  N  C  N  N  N  T  S  N  R  N  N  N
Row 9:   T  N  N  T  S  N  N  N  T  N  C  T  N  S  T  N
Row 10:  N  R  C  N  T  N  S  N  N  C  N  N  T  N  N  E
Row 11:  N  N  T  N  N  T  N  R  S  N  N  T  N  N  S  N
Row 12:  C  S  N  T  N  N  T  N  N  C  N  N  T  S  N  N
Row 13:  T  N  N  R  N  C  N  T  N  N  S  T  N  N  R  T
Row 14:  N  S  T  N  N  T  N  N  R  C  N  T  S  N  C  N
Row 15:  N  N  N  N  E  T  N  S  T  N  N  C  N  N  T  E

---

Key Story-Forward Rooms (S):

* 0x3: Wakes up in the first story room with flashing lights.
* 1x5: Finds first clue about his past.
* 2x2: Hears voice recording of himself.
* 4x4: Meets someone who clearly recognizes him.
* 6x6: Major confrontation with a character who accuses him.
* 8x0: Finds a video log hinting at who created the maze.
* 10x6: Learns of the experiment’s original purpose.
* 11x8: Another character sacrifices themselves.
* 12x1: Recovered full memory fragment.
* 14x1: Decides whether to escape alone or save someone.
* 15x4: Escape route #1 (Escape without truth).
* 15x15: Escape route #2 (Escape after full truth).

Reset Mechanic Rooms (R):

* 2x7, 3x12, 5x6, 6x15, 7x9, 10x1, 11x7, 13x3, 14x8

Character Highlights (C):

* Multiple characters are scattered; some will clash, some bond.
* 0x7: A scared teenager.
* 1x0: A woman who distrusts everyone.
* 3x2: A wounded man with cryptic messages.
* 6x8: A scientist with partial memory.
* 9x10: A grieving mother.
* 12x9: A manipulative stranger.

Trap Rooms (T):

* Traps include: gas, psychological hallucinations, collapsing floor, fake NPCs, moral dilemmas.
* Examples: 0x1 (gas), 3x5 (moral test), 5x0 (hallucination), 7x4 (death switch).

Ending Rooms (E):

* 10x15: Sacrifice ending.
* 15x4: Partial memory, successful escape.
* 15x15: Full memory, completed arc, saved others.

---

Notes:

* Player starts at 0x3.
* Can only move forward from room to room (no backtracking).
* Doors lock based on entry, affecting other characters.
* Dynamic interactions if two characters meet.
* Reset Rooms add replay value and fatal consequences.
* Hidden items or clues can be randomized.

This map is for development and should not be visible to players.
In-game navigation is purely narrative-driven and based on choice.
