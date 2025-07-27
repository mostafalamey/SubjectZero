if (!window.artifactList) window.artifactList = [];

window.renderArtifacts = function(container) {
  // Modal HTML (hidden by default)
  let modal = document.createElement('div');
  modal.id = 'artifactModal';
  modal.style.display = 'none';
  modal.innerHTML = `
    <div class="modal-bg"></div>
    <div class="modal-content">
      <h3 id="artifactModalTitle">Add Artifact</h3>
      <form id="artifactForm">
        <label>Name:<br><input id="artifactName" required maxlength="40"></label><br>
        <label>Description:<br><textarea id="artifactDesc" maxlength="200"></textarea></label><br>
        <label>Memory:<br><textarea id="artifactMemory" maxlength="200"></textarea></label><br>
        <label>Notes:<br><textarea id="artifactNotes" maxlength="200"></textarea></label><br>
        <div style="margin-top:12px; text-align:right;">
          <button type="submit" id="saveArtifactBtn">Save</button>
          <button type="button" id="cancelArtifactBtn">Cancel</button>
        </div>
      </form>
    </div>
  `;
  // Remove any previous modal
  let oldModal = document.getElementById('artifactModal');
  if (oldModal) oldModal.remove();
  document.body.appendChild(modal);

  // Main UI
  container.innerHTML = `
    <div class='artifacts-view'>
      <button id="addArtifactBtn" style="font-size:1.2em; padding:12px 32px; margin-bottom:24px;">+ Add New Artifact</button>
      <div style="overflow-x:auto;">
        <table class="artifact-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Memory</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="artifactTableBody"></tbody>
        </table>
      </div>
    </div>
  `;

  async function renderTable() {
    const tbody = container.querySelector('#artifactTableBody');
    tbody.innerHTML = '';
    window.artifactList.forEach((a, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML =
        `<td>${escapeHTML(a.name)}</td>`+
        `<td>${escapeHTML(a.desc)}</td>`+
        `<td>${escapeHTML(a.memory)}</td>`+
        `<td>${escapeHTML(a.notes)}</td>`+
        `<td style="white-space:nowrap;">
          <button class="editArtifactBtn" data-idx="${i}">Edit</button>
          <button class="deleteArtifactBtn" data-idx="${i}">Delete</button>
        </td>`;
      tbody.appendChild(tr);
    });
    // Attach edit/delete events
    Array.from(container.querySelectorAll('.editArtifactBtn')).forEach(btn => {
      btn.onclick = function() {
        const idx = parseInt(btn.getAttribute('data-idx'));
        openModal(window.artifactList[idx], idx);
      };
    });
    Array.from(container.querySelectorAll('.deleteArtifactBtn')).forEach(btn => {
      btn.onclick = async function() {
        const idx = parseInt(btn.getAttribute('data-idx'));
        const artifact = window.artifactList[idx];
        if (confirm('Delete this artifact?')) {
          try {
            const { error } = await window.supabase.from('artifacts').delete().eq('id', artifact.id);
            if (error) {
              alert('Error deleting artifact: ' + error.message);
              return;
            }
            window.artifactList.splice(idx, 1);
            renderTable();
          } catch (err) {
            alert('Unexpected error: ' + err);
          }
        }
      };
    });
  }

  function openModal(artifact, idx) {
    modal.style.display = '';
    document.getElementById('artifactModalTitle').textContent = artifact ? 'Edit Artifact' : 'Add Artifact';
    document.getElementById('artifactName').value = artifact ? artifact.name : '';
    document.getElementById('artifactDesc').value = artifact ? artifact.desc : '';
    document.getElementById('artifactMemory').value = artifact ? artifact.memory : '';
    document.getElementById('artifactNotes').value = artifact ? artifact.notes : '';
    document.getElementById('artifactForm').onsubmit = async function(e) {
      e.preventDefault();
      const name = document.getElementById('artifactName').value.trim();
      const desc = document.getElementById('artifactDesc').value.trim();
      const memory = document.getElementById('artifactMemory').value.trim();
      const notes = document.getElementById('artifactNotes').value.trim();
      try {
        let data, error;
        if (artifact && artifact.id) {
          ({ data, error } = await window.supabase
            .from('artifacts')
            .update({ name, desc, memory, notes })
            .eq('id', artifact.id)
            .select());
        } else {
          ({ data, error } = await window.supabase
            .from('artifacts')
            .insert([{ name, desc, memory, notes }])
            .select());
        }
        if (error) {
          alert('Error saving artifact: ' + error.message);
          return;
        }
        if (Array.isArray(data) && data.length > 0) {
          if (artifact && typeof idx === 'number') {
            window.artifactList[idx] = data[0];
          } else {
            window.artifactList.push(data[0]);
          }
        }
        modal.style.display = 'none';
        renderTable();
      } catch (err) {
        alert('Unexpected error: ' + err);
      }
    };
    document.getElementById('cancelArtifactBtn').onclick = function() {
      modal.style.display = 'none';
    };
  }

  function escapeHTML(str) {
    return String(str || '').replace(/[&<>"']/g, function(m) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'})[m];
    });
  }

  container.querySelector('#addArtifactBtn').onclick = function() { openModal(); };

  // Initial load from Supabase
  (async function() {
    try {
      const { data, error } = await window.supabase.from('artifacts').select('*');
      if (!error && Array.isArray(data)) {
        window.artifactList = data;
        renderTable();
      }
    } catch {}
  })();

  renderTable();
};
