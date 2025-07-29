window.renderSidebar = function(container) {
  container.innerHTML = `
    <div class="sidebar-header">SubjectZero</div>
    <div class="sidebar-tabs">
      <button class="sidebar-tab" id="tab-mindmap">Mind Map</button>
      <button class="sidebar-tab" id="tab-maze">Maze Editor</button>
      <button class="sidebar-tab" id="tab-characters">Characters</button>
      <button class="sidebar-tab" id="tab-artifacts">Artifacts</button>
    </div>
  `;

  // make the maze editor the default active tab
  // Determine which tab to activate (default: maze)
  let lastTab = localStorage.getItem('sz-selected-tab') || 'maze';
  document.getElementById('tab-' + lastTab).classList.add('active');

  function activateTab(tab) {
    window.showView(tab);
    document.querySelectorAll('.sidebar-tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    localStorage.setItem('sz-selected-tab', tab);
  }

  document.getElementById('tab-characters').onclick = () => activateTab('characters');
  document.getElementById('tab-artifacts').onclick = () => activateTab('artifacts');
  document.getElementById('tab-maze').onclick = () => activateTab('maze');
  document.getElementById('tab-mindmap').onclick = () => activateTab('mindmap');
  // ...existing code...
};
