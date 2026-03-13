/* ═══════════════════════════════════════════════════════
   SMILES FOR BELIZE — Interactive Canvas Engine
   Pan/zoom, sticky notes, image drops, minimap, persistence.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── DOM refs ──────────────────────────────────────────
  const wrapper = document.getElementById('canvasWrapper');
  const canvas  = document.getElementById('canvas');
  const zoomLevelEl = document.getElementById('zoomLevel');
  const minimap = document.getElementById('minimap');
  const minimapViewport = document.getElementById('minimapViewport');

  // ── State ─────────────────────────────────────────────
  const state = {
    // Rendered (lerped each frame)
    scale: 0.55,
    panX: -200,
    panY: -20,
    // Targets (set instantly on input)
    targetScale: 0.55,
    targetPanX: -200,
    targetPanY: -20,
    // Elements
    elements: [],
    selectedElementId: null,
    nextElementId: 1,
    zCounter: 100,
    // Interaction
    activeTool: 'move',    // 'move' | 'sticky'
    isPanning: false,
    isDraggingElement: false,
    isResizing: false,
    isSpaceDown: false,
    dragStartX: 0,
    dragStartY: 0,
    dragOffsetX: 0,
    dragOffsetY: 0,
    resizeHandle: null,
    resizeStartW: 0,
    resizeStartH: 0,
    resizeStartX: 0,
    resizeStartY: 0,
    // Minimap dragging
    isMinimapDragging: false,
    // Multi-selection & marquee
    selectedElementIds: [],
    isMarqueeSelecting: false,
    marqueeStartScreenX: 0,
    marqueeStartScreenY: 0,
    dragGroupOffsets: [],
    // Frame creation drag
    isCreatingFrame: false,
    frameStartX: 0,
    frameStartY: 0,
    // Connector lines
    connectorsDirty: false,
    // Session tracking
    briefingCount: 0,
    lastBriefingDate: null,
  };

  const CANVAS_W = 5000;
  const CANVAS_H = 4800;
  const LERP_FACTOR = 0.15;
  const MIN_SCALE = 0.15;
  const MAX_SCALE = 3;

  // ── Coordinate utils ──────────────────────────────────
  function screenToCanvas(sx, sy) {
    return {
      x: (sx - state.scale * 0 - state.panX) / state.scale,
      y: (sy - state.scale * 0 - state.panY) / state.scale,
    };
  }

  function screenToCanvasTarget(sx, sy) {
    return {
      x: (sx - state.targetPanX) / state.targetScale,
      y: (sy - state.targetPanY) / state.targetScale,
    };
  }

  // ── Animation loop ────────────────────────────────────
  let animFrameId = null;

  function tick() {
    // Lerp toward targets
    state.scale += (state.targetScale - state.scale) * LERP_FACTOR;
    state.panX  += (state.targetPanX  - state.panX)  * LERP_FACTOR;
    state.panY  += (state.targetPanY  - state.panY)  * LERP_FACTOR;

    // Snap when close enough
    if (Math.abs(state.targetScale - state.scale) < 0.0001) state.scale = state.targetScale;
    if (Math.abs(state.targetPanX - state.panX) < 0.05) state.panX = state.targetPanX;
    if (Math.abs(state.targetPanY - state.panY) < 0.05) state.panY = state.targetPanY;

    canvas.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.scale})`;
    zoomLevelEl.textContent = Math.round(state.scale * 100) + '%';

    updateMinimapViewport();
    updateConnectors();
    animFrameId = requestAnimationFrame(tick);
  }

  // ── Zoom toward cursor ────────────────────────────────
  function zoomAtPoint(newScale, screenX, screenY) {
    newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));
    // Canvas point under cursor before zoom
    const cx = (screenX - state.targetPanX) / state.targetScale;
    const cy = (screenY - state.targetPanY) / state.targetScale;
    state.targetScale = newScale;
    // Recalculate pan so same canvas point stays under cursor
    state.targetPanX = screenX - cx * newScale;
    state.targetPanY = screenY - cy * newScale;
  }

  // ── Mouse wheel zoom ─────────────────────────────────
  wrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.92 : 1.08;
    zoomAtPoint(state.targetScale * factor, e.clientX, e.clientY);
  }, { passive: false });

  // ── Mouse pan ─────────────────────────────────────────
  wrapper.addEventListener('mousedown', (e) => {
    if (e.target.closest('.toolbar') || e.target.closest('.minimap')) return;
    if (e.target.closest('.color-picker-bar') || e.target.closest('.category-picker-bar') || e.target.closest('.delete-btn')) return;

    // Check if clicking a user element
    const userEl = e.target.closest('.user-element');
    if (userEl && !state.isSpaceDown && (state.activeTool === 'move' || state.activeTool === 'select')) {
      handleElementMouseDown(e, userEl);
      return;
    }

    // Check if clicking a resize handle
    if (e.target.classList.contains('resize-handle')) {
      handleResizeMouseDown(e);
      return;
    }

    // Sticky placement mode
    if (state.activeTool === 'sticky' && !state.isSpaceDown) {
      // If elements are selected, create a connected sticky instead
      if (state.selectedElementIds.length > 0) {
        createConnectedSticky(state.selectedElementIds.slice());
        deselectAll();
        setActiveTool('select');
        return;
      }
      const pos = screenToCanvasTarget(e.clientX, e.clientY);
      createSticky(pos.x - 100, pos.y - 60, 200);
      setActiveTool('move');
      return;
    }

    // Marquee selection mode
    if (state.activeTool === 'select' && !state.isSpaceDown) {
      deselectAll();
      state.isMarqueeSelecting = true;
      state.marqueeStartScreenX = e.clientX;
      state.marqueeStartScreenY = e.clientY;
      marqueeRect.style.left = e.clientX + 'px';
      marqueeRect.style.top = e.clientY + 'px';
      marqueeRect.style.width = '0';
      marqueeRect.style.height = '0';
      marqueeRect.style.display = 'block';
      return;
    }

    // Frame creation mode
    if (state.activeTool === 'frame' && !state.isSpaceDown) {
      var fpos = screenToCanvasTarget(e.clientX, e.clientY);
      state.isCreatingFrame = true;
      state.frameStartX = fpos.x;
      state.frameStartY = fpos.y;
      framePreview.style.left = fpos.x + 'px';
      framePreview.style.top = fpos.y + 'px';
      framePreview.style.width = '0';
      framePreview.style.height = '0';
      framePreview.style.display = 'block';
      return;
    }

    // Pan
    state.isPanning = true;
    state.dragStartX = e.clientX - state.targetPanX;
    state.dragStartY = e.clientY - state.targetPanY;
    wrapper.style.cursor = 'grabbing';
    deselectAll();
  });

  window.addEventListener('mousemove', (e) => {
    if (state.isPanning) {
      state.targetPanX = e.clientX - state.dragStartX;
      state.targetPanY = e.clientY - state.dragStartY;
      return;
    }
    if (state.isMarqueeSelecting) {
      var mx = Math.min(e.clientX, state.marqueeStartScreenX);
      var my = Math.min(e.clientY, state.marqueeStartScreenY);
      var mw = Math.abs(e.clientX - state.marqueeStartScreenX);
      var mh = Math.abs(e.clientY - state.marqueeStartScreenY);
      marqueeRect.style.left = mx + 'px';
      marqueeRect.style.top = my + 'px';
      marqueeRect.style.width = mw + 'px';
      marqueeRect.style.height = mh + 'px';
      return;
    }
    if (state.isCreatingFrame) {
      var fp = screenToCanvasTarget(e.clientX, e.clientY);
      var fx = Math.min(fp.x, state.frameStartX);
      var fy = Math.min(fp.y, state.frameStartY);
      var fw = Math.abs(fp.x - state.frameStartX);
      var fh = Math.abs(fp.y - state.frameStartY);
      framePreview.style.left = fx + 'px';
      framePreview.style.top = fy + 'px';
      framePreview.style.width = fw + 'px';
      framePreview.style.height = fh + 'px';
      return;
    }
    if (state.isDraggingElement) {
      handleElementDrag(e);
      return;
    }
    if (state.isResizing) {
      handleResizeDrag(e);
      return;
    }
  });

  window.addEventListener('mouseup', (e) => {
    if (state.isPanning) {
      state.isPanning = false;
      wrapper.style.cursor = cursorForTool(state.activeTool);
    }
    if (state.isMarqueeSelecting) {
      state.isMarqueeSelecting = false;
      marqueeRect.style.display = 'none';
      var sc = screenToCanvasTarget(state.marqueeStartScreenX, state.marqueeStartScreenY);
      var ec = screenToCanvasTarget(e.clientX, e.clientY);
      var ml = Math.min(sc.x, ec.x), mt = Math.min(sc.y, ec.y);
      var mr = Math.max(sc.x, ec.x), mb = Math.max(sc.y, ec.y);
      var ids = [];
      state.elements.forEach(function (el) {
        var er = el.x + (el.width || 200);
        var eb = el.y + (el.height || 80);
        if (el.x < mr && er > ml && el.y < mb && eb > mt) ids.push(el.id);
      });
      if (ids.length > 0) selectMultiple(expandWithFrameChildren(ids));
    }
    if (state.isCreatingFrame) {
      state.isCreatingFrame = false;
      framePreview.style.display = 'none';
      var fpc = screenToCanvasTarget(e.clientX, e.clientY);
      var ffx = Math.min(fpc.x, state.frameStartX);
      var ffy = Math.min(fpc.y, state.frameStartY);
      var ffw = Math.abs(fpc.x - state.frameStartX);
      var ffh = Math.abs(fpc.y - state.frameStartY);
      if (ffw > 30 && ffh > 30) {
        createFrame(ffx, ffy, ffw, ffh);
        // Adopt any elements whose center falls inside this new frame
        var adoptIds = state.elements
          .filter(function (el) { return el.type !== 'frame'; })
          .map(function (el) { return el.id; });
        updateFrameContainment(adoptIds);
        setActiveTool('select');
      }
    }
    if (state.isDraggingElement) {
      clearDropTargetHighlight();
      // Collect dragged element IDs before clearing state
      var draggedIds = [];
      if (state.dragGroupOffsets.length > 0) {
        draggedIds = state.dragGroupOffsets.map(function (item) { return item.id; });
      } else if (state.selectedElementId !== null) {
        draggedIds = [state.selectedElementId];
      }

      state.isDraggingElement = false;
      state.dragGroupOffsets = [];

      // Update frame containment for non-frame elements
      updateFrameContainment(draggedIds.filter(function (did) {
        var d = state.elements.find(function (el) { return el.id === did; });
        return d && d.type !== 'frame';
      }));

      saveState();
    }
    if (state.isResizing) {
      // If resized element is a frame, re-check containment
      var resizedData = state.elements.find(function (el) { return el.id === state.selectedElementId; });
      if (resizedData && resizedData.type === 'frame') {
        var nonFrameIds = state.elements
          .filter(function (el) { return el.type !== 'frame'; })
          .map(function (el) { return el.id; });
        updateFrameContainment(nonFrameIds);
      }
      state.isResizing = false;
      state.resizeHandle = null;
      saveState();
    }
  });

  // ── Double-click to create sticky ─────────────────────
  wrapper.addEventListener('dblclick', (e) => {
    if (e.target.closest('.toolbar') || e.target.closest('.minimap')) return;
    if (e.target.closest('.user-element')) return;
    const pos = screenToCanvasTarget(e.clientX, e.clientY);
    createSticky(pos.x - 100, pos.y - 60, 200);
  });

  // ── Space key for pan override ────────────────────────
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !e.target.closest('[contenteditable]')) {
      e.preventDefault();
      state.isSpaceDown = true;
      wrapper.style.cursor = 'grab';
    }
    // Delete selected element(s)
    if ((e.code === 'Delete' || e.code === 'Backspace') &&
        (state.selectedElementId !== null || state.selectedElementIds.length > 0)) {
      if (e.target.closest('[contenteditable]')) return;
      e.preventDefault();
      if (state.selectedElementIds.length > 1) {
        var idsToDelete = state.selectedElementIds.slice();
        deselectAll();
        idsToDelete.forEach(function (did) { deleteElement(did); });
      } else {
        deleteElement(state.selectedElementId);
      }
    }
    // 'N' to create connected sticky from selection
    if (e.code === 'KeyN' && !e.target.closest('[contenteditable]') &&
        state.selectedElementIds.length > 0) {
      e.preventDefault();
      createConnectedSticky(state.selectedElementIds.slice());
      deselectAll();
    }
    // Keyboard zoom
    if (e.ctrlKey || e.metaKey) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      if (e.code === 'Equal' || e.code === 'NumpadAdd') {
        e.preventDefault();
        zoomAtPoint(state.targetScale * 1.15, cx, cy);
      } else if (e.code === 'Minus' || e.code === 'NumpadSubtract') {
        e.preventDefault();
        zoomAtPoint(state.targetScale * 0.87, cx, cy);
      } else if (e.code === 'Digit0') {
        e.preventDefault();
        state.targetScale = 1;
        state.targetPanX = -CANVAS_W / 2 + window.innerWidth / 2;
        state.targetPanY = -CANVAS_H / 2 + window.innerHeight / 2;
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      state.isSpaceDown = false;
      wrapper.style.cursor = cursorForTool(state.activeTool);
    }
  });

  // ── Touch support ─────────────────────────────────────
  let lastTouchDist = 0;
  let lastTouchCenter = { x: 0, y: 0 };

  wrapper.addEventListener('touchstart', (e) => {
    if (e.target.closest('.toolbar') || e.target.closest('.minimap')) return;
    if (e.touches.length === 1) {
      state.isPanning = true;
      state.dragStartX = e.touches[0].clientX - state.targetPanX;
      state.dragStartY = e.touches[0].clientY - state.targetPanY;
    } else if (e.touches.length === 2) {
      state.isPanning = false;
      lastTouchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchCenter = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    }
  });

  wrapper.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && state.isPanning) {
      state.targetPanX = e.touches[0].clientX - state.dragStartX;
      state.targetPanY = e.touches[0].clientY - state.dragStartY;
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const center = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
      const scaleFactor = dist / lastTouchDist;
      zoomAtPoint(state.targetScale * scaleFactor, center.x, center.y);
      lastTouchDist = dist;
      lastTouchCenter = center;
    }
  }, { passive: false });

  wrapper.addEventListener('touchend', () => { state.isPanning = false; });

  // ── Zoom buttons ──────────────────────────────────────
  document.getElementById('zoomIn').addEventListener('click', () => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    zoomAtPoint(state.targetScale * 1.2, cx, cy);
  });

  document.getElementById('zoomOut').addEventListener('click', () => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    zoomAtPoint(state.targetScale * 0.83, cx, cy);
  });


  // ═══════════════════════════════════════════════════════
  // TOOLBAR
  // ═══════════════════════════════════════════════════════

  function cursorForTool(tool) {
    if (tool === 'sticky' || tool === 'frame') return 'crosshair';
    if (tool === 'select') return 'default';
    return 'grab';
  }

  function setActiveTool(tool) {
    state.activeTool = tool;
    document.querySelectorAll('.toolbar__btn[data-tool]').forEach((btn) => {
      btn.classList.toggle('toolbar__btn--active', btn.dataset.tool === tool);
    });
    wrapper.style.cursor = cursorForTool(tool);
  }

  document.querySelectorAll('.toolbar__btn[data-tool]').forEach((btn) => {
    btn.addEventListener('click', () => setActiveTool(btn.dataset.tool));
  });


  // ═══════════════════════════════════════════════════════
  // MINIMAP
  // ═══════════════════════════════════════════════════════

  const MINIMAP_PAD = 8;
  const MINIMAP_W = 160 - MINIMAP_PAD * 2; // 144
  const MINIMAP_H = 110 - MINIMAP_PAD * 2; // 94
  const minimapScale = Math.min(MINIMAP_W / CANVAS_W, MINIMAP_H / CANVAS_H);

  function initMinimap() {
    // Scan all .frame elements and create minimap rectangles
    const frames = canvas.querySelectorAll('.frame');
    frames.forEach((frame) => {
      const rect = document.createElement('div');
      rect.className = 'minimap__frame';
      const left = parseFloat(frame.style.left) || 0;
      const top  = parseFloat(frame.style.top)  || 0;
      const w    = parseFloat(frame.style.width) || frame.offsetWidth;
      // Estimate height from frame content
      const h = frame.offsetHeight || 400;

      rect.style.left   = (left * minimapScale + MINIMAP_PAD) + 'px';
      rect.style.top    = (top  * minimapScale + MINIMAP_PAD) + 'px';
      rect.style.width  = (w * minimapScale) + 'px';
      rect.style.height = (h * minimapScale) + 'px';

      // Color from frame label
      const label = frame.querySelector('.frame__label');
      if (label) {
        const bg = getComputedStyle(label).backgroundColor;
        rect.style.backgroundColor = bg;
      } else {
        rect.style.backgroundColor = 'rgba(0,0,0,0.15)';
      }
      minimap.appendChild(rect);
    });
  }

  function updateMinimapViewport() {
    // Visible area in canvas coordinates
    const visLeft = -state.panX / state.scale;
    const visTop  = -state.panY / state.scale;
    const visW    = window.innerWidth / state.scale;
    const visH    = window.innerHeight / state.scale;

    minimapViewport.style.left   = (visLeft * minimapScale + MINIMAP_PAD) + 'px';
    minimapViewport.style.top    = (visTop  * minimapScale + MINIMAP_PAD) + 'px';
    minimapViewport.style.width  = (visW * minimapScale) + 'px';
    minimapViewport.style.height = (visH * minimapScale) + 'px';
  }

  // Click minimap to jump
  minimap.addEventListener('mousedown', (e) => {
    if (e.target === minimapViewport) {
      state.isMinimapDragging = true;
      return;
    }
    const rect = minimap.getBoundingClientRect();
    const mx = e.clientX - rect.left - MINIMAP_PAD;
    const my = e.clientY - rect.top  - MINIMAP_PAD;
    const canvasX = mx / minimapScale;
    const canvasY = my / minimapScale;
    state.targetPanX = -canvasX * state.targetScale + window.innerWidth / 2;
    state.targetPanY = -canvasY * state.targetScale + window.innerHeight / 2;
  });

  window.addEventListener('mousemove', (e) => {
    if (!state.isMinimapDragging) return;
    const rect = minimap.getBoundingClientRect();
    const mx = e.clientX - rect.left - MINIMAP_PAD;
    const my = e.clientY - rect.top  - MINIMAP_PAD;
    const canvasX = mx / minimapScale;
    const canvasY = my / minimapScale;
    state.targetPanX = -canvasX * state.targetScale + window.innerWidth / 2;
    state.targetPanY = -canvasY * state.targetScale + window.innerHeight / 2;
  });

  window.addEventListener('mouseup', () => {
    state.isMinimapDragging = false;
  });


  // ═══════════════════════════════════════════════════════
  // ELEMENT SELECTION & INTERACTION
  // ═══════════════════════════════════════════════════════

  function selectElement(id) {
    deselectAll();
    state.selectedElementId = id;
    state.selectedElementIds = [id];
    const el = document.getElementById('user-el-' + id);
    if (!el) return;
    el.classList.add('user-element--selected');

    // Add delete button
    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '\u00d7';
    del.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteElement(id);
    });
    el.appendChild(del);

    // Add resize handles for images and frames
    const data = state.elements.find((e) => e.id === id);
    if (data && (data.type === 'image' || data.type === 'frame')) {
      ['nw', 'ne', 'sw', 'se'].forEach((pos) => {
        const handle = document.createElement('div');
        handle.className = 'resize-handle resize-handle--' + pos;
        handle.dataset.handle = pos;
        handle.dataset.elementId = id;
        el.appendChild(handle);
      });
    }

    // Add color picker for stickies
    if (data && data.type === 'sticky') {
      const picker = document.createElement('div');
      picker.className = 'color-picker-bar';
      const colors = [
        { name: 'yellow', value: 'var(--sticky-yellow)' },
        { name: 'pink',   value: 'var(--sticky-pink)' },
        { name: 'green',  value: 'var(--sticky-green)' },
        { name: 'blue',   value: 'var(--sticky-blue)' },
        { name: 'white',  value: '#ffffff' },
      ];
      colors.forEach((c) => {
        const swatch = document.createElement('button');
        swatch.className = 'color-swatch';
        swatch.dataset.color = c.name;
        swatch.style.backgroundColor = c.value;
        if (data.color === c.name) swatch.classList.add('color-swatch--active');
        swatch.addEventListener('click', (e) => {
          e.stopPropagation();
          data.color = c.name;
          el.style.backgroundColor = c.value;
          picker.querySelectorAll('.color-swatch').forEach((s) => s.classList.remove('color-swatch--active'));
          swatch.classList.add('color-swatch--active');
          debouncedSave();
        });
        picker.appendChild(swatch);
      });
      el.appendChild(picker);
    }

    // Add category picker (not for frames — frames use their label)
    if (data && data.type !== 'frame') {
      const catPicker = document.createElement('div');
      catPicker.className = 'category-picker-bar';
      const categories = [
        { name: 'note',        label: '\u2014',  title: 'Note' },
        { name: 'inspiration', label: '\u2726',  title: 'Inspiration' },
        { name: 'question',    label: '?',  title: 'Question' },
        { name: 'decision',    label: '\u2713',  title: 'Decision' },
      ];
      categories.forEach((cat) => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.dataset.category = cat.name;
        btn.textContent = cat.label;
        btn.title = cat.title;
        if (data.category === cat.name) btn.classList.add('category-btn--active');
        btn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          data.category = cat.name;
          el.dataset.category = cat.name;
          catPicker.querySelectorAll('.category-btn').forEach((b) => b.classList.remove('category-btn--active'));
          btn.classList.add('category-btn--active');
          debouncedSave();
        });
        catPicker.appendChild(btn);
      });
      el.appendChild(catPicker);
    }
  }

  function deselectElement() {
    if (state.selectedElementId === null) return;
    const el = document.getElementById('user-el-' + state.selectedElementId);
    if (el) {
      el.classList.remove('user-element--selected');
      el.querySelectorAll('.delete-btn, .resize-handle, .color-picker-bar, .category-picker-bar').forEach((c) => c.remove());
    }
    state.selectedElementId = null;
  }

  function deselectAll() {
    deselectElement();
    state.selectedElementIds.forEach(function (sid) {
      var el = document.getElementById('user-el-' + sid);
      if (el) el.classList.remove('user-element--selected');
    });
    state.selectedElementIds = [];
    state.dragGroupOffsets = [];
    updateSelectionUI();
  }

  function updateSelectionUI() {
    var annotateBtn = document.getElementById('annotateBtn');
    if (annotateBtn) annotateBtn.disabled = state.selectedElementIds.length === 0;
    if (bulkCategoryBar) bulkCategoryBar.style.display = state.selectedElementIds.length > 1 ? 'flex' : 'none';
  }

  function selectMultiple(ids) {
    deselectAll();
    state.selectedElementIds = ids;
    ids.forEach(function (sid) {
      var el = document.getElementById('user-el-' + sid);
      if (el) el.classList.add('user-element--selected');
    });
    // Show pickers only for single selection
    if (ids.length === 1) {
      selectElement(ids[0]);
    }
    updateSelectionUI();
  }

  function deleteElement(id) {
    const el = document.getElementById('user-el-' + id);
    if (el) el.remove();
    state.elements = state.elements.filter((e) => e.id !== id);
    // Clean up references pointing to deleted element
    state.elements.forEach(function (e) {
      if (e.connectedTo) {
        e.connectedTo = e.connectedTo.filter(function (cid) { return cid !== id; });
      }
      // Orphan children if a frame was deleted
      if (e.parentFrameId === id) e.parentFrameId = null;
    });
    if (state.selectedElementId === id) state.selectedElementId = null;
    state.connectorsDirty = true;
    saveState();
  }

  // ── Frame containment ───────────────────────────────
  function updateFrameContainment(elementIds) {
    var frames = state.elements.filter(function (e) { return e.type === 'frame'; });

    elementIds.forEach(function (eid) {
      var el = state.elements.find(function (e) { return e.id === eid; });
      if (!el || el.type === 'frame') return;

      var ecx = el.x + (el.width || 200) / 2;
      var ecy = el.y + ((el.height || 80) / 2);

      var bestFrame = null;
      var bestArea = Infinity;

      frames.forEach(function (f) {
        if (ecx >= f.x && ecx <= f.x + f.width &&
            ecy >= f.y && ecy <= f.y + f.height) {
          var area = f.width * f.height;
          if (area < bestArea) {
            bestArea = area;
            bestFrame = f;
          }
        }
      });

      el.parentFrameId = bestFrame ? bestFrame.id : null;
    });
  }

  function expandWithFrameChildren(ids) {
    var expanded = ids.slice();
    ids.forEach(function (eid) {
      var el = state.elements.find(function (e) { return e.id === eid; });
      if (el && el.type === 'frame') {
        state.elements.forEach(function (child) {
          if (child.parentFrameId === eid && expanded.indexOf(child.id) === -1) {
            expanded.push(child.id);
          }
        });
      }
    });
    return expanded;
  }

  function highlightDropTargetFrame(draggedData) {
    document.querySelectorAll('.user-frame--drop-target').forEach(function (el) {
      el.classList.remove('user-frame--drop-target');
    });
    if (!draggedData || draggedData.type === 'frame') return;
    var ecx = draggedData.x + (draggedData.width || 200) / 2;
    var ecy = draggedData.y + ((draggedData.height || 80) / 2);
    var userFrames = state.elements.filter(function (e) { return e.type === 'frame'; });
    var bestFrame = null;
    var bestArea = Infinity;
    userFrames.forEach(function (f) {
      if (ecx >= f.x && ecx <= f.x + f.width &&
          ecy >= f.y && ecy <= f.y + f.height) {
        var area = f.width * f.height;
        if (area < bestArea) {
          bestArea = area;
          bestFrame = f;
        }
      }
    });
    if (bestFrame) {
      var frameEl = document.getElementById('user-el-' + bestFrame.id);
      if (frameEl) frameEl.classList.add('user-frame--drop-target');
    }
  }

  function clearDropTargetHighlight() {
    document.querySelectorAll('.user-frame--drop-target').forEach(function (el) {
      el.classList.remove('user-frame--drop-target');
    });
  }

  function handleElementMouseDown(e, userEl) {
    e.stopPropagation();
    const id = parseInt(userEl.id.replace('user-el-', ''), 10);
    const canvasPos = screenToCanvasTarget(e.clientX, e.clientY);

    // If element is part of a multi-selection, start group drag (include frame children)
    if (state.selectedElementIds.includes(id) && state.selectedElementIds.length > 1) {
      state.isDraggingElement = true;
      var allGroupIds = expandWithFrameChildren(state.selectedElementIds);
      state.dragGroupOffsets = allGroupIds.map(function (eid) {
        var d = state.elements.find(function (el) { return el.id === eid; });
        return d ? { id: eid, offsetX: canvasPos.x - d.x, offsetY: canvasPos.y - d.y } : null;
      }).filter(Boolean);
      return;
    }

    // Single select
    selectElement(id);

    const data = state.elements.find((el) => el.id === id);
    if (!data) return;

    // Bring to front
    state.zCounter++;
    data.zIndex = state.zCounter;
    userEl.style.zIndex = state.zCounter;

    state.isDraggingElement = true;

    // Frame drag: include all children in the drag group
    if (data.type === 'frame') {
      var childIds = state.elements
        .filter(function (el) { return el.parentFrameId === id; })
        .map(function (el) { return el.id; });
      var frameGroupIds = [id].concat(childIds);
      state.dragGroupOffsets = frameGroupIds.map(function (eid) {
        var d = state.elements.find(function (el) { return el.id === eid; });
        return d ? { id: eid, offsetX: canvasPos.x - d.x, offsetY: canvasPos.y - d.y } : null;
      }).filter(Boolean);
      return;
    }

    state.dragGroupOffsets = [];
    state.dragOffsetX = canvasPos.x - data.x;
    state.dragOffsetY = canvasPos.y - data.y;
  }

  function handleElementDrag(e) {
    const pos = screenToCanvasTarget(e.clientX, e.clientY);

    // Group drag
    if (state.dragGroupOffsets.length > 0) {
      state.dragGroupOffsets.forEach(function (item) {
        var data = state.elements.find(function (el) { return el.id === item.id; });
        if (!data) return;
        data.x = pos.x - item.offsetX;
        data.y = pos.y - item.offsetY;
        var domEl = document.getElementById('user-el-' + data.id);
        if (domEl) {
          domEl.style.left = data.x + 'px';
          domEl.style.top = data.y + 'px';
        }
      });
      // Highlight drop target frame
      var firstNonFrame = null;
      for (var gi = 0; gi < state.dragGroupOffsets.length; gi++) {
        var gd = state.elements.find(function (el) { return el.id === state.dragGroupOffsets[gi].id; });
        if (gd && gd.type !== 'frame') { firstNonFrame = gd; break; }
      }
      highlightDropTargetFrame(firstNonFrame);
      return;
    }

    // Single element drag
    const data = state.elements.find((el) => el.id === state.selectedElementId);
    if (!data) return;
    data.x = pos.x - state.dragOffsetX;
    data.y = pos.y - state.dragOffsetY;
    const el = document.getElementById('user-el-' + data.id);
    if (el) {
      el.style.left = data.x + 'px';
      el.style.top  = data.y + 'px';
    }
    highlightDropTargetFrame(data);
  }

  // ── Resize handles ────────────────────────────────────
  function handleResizeMouseDown(e) {
    e.stopPropagation();
    const handle = e.target.dataset.handle;
    const id = parseInt(e.target.dataset.elementId, 10);
    const data = state.elements.find((el) => el.id === id);
    if (!data) return;

    state.isResizing = true;
    state.resizeHandle = handle;
    state.selectedElementId = id;
    state.resizeStartW = data.width;
    state.resizeStartH = data.height || data.width;
    state.resizeStartX = e.clientX;
    state.resizeStartY = e.clientY;
  }

  function handleResizeDrag(e) {
    const data = state.elements.find((el) => el.id === state.selectedElementId);
    if (!data || (data.type !== 'image' && data.type !== 'frame')) return;

    const dx = (e.clientX - state.resizeStartX) / state.targetScale;
    const dy = (e.clientY - state.resizeStartY) / state.targetScale;
    const handle = state.resizeHandle;

    let newW = state.resizeStartW;
    let newH = state.resizeStartH;

    if (handle === 'se') { newW += dx; newH += dy; }
    else if (handle === 'sw') { newW -= dx; newH += dy; data.x = data.x + dx; }
    else if (handle === 'ne') { newW += dx; newH -= dy; data.y = data.y + dy; }
    else if (handle === 'nw') { newW -= dx; newH -= dy; data.x = data.x + dx; data.y = data.y + dy; }

    newW = Math.max(50, newW);
    newH = Math.max(50, newH);
    data.width = newW;
    data.height = newH;

    const el = document.getElementById('user-el-' + data.id);
    if (el) {
      el.style.width  = newW + 'px';
      el.style.height = newH + 'px';
      el.style.left   = data.x + 'px';
      el.style.top    = data.y + 'px';
    }
    state.resizeStartW = newW;
    state.resizeStartH = newH;
    state.resizeStartX = e.clientX;
    state.resizeStartY = e.clientY;
  }


  // ═══════════════════════════════════════════════════════
  // STICKY NOTES
  // ═══════════════════════════════════════════════════════

  function createSticky(x, y, width, color, text, id, category) {
    color    = color || 'yellow';
    text     = text  || '';
    id       = id    || state.nextElementId++;
    category = category || 'note';

    state.zCounter++;
    const zIndex = state.zCounter;

    const data = { id, type: 'sticky', x, y, width, color, text, zIndex, category };
    // Avoid duplicates on restore
    if (!state.elements.find((e) => e.id === id)) {
      state.elements.push(data);
    }

    const colorMap = {
      yellow: 'var(--sticky-yellow)',
      pink:   'var(--sticky-pink)',
      green:  'var(--sticky-green)',
      blue:   'var(--sticky-blue)',
      white:  '#ffffff',
    };

    const el = document.createElement('div');
    el.id = 'user-el-' + id;
    el.className = 'user-element user-sticky';
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    el.style.width = width + 'px';
    el.style.zIndex = zIndex;
    el.style.backgroundColor = colorMap[color] || colorMap.yellow;
    el.dataset.category = category;

    const textDiv = document.createElement('div');
    textDiv.className = 'user-sticky__text';
    textDiv.contentEditable = 'true';
    textDiv.spellcheck = false;
    textDiv.textContent = text;
    textDiv.addEventListener('input', () => {
      data.text = textDiv.textContent;
      debouncedSave();
    });
    // Prevent pan when editing
    textDiv.addEventListener('mousedown', (e) => e.stopPropagation());

    el.appendChild(textDiv);
    canvas.appendChild(el);

    if (state.nextElementId <= id) state.nextElementId = id + 1;
    saveState();
    return data;
  }

  function createConnectedSticky(targetIds) {
    // Calculate bounding box of all target elements
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    var sharedFrameId = undefined;
    targetIds.forEach(function (tid) {
      var t = state.elements.find(function (el) { return el.id === tid; });
      if (!t) return;
      minX = Math.min(minX, t.x);
      minY = Math.min(minY, t.y);
      maxX = Math.max(maxX, t.x + (t.width || 200));
      maxY = Math.max(maxY, t.y + (t.height || 80));
      // Track shared parent frame
      if (sharedFrameId === undefined) sharedFrameId = t.parentFrameId || null;
      else if (sharedFrameId !== (t.parentFrameId || null)) sharedFrameId = null;
    });

    // Position new sticky below the group, centered
    var groupCenterX = (minX + maxX) / 2;
    var stickyWidth = 220;
    var stickyX = groupCenterX - stickyWidth / 2;
    var stickyY = maxY + 40;

    // If all targets share a parent frame, clamp inside it
    if (sharedFrameId) {
      var parentFrame = state.elements.find(function (f) { return f.id === sharedFrameId; });
      if (parentFrame) {
        var frameRight = parentFrame.x + parentFrame.width;
        var frameBottom = parentFrame.y + parentFrame.height;
        if (stickyX < parentFrame.x + 10) stickyX = parentFrame.x + 10;
        if (stickyX + stickyWidth > frameRight - 10) stickyX = frameRight - stickyWidth - 10;
        if (stickyY + 80 > frameBottom - 10) stickyY = frameBottom - 80 - 10;
      }
    }

    var data = createSticky(stickyX, stickyY, stickyWidth, 'blue');
    data.connectedTo = targetIds.slice();
    if (sharedFrameId) data.parentFrameId = sharedFrameId;

    // Focus text for immediate typing
    var el = document.getElementById('user-el-' + data.id);
    if (el) {
      var textEl = el.querySelector('.user-sticky__text');
      if (textEl) {
        setTimeout(function () { textEl.focus(); }, 50);
      }
    }

    state.connectorsDirty = true;
    saveState();
    return data;
  }


  // ═══════════════════════════════════════════════════════
  // IMAGE DRAG & DROP
  // ═══════════════════════════════════════════════════════

  // Marquee selection rectangle (screen-space, fixed position)
  const marqueeRect = document.createElement('div');
  marqueeRect.className = 'marquee-rect';
  wrapper.appendChild(marqueeRect);

  // Frame creation preview (canvas-space)
  const framePreview = document.createElement('div');
  framePreview.className = 'frame-preview';
  canvas.appendChild(framePreview);

  // User connector lines SVG (canvas-space, z-index 90: above frames, below elements)
  const connectorSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  connectorSvg.setAttribute('class', 'user-connectors');
  canvas.appendChild(connectorSvg);

  // Bulk category bar for multi-selection
  var bulkCategoryBar = document.createElement('div');
  bulkCategoryBar.className = 'bulk-category-bar';
  bulkCategoryBar.style.display = 'none';
  [
    { name: 'note', label: '\u2014', title: 'Note' },
    { name: 'inspiration', label: '\u2726', title: 'Inspiration' },
    { name: 'question', label: '?', title: 'Question' },
    { name: 'decision', label: '\u2713', title: 'Decision' },
  ].forEach(function (cat) {
    var btn = document.createElement('button');
    btn.className = 'category-btn';
    btn.textContent = cat.label;
    btn.title = cat.title;
    btn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      state.selectedElementIds.forEach(function (sid) {
        var data = state.elements.find(function (el) { return el.id === sid; });
        if (data && data.type !== 'frame') {
          data.category = cat.name;
          var domEl = document.getElementById('user-el-' + sid);
          if (domEl) domEl.dataset.category = cat.name;
        }
      });
      debouncedSave();
    });
    bulkCategoryBar.appendChild(btn);
  });
  document.body.appendChild(bulkCategoryBar);

  var _connectorCache = {};

  function updateConnectors() {
    if (!state.connectorsDirty && !state.isDraggingElement) return;
    state.connectorsDirty = false;

    var activeKeys = {};

    var connected = state.elements.filter(function (el) {
      return el.connectedTo && el.connectedTo.length > 0;
    });

    connected.forEach(function (sticky) {
      var sx = sticky.x + (sticky.width || 200) / 2;
      var sy = sticky.y + 20;

      sticky.connectedTo.forEach(function (targetId) {
        var target = state.elements.find(function (el) { return el.id === targetId; });
        if (!target) return;

        var tx = target.x + (target.width || 200) / 2;
        var ty = target.y + (target.height || 80) / 2;
        var key = sticky.id + '-' + targetId;
        activeKeys[key] = true;

        if (_connectorCache[key]) {
          var cached = _connectorCache[key];
          cached.line.setAttribute('x1', sx);
          cached.line.setAttribute('y1', sy);
          cached.line.setAttribute('x2', tx);
          cached.line.setAttribute('y2', ty);
          cached.c1.setAttribute('cx', sx);
          cached.c1.setAttribute('cy', sy);
          cached.c2.setAttribute('cx', tx);
          cached.c2.setAttribute('cy', ty);
        } else {
          var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', sx);
          line.setAttribute('y1', sy);
          line.setAttribute('x2', tx);
          line.setAttribute('y2', ty);
          line.setAttribute('stroke', '#2563EB');
          line.setAttribute('stroke-width', '2');
          line.setAttribute('stroke-dasharray', '6 4');
          line.setAttribute('opacity', '0.4');

          var c1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          c1.setAttribute('cx', sx);
          c1.setAttribute('cy', sy);
          c1.setAttribute('r', '4');
          c1.setAttribute('fill', '#2563EB');
          c1.setAttribute('opacity', '0.4');

          var c2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          c2.setAttribute('cx', tx);
          c2.setAttribute('cy', ty);
          c2.setAttribute('r', '4');
          c2.setAttribute('fill', '#2563EB');
          c2.setAttribute('opacity', '0.4');

          connectorSvg.appendChild(line);
          connectorSvg.appendChild(c1);
          connectorSvg.appendChild(c2);
          _connectorCache[key] = { line: line, c1: c1, c2: c2 };
        }
      });
    });

    // Remove stale connectors
    Object.keys(_connectorCache).forEach(function (key) {
      if (!activeKeys[key]) {
        var cached = _connectorCache[key];
        cached.line.remove();
        cached.c1.remove();
        cached.c2.remove();
        delete _connectorCache[key];
      }
    });
  }

  // Drop overlay
  const dropOverlay = document.createElement('div');
  dropOverlay.className = 'drop-overlay';
  dropOverlay.textContent = 'Drop image here';
  wrapper.appendChild(dropOverlay);

  wrapper.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    dropOverlay.classList.add('drop-overlay--active');
  });

  wrapper.addEventListener('dragleave', (e) => {
    if (e.relatedTarget && wrapper.contains(e.relatedTarget)) return;
    dropOverlay.classList.remove('drop-overlay--active');
  });

  wrapper.addEventListener('drop', (e) => {
    e.preventDefault();
    dropOverlay.classList.remove('drop-overlay--active');

    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;

    const pos = screenToCanvasTarget(e.clientX, e.clientY);

    files.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = () => {
        resizeImage(reader.result, 1200, (dataUrl, natW, natH) => {
          const w = Math.min(natW, 400);
          const h = (natH / natW) * w;
          createImage(pos.x + i * 20, pos.y + i * 20, w, h, dataUrl, file.name);
        });
      };
      reader.readAsDataURL(file);
    });
  });

  function resizeImage(dataUrl, maxDim, callback) {
    const img = new Image();
    img.onload = () => {
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w <= maxDim && h <= maxDim) {
        callback(dataUrl, w, h);
        return;
      }
      const ratio = Math.min(maxDim / w, maxDim / h);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);
      const cv = document.createElement('canvas');
      cv.width = w;
      cv.height = h;
      cv.getContext('2d').drawImage(img, 0, 0, w, h);
      callback(cv.toDataURL('image/jpeg', 0.85), w, h);
    };
    img.src = dataUrl;
  }

  function createImage(x, y, width, height, dataUrl, filename, id, category) {
    id = id || state.nextElementId++;
    category = category || 'inspiration';
    state.zCounter++;
    const zIndex = state.zCounter;

    const data = { id, type: 'image', x, y, width, height, dataUrl, filename: filename || '', zIndex, category };
    if (!state.elements.find((e) => e.id === id)) {
      state.elements.push(data);
    }

    const el = document.createElement('div');
    el.id = 'user-el-' + id;
    el.className = 'user-element user-image';
    el.style.left   = x + 'px';
    el.style.top    = y + 'px';
    el.style.width  = width + 'px';
    el.style.height = height + 'px';
    el.style.zIndex = zIndex;
    el.dataset.category = category;

    const img = document.createElement('img');
    img.src = dataUrl;
    img.draggable = false;
    el.appendChild(img);
    canvas.appendChild(el);

    if (state.nextElementId <= id) state.nextElementId = id + 1;
    saveState();
    return data;
  }


  // ═══════════════════════════════════════════════════════
  // USER FRAMES — Custom labeled containers
  // ═══════════════════════════════════════════════════════

  function createFrame(x, y, width, height, label, id, category) {
    id       = id || state.nextElementId++;
    label    = label || 'New Frame';
    category = category || 'note';
    // Frames sit behind stickies/images
    var zIndex = 50;

    var data = { id, type: 'frame', x, y, width, height, label, zIndex, category };
    if (!state.elements.find(function (e) { return e.id === id; })) {
      state.elements.push(data);
    }

    var el = document.createElement('div');
    el.id = 'user-el-' + id;
    el.className = 'user-element user-frame';
    el.style.left   = x + 'px';
    el.style.top    = y + 'px';
    el.style.width  = width + 'px';
    el.style.height = height + 'px';
    el.style.zIndex = zIndex;
    el.dataset.category = category;

    var labelEl = document.createElement('span');
    labelEl.className = 'user-frame__label';
    labelEl.contentEditable = 'true';
    labelEl.spellcheck = false;
    labelEl.textContent = label;
    labelEl.addEventListener('input', function () {
      data.label = labelEl.textContent;
      debouncedSave();
    });
    labelEl.addEventListener('mousedown', function (ev) { ev.stopPropagation(); });

    el.appendChild(labelEl);
    canvas.appendChild(el);

    if (state.nextElementId <= id) state.nextElementId = id + 1;
    saveState();
    return data;
  }


  // ═══════════════════════════════════════════════════════
  // PERSISTENCE (localStorage + Export)
  // ═══════════════════════════════════════════════════════

  const STORAGE_KEY = 'sfb-canvas-state';

  function saveState() {
    const payload = {
      version: 1,
      viewport: {
        panX: state.targetPanX,
        panY: state.targetPanY,
        scale: state.targetScale,
      },
      elements: state.elements.map((e) => ({ ...e })),
      nextElementId: state.nextElementId,
      zCounter: state.zCounter,
      briefingCount: state.briefingCount,
      lastBriefingDate: state.lastBriefingDate,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (_) {
      // Storage full — silently fail
    }
  }

  var _saveTimer = null;
  function debouncedSave() {
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(saveState, 400);
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const payload = JSON.parse(raw);
      if (payload.version !== 1) return;

      state.targetPanX  = payload.viewport.panX;
      state.targetPanY  = payload.viewport.panY;
      state.targetScale = payload.viewport.scale;
      state.panX  = state.targetPanX;
      state.panY  = state.targetPanY;
      state.scale = state.targetScale;
      state.nextElementId = payload.nextElementId || 1;
      state.zCounter = payload.zCounter || 100;
      state.briefingCount = payload.briefingCount || 0;
      state.lastBriefingDate = payload.lastBriefingDate || null;

      (payload.elements || []).forEach((e) => {
        var created = null;
        if (e.type === 'sticky') {
          created = createSticky(e.x, e.y, e.width, e.color, e.text, e.id, e.category);
          if (e.connectedTo) created.connectedTo = e.connectedTo;
          if (e.parentFrameId) created.parentFrameId = e.parentFrameId;
        } else if (e.type === 'image') {
          created = createImage(e.x, e.y, e.width, e.height, e.dataUrl, e.filename, e.id, e.category);
          if (e.parentFrameId) created.parentFrameId = e.parentFrameId;
        } else if (e.type === 'frame') {
          created = createFrame(e.x, e.y, e.width, e.height, e.label, e.id, e.category);
        }
        // Restore saved z-index
        if (created && e.zIndex != null) {
          created.zIndex = e.zIndex;
          var domEl = document.getElementById('user-el-' + created.id);
          if (domEl) domEl.style.zIndex = e.zIndex;
        }
      });

      // Set zCounter to highest z-index across all loaded elements
      var maxZ = 100;
      state.elements.forEach(function (el) {
        if (el.zIndex > maxZ) maxZ = el.zIndex;
      });
      state.zCounter = maxZ;

      // Validate stale references (1D)
      var existingIds = state.elements.map(function (el) { return el.id; });
      state.elements.forEach(function (el) {
        if (el.connectedTo) {
          el.connectedTo = el.connectedTo.filter(function (cid) {
            return existingIds.indexOf(cid) !== -1;
          });
        }
        if (el.parentFrameId && existingIds.indexOf(el.parentFrameId) === -1) {
          el.parentFrameId = null;
        }
      });

      state.connectorsDirty = true;
    } catch (_) {
      // Corrupted state — start fresh
    }
  }

  function exportJSON() {
    // Gather brand frame positions for Claude context
    const brandFrames = [];
    canvas.querySelectorAll('.frame').forEach((f) => {
      const label = f.querySelector('.frame__label');
      brandFrames.push({
        label: label ? label.textContent.trim() : 'Unlabeled',
        x: parseFloat(f.style.left) || 0,
        y: parseFloat(f.style.top) || 0,
        width: parseFloat(f.style.width) || f.offsetWidth,
      });
    });

    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      viewport: {
        panX: Math.round(state.targetPanX),
        panY: Math.round(state.targetPanY),
        scale: parseFloat(state.targetScale.toFixed(3)),
      },
      elements: state.elements.map((e) => {
        const out = { ...e };
        out.x = Math.round(out.x);
        out.y = Math.round(out.y);
        out.width = Math.round(out.width);
        if (out.height) out.height = Math.round(out.height);
        return out;
      }),
      meta: {
        canvasWidth: CANVAS_W,
        canvasHeight: CANVAS_H,
        brandFrames,
      },
    };
  }

  function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Save button handler
  async function handleSave() {
    const data = exportJSON();
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: 'canvas-state.json',
          types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(JSON.stringify(data, null, 2));
        await writable.close();
        return;
      } catch (err) {
        if (err.name === 'AbortError') return; // User cancelled
      }
    }
    downloadJSON(data, 'canvas-state.json');
  }

  // Export button handler
  function handleExport() {
    downloadJSON(exportJSON(), 'canvas-state.json');
  }


  // ═══════════════════════════════════════════════════════
  // CANVAS BRIEFING — Claude-optimized markdown export
  // ═══════════════════════════════════════════════════════

  function generateBriefing() {
    // Gather brand frames with bounding boxes from DOM
    const frames = [];
    canvas.querySelectorAll('.frame').forEach((f) => {
      const label = f.querySelector('.frame__label');
      const x = parseFloat(f.style.left) || 0;
      const y = parseFloat(f.style.top) || 0;
      const w = parseFloat(f.style.width) || f.offsetWidth;
      const h = f.offsetHeight || 400;
      frames.push({
        label: label ? label.textContent.trim() : 'Unlabeled',
        x, y, w, h,
        cx: x + w / 2,
        cy: y + h / 2,
      });
    });

    // Also include user-created frames as grouping targets
    state.elements.forEach(function (el) {
      if (el.type === 'frame') {
        frames.push({
          label: el.label || 'Untitled Frame',
          x: el.x, y: el.y, w: el.width, h: el.height,
          cx: el.x + el.width / 2,
          cy: el.y + el.height / 2,
        });
      }
    });

    const PADDING = 100;

    // Assign each user element (excluding frames) to the nearest brand frame
    const grouped = {};
    const unassigned = [];
    var contentElements = state.elements.filter(function (el) { return el.type !== 'frame'; });

    contentElements.forEach((el) => {
      const category = el.category || (el.type === 'image' ? 'inspiration' : 'note');

      const entry = {
        type: el.type,
        category,
        text: el.text || '',
        filename: el.filename || '',
        width: Math.round(el.width || 0),
        height: Math.round(el.height || 0),
        color: el.color || '',
        connectedIds: el.connectedTo || [],
      };

      // Use parentFrameId (frame containment) if available
      if (el.parentFrameId) {
        var parentFrame = state.elements.find(function (f) { return f.id === el.parentFrameId; });
        if (parentFrame) {
          var frameLabel = parentFrame.label || 'Untitled Frame';
          if (!grouped[frameLabel]) grouped[frameLabel] = [];
          grouped[frameLabel].push(entry);
          return;
        }
      }

      // Fall through to proximity-based grouping
      const ecx = el.x + (el.width || 0) / 2;
      const ecy = el.y + ((el.height || 80) / 2);

      let bestFrame = null;
      let bestDist = Infinity;

      frames.forEach((f) => {
        if (ecx >= f.x - PADDING && ecx <= f.x + f.w + PADDING &&
            ecy >= f.y - PADDING && ecy <= f.y + f.h + PADDING) {
          const dist = Math.hypot(ecx - f.cx, ecy - f.cy);
          if (dist < bestDist) {
            bestDist = dist;
            bestFrame = f.label;
          }
        }
      });

      if (bestFrame) {
        if (!grouped[bestFrame]) grouped[bestFrame] = [];
        grouped[bestFrame].push(entry);
      } else {
        unassigned.push(entry);
      }
    });

    // Count categories across content elements
    const counts = { decision: 0, question: 0, note: 0, inspiration: 0 };
    contentElements.forEach((el) => {
      const cat = el.category || (el.type === 'image' ? 'inspiration' : 'note');
      counts[cat] = (counts[cat] || 0) + 1;
    });

    // Build markdown
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const total = contentElements.length;

    let md = '# Smiles for Belize \u2014 Canvas Briefing\n';
    md += '*Exported: ' + dateStr + ' at ' + timeStr + '*\n';
    md += '*Elements: ' + total + ' (' + counts.decision + ' decisions, ' + counts.note + ' notes, ' + counts.question + ' questions, ' + counts.inspiration + ' inspiration)*\n';
    md += '*Session #' + state.briefingCount;
    if (state.lastBriefingDate) md += ' \u2014 Previous: ' + state.lastBriefingDate;
    md += '*\n\n';

    // Canvas Structure preamble
    var frameLookup = {
      'Brand Identity': 'Core brand name, tagline, and DNA statement',
      'Color Palette': 'Primary and accent colors with emotional associations',
      'Typography': 'Font pairings, type hierarchy, and headline styles',
      'Voice & Tone': 'Messaging style, tone keywords, and sample copy',
      'Patterns & Motifs': 'Visual patterns, icons, and decorative elements',
      'Imagery Direction': 'Photography style, subjects, and mood guidelines',
      'Emotional Territory': 'Core emotions, values, and brand personality',
      'Closing Thought': 'Unifying brand statement and vision',
    };
    md += '## Canvas Structure\n';
    md += 'This canvas is organized into branded sections, each representing a dimension of the Smiles for Belize brand identity:\n\n';
    var listedLabels = {};
    frames.forEach(function (f) {
      if (listedLabels[f.label]) return;
      listedLabels[f.label] = true;
      var desc = frameLookup[f.label];
      md += '- **' + f.label + '** \u2014 ' + (desc || 'User-created grouping') + '\n';
    });
    md += '\n';

    // Design System — code-ready tokens
    md += '## Design System\n\n';
    md += '### Colors\n';
    md += '| Token | Hex | Role |\n';
    md += '|-------|-----|------|\n';
    md += '| `--royal` | `#1B3A8C` | Primary — trust, authority, headlines |\n';
    md += '| `--bright` | `#2563EB` | Energy — CTAs, links, interactive elements |\n';
    md += '| `--teal` | `#0D9488` | Fresh — secondary accent, success states |\n';
    md += '| `--sand` | `#F5E6D3` | Warmth — card backgrounds, soft sections |\n';
    md += '| `--sand-light` | `#FAF7F2` | Light — page backgrounds, breathing room |\n';
    md += '| `--gold` | `#D4A96A` | Optimism — highlights, dividers, accents |\n';
    md += '| `--charcoal` | `#2D2A26` | Ground — body text, dark UI |\n\n';
    md += '### Typography\n';
    md += '| Role | Font Family | Weights | Use |\n';
    md += '|------|-------------|---------|-----|\n';
    md += '| Headlines | `DM Serif Display` | 400 | Hero text, section headers, pull quotes |\n';
    md += '| Body / UI | `DM Sans` | 400, 500, 700 | Paragraphs, buttons, captions, nav |\n';
    md += '| Editorial alt | `Playfair Display` | 400, 700 | Long-form, editorial feel |\n';
    md += '| Modern alt | `Plus Jakarta Sans` | 400\u2013800 | Clean headings, bold statements |\n';
    md += '| Handwritten | `Caveat` | 400\u2013700 | Annotations, informal labels |\n\n';
    md += '### Font Import\n';
    md += '```\n';
    md += 'fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=DM+Serif+Display&family=Playfair+Display:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Caveat:wght@400;600;700&display=swap\n';
    md += '```\n\n';

    md += '## Summary\n';
    md += '- ' + counts.decision + ' decisions locked in\n';
    md += '- ' + counts.question + ' open questions for Claude\n';

    // Focus areas (top sections by element count)
    const focusAreas = Object.entries(grouped)
      .sort(function (a, b) { return b[1].length - a[1].length; })
      .slice(0, 3)
      .map(function (pair) { return pair[0] + ' (' + pair[1].length + ' elements)'; })
      .join(', ');
    if (focusAreas) md += '- Focus areas: ' + focusAreas + '\n';
    md += '\n---\n\n';

    function formatEntry(entry) {
      var suffix = '';
      if (entry.connectedIds && entry.connectedIds.length > 0) {
        var targets = entry.connectedIds.map(function (cid) {
          var t = state.elements.find(function (el) { return el.id === cid; });
          if (!t) return null;
          if (t.type === 'sticky') return '"' + (t.text || '').substring(0, 40) + '" (' + (t.color || 'yellow') + ' sticky)';
          return (t.filename || 'image') + ' (' + Math.round(t.width || 0) + 'x' + Math.round(t.height || 0) + ')';
        }).filter(Boolean);
        suffix = targets.length ? ' [annotates: ' + targets.join(', ') + ']' : '';
      }
      if (entry.type === 'sticky') {
        return '- "' + entry.text + '" (' + entry.color + ' sticky)' + suffix;
      } else {
        var name = entry.filename || 'unnamed image (' + entry.width + 'x' + entry.height + 'px)';
        return '- ' + name + ' (image, ' + entry.width + 'x' + entry.height + ')' + suffix;
      }
    }

    // Grouped sections
    Object.entries(grouped).forEach(function (pair) {
      var label = pair[0];
      var elements = pair[1];
      md += '## ' + label + ' (' + elements.length + ' elements)\n\n';

      var byCat = { decision: [], question: [], note: [], inspiration: [] };
      elements.forEach(function (el) {
        (byCat[el.category] || byCat.note).push(el);
      });

      if (byCat.decision.length) {
        md += '### Decisions\n';
        byCat.decision.forEach(function (e) { md += formatEntry(e) + '\n'; });
        md += '\n';
      }
      if (byCat.question.length) {
        md += '### Questions\n';
        byCat.question.forEach(function (e) { md += formatEntry(e) + '\n'; });
        md += '\n';
      }
      if (byCat.note.length) {
        md += '### Notes\n';
        byCat.note.forEach(function (e) { md += formatEntry(e) + '\n'; });
        md += '\n';
      }
      if (byCat.inspiration.length) {
        md += '### Inspiration\n';
        byCat.inspiration.forEach(function (e) { md += formatEntry(e) + '\n'; });
        md += '\n';
      }

      md += '---\n\n';
    });

    // Unassigned elements
    if (unassigned.length) {
      md += '## General / Cross-Cutting (' + unassigned.length + ' elements)\n\n';
      unassigned.forEach(function (e) { md += formatEntry(e) + '\n'; });
      md += '\n---\n\n';
    }

    // Consolidated open questions section
    var questions = [];
    Object.entries(grouped).forEach(function (pair) {
      pair[1].forEach(function (el) {
        if (el.category === 'question') {
          questions.push({ text: el.text || el.filename, area: pair[0] });
        }
      });
    });
    unassigned.forEach(function (el) {
      if (el.category === 'question') {
        questions.push({ text: el.text || el.filename, area: 'General' });
      }
    });

    if (questions.length) {
      md += '## For Claude: Open Questions\n';
      questions.forEach(function (q, i) {
        md += (i + 1) + '. ' + q.text + ' (' + q.area + ' area)\n';
      });
      md += '\n';
    }

    // Implementation guidance for Claude Code
    md += '## For Claude Code: Implementation Notes\n';
    md += 'When generating pages from this brand canvas:\n';
    md += '- Use the CSS custom properties from the Design System section for all colors\n';
    md += '- `DM Serif Display` for headlines, `DM Sans` for body/UI text\n';
    md += '- Photography direction: warm, natural light, people-first — never clinical or stock-photo-perfect\n';
    md += '- Smile arc motif (`Q` bezier curves) for section dividers and decorative elements\n';
    md += '- Elements marked **decision** are locked in — use them as-is\n';
    md += '- Elements marked **question** are open — propose a direction and explain the trade-off\n';
    md += '- Elements marked **inspiration** are mood references — draw from the feeling, not literal replication\n';

    return md;
  }

  // Toast notification
  function showToast(message, duration) {
    duration = duration || 5000;
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      toast.classList.add('toast--visible');
    });
    var dismiss = function () {
      toast.classList.remove('toast--visible');
      setTimeout(function () { toast.remove(); }, 300);
    };
    toast.addEventListener('click', dismiss);
    setTimeout(dismiss, duration);
  }

  // Brief Claude button handler — clipboard-first for Claude Code workflow
  async function handleBriefClaude() {
    state.briefingCount++;
    var md = generateBriefing();
    var now = new Date();
    state.lastBriefingDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ' at ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    saveState();

    // Primary: copy to clipboard for pasting into Claude Code
    try {
      await navigator.clipboard.writeText(md);
      showToast('Briefing copied to clipboard! Paste it into Claude Code.', 6000);
    } catch (_) {
      // Fallback: download file if clipboard unavailable
      var blob = new Blob([md], { type: 'text/markdown' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'canvas-briefing.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Briefing downloaded! Share it with Claude Code.');
    }
  }


  // Wire save/export/brief buttons
  const saveBtn = document.getElementById('saveBtn');
  const exportBtn = document.getElementById('exportBtn');
  const briefBtn = document.getElementById('briefBtn');
  if (saveBtn) saveBtn.addEventListener('click', handleSave);
  if (exportBtn) exportBtn.addEventListener('click', handleExport);
  if (briefBtn) briefBtn.addEventListener('click', handleBriefClaude);

  // Annotate button
  var annotateBtn = document.getElementById('annotateBtn');
  if (annotateBtn) {
    annotateBtn.addEventListener('click', function () {
      if (state.selectedElementIds.length > 0) {
        createConnectedSticky(state.selectedElementIds.slice());
        deselectAll();
      }
    });
  }


  // ═══════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════

  function init() {
    loadState();
    // Need a small delay so frames render before measuring for minimap
    requestAnimationFrame(() => {
      initMinimap();
      tick();
    });
  }

  init();
})();
