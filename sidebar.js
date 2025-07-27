window.renderSidebar = function(container) {
  container.innerHTML = `
    <div class="sidebar-header">SubjectZero</div>
    <div class="sidebar-tabs">
    <button class="sidebar-tab" id="tab-maze">Maze Editor</button>
      <button class="sidebar-tab" id="tab-characters">Characters</button>
      <button class="sidebar-tab" id="tab-artifacts">Artifacts</button>
    </div>
  `;
    // make the maze editor the default active tab
    document.getElementById('tab-maze').classList.add('active');

    document.getElementById('tab-characters').onclick = () => {
        window.showView('characters');
        document.querySelectorAll('.sidebar-tab').forEach(btn => btn.classList.remove('active'));
        document.getElementById('tab-characters').classList.add('active');
    }
    document.getElementById('tab-artifacts').onclick = () => {
        window.showView('artifacts');
        document.querySelectorAll('.sidebar-tab').forEach(btn => btn.classList.remove('active'));
        document.getElementById('tab-artifacts').classList.add('active');
    }
    document.getElementById('tab-maze').onclick = () => {
        window.showView('maze');
        document.querySelectorAll('.sidebar-tab').forEach(btn => btn.classList.remove('active'));
        document.getElementById('tab-maze').classList.add('active');
    }
};
