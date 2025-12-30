/**
 * Theme Switcher for Hugo Multi-Theme Blog
 * Enables runtime switching between pre-built themes
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'selected-theme';
  const MANIFEST_PATH = '/theme-manifest.json';

  let themes = [];
  let modal = null;

  // Detect current theme from URL path
  function detectCurrentTheme() {
    const path = window.location.pathname;
    const match = path.match(/^\/themes\/([^/]+)\//);
    if (match) {
      return match[1];
    }
    return 'default';
  }

  // Get the equivalent path in a different theme
  function getThemePath(themeId) {
    const currentPath = window.location.pathname;
    const currentThemeId = detectCurrentTheme();

    if (themeId === 'default') {
      if (currentThemeId === 'default') {
        return currentPath;
      }
      return currentPath.replace(/^\/themes\/[^/]+/, '');
    }

    if (currentThemeId === 'default') {
      return '/themes/' + themeId + currentPath;
    }

    return currentPath.replace(/^\/themes\/[^/]+/, '/themes/' + themeId);
  }

  // Load theme manifest
  async function loadManifest() {
    try {
      const response = await fetch(MANIFEST_PATH);
      if (!response.ok) throw new Error('Manifest not found');
      themes = await response.json();

      themes.unshift({
        id: 'default',
        name: 'Congo (Default)',
        path: '/',
        module: 'github.com/jpanther/congo/v2'
      });

      return themes;
    } catch (error) {
      console.warn('Theme manifest not available:', error);
      return [];
    }
  }

  // Create SVG icon element safely
  function createSunIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '3');
    svg.appendChild(circle);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42');
    svg.appendChild(path);

    return svg;
  }

  // Create the floating button
  function createFloatingButton() {
    const button = document.createElement('button');
    button.id = 'theme-switcher-btn';
    button.title = 'Switch Theme';

    button.appendChild(createSunIcon());

    const span = document.createElement('span');
    span.textContent = 'Themes';
    button.appendChild(span);

    button.addEventListener('click', openModal);
    document.body.appendChild(button);
    return button;
  }

  // Create the modal
  function createModal() {
    modal = document.createElement('div');
    modal.id = 'theme-switcher-modal';

    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'theme-modal-backdrop';
    backdrop.addEventListener('click', closeModal);
    modal.appendChild(backdrop);

    // Content container
    const content = document.createElement('div');
    content.className = 'theme-modal-content';

    // Header
    const header = document.createElement('div');
    header.className = 'theme-modal-header';

    const title = document.createElement('h2');
    title.textContent = 'Choose Theme';
    header.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'theme-modal-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '\u00D7';
    closeBtn.addEventListener('click', closeModal);
    header.appendChild(closeBtn);

    content.appendChild(header);

    // Search
    const searchDiv = document.createElement('div');
    searchDiv.className = 'theme-modal-search';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search themes...';
    searchInput.id = 'theme-search-input';
    searchInput.addEventListener('input', filterThemes);
    searchDiv.appendChild(searchInput);

    content.appendChild(searchDiv);

    // Body
    const body = document.createElement('div');
    body.className = 'theme-modal-body';

    const grid = document.createElement('div');
    grid.className = 'theme-grid';
    grid.id = 'theme-grid';
    body.appendChild(grid);

    content.appendChild(body);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'theme-modal-footer';

    const currentP = document.createElement('p');
    currentP.textContent = 'Currently viewing: ';
    const currentName = document.createElement('strong');
    currentName.id = 'current-theme-name';
    currentName.textContent = 'Loading...';
    currentP.appendChild(currentName);
    footer.appendChild(currentP);

    const noteP = document.createElement('p');
    noteP.className = 'theme-note';
    noteP.textContent = 'Theme preference is saved in your browser';
    footer.appendChild(noteP);

    content.appendChild(footer);
    modal.appendChild(content);

    // Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });

    document.body.appendChild(modal);
    return modal;
  }

  // Create a single theme card
  function createThemeCard(theme, isActive) {
    const card = document.createElement('div');
    card.className = 'theme-card' + (isActive ? ' active' : '');
    card.dataset.themeId = theme.id;

    // Preview
    const preview = document.createElement('div');
    preview.className = 'theme-card-preview';

    const placeholder = document.createElement('div');
    placeholder.className = 'theme-preview-placeholder';
    placeholder.textContent = theme.name.charAt(0).toUpperCase();
    preview.appendChild(placeholder);

    card.appendChild(preview);

    // Info
    const info = document.createElement('div');
    info.className = 'theme-card-info';

    const name = document.createElement('h3');
    name.textContent = theme.name;
    info.appendChild(name);

    if (isActive) {
      const badge = document.createElement('span');
      badge.className = 'theme-badge';
      badge.textContent = 'Current';
      info.appendChild(badge);
    }

    card.appendChild(info);

    card.addEventListener('click', function() {
      switchToTheme(theme.id);
    });

    return card;
  }

  // Render theme cards
  function renderThemes(themesToRender) {
    if (!themesToRender) themesToRender = themes;

    const grid = document.getElementById('theme-grid');
    const currentThemeId = detectCurrentTheme();

    // Clear existing cards
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    // Add new cards
    themesToRender.forEach(function(theme) {
      const isActive = theme.id === currentThemeId;
      const card = createThemeCard(theme, isActive);
      grid.appendChild(card);
    });

    // Update current theme display
    const currentTheme = themes.find(function(t) {
      return t.id === currentThemeId;
    });
    var nameEl = document.getElementById('current-theme-name');
    if (nameEl) {
      nameEl.textContent = currentTheme ? currentTheme.name : 'Unknown';
    }
  }

  // Filter themes by search
  function filterThemes(e) {
    const query = e.target.value.toLowerCase();
    const filtered = themes.filter(function(theme) {
      return theme.name.toLowerCase().indexOf(query) !== -1 ||
             theme.id.toLowerCase().indexOf(query) !== -1;
    });
    renderThemes(filtered);
  }

  // Switch to a theme
  function switchToTheme(themeId) {
    localStorage.setItem(STORAGE_KEY, themeId);
    const newPath = getThemePath(themeId);
    window.location.href = newPath;
  }

  // Open modal
  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderThemes();
    setTimeout(function() {
      var input = document.getElementById('theme-search-input');
      if (input) input.focus();
    }, 100);
  }

  // Close modal
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Check for saved theme preference on load
  function checkSavedPreference() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const currentThemeId = detectCurrentTheme();

    if (savedTheme && savedTheme !== currentThemeId) {
      console.log('Saved theme preference: ' + savedTheme + ', current: ' + currentThemeId);
    }
  }

  // Initialize
  async function init() {
    injectStyles();
    await loadManifest();

    if (themes.length === 0) {
      console.log('Theme switcher: No themes available');
      return;
    }

    createFloatingButton();
    createModal();
    checkSavedPreference();

    console.log('Theme switcher initialized with ' + themes.length + ' themes');
  }

  // Inject CSS styles
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = [
      '#theme-switcher-btn {',
      '  position: fixed;',
      '  bottom: 20px;',
      '  right: 20px;',
      '  z-index: 9998;',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 8px;',
      '  padding: 12px 16px;',
      '  background: linear-gradient(135deg, #8be9fd 0%, #bd93f9 100%);',
      '  color: #282a36;',
      '  border: none;',
      '  border-radius: 50px;',
      '  cursor: pointer;',
      '  font-family: inherit;',
      '  font-size: 14px;',
      '  font-weight: 600;',
      '  box-shadow: 0 4px 20px rgba(139, 233, 253, 0.4);',
      '  transition: all 0.3s ease;',
      '}',
      '#theme-switcher-btn:hover {',
      '  transform: translateY(-2px);',
      '  box-shadow: 0 6px 25px rgba(139, 233, 253, 0.5);',
      '}',
      '#theme-switcher-btn svg { width: 20px; height: 20px; }',
      '#theme-switcher-modal {',
      '  display: none;',
      '  position: fixed;',
      '  inset: 0;',
      '  z-index: 9999;',
      '}',
      '#theme-switcher-modal.open {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '}',
      '.theme-modal-backdrop {',
      '  position: absolute;',
      '  inset: 0;',
      '  background: rgba(0, 0, 0, 0.7);',
      '  backdrop-filter: blur(4px);',
      '}',
      '.theme-modal-content {',
      '  position: relative;',
      '  width: 90%;',
      '  max-width: 800px;',
      '  max-height: 85vh;',
      '  background: #1e1e2e;',
      '  border-radius: 16px;',
      '  display: flex;',
      '  flex-direction: column;',
      '  overflow: hidden;',
      '  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);',
      '  animation: modalSlideIn 0.3s ease;',
      '}',
      '@keyframes modalSlideIn {',
      '  from { opacity: 0; transform: translateY(20px) scale(0.95); }',
      '  to { opacity: 1; transform: translateY(0) scale(1); }',
      '}',
      '.theme-modal-header {',
      '  display: flex;',
      '  justify-content: space-between;',
      '  align-items: center;',
      '  padding: 20px 24px;',
      '  border-bottom: 1px solid #313244;',
      '}',
      '.theme-modal-header h2 { margin: 0; font-size: 1.5rem; color: #cdd6f4; }',
      '.theme-modal-close {',
      '  background: none;',
      '  border: none;',
      '  font-size: 28px;',
      '  color: #6c7086;',
      '  cursor: pointer;',
      '  padding: 0;',
      '  line-height: 1;',
      '  transition: color 0.2s;',
      '}',
      '.theme-modal-close:hover { color: #f38ba8; }',
      '.theme-modal-search {',
      '  padding: 16px 24px;',
      '  border-bottom: 1px solid #313244;',
      '}',
      '.theme-modal-search input {',
      '  width: 100%;',
      '  padding: 12px 16px;',
      '  background: #313244;',
      '  border: 1px solid #45475a;',
      '  border-radius: 8px;',
      '  color: #cdd6f4;',
      '  font-size: 16px;',
      '  outline: none;',
      '  transition: border-color 0.2s;',
      '}',
      '.theme-modal-search input:focus { border-color: #8be9fd; }',
      '.theme-modal-search input::placeholder { color: #6c7086; }',
      '.theme-modal-body {',
      '  flex: 1;',
      '  overflow-y: auto;',
      '  padding: 24px;',
      '}',
      '.theme-grid {',
      '  display: grid;',
      '  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));',
      '  gap: 16px;',
      '}',
      '.theme-card {',
      '  background: #313244;',
      '  border-radius: 12px;',
      '  overflow: hidden;',
      '  cursor: pointer;',
      '  transition: all 0.2s ease;',
      '  border: 2px solid transparent;',
      '}',
      '.theme-card:hover {',
      '  transform: translateY(-4px);',
      '  border-color: #8be9fd;',
      '  box-shadow: 0 8px 25px rgba(139, 233, 253, 0.2);',
      '}',
      '.theme-card.active {',
      '  border-color: #a6e3a1;',
      '  background: #1e3a28;',
      '}',
      '.theme-card-preview {',
      '  height: 100px;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  background: linear-gradient(135deg, #45475a 0%, #313244 100%);',
      '}',
      '.theme-preview-placeholder {',
      '  width: 50px;',
      '  height: 50px;',
      '  border-radius: 50%;',
      '  background: linear-gradient(135deg, #8be9fd 0%, #bd93f9 100%);',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  font-size: 24px;',
      '  font-weight: bold;',
      '  color: #282a36;',
      '}',
      '.theme-card-info {',
      '  padding: 12px 16px;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  gap: 8px;',
      '}',
      '.theme-card-info h3 {',
      '  margin: 0;',
      '  font-size: 14px;',
      '  color: #cdd6f4;',
      '  white-space: nowrap;',
      '  overflow: hidden;',
      '  text-overflow: ellipsis;',
      '}',
      '.theme-badge {',
      '  background: #a6e3a1;',
      '  color: #1e1e2e;',
      '  padding: 2px 8px;',
      '  border-radius: 4px;',
      '  font-size: 11px;',
      '  font-weight: 600;',
      '  flex-shrink: 0;',
      '}',
      '.theme-modal-footer {',
      '  padding: 16px 24px;',
      '  border-top: 1px solid #313244;',
      '  text-align: center;',
      '}',
      '.theme-modal-footer p { margin: 4px 0; color: #6c7086; font-size: 13px; }',
      '.theme-modal-footer strong { color: #8be9fd; }',
      '.theme-note { font-size: 12px !important; opacity: 0.7; }',
      '@media (max-width: 640px) {',
      '  #theme-switcher-btn span { display: none; }',
      '  #theme-switcher-btn { padding: 12px; border-radius: 50%; }',
      '  .theme-modal-content { width: 95%; max-height: 90vh; }',
      '  .theme-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }',
      '  .theme-card-preview { height: 80px; }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
