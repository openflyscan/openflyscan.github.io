(() => {
  'use strict';
  const config = window.OPENFLYSCAN_CONFIG || { scenes: [], links: {} };
  const shell = document.querySelector('#viewer-shell');
  const mount = document.querySelector('#viewer-mount');
  const overlay = document.querySelector('#viewer-overlay');
  const poster = document.querySelector('#viewer-poster');
  const loadButton = document.querySelector('#load-viewer');
  const closeButton = document.querySelector('#close-viewer');
  const fullscreenButton = document.querySelector('#fullscreen-viewer');
  const standalone = document.querySelector('#standalone-viewer');
  const status = document.querySelector('#viewer-status');
  const badge = document.querySelector('#viewer-badge');
  const sceneSelect = document.querySelector('#all-scenes');
  let selectedScene = config.scenes[0];
  let activeFrame = null;
  let readyTimer = null;

  function safeUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value, document.baseURI);
      if (url.username || url.password) return null;
      if (url.protocol === 'https:' || (url.protocol === 'http:' && url.origin === location.origin)) return url;
    } catch { return null; }
    return null;
  }

  document.querySelectorAll('[data-release]').forEach(link => {
    const url = safeUrl(config.links?.[link.dataset.release]);
    if (!url) return;
    link.href = url.href;
    link.target = '_blank';
    link.rel = 'noopener';
    link.hidden = false;
    link.querySelector('.small-status')?.remove();
    const state = link.querySelector('.resource-state');
    if (state) state.textContent = 'View resource ↗';
  });

  function stopViewer() {
    clearTimeout(readyTimer);
    activeFrame?.remove();
    activeFrame = null;
    shell.setAttribute('aria-busy', 'false');
    overlay.hidden = false;
    closeButton.hidden = true;
    fullscreenButton.hidden = true;
  }

  function selectScene(scene) {
    if (!scene) return;
    stopViewer();
    selectedScene = scene;
    document.querySelector('#scene-name').textContent = scene.name;
    document.querySelector('#scene-description').textContent = scene.description;
    poster.hidden = !scene.poster;
    if (scene.poster) {
      poster.src = scene.poster;
      poster.alt = `Static preview of the ${scene.name} reconstruction`;
    } else poster.removeAttribute('src');
    sceneSelect.value = scene.id;
    const url = safeUrl(scene.viewerUrl);
    loadButton.disabled = !url;
    loadButton.textContent = url ? 'Explore in 3D ↗' : '3D viewer coming soon';
    badge.textContent = url ? 'Interactive preview · Spark' : 'Interactive preview · coming soon';
    standalone.hidden = !url;
    if (url) {
      const standaloneUrl = new URL(url);
      standaloneUrl.searchParams.delete('embed');
      standalone.href = standaloneUrl.href;
    }
    else standalone.removeAttribute('href');
    status.textContent = url
      ? 'Click to load this scene. The 3D viewer may download additional data and use your GPU.'
      : 'Static preview. Interactive browsing will be enabled when the scene viewer is deployed.';
  }

  function populateScenes() {
    sceneSelect.replaceChildren(...config.scenes.map(scene => {
      const option = document.createElement('option');
      option.value = scene.id;
      option.textContent = scene.name;
      return option;
    }));
    sceneSelect.value = selectedScene?.id || '';
  }
  populateScenes();
  sceneSelect.addEventListener('change', () => {
    selectScene(config.scenes.find(scene => scene.id === sceneSelect.value));
  });
  if (config.sceneCatalog && safeUrl(config.viewerBase)) {
    fetch(config.sceneCatalog).then(response => {
      if (!response.ok) throw new Error('Catalog unavailable');
      return response.json();
    }).then(records => {
      for (const record of records) {
        const viewerUrl = new URL(config.viewerBase);
        viewerUrl.searchParams.set('scene', record.id);
        viewerUrl.searchParams.set('embed', '1');
        const existing = config.scenes.find(scene => scene.id === record.id);
        if (existing) existing.viewerUrl = viewerUrl.href;
        else config.scenes.push({ id: record.id, name: record.name,
          description: `${record.group} · Existing reconstruction, streamed in tiles.`,
          poster: null, viewerUrl: viewerUrl.href });
      }
      populateScenes();
      if (!activeFrame) selectScene(selectedScene);
      document.querySelector('#catalog-note').textContent = `${records.length} reconstructed scenes, with one selected version per site. Simulation scenes are excluded.`;
    }).catch(() => {
      document.querySelector('#catalog-note').textContent = 'The complete scene list is unavailable. The featured scenes remain accessible.';
    });
  }

  function viewerFailed() {
    stopViewer();
    loadButton.disabled = false;
    loadButton.textContent = 'Retry 3D viewer';
    status.textContent = 'The viewer could not be opened here. Retry, open it separately, or watch the video.';
  }

  loadButton.addEventListener('click', () => {
    const url = safeUrl(selectedScene?.viewerUrl);
    if (!url || activeFrame) return;
    const frame = document.createElement('iframe');
    activeFrame = frame;
    frame.title = `${selectedScene.name} — interactive Gaussian scene`;
    frame.allow = 'fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.src = url.href;
    shell.setAttribute('aria-busy', 'true');
    overlay.hidden = true;
    closeButton.hidden = false;
    fullscreenButton.hidden = !shell.requestFullscreen;
    status.textContent = 'Opening the viewer… If it stays blank, try opening it separately.';
    frame.addEventListener('load', () => {
      if (activeFrame !== frame || frame.dataset.viewerState) return;
      status.textContent = 'Viewer opened. Scene data may still be loading. If blank, open it separately.';
    });
    frame.addEventListener('error', () => { if (activeFrame === frame) viewerFailed(); });
    mount.append(frame);
    readyTimer = setTimeout(() => {
      if (activeFrame !== frame) return;
      shell.setAttribute('aria-busy', 'false');
      status.textContent = 'If the scene has not appeared, open the viewer separately. You can close it to return to the preview.';
    }, 25000);
  });

  window.addEventListener('message', event => {
    const url = safeUrl(selectedScene?.viewerUrl);
    if (!activeFrame || !url || event.source !== activeFrame.contentWindow || event.origin !== url.origin) return;
    if (event.data?.type === 'openflyscan:viewer-ready') {
      activeFrame.dataset.viewerState = 'ready';
      clearTimeout(readyTimer);
      shell.setAttribute('aria-busy', 'false');
      status.textContent = 'Current view ready. More details load as you explore; close it to return to the preview.';
    } else if (event.data?.type === 'openflyscan:viewer-loading') {
      activeFrame.dataset.viewerState = 'loading';
      clearTimeout(readyTimer);
      shell.setAttribute('aria-busy', 'true');
      status.textContent = 'Loading scene details. The preview may look blurry until loading settles.';
    } else if (event.data?.type === 'openflyscan:viewer-error') viewerFailed();
  });
  closeButton.addEventListener('click', () => { selectScene(selectedScene); loadButton.focus(); });
  fullscreenButton.addEventListener('click', async () => {
    try { await shell.requestFullscreen(); }
    catch { status.textContent = 'Full screen is unavailable. Use “Open separately” instead.'; }
  });
  selectScene(selectedScene);

  document.querySelectorAll('.comparison input').forEach(input => {
    input.addEventListener('input', () => {
      input.closest('.comparison').style.setProperty('--reveal', `${input.value}%`);
      input.setAttribute('aria-valuetext', `${100 - Number(input.value)} percent of our reconstruction revealed`);
    });
  });

  const dialog = document.querySelector('#figure-dialog');
  document.querySelectorAll('[data-enlarge]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector('#dialog-image').src = button.dataset.enlarge;
      document.querySelector('#dialog-image').alt = button.dataset.caption;
      document.querySelector('#dialog-caption').textContent = button.dataset.caption;
      dialog.showModal();
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

  document.querySelector('#copy-citation').addEventListener('click', async () => {
    const text = document.querySelector('#citation-text').textContent;
    const feedback = document.querySelector('#citation-status');
    try {
      await navigator.clipboard.writeText(text);
      feedback.textContent = 'Citation copied.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('#citation-text'));
      selection.removeAllRanges();
      selection.addRange(range);
      feedback.textContent = 'Citation selected. Press Ctrl+C or ⌘C to copy.';
    }
  });
})();
