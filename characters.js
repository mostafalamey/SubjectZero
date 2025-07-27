if (!window.characterList) window.characterList = [];

window.renderCharacters = function(container) {
  // Modal HTML (hidden by default)
  let modal = document.createElement('div');
  modal.id = 'characterModal';
  modal.style.display = 'none';
  modal.innerHTML = `
    <div class="modal-bg"></div>
    <div class="modal-content">
      <h3 id="modalTitle">Add Character</h3>
      <form id="characterForm">
        <label>Name:<br><input id="charName" required maxlength="40"></label><br>
        <label>Relation:<br>
          <select id="charRelation">
            <option>Wife</option>
            <option>Son</option>
            <option>Daughter</option>
            <option>Father</option>
            <option>Friend</option>
            <option>Cousin</option>
            <option>Coworker</option>
          </select>
        </label><br>
        <label>Description:<br><textarea id="charDesc" maxlength="200"></textarea></label><br>
        <label>Story:<br><textarea id="charStory" maxlength="200"></textarea></label><br>
        <label>Notes:<br><textarea id="charNotes" maxlength="200"></textarea></label><br>
        <div style="margin-top:12px; text-align:right;">
          <button type="submit" id="saveCharBtn">Save</button>
          <button type="button" id="cancelCharBtn">Cancel</button>
        </div>
      </form>
    </div>
  `;
  // Remove any previous modal
  let oldModal = document.getElementById('characterModal');
  if (oldModal) oldModal.remove();
  document.body.appendChild(modal);

  // Main UI
  container.innerHTML = `
    <div class='characters-view'>
      <button id="addCharBtn" style="font-size:1.2em; padding:12px 32px; margin-bottom:24px;">+ Add New Character</button>
      <div style="overflow-x:auto;">
        <table class="char-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Relation</th>
              <th>Description</th>
              <th>Story</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="charTableBody"></tbody>
        </table>
      </div>
    </div>
  `;

  async function renderTable() {
    const tbody = container.querySelector('#charTableBody');
    tbody.innerHTML = '';
    window.characterList.forEach((c, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML =
        `<td>${escapeHTML(c.name)}</td>`+
        `<td>${escapeHTML(c.relation)}</td>`+
        `<td>${escapeHTML(c.description)}</td>`+
        `<td>${escapeHTML(c.story)}</td>`+
        `<td>${escapeHTML(c.notes)}</td>`+
        `<td style="white-space:nowrap;">
          <button class="editCharBtn" data-idx="${i}" title="Edit">
            <i class="fa fa-pencil-alt" aria-hidden="true"></i>
          </button>
          <button class="deleteCharBtn" data-idx="${i}" title="Delete">
            <i class="fa fa-trash" aria-hidden="true" style="color:#e57373;"></i>
          </button>
        </td>`;
      tbody.appendChild(tr);
    });
    // Attach edit/delete events
    Array.from(container.querySelectorAll('.editCharBtn')).forEach(btn => {
      btn.onclick = function() { openModal(parseInt(btn.getAttribute('data-idx'), 10)); };
    });
    Array.from(container.querySelectorAll('.deleteCharBtn')).forEach(btn => {
      btn.onclick = function() {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const char = window.characterList[idx];
        window.showMessageModal('Are you sure you want to delete this character?', {
          confirm: true,
          onConfirm: async function() {
            try {
              if (char && char.id) {
                // Check if character is referenced in any room
                const { data: usedRooms, error: roomError } = await window.supabase
                  .from('rooms')
                  .select('id')
                  .eq('character_id', char.id);
                if (roomError) {
                  window.showMessageModal('Error checking rooms: ' + roomError.message);
                  return;
                }
                if (Array.isArray(usedRooms) && usedRooms.length > 0) {
                  window.showMessageModal(
                    'Cannot delete: This character is used in one or more rooms.',
                    {
                      // Custom button: Unlink and Delete
                      customButtons: [
                        {
                          label: 'Unlink from all rooms and Delete',
                          async onClick() {
                            try {
                              // Unlink character from all rooms
                              const { error: unlinkError } = await window.supabase
                                .from('rooms')
                                .update({ character_id: null })
                                .eq('character_id', char.id);
                              if (unlinkError) {
                                window.showMessageModal('Error unlinking character from rooms: ' + unlinkError.message);
                                return;
                              }
                              // Now delete the character
                              const { error: delError } = await window.supabase.from('characters').delete().eq('id', char.id);
                              if (delError) {
                                window.showMessageModal('Error deleting character: ' + delError.message);
                                return;
                              }
                              window.characterList.splice(idx, 1);
                              renderTable();
                            } catch (err) {
                              window.showMessageModal('Unexpected error: ' + err);
                            }
                          }
                        }
                      ],
                      onClose: function() {}
                    }
                  );
                  return;
                }
                const { error } = await window.supabase.from('characters').delete().eq('id', char.id);
                if (error) {
                  window.showMessageModal('Error deleting character: ' + error.message);
                  return;
                }
              }
              window.characterList.splice(idx, 1);
              renderTable();
            } catch (err) {
              window.showMessageModal('Unexpected error: ' + err);
            }
          }
        });
      };
    });
  }

  // Load characters from Supabase on first render
  (async function loadCharacters() {
    try {
      const { data, error } = await window.supabase
        .from('characters')
        .select('*');
      if (error) {
        alert('Error loading characters: ' + error.message);
      } else if (Array.isArray(data)) {
        window.characterList = data;
      }
    } catch (err) {
      alert('Unexpected error loading characters: ' + err);
    }
    renderTable();
  })();

  function openModal(idx) {
    const editing = typeof idx === 'number';
    modal.style.display = '';
    document.getElementById('modalTitle').textContent = editing ? 'Edit Character' : 'Add Character';
    const form = document.getElementById('characterForm');
    // Fill fields if editing
    if (editing) {
      const c = window.characterList[idx];
      form.charName.value = c.name;
      form.charRelation.value = c.relation;
      form.charDesc.value = c.description;
      form.charStory.value = c.story;
      form.charNotes.value = c.notes;
    } else {
      form.charName.value = '';
      form.charRelation.value = 'Wife';
      form.charDesc.value = '';
      form.charStory.value = '';
      form.charNotes.value = '';
    }
    form.onsubmit = async function(e) {
      e.preventDefault();
      let newChar;
      if (editing) {
        newChar = {
          id: window.characterList[idx].id,
          name: form.charName.value.trim(),
          relation: form.charRelation.value,
          description: form.charDesc.value.trim(),
          story: form.charStory.value.trim(),
          notes: form.charNotes.value.trim()
        };
      } else {
        newChar = {
          name: form.charName.value.trim(),
          relation: form.charRelation.value,
          description: form.charDesc.value.trim(),
          story: form.charStory.value.trim(),
          notes: form.charNotes.value.trim()
        };
      }
      // Save to Supabase
      try {
        const { data, error } = await window.supabase
          .from('characters')
          .upsert([newChar], { onConflict: editing ? ['id'] : undefined })
          .select();
        if (error) {
          alert('Error saving character: ' + error.message);
          return;
        }
        if (Array.isArray(data) && data.length > 0) {
          if (editing) {
            window.characterList[idx] = data[0];
          } else {
            window.characterList.push(data[0]);
          }
        }
        modal.style.display = 'none';
        renderTable();
      } catch (err) {
        alert('Unexpected error: ' + err);
      }
    };
    document.getElementById('cancelCharBtn').onclick = function() {
      modal.style.display = 'none';
    };
  }

  function escapeHTML(str) {
    return String(str || '').replace(/[&<>"']/g, function(m) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'})[m];
    });
  }

  container.querySelector('#addCharBtn').onclick = function() { openModal(); };
  renderTable();
};
