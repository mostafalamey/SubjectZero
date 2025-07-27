// Simple floating message modal for reuse
(function() {
  if (window.showMessageModal) return;

  function showMessageModal(message, options = {}) {
    // Remove any existing modal
    let old = document.getElementById('messageModal');
    if (old) old.remove();
    // Modal structure
    const modal = document.createElement('div');
    modal.id = 'messageModal';
    modal.innerHTML = `
      <div class="modal-bg"></div>
      <div class="modal-content" style="min-width:340px;max-width:90vw;text-align:center;">
        <div style="margin-bottom:18px;font-size:1.1em;">${message}</div>
        <button id="closeMessageModal" style="margin-top:8px;">OK</button>
      </div>
    `;
    document.body.appendChild(modal);
    // Close logic
    // Support customButtons option
    const okBtn = document.getElementById('closeMessageModal');
    const content = modal.querySelector('.modal-content');
    if (options && Array.isArray(options.customButtons) && options.customButtons.length > 0) {
      // Remove default OK button
      if (okBtn) content.removeChild(okBtn);
      const btnRow = document.createElement('div');
      btnRow.style.marginTop = '18px';
      btnRow.style.textAlign = 'right';
      options.customButtons.forEach(btnOpt => {
        const btn = document.createElement('button');
        btn.textContent = btnOpt.label;
        btn.onclick = async function() {
          document.body.removeChild(modal);
          if (btnOpt.onClick) await btnOpt.onClick();
        };
        btnRow.appendChild(btn);
      });
      // Always add a Cancel button if not present
      if (!options.customButtons.some(b => b.label.toLowerCase().includes('cancel'))) {
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.marginLeft = '12px';
        cancelBtn.onclick = function() {
          document.body.removeChild(modal);
          if (options.onClose) options.onClose();
        };
        btnRow.appendChild(cancelBtn);
      }
      content.appendChild(btnRow);
    } else if (options && options.confirm) {
      // Remove default OK button
      if (okBtn) content.removeChild(okBtn);
      // Add Cancel and OK buttons
      const btnRow = document.createElement('div');
      btnRow.style.marginTop = '18px';
      btnRow.style.textAlign = 'right';
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.onclick = function() {
        document.body.removeChild(modal);
        if (options.onCancel) options.onCancel();
      };
      btnRow.appendChild(cancelBtn);
      const okBtn2 = document.createElement('button');
      okBtn2.textContent = 'OK';
      okBtn2.style.marginLeft = '12px';
      okBtn2.onclick = function() {
        document.body.removeChild(modal);
        if (options.onConfirm) options.onConfirm();
      };
      btnRow.appendChild(okBtn2);
      content.appendChild(btnRow);
    } else {
      okBtn.onclick = function() {
        modal.remove();
        if (options && options.onClose) options.onClose();
      };
    }
    // Do NOT close modal on background click anymore
    modal.querySelector('.modal-bg').onclick = null;
  }

  window.showMessageModal = showMessageModal;
})();
