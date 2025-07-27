
// Maze editor state (shared across renders)
if (!window._mazeEditorState) {
  window._mazeEditorState = {
    rooms: null,
    selectedRoom: null
  };
}

window.renderMazeEditor = async function (container) {
  // HTML structure (no save/load buttons)
  container.innerHTML = `
    <div id="main">
      <div style="display: flex; flex-direction: column; align-items: flex-start;">
        <div style="display: flex; flex-direction: row; align-items: flex-start; margin-left: 42px; height: 12px;">
          <div id="colNumbers" style="display: flex; flex-direction: row; align-items: center; justify-content: center;"></div>
        </div>
        <div style="display: flex; flex-direction: row;">
          <div id="rowNumbers" style="display: flex; flex-direction: column; margin-top: 12px; align-items: center; justify-content: center;"></div>
          <div id="maze" style="display: grid; grid-template-columns: repeat(16, 42px); grid-template-rows: repeat(16, 42px); gap: 8px;"></div>
        </div>
      </div>
      <div id="editor">
        <label>Room Position: <span id="roomPos" style="display:inline-block; min-width:100px;"></span></label>
        <label>Room Type:
          <select id="roomType">
              <option value="A">Starting Room (A)</option>
              <option value="N">Neutral (N)</option>
              <option value="T">Trap (T)</option>
              <option value="S">Story (S)</option>
              <option value="E">Encounter (E)</option>
              <option value="M">Memory (M)</option>
              <option value="P">Puzzle (P)</option>
              <option value="C">Clue (C)</option>
              <option value="X">Exit (X)</option>
          </select>
        </label>
        <label id="characterSelectorLabel" style="display:none;">
          Character:
          <select id="characterSelector"></select>
        </label>
        <label id="artifactSelectorLabel" style="display:none;">
          Artifact:
          <select id="artifactSelector"></select>
        </label>
        <label>Description:
          <textarea id="roomDesc" maxlength="400"></textarea>
        </label>
      </div>
    </div>
  `;

  // DOM refs (scoped to container)
  const maze = container.querySelector('#maze');
  const colNumbers = container.querySelector('#colNumbers');
  const rowNumbers = container.querySelector('#rowNumbers');
  const roomPosSpan = container.querySelector('#roomPos');
  const roomTypeInput = container.querySelector('#roomType');
  const roomDescInput = container.querySelector('#roomDesc');
  const characterSelectorLabel = container.querySelector('#characterSelectorLabel');
  const characterSelector = container.querySelector('#characterSelector');
  const artifactSelectorLabel = container.querySelector('#artifactSelectorLabel');
  const artifactSelector = container.querySelector('#artifactSelector');

  // State
  let rooms = window._mazeEditorState.rooms;
  let selectedRoom = window._mazeEditorState.selectedRoom;

  // Load rooms from Supabase or initialize
  async function loadRooms() {
    if (rooms && Array.isArray(rooms) && rooms.length === 256) return;
    try {
      const { data, error } = await window.supabase.from('rooms').select('*');
      if (error) {
        alert('Error loading rooms: ' + error.message);
        rooms = [];
      } else if (Array.isArray(data) && data.length === 256) {
        rooms = data;
      } else {
        // If table is empty, insert all rooms as neutral
        const initialRooms = [];
        for (let y = 0; y < 16; y++) {
          for (let x = 0; x < 16; x++) {
            initialRooms.push({
              position: `${y}x${x}`,
              type: 'N',
              desc: ''
            });
          }
        }
        try {
          const { error: insertError } = await window.supabase.from('rooms').upsert(initialRooms);
          if (insertError) alert('Error initializing rooms: ' + insertError.message);
        } catch (err) {
          alert('Unexpected error initializing rooms: ' + err);
        }
        rooms = initialRooms;
      }
      window._mazeEditorState.rooms = rooms;
    } catch (err) {
      alert('Unexpected error loading rooms: ' + err);
      rooms = [];
    }
  }

  // Render column and row numbers
  function renderNumbers() {
    if (colNumbers) {
      colNumbers.innerHTML = '';
      for (let x = 0; x < 16; x++) {
        const col = document.createElement('div');
        col.textContent = x;
        col.style.width = '42px';
        col.style.height = '42px';
        col.style.display = 'flex';
        col.style.alignItems = 'center';
        col.style.justifyContent = 'center';
        col.style.color = '#bfc9e0';
        col.style.fontSize = '1rem';
        col.style.fontWeight = 'bold';
        if (x > 0) col.style.marginLeft = '8px';
        colNumbers.appendChild(col);
      }
    }
    if (rowNumbers) {
      rowNumbers.innerHTML = '';
      for (let y = 0; y < 16; y++) {
        const row = document.createElement('div');
        row.textContent = y;
        row.style.width = '42px';
        row.style.height = '42px';
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.justifyContent = 'center';
        row.style.color = '#bfc9e0';
        row.style.fontSize = '1rem';
        row.style.fontWeight = 'bold';
        if (y > 0) row.style.marginTop = '8px';
        rowNumbers.appendChild(row);
      }
    }
  }

  // Render the maze grid
  function renderMaze() {
    maze.innerHTML = '';
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const pos = `${y}x${x}`;
        const room = rooms.find(r => r.position === pos);
        const div = document.createElement('div');
        div.className = `room ${room ? room.type : 'N'}` + ((selectedRoom && room && selectedRoom.position === room.position) ? ' selected' : '');
        div.textContent = room ? room.type : '';
        div.title = room ? (room.position) : pos;
        div.style.width = '42px';
        div.style.height = '42px';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.style.cursor = 'pointer';
        div.addEventListener('click', () => selectRoom(pos));
        maze.appendChild(div);
      }
    }
  }

  // Clear the editor fields
  function clearEditor() {
    roomPosSpan.textContent = '';
    roomTypeInput.value = 'N';
    roomDescInput.value = '';
    characterSelectorLabel.style.display = 'none';
    characterSelector.innerHTML = '';
  }

  // Update the editor fields for the selected room
  function updateEditor(room) {
    if (!room) {
      clearEditor();
      return;
    }
    roomPosSpan.textContent = room.position;
    roomTypeInput.value = room.type || 'N';
    roomDescInput.value = room.desc || '';
    updateCharacterSelector(room);
    updateArtifactSelector(room);
  }

  // Show/hide and populate the artifact selector for Memory rooms
  async function updateArtifactSelector(room) {
    if (!room || roomTypeInput.value !== 'M') {
      artifactSelectorLabel.style.display = 'none';
      artifactSelector.innerHTML = '';
      return;
    }
    artifactSelectorLabel.style.display = '';
    artifactSelector.innerHTML = '';
    let artifacts = Array.isArray(window.artifactList) ? window.artifactList : [];
    if (!artifacts || artifacts.length === 0) {
      try {
        const { data, error } = await window.supabase.from('artifacts').select('id, name');
        if (!error && Array.isArray(data)) {
          artifacts = data;
          window.artifactList = artifacts;
        }
      } catch {}
    }
    if (!artifacts || artifacts.length === 0) {
      artifactSelector.innerHTML = '<option value="">(No artifacts)</option>';
    } else {
      artifacts.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.id;
        opt.textContent = a.name || a.id;
        artifactSelector.appendChild(opt);
      });
    }
    artifactSelector.value = room.artifact_id || '';
  }

  // Show/hide and populate the character selector for Encounter rooms
  async function updateCharacterSelector(room) {
    if (!room || roomTypeInput.value !== 'E') {
      characterSelectorLabel.style.display = 'none';
      characterSelector.innerHTML = '';
      return;
    }
    characterSelectorLabel.style.display = '';
    characterSelector.innerHTML = '';
    let chars = Array.isArray(window.characterList) ? window.characterList : [];
    if (!chars || chars.length === 0) {
      try {
        const { data, error } = await window.supabase.from('characters').select('id, name');
        if (!error && Array.isArray(data)) {
          chars = data;
          window.characterList = chars;
        }
      } catch {}
    }
    if (!chars || chars.length === 0) {
      characterSelector.innerHTML = '<option value="">(No characters)</option>';
    } else {
      chars.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name || c.id;
        characterSelector.appendChild(opt);
      });
    }
    characterSelector.value = room.character_id || '';
  }

  // Select a room by position
  function selectRoom(position) {
    const room = rooms.find(r => r.position === position);
    selectedRoom = room || null;
    window._mazeEditorState.selectedRoom = selectedRoom;
    updateEditor(selectedRoom);
    renderMaze();
  }

  // Update a room in Supabase and local state
  async function updateRoomField(field, value) {
    if (!selectedRoom) return;
    selectedRoom[field] = value;
    try {
      const { error } = await window.supabase.from('rooms').upsert([selectedRoom]);
      if (error) alert('Error updating room: ' + error.message);
    } catch (err) {
      alert('Unexpected error updating room: ' + err);
    }
    renderMaze();
  }

  // Event listeners
  roomTypeInput.addEventListener('input', async function() {
    if (!selectedRoom) return;
    selectedRoom.type = roomTypeInput.value;
    await updateCharacterSelector(selectedRoom);
    await updateArtifactSelector(selectedRoom);
    await updateRoomField('type', roomTypeInput.value);
  });
  artifactSelector.addEventListener('input', async function() {
    if (!selectedRoom) return;
    selectedRoom.artifact_id = artifactSelector.value;
    await updateRoomField('artifact_id', artifactSelector.value);
  });
  characterSelector.addEventListener('input', async function() {
    if (!selectedRoom) return;
    selectedRoom.character_id = characterSelector.value;
    await updateRoomField('character_id', characterSelector.value);
  });
  roomDescInput.addEventListener('input', async function() {
    if (!selectedRoom) return;
    selectedRoom.desc = roomDescInput.value;
    await updateRoomField('desc', roomDescInput.value);
  });

  // Initial load
  await loadRooms();
  renderNumbers();
  renderMaze();
  clearEditor();
  window._mazeEditorState.rooms = rooms;
  window._mazeEditorState.selectedRoom = selectedRoom;
}