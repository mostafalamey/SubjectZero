// Mind Map view renderer
window.renderMindMap = function(container) {
  container.innerHTML = `<h2>Mind Map</h2>
    <div id="mindmap-container" style="max-height:80vh;overflow-y:auto;"></div>
    <button id="add-mindmap-node">Add Node</button>
    <style>
      #mindmap-container::-webkit-scrollbar {
        width: 10px;
        background: #23232b;
      }
      #mindmap-container::-webkit-scrollbar-thumb {
        background: #3a3a4d;
        border-radius: 8px;
        border: 2px solid #23232b;
      }
      #mindmap-container::-webkit-scrollbar-thumb:hover {
        background: #6c63ff;
      }
      #mindmap-container {
        scrollbar-width: thin;
        scrollbar-color: #3a3a4d #23232b;
      }
    </style>`;
  if (window.mindmap && window.supabase) {
    window.mindmap.init(window.supabase).then(() => {
      document.getElementById('add-mindmap-node').onclick = function() {
        window.showMessageModal(
          `<div style='margin-bottom:8px;'>Node Title:</div><input id='mm-title' style='width:90%;margin-bottom:12px;' /><br/><div style='margin-bottom:8px;'>Node Text:</div><textarea id='mm-text' rows='4' style='width:90%;'></textarea><br/><button id='mm-add-btn' style='margin-top:12px;'>Add</button>`,
          {
            customButtons: [ { label: 'Cancel' } ]
          }
        );
        setTimeout(() => {
          const addBtn = document.getElementById('mm-add-btn');
          if (addBtn) {
            addBtn.onclick = function() {
              const titleInput = document.getElementById('mm-title');
              const textInput = document.getElementById('mm-text');
              const title = titleInput ? titleInput.value.trim() : '';
              const text = textInput ? textInput.value.trim() : '';
              if (title) {
                window.mindmap.addNode(title, null, text);
                document.getElementById('messageModal').remove();
              } else {
                window.showMessageModal('Title is required.');
              }
            };
          }
        }, 0);
      };
    });
  }
};
// mindmap.js
// Simple mind map logic for SubjectZero
// Data structure: nodes (id, label, parentId)
// Handles rendering, editing, and saving/loading via Supabase

const mindmap = {
  nodes: [],
  supabase: null,
  table: 'mindmap_nodes',

  async init(supabaseClient) {
    this.supabase = supabaseClient;
    await this.load();
    this.render();
  },

  async load() {
    const { data, error } = await this.supabase.from(this.table).select('*');
    if (!error && data) {
      this.nodes = data;
    }
  },

  async save() {
    // Upsert all nodes
    for (const node of this.nodes) {
      await this.supabase.from(this.table).upsert([node]);
    }
  },

  addNode(title, parentId = null, text = '') {
    const id = Date.now().toString();
    this.nodes.push({ id, title, parentId, text });
    this.render();
    this.save();
  },

  render() {
    const container = document.getElementById('mindmap-container');
    if (!container) return;
    container.innerHTML = '';
    // Selectable box with edit/delete
    const renderNode = (node, depth = 0) => {
      const div = document.createElement('div');
      div.style.marginLeft = depth * 24 + 'px';
      div.className = 'mindmap-node';
      div.style.border = '1.5px solid #3a3a4d';
      div.style.borderRadius = '12px';
      div.style.padding = '18px 22px';
      div.style.marginBottom = '16px';
      div.style.background = '#23232b';
      div.style.boxShadow = '0 2px 8px rgba(40,40,60,0.18)';
      div.style.cursor = 'pointer';
      div.style.transition = 'box-shadow 0.2s, border-color 0.2s';
      div.onmouseover = () => { div.style.boxShadow = '0 4px 16px rgba(40,40,60,0.32)'; div.style.borderColor = '#6c63ff'; };
      div.onmouseout = () => { div.style.boxShadow = '0 2px 8px rgba(40,40,60,0.18)'; div.style.borderColor = '#3a3a4d'; };
      div.innerHTML = `<div style="font-weight:600;font-size:1.15em;color:#f7f7fa;margin-bottom:6px;">${node.title}</div><div style="color:#e0e0e6;font-size:1em;white-space:pre-wrap;">${node.text || ''}</div>`;

      // Selection logic
      div.onclick = (e) => {
        e.stopPropagation();
        // Highlight selected
        document.querySelectorAll('.mindmap-node.selected').forEach(n => n.classList.remove('selected'));
        div.classList.add('selected');
        // Show edit/delete buttons
        showNodeActions(node, div);
      };
      container.appendChild(div);
      this.nodes.filter(n => n.parentId === node.id).forEach(child => renderNode(child, depth + 1));
    };
    this.nodes.filter(n => !n.parentId).forEach(root => renderNode(root));

    // Helper to show edit/delete actions
    function showNodeActions(node, nodeDiv) {
      // Remove any previous actions
      document.querySelectorAll('.mindmap-actions').forEach(a => a.remove());
      const actions = document.createElement('div');
      actions.className = 'mindmap-actions';
      actions.style.marginTop = '8px';
      actions.innerHTML = `
        <button id='mm-edit'>Edit</button>
        <button id='mm-delete'>Delete</button>
      `;
      nodeDiv.appendChild(actions);
      // Edit handler
      actions.querySelector('#mm-edit').onclick = (e) => {
        e.stopPropagation();
        window.showMessageModal(
          `<div style='margin-bottom:8px;'>Edit Title:</div><input id='mm-title-edit' style='width:90%;margin-bottom:12px;' value="${node.title}" /><br/><div style='margin-bottom:8px;'>Edit Text:</div><textarea id='mm-text-edit' rows='4' style='width:90%;'>${node.text || ''}</textarea><br/><button id='mm-save-btn' style='margin-top:12px;'>Save</button>`,
          {
            customButtons: [ { label: 'Cancel' } ]
          }
        );
        setTimeout(() => {
          const saveBtn = document.getElementById('mm-save-btn');
          if (saveBtn) {
            saveBtn.onclick = function() {
              const titleInput = document.getElementById('mm-title-edit');
              const textInput = document.getElementById('mm-text-edit');
              const title = titleInput ? titleInput.value.trim() : '';
              const text = textInput ? textInput.value.trim() : '';
              if (title) {
                node.title = title;
                node.text = text;
                window.mindmap.save();
                window.mindmap.render();
                document.getElementById('messageModal').remove();
              } else {
                window.showMessageModal('Title is required.');
              }
            };
          }
        }, 0);
      };
      // Delete handler
      actions.querySelector('#mm-delete').onclick = (e) => {
        e.stopPropagation();
        window.showMessageModal(
          `Delete this node?`,
          {
            customButtons: [
              {
                label: 'Delete',
                onClick: () => {
                  window.mindmap.deleteNode(node.id);
                  window.mindmap.render();
                }
              },
              { label: 'Cancel' }
            ]
          }
        );
      };
    }
  },

  // Delete node and its children
  async deleteNode(id) {
    // Remove node and all children recursively
    const removeIds = [id];
    const collect = (nid) => {
      this.nodes.filter(n => n.parentId === nid).forEach(child => {
        removeIds.push(child.id);
        collect(child.id);
      });
    };
    collect(id);
    this.nodes = this.nodes.filter(n => !removeIds.includes(n.id));
    await this.supabase.from(this.table).delete().in('id', removeIds);
    this.save();
  }
};

window.mindmap = mindmap;
