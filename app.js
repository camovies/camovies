(() => {
  const REPO_OWNER = 'camovies';
  const REPO_NAME = 'camovies';
  const STREAM_PROXY_URL = 'https://camovies-dl.camoviesmizo.workers.dev/apk-stream';
  const CACHE_KEY = 'ca_release_hub_cache_v3';
  const CACHE_TTL = 0;
  const RING_CIRCUMFERENCE = 2 * Math.PI * 88;

  const I18N = {
    mz: {
      brandTag: 'Official APK Download-na',
      heroTitle: 'CA Movies APK Download-na',
      heroDesc: 'Mizo Dubbed leh Subtitled Movie & Series-te enna official Android app.',
      versionLabel: 'Version',
      latestTag: 'Thar ber',
      archiveTag: 'Version hlui',
      metaPlatform: 'Platform',
      metaUpdated: 'Chhuah ni',
      metaDownloads: 'Download zat',
      selectBuild: 'I Phone mil tur thlang rawh',
      detectModern: 'Tunlai phone tlanglawn (arm64-v8a)',
      recommended: 'Fuh ber',
      modernTitle: 'Tunlai phone tlanglawn tan',
      modernSub: '64-bit Android phone',
      olderTitle: 'Phone chhuak hlui lam tan',
      olderSub: '32-bit Android phone hlui lam tan',
      universalTitle: 'Android phone zawng zawng',
      universalSub: 'Universal APK package',
      downloadBtn: 'Download',
      changelogTitle: 'Changelog',
      changelogEmpty: 'He version tan hian changelog ziah luh a awm rih lo.',
      installGuide: 'A khawi zawk nge thlan tur i hriat loh chuan Tunlai phone tlanglawn tan (arm64-v8a) hi hmang hmasa la; a in-install theih loh chauhvin Phone chhuak hlui lam tan (armeabi-v7a) download rawh.',
      supportTitle: 'Support Group',
      supportBadge: 'Ṭanpuina',
      supportDesc: 'Harsatna i neih emaw, zawh duh i neih chuan a hnuaia kan Support Group hi lo join rawh.',
      joinGroup: 'Join',
      allReleasesLink: 'GitHub Releases',
      btnCancel: 'Cancel',
      btnRetry: 'Tih Ṭhatna',
      btnDirect: 'Save Nawnna',
      btnDone: 'Zo Ta',
      stageConnect: 'Release server biak mek a ni...',
      stageStreaming: 'APK file a in-download mek...',
      stageSaving: 'I phone-ah APK a in-save mek...',
      titleActive: 'A in-download Mek',
      titleSuccess: 'Download A Zo Ta',
      subSuccess: 'APK file chu i phone Downloads-ah a in-save fel tawh e. Install nghal theih a ni.',
      subDirectFallback: 'I browser download bar-ah a in-download mek.',
      titleCancelled: 'Download tih tawp a ni',
      subCancelled: 'Download lai i ti tawp a, i duh hunah i ti ṭha leh thei.',
      titleError: 'Download theih loh',
      errOffline: 'Internet connection a awm lo. I data emaw, Wi-Fi en fiah la ti ṭha leh rawh.',
      errNetwork: 'Download laiin connection a chat emaw, server-ah harsatna a awm. Ti ṭha leh rawh.',
      errMissing: 'He version-ah hian APK file hmuh a ni lo.',
      noAssets: 'He release-ah hian download tur APK a la awm lo.',
      sourceReadme: 'README.md',
      sourceRelease: 'Release Notes',
      downloadsCount: 'vawi'
    },
    en: {
      brandTag: 'Official Release Hub',
      heroTitle: 'Download CA Movies',
      heroDesc: 'Stream Mizo Dubbed & Subtitled Movies and Series effortlessly on Android.',
      versionLabel: 'Version',
      latestTag: 'Latest',
      archiveTag: 'Archive',
      metaPlatform: 'Platform',
      metaUpdated: 'Released',
      metaDownloads: 'Downloads',
      selectBuild: 'Choose Your Device Build',
      detectModern: 'Modern (arm64-v8a) is recommended for your device',
      recommended: 'Recommended',
      modernTitle: 'Modern Phones',
      modernSub: '64-bit Android devices',
      olderTitle: 'Older 32-bit Phones',
      olderSub: 'Legacy 32-bit Android devices',
      universalTitle: 'Universal Build',
      universalSub: 'Compatible Android APK package',
      downloadBtn: 'Download APK',
      changelogTitle: 'Changelog',
      changelogEmpty: 'No changelog entries listed for this version.',
      installGuide: 'Unsure which APK to pick? Most phones made after 2018 use Modern (arm64-v8a). If installation fails, download Older 32-bit (armeabi-v7a).',
      supportTitle: 'Support Group',
      supportBadge: 'Community',
      supportDesc: 'Need help, have questions, or want to report an issue? Join our official groups below.',
      joinGroup: 'Join Group',
      allReleasesLink: 'GitHub Releases',
      btnCancel: 'Cancel',
      btnRetry: 'Try Again',
      btnDirect: 'Save Again',
      btnDone: 'Done',
      stageConnect: 'Connecting to release edge...',
      stageStreaming: 'Downloading APK package...',
      stageSaving: 'Saving APK to your device...',
      titleActive: 'Downloading APK',
      titleSuccess: 'Download Complete',
      subSuccess: 'APK has been saved directly to your device Downloads. Open it to install.',
      subDirectFallback: 'Your browser has started downloading the APK.',
      titleCancelled: 'Download Cancelled',
      subCancelled: 'Transfer was aborted and stopped. You can restart anytime.',
      titleError: 'Download Failed',
      errOffline: 'No internet connection detected. Check your network and try again.',
      errNetwork: 'Transfer interrupted or server unreachable. Please try again.',
      errMissing: 'The requested APK file could not be found on this release.',
      noAssets: 'No APK files found in this release.',
      sourceReadme: 'README.md',
      sourceRelease: 'Release Notes',
      downloadsCount: 'total'
    }
  };

  const state = {
    lang: localStorage.getItem('ca_lang') === 'mz' ? 'mz' : 'en',
    theme: document.documentElement.getAttribute('data-theme') || 'dark',
    releases: [],
    selectedIndex: 0,
    readmeChangelog: { mz: [], en: [] },
    activeAsset: null,
    abortController: null,
    blobUrl: null,
    downloadState: 'idle',
    downloadState: 'idle',
    hasFocusedHash: false
  };

  const els = {
    langBtns: document.querySelectorAll('[data-set-lang]'),
    themeToggle: document.getElementById('themeToggle'),
    releaseBadgeText: document.getElementById('releaseBadgeText'),
    versionPicker: document.getElementById('versionPicker'),
    versionTrigger: document.getElementById('versionTrigger'),
    selectedVersionLabel: document.getElementById('selectedVersionLabel'),
    versionMenu: document.getElementById('versionMenu'),
    releaseDateValue: document.getElementById('releaseDateValue'),
    releaseDownloadsValue: document.getElementById('releaseDownloadsValue'),
    deviceDetectHint: document.getElementById('deviceDetectHint'),
    downloadDeck: document.getElementById('downloadDeck'),
    changelogSourceTag: document.getElementById('changelogSourceTag'),
    changelogVersionPill: document.getElementById('changelogVersionPill'),
    changelogList: document.getElementById('changelogList'),
    yearNow: document.getElementById('yearNow'),
    reactorOverlay: document.getElementById('reactorOverlay'),
    reactorModal: document.getElementById('reactorModal'),
    reactorVerBadge: document.getElementById('reactorVerBadge'),
    reactorFilename: document.getElementById('reactorFilename'),
    reactorCloseX: document.getElementById('reactorCloseX'),
    reactorCanvas: document.getElementById('reactorCanvas'),
    ringProgress: document.getElementById('ringProgress'),
    liquidGroup: document.getElementById('liquidGroup'),
    reactorPct: document.getElementById('reactorPct'),
    reactorStatusTitle: document.getElementById('reactorStatusTitle'),
    reactorStatusSub: document.getElementById('reactorStatusSub'),
    reactorStats: document.getElementById('reactorStats'),
    reactorCancelBtn: document.getElementById('reactorCancelBtn'),
    reactorRetryBtn: document.getElementById('reactorRetryBtn'),
    reactorDirectLink: document.getElementById('reactorDirectLink'),
    reactorDoneBtn: document.getElementById('reactorDoneBtn')
  };

  function t(key) {
    return (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;
  }

  function hasValidProxy() {
    return Boolean(STREAM_PROXY_URL && STREAM_PROXY_URL.startsWith('http') && !STREAM_PROXY_URL.includes('YOUR_CLOUDFLARE_WORKER_URL'));
  }

  function formatBytes(bytes) {
    if (!bytes || bytes <= 0) return '0.0 MB';
    const mb = bytes / (1024 * 1024);
    if (mb < 0.1) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  }

  function formatSpeed(bytesPerSec) {
    if (!bytesPerSec || bytesPerSec <= 0) return '';
    const mbps = bytesPerSec / (1024 * 1024);
    if (mbps >= 1) return `${mbps.toFixed(1)} MB/s`;
    return `${Math.round(bytesPerSec / 1024)} KB/s`;
  }

  function formatDate(iso) {
    if (!iso) return '--';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '--';
    return d.toLocaleDateString(state.lang === 'mz' ? 'en-GB' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function formatNumber(n) {
    if (typeof n !== 'number' || Number.isNaN(n)) return '--';
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
  }

  function cleanMarkdownLine(line) {
    return line
      .replace(/^[-*•]\s*/, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();
  }

  function parseReadmeChangelog(markdown) {
    const result = { mz: [], en: [] };
    if (!markdown || typeof markdown !== 'string') return result;

    const lines = markdown.split(/\r?\n/);
    let currentLangSection = null;
    let capturing = null;

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (/^##\s+.*mizo/i.test(line)) {
        currentLangSection = 'mz';
        capturing = null;
        continue;
      }
      if (/^##\s+.*english/i.test(line)) {
        currentLangSection = 'en';
        capturing = null;
        continue;
      }

      if (/^###\s+/i.test(line)) {
        if (/thil\s+thar|changelog/i.test(line) && currentLangSection === 'mz') {
          capturing = 'mz';
        } else if (/what'?s\s+new|changelog/i.test(line) && currentLangSection !== 'mz') {
          capturing = 'en';
        } else if (/thil\s+thar/i.test(line)) {
          capturing = 'mz';
        } else {
          capturing = null;
        }
        continue;
      }

      if (/^(---|<p|<div|##\s+)/i.test(line)) {
        capturing = null;
        continue;
      }

      if (capturing && /^[-*•]\s+/.test(line)) {
        const cleaned = cleanMarkdownLine(line);
        if (cleaned) result[capturing].push(cleaned);
      }
    }

    return result;
  }

  function parseReleaseBody(body) {
    if (!body || typeof body !== 'string') return [];
    const items = [];
    for (const raw of body.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || /^#/.test(line) || /^---/.test(line)) continue;
      const cleaned = cleanMarkdownLine(line);
      if (cleaned) items.push(cleaned);
    }
    return items.slice(0, 12);
  }

  function buildFallbackRelease() {
    return [
      {
        tag_name: 'Latest',
        name: 'Latest Release',
        published_at: null,
        body: '',
        isFallback: true,
        assets: [
          {
            id: null,
            name: 'app-arm64-v8a-release.apk',
            size: 0,
            download_count: null,
            url: null,
            browser_download_url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/latest/download/app-arm64-v8a-release.apk`
          },
          {
            id: null,
            name: 'app-armeabi-v7a-release.apk',
            size: 0,
            download_count: null,
            url: null,
            browser_download_url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/latest/download/app-armeabi-v7a-release.apk`
          }
        ]
      }
    ];
  }

  function getMetaProxyUrl() {
    if (!hasValidProxy()) return '';
    return STREAM_PROXY_URL.replace(/\/apk-stream\/?$/, '/releases-meta');
  }

  function isPageReload() {
    try {
      const nav = performance.getEntriesByType('navigation');
      if (nav && nav.length > 0 && nav[0].type === 'reload') return true;
    } catch (_) {}
    return false;
  }

  async function fetchReleasesList() {
    const bust = Date.now();
    const freshFlag = isPageReload() ? '&fresh=1' : '';
    const endpoints = [];
    const proxyMeta = getMetaProxyUrl();
    if (proxyMeta) {
      endpoints.push(`${proxyMeta}?t=${bust}${freshFlag}`);
    }
    endpoints.push(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases?per_page=30&t=${bust}`);

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          cache: 'no-store',
          headers: endpoint.includes('api.github.com')
            ? { Accept: 'application/vnd.github+json' }
            : {}
        });
        if (!res.ok) continue;
        const data = await res.json();
        if (!Array.isArray(data)) continue;

        const sortNewest = (arr) => arr.sort((a, b) => {
          const ta = Date.parse(a.published_at || a.created_at || 0) || 0;
          const tb = Date.parse(b.published_at || b.created_at || 0) || 0;
          return tb - ta;
        });

        const stable = sortNewest(data.filter((r) => !r.draft && !r.prerelease));
        if (stable.length > 0) return stable;
        const nonDraft = sortNewest(data.filter((r) => !r.draft));
        if (nonDraft.length > 0) return nonDraft;
      } catch (_) {}
    }
    return null;
  }

  async function fetchReadmeText() {
    const bust = Date.now();
    const urls = [
      `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/README.md?t=${bust}`,
      `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/master/README.md?t=${bust}`
    ];
    for (const url of urls) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) return await res.text();
      } catch (_) {}
    }
    return '';
  }

  async function fetchRepoData() {
    let staleBackup = null;
    try {
      const cachedRaw = localStorage.getItem(CACHE_KEY);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        const hasRealReleases =
          cached &&
          Array.isArray(cached.releases) &&
          cached.releases.length > 0 &&
          !cached.releases[0].isFallback;
        if (hasRealReleases) {
          staleBackup = cached;
        }
      }
    } catch (_) {}

    // Page luh thar emaw refresh apiangin live-in a thar ber a fetch ziah ang
    const [releases, readmeText] = await Promise.all([
      fetchReleasesList(),
      fetchReadmeText()
    ]);

    if (readmeText) {
      state.readmeChangelog = parseReadmeChangelog(readmeText);
    } else if (staleBackup && staleBackup.readmeChangelog) {
      state.readmeChangelog = staleBackup.readmeChangelog;
    }

    if (releases && releases.length > 0) {
      state.releases = releases;
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          savedAt: Date.now(),
          releases: state.releases,
          readmeChangelog: state.readmeChangelog
        }));
      } catch (_) {}
    } else if (staleBackup) {
      state.releases = staleBackup.releases;
    } else {
      state.releases = buildFallbackRelease();
    }

    renderAll();
  }
  
  function applyStaticTranslations() {
    document.documentElement.lang = state.lang === 'mz' ? 'lus' : 'en';
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.getAttribute('data-i18n');
      if (key) node.textContent = t(key);
    });
    els.langBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-set-lang') === state.lang);
    });
    els.deviceDetectHint.textContent = /android/i.test(navigator.userAgent) ? t('detectModern') : '';
  }

  function setLanguage(lang) {
    if (lang !== 'mz' && lang !== 'en') return;
    state.lang = lang;
    localStorage.setItem('ca_lang', lang);
    applyStaticTranslations();
    renderAll();
  }

  function toggleTheme() {
    const next = state.theme === 'dark' ? 'light' : 'dark';
    state.theme = next;
    localStorage.setItem('ca_theme', next);
    document.documentElement.classList.add('theme-switching');
    document.documentElement.setAttribute('data-theme', next);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', next === 'dark' ? '#06090c' : '#eef4f5');
    void document.documentElement.offsetHeight;
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('theme-switching');
    });
  }

  function classifyAsset(asset) {
    const name = (asset.name || '').toLowerCase();
    if (name.includes('arm64') || name.includes('v8a')) {
      return {
        kind: 'modern',
        arch: 'arm64-v8a',
        title: t('modernTitle'),
        sub: t('modernSub'),
        primary: true
      };
    }
    if (name.includes('armeabi') || name.includes('v7a') || name.includes('32')) {
      return {
        kind: 'older',
        arch: 'armeabi-v7a',
        title: t('olderTitle'),
        sub: t('olderSub'),
        primary: false
      };
    }
    return {
      kind: 'universal',
      arch: 'APK',
      title: t('universalTitle'),
      sub: asset.name || t('universalSub'),
      primary: false
    };
  }

  function renderVersionMenu() {
    els.versionMenu.innerHTML = '';
    state.releases.forEach((rel, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `version-option${idx === state.selectedIndex ? ' selected' : ''}`;
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', idx === state.selectedIndex ? 'true' : 'false');

      const left = document.createElement('span');
      left.className = 'version-opt-left';

      const tag = document.createElement('span');
      tag.className = 'version-opt-tag';
      tag.textContent = rel.tag_name || rel.name || 'Release';

      const date = document.createElement('span');
      date.className = 'version-opt-date';
      date.textContent = formatDate(rel.published_at);

      left.append(tag, date);
      btn.appendChild(left);

      if (idx === 0) {
        const badge = document.createElement('span');
        badge.className = 'version-opt-badge';
        badge.textContent = t('latestTag');
        btn.appendChild(badge);
      }

      btn.addEventListener('click', () => {
        state.selectedIndex = idx;
        closeVersionMenu();
        renderAll();
      });

      els.versionMenu.appendChild(btn);
    });
  }

  function closeVersionMenu() {
    els.versionMenu.hidden = true;
    els.versionTrigger.setAttribute('aria-expanded', 'false');
  }

  function renderDownloadDeck(release) {
    const apkAssets = (release.assets || []).filter((a) => /\.apk$/i.test(a.name || ''));
    apkAssets.sort((a, b) => {
      const aModern = /arm64|v8a/i.test(a.name) ? 0 : 1;
      const bModern = /arm64|v8a/i.test(b.name) ? 0 : 1;
      return aModern - bModern;
    });

    els.downloadDeck.innerHTML = '';

    if (apkAssets.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'guide-box';
      empty.style.gridColumn = '1 / -1';
      empty.textContent = t('noAssets');
      els.downloadDeck.appendChild(empty);
      return;
    }

    apkAssets.forEach((asset, index) => {
      const info = classifyAsset(asset);
      const isPrimary = info.primary || (apkAssets.length === 1 && index === 0);

      const card = document.createElement('article');
      card.className = `dl-card${isPrimary ? ' primary' : ''}`;

      const iconSvg = info.kind === 'modern'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>';

      const badgeHtml = isPrimary
        ? `<span class="dl-rec-tag">${t('recommended')}</span>`
        : `<span class="dl-arch-tag mono">${info.arch}</span>`;

      const dlCountText = typeof asset.download_count === 'number'
        ? `${formatNumber(asset.download_count)} ${t('downloadsCount')}`
        : info.arch;

      card.innerHTML = `
        <div class="dl-top">
          <div class="dl-icon">${iconSvg}</div>
          ${badgeHtml}
        </div>
        <div class="dl-info">
          <h3 class="dl-title">${info.title}</h3>
          <p class="dl-subtitle">${info.sub}</p>
        </div>
        <div class="dl-specs mono">
          <span>${asset.size ? formatBytes(asset.size) : '-- MB'}</span>
          <span>${dlCountText}</span>
        </div>
        <button type="button" class="dl-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          <span>${t('downloadBtn')}</span>
        </button>
      `;

      card.querySelector('.dl-btn').addEventListener('click', () => {
        startDownloadSequence(asset, release);
      });

      els.downloadDeck.appendChild(card);
    });
  }

  function renderChangelog(release) {
    const isLatest = state.selectedIndex === 0;
    let entries = [];
    let sourceText = t('sourceRelease');

    if (isLatest) {
      const langEntries = state.readmeChangelog[state.lang];
      const otherEntries = state.readmeChangelog[state.lang === 'mz' ? 'en' : 'mz'];
      if (langEntries && langEntries.length > 0) {
        entries = langEntries;
        sourceText = t('sourceReadme');
      } else if (otherEntries && otherEntries.length > 0) {
        entries = otherEntries;
        sourceText = t('sourceReadme');
      } else {
        entries = parseReleaseBody(release.body);
      }
    } else {
      entries = parseReleaseBody(release.body);
    }

    els.changelogSourceTag.textContent = sourceText;
    els.changelogVersionPill.textContent = release.tag_name || '--';
    els.changelogList.innerHTML = '';

    if (entries.length === 0) {
      const li = document.createElement('li');
      li.className = 'changelog-item';
      li.textContent = t('changelogEmpty');
      els.changelogList.appendChild(li);
      return;
    }

    entries.forEach((text) => {
      const li = document.createElement('li');
      li.className = 'changelog-item';
      li.textContent = text;
      els.changelogList.appendChild(li);
    });
  }

  function renderAll() {
    if (!state.releases.length) return;
    const release = state.releases[state.selectedIndex] || state.releases[0];
    const isLatest = state.selectedIndex === 0;
    const tag = release.tag_name || 'Latest';

    els.releaseBadgeText.textContent = `${tag} • ${isLatest ? t('latestTag') : t('archiveTag')}`;
    els.selectedVersionLabel.textContent = tag;
    els.releaseDateValue.textContent = formatDate(release.published_at);

    const totalDownloads = (release.assets || []).reduce((acc, a) => acc + (a.download_count || 0), 0);
    els.releaseDownloadsValue.textContent = release.isFallback ? '--' : formatNumber(totalDownloads);

    renderVersionMenu();
    renderDownloadDeck(release);
    renderChangelog(release);
    focusChangelogIfRequested(false);
  }

  class ReactorCanvasEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.rafId = null;
      this.particles = [];
      this.shockwaves = [];
      this.mode = 'idle';
      this.progress = 0;
      this.resize();
      this.seedParticles();
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = this.canvas.getBoundingClientRect();
      const w = rect.width || 300;
      const h = rect.height || 300;
      this.w = w;
      this.h = h;
      this.cx = w / 2;
      this.cy = h / 2;
      this.canvas.width = Math.round(w * dpr);
      this.canvas.height = Math.round(h * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    seedParticles() {
      this.particles = [];
      for (let i = 0; i < 72; i++) {
        this.particles.push(this.createParticle(Math.random()));
      }
    }

    createParticle(radiusFactor) {
      const maxR = Math.min(this.w, this.h) * 0.48;
      return {
        angle: Math.random() * Math.PI * 2,
        radius: 58 + radiusFactor * (maxR - 58),
        baseSpeed: 0.014 + Math.random() * 0.024,
        inward: 0.42 + Math.random() * 0.9,
        size: 1.2 + Math.random() * 2.1,
        alpha: 0.35 + Math.random() * 0.65,
        vx: 0,
        vy: 0,
        x: 0,
        y: 0
      };
    }

    setMode(mode) {
      this.mode = mode;
      if (mode === 'success') {
        this.shockwaves.push({ r: 64, alpha: 0.95, color: '16, 185, 129' });
        this.shockwaves.push({ r: 44, alpha: 0.7, color: '0, 210, 190' });
        for (const p of this.particles) {
          const ang = Math.random() * Math.PI * 2;
          const spd = 2.2 + Math.random() * 4.4;
          p.x = this.cx + Math.cos(ang) * 66;
          p.y = this.cy + Math.sin(ang) * 66;
          p.vx = Math.cos(ang) * spd;
          p.vy = Math.sin(ang) * spd;
          p.alpha = 1;
        }
      } else if (mode === 'error') {
        this.shockwaves.push({ r: 68, alpha: 0.9, color: '239, 68, 68' });
        for (const p of this.particles) {
          const ang = Math.random() * Math.PI * 2;
          const spd = 1.6 + Math.random() * 3.4;
          p.x = this.cx + Math.cos(p.angle) * p.radius;
          p.y = this.cy + Math.sin(p.angle) * p.radius;
          p.vx = Math.cos(ang) * spd;
          p.vy = Math.sin(ang) * spd;
          p.alpha = 0.95;
        }
      } else if (mode === 'cancelled') {
        for (const p of this.particles) {
          p.x = this.cx + Math.cos(p.angle) * p.radius;
          p.y = this.cy + Math.sin(p.angle) * p.radius;
          p.vx = Math.cos(p.angle) * 1.4;
          p.vy = Math.sin(p.angle) * 1.4;
        }
      } else if (mode === 'active') {
        this.shockwaves = [];
        this.seedParticles();
      }
    }

    start() {
      if (this.rafId) return;
      this.resize();
      const loop = () => {
        this.draw();
        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    }

    stop() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.ctx.clearRect(0, 0, this.w, this.h);
    }

    draw() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.w, this.h);

      for (let i = this.shockwaves.length - 1; i >= 0; i--) {
        const sw = this.shockwaves[i];
        sw.r += 3.2;
        sw.alpha *= 0.93;
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${sw.color}, ${sw.alpha})`;
        ctx.lineWidth = 2.4;
        ctx.stroke();
        if (sw.alpha < 0.02) this.shockwaves.splice(i, 1);
      }

      const maxR = Math.min(this.w, this.h) * 0.48;

      if (this.mode === 'active') {
        const boost = 1 + (this.progress / 100) * 1.9;
        for (const p of this.particles) {
          const prevX = this.cx + Math.cos(p.angle) * p.radius;
          const prevY = this.cy + Math.sin(p.angle) * p.radius;
          p.angle += p.baseSpeed * boost;
          p.radius -= p.inward * (0.7 + (this.progress / 100) * 1.2);
          if (p.radius < 62) {
            p.radius = maxR;
            p.angle = Math.random() * Math.PI * 2;
          }
          const nx = this.cx + Math.cos(p.angle) * p.radius;
          const ny = this.cy + Math.sin(p.angle) * p.radius;
          const fade = Math.min(1, (maxR - p.radius) / 26) * Math.min(1, (p.radius - 58) / 18);

          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(nx, ny);
          ctx.strokeStyle = `rgba(0, 226, 206, ${p.alpha * fade * 0.72})`;
          ctx.lineWidth = p.size;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
        return;
      }

      const rgb = this.mode === 'success'
        ? '16, 185, 129'
        : this.mode === 'error'
          ? '239, 68, 68'
          : '245, 158, 11';

      for (const p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.955;
        p.vy *= 0.955;
        p.alpha *= 0.968;
        if (p.alpha < 0.02) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${p.alpha})`;
        ctx.fill();
      }
    }
  }

  const reactor = new ReactorCanvasEngine(els.reactorCanvas);

  function revokeActiveBlob() {
    if (state.blobUrl) {
      URL.revokeObjectURL(state.blobUrl);
      state.blobUrl = null;
    }
  }

  function setReactorProgress(pct, receivedBytes, totalBytes, speedText) {
    const clamped = Math.max(0, Math.min(100, pct));
    reactor.progress = clamped;
    const offset = RING_CIRCUMFERENCE * (1 - clamped / 100);
    els.ringProgress.style.strokeDashoffset = String(offset);

    const liquidY = 200 - (clamped / 100) * 136;
    els.liquidGroup.style.transform = `translateY(${liquidY}px)`;
    els.reactorPct.textContent = String(Math.round(clamped));

    if (totalBytes && totalBytes > 0) {
      const sizeStr = `${formatBytes(receivedBytes)} / ${formatBytes(totalBytes)}`;
      els.reactorStats.textContent = speedText ? `${sizeStr} • ${speedText}` : sizeStr;
    } else if (receivedBytes && receivedBytes > 0) {
      els.reactorStats.textContent = speedText
        ? `${formatBytes(receivedBytes)} • ${speedText}`
        : formatBytes(receivedBytes);
    } else {
      els.reactorStats.textContent = `${Math.round(clamped)}%`;
    }
  }

  function setReactorUiState(mode, titleText, subText) {
    state.downloadState = mode;
    els.reactorModal.classList.remove('state-active', 'state-success', 'state-error', 'state-cancelled');
    els.reactorModal.classList.add(`state-${mode}`);
    els.reactorStatusTitle.textContent = titleText;
    els.reactorStatusSub.textContent = subText;

    els.reactorCancelBtn.hidden = mode !== 'active';
    els.reactorRetryBtn.hidden = mode !== 'error' && mode !== 'cancelled';
    els.reactorDirectLink.hidden = mode !== 'success';
    els.reactorDoneBtn.hidden = mode !== 'success';

    reactor.setMode(mode);
  }

  function openReactorModal(asset, release) {
    state.activeAsset = { asset, release };
    els.reactorVerBadge.textContent = release.tag_name || 'Latest';
    els.reactorFilename.textContent = asset.name || 'CA-Movies.apk';
    els.reactorDirectLink.href = asset.browser_download_url;
    els.reactorDirectLink.download = asset.name || 'CA-Movies.apk';

    document.body.classList.add('modal-open');
    els.reactorOverlay.classList.add('open');
    els.reactorOverlay.setAttribute('aria-hidden', 'false');
    reactor.start();
  }

  function closeReactorModal() {
    if (state.downloadState === 'active') {
      cancelActiveDownload();
    }
    els.reactorOverlay.classList.remove('open');
    els.reactorOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    setTimeout(() => {
      if (!els.reactorOverlay.classList.contains('open')) {
        reactor.stop();
        revokeActiveBlob();
      }
    }, 300);
  }

  function triggerFileSave(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'CA-Movies.apk';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function cancelActiveDownload() {
    if (state.abortController) {
      state.abortController.abort();
      state.abortController = null;
    }
    if (state.downloadState === 'active') {
      setReactorUiState('cancelled', t('titleCancelled'), t('subCancelled'));
    }
  }

  async function startDownloadSequence(asset, release) {
    if (state.abortController) {
      state.abortController.abort();
      state.abortController = null;
    }
    revokeActiveBlob();

    openReactorModal(asset, release);
    setReactorProgress(0, 0, asset.size, '');
    setReactorUiState('active', t('titleActive'), t('stageConnect'));

    if (!navigator.onLine) {
      setReactorUiState('error', t('titleError'), t('errOffline'));
      return;
    }

    if (!asset.browser_download_url) {
      setReactorUiState('error', t('titleError'), t('errMissing'));
      return;
    }

    if (!hasValidProxy()) {
      setReactorProgress(100, asset.size || 0, asset.size || 0, '');
      setReactorUiState('success', t('titleSuccess'), t('subDirectFallback'));
      triggerFileSave(asset.browser_download_url, asset.name);
      return;
    }

    const controller = new AbortController();
    state.abortController = controller;

    try {
      const streamUrl = `${STREAM_PROXY_URL}?url=${encodeURIComponent(asset.browser_download_url)}`;
      const response = await fetch(streamUrl, {
        method: 'GET',
        signal: controller.signal
      });

      if (!response.ok || !response.body) {
        throw new Error(response.status === 404 ? 'missing' : 'network');
      }

      const headerLen = parseInt(response.headers.get('Content-Length') || '0', 10);
      const totalBytes = headerLen > 0 ? headerLen : (asset.size || 0);
      const reader = response.body.getReader();
      const chunks = [];
      let receivedBytes = 0;
      let lastSampleTime = performance.now();
      let lastSampleBytes = 0;
      let currentSpeed = 0;

      els.reactorStatusSub.textContent = t('stageStreaming');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedBytes += value.byteLength;

        const now = performance.now();
        const dt = (now - lastSampleTime) / 1000;
        if (dt >= 0.25) {
          const instantSpeed = (receivedBytes - lastSampleBytes) / dt;
          currentSpeed = currentSpeed > 0 ? (currentSpeed * 0.6 + instantSpeed * 0.4) : instantSpeed;
          lastSampleTime = now;
          lastSampleBytes = receivedBytes;
        }

        const pct = totalBytes > 0
          ? Math.min(99, (receivedBytes / totalBytes) * 100)
          : Math.min(95, (receivedBytes / (40 * 1024 * 1024)) * 100);

        setReactorProgress(pct, receivedBytes, totalBytes || receivedBytes, formatSpeed(currentSpeed));
      }

      if (controller.signal.aborted) return;

      els.reactorStatusSub.textContent = t('stageSaving');
      const finalTotal = totalBytes || receivedBytes;
      setReactorProgress(100, finalTotal, finalTotal, '');

      const blob = new Blob(chunks, { type: 'application/vnd.android.package-archive' });
      state.blobUrl = URL.createObjectURL(blob);
      const verSlug = (release.tag_name || 'latest').replace(/[^a-zA-Z0-9._-]/g, '');
      const archSlug = /arm64|v8a/i.test(asset.name || '')
        ? 'arm64'
        : (/armeabi|v7a/i.test(asset.name || '') ? 'armeabi' : 'android');
      const saveName = `CA-Movies-${verSlug}-${archSlug}.apk`;
      els.reactorDirectLink.href = state.blobUrl;
      els.reactorDirectLink.download = saveName;

      state.abortController = null;
      setReactorUiState('success', t('titleSuccess'), t('subSuccess'));
      triggerFileSave(state.blobUrl, saveName);
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      state.abortController = null;
      const errMsg = !navigator.onLine
        ? t('errOffline')
        : (err && err.message === 'missing' ? t('errMissing') : t('errNetwork'));
      setReactorUiState('error', t('titleError'), errMsg);
    }
  }

  els.langBtns.forEach((btn) => {
    btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-set-lang')));
  });

  els.themeToggle.addEventListener('click', toggleTheme);

  els.versionTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = els.versionMenu.hidden;
    els.versionMenu.hidden = !open;
    els.versionTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!els.versionPicker.contains(e.target)) {
      closeVersionMenu();
    }
  });

  els.reactorCancelBtn.addEventListener('click', cancelActiveDownload);
  els.reactorDoneBtn.addEventListener('click', closeReactorModal);
  els.reactorCloseX.addEventListener('click', closeReactorModal);

  els.reactorRetryBtn.addEventListener('click', () => {
    if (state.activeAsset) {
      startDownloadSequence(state.activeAsset.asset, state.activeAsset.release);
    }
  });

  els.reactorOverlay.addEventListener('click', (e) => {
    if (e.target === els.reactorOverlay && state.downloadState !== 'active') {
      closeReactorModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeVersionMenu();
      if (els.reactorOverlay.classList.contains('open')) {
        closeReactorModal();
      }
    }
  });

  window.addEventListener('resize', () => {
    if (els.reactorOverlay.classList.contains('open')) {
      reactor.resize();
    }
  });

  function focusChangelogIfRequested(force) {
    const hash = window.location.hash.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const wantsChangelog = hash === '#changelog' || params.get('section') === 'changelog';
    if (!wantsChangelog) return;
    if (!force && state.hasFocusedHash) return;

    const card = document.getElementById('changelog');
    if (!card) return;

    state.hasFocusedHash = true;
    requestAnimationFrame(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.remove('spotlight');
      void card.offsetWidth;
      card.classList.add('spotlight');
      setTimeout(() => {
        card.classList.remove('spotlight');
      }, 2500);
    });
  }

  window.addEventListener('hashchange', () => focusChangelogIfRequested(true));

  els.yearNow.textContent = String(new Date().getFullYear());
  applyStaticTranslations();
  fetchRepoData();
})();
