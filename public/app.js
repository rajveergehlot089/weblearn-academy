// ============================================
// WebLearn Academy — Client-Side App (API-backed)
// ============================================

const API_BASE = '';

// CSRF token stored from server response headers (cookie is httpOnly)
let _csrfToken = '';

function getCsrfToken() {
  return _csrfToken;
}

async function api(path, options = {}) {
  const token = localStorage.getItem('wla_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!['GET', 'HEAD'].includes(options.method || 'GET')) {
    headers['X-CSRF-Token'] = getCsrfToken();
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: 'same-origin' });

  // Capture CSRF token from response header
  const newCsrf = res.headers.get('X-CSRF-Token');
  if (newCsrf) _csrfToken = newCsrf;

  let data;
  try { data = await res.json(); } catch { data = {}; }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

const App = {
  state: {
    token: localStorage.getItem('wla_token'),
    user: null,
    courses: [],
    courseId: localStorage.getItem('wla_activeCourse') || null,
    courseData: null,
    topics: [],
    currentTopic: null,
    currentSection: 'quick',
    isRegistering: false,
    mode: localStorage.getItem('wla_mode') || 'fast-track',
    adminPage: 1,
    adminSearch: '',
    typingText: '', typingIndex: 0, typingCorrect: 0, typingTotal: 0,
    typingStartTime: null, typingTimeLimit: 60, typingTimer: null, typingActive: false,
    typingHistory: [], isHindiTyping: false,
  },

  show(name) {
    ['login', 'course-select', 'dashboard', 'admin'].forEach(s => {
      const el = document.getElementById(s + '-screen');
      if (el) el.classList.add('hidden');
    });
    const target = document.getElementById(name + '-screen');
    if (target) target.classList.remove('hidden');
  },

  async init() {
    if (this.state.token) {
      try {
        const { user } = await api('/api/auth/profile');
        this.state.user = user;
        await this._loadCourses();
        if (user.role === 'admin') { showAdminDashboard(); return; }
        if (this.state.courseId) { showDashboard(); } else { showCourseSelection(); }
        return;
      } catch {
        localStorage.removeItem('wla_token');
        this.state.token = null;
      }
    }
    this.show('login');
  },

  async _loadCourses() {
    try {
      const { courses, activeCourse } = await api('/api/courses');
      this.state.courses = courses;
      if (!this.state.courseId) this.state.courseId = activeCourse;
    } catch (err) {
      console.error('Failed to load courses:', err);
    }
  },
};

// ============================================
// Toast
// ============================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('removing'); setTimeout(() => toast.remove(), 300); }, 2700);
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================================
// Auth
// ============================================
function toggleAuth() {
  App.state.isRegistering = !App.state.isRegistering;
  const reg = App.state.isRegistering;
  document.getElementById('name-group').classList.toggle('hidden', !reg);
  document.getElementById('auth-btn').textContent = reg ? 'Create Account' : 'Sign In';
  document.getElementById('auth-toggle-text').textContent = reg ? 'Already have an account?' : "Don't have an account?";
  document.getElementById('auth-toggle-link').textContent = reg ? 'Sign In' : 'Sign Up';
  document.getElementById('auth-error').classList.add('hidden');
}

document.getElementById('auth-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errEl = document.getElementById('auth-error');
  errEl.classList.add('hidden');
  const btn = document.getElementById('auth-btn');
  btn.textContent = 'Please wait...'; btn.disabled = true;

  try {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) throw new Error('Email and password are required');
    if (password.length < 8) throw new Error('Password must be at least 8 characters');
    if (App.state.isRegistering) {
      if (!/[A-Z]/.test(password)) throw new Error('Password must contain an uppercase letter');
      if (!/[a-z]/.test(password)) throw new Error('Password must contain a lowercase letter');
      if (!/[0-9]/.test(password)) throw new Error('Password must contain a number');
      if (!/[^A-Za-z0-9]/.test(password)) throw new Error('Password must contain a special character');
    }

    let data;
    if (App.state.isRegistering) {
      if (!name) throw new Error('Name is required');
      data = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
    } else {
      data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    }

    localStorage.setItem('wla_token', data.token);
    App.state.token = data.token;
    App.state.user = data.user;
    await App._loadCourses();

    if (data.user.role === 'admin') { showAdminDashboard(); }
    else if (App.state.courseId) { showDashboard(); }
    else { showCourseSelection(); }
    showToast(App.state.isRegistering ? 'Account created!' : 'Welcome back!');
  } catch (err) {
    errEl.textContent = err.message;
    errEl.classList.remove('hidden');
  }
  btn.textContent = App.state.isRegistering ? 'Create Account' : 'Sign In';
  btn.disabled = false;
});

function logout() {
  localStorage.removeItem('wla_token');
  localStorage.removeItem('wla_activeCourse');
  localStorage.removeItem('wla_mode');
  App.state.token = null; App.state.user = null; App.state.courseId = null;
  App.state.courseData = null; App.state.topics = []; App.state.currentTopic = null;
  if (App.state.typingTimer) { clearInterval(App.state.typingTimer); App.state.typingTimer = null; }
  ['login-screen', 'course-select-screen', 'dashboard-screen', 'admin-screen', 'typing-results'].forEach(id => {
    const el = document.getElementById(id); if (el) el.classList.add('hidden');
  });
  hideAllViews();
  document.getElementById('auth-form').reset();
  document.getElementById('auth-error').classList.add('hidden');
  document.getElementById('name-group').classList.add('hidden');
  App.state.isRegistering = false;
  document.getElementById('auth-btn').textContent = 'Sign In';
  document.getElementById('auth-toggle-text').textContent = "Don't have an account?";
  document.getElementById('auth-toggle-link').textContent = 'Sign Up';
  App.show('login');
}

// ============================================
// Admin Modal Form Handlers
// ============================================
document.getElementById('edit-user-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('edit-user-id').value;
  const name = document.getElementById('edit-user-name').value.trim();
  const email = document.getElementById('edit-user-email').value.trim();
  const role = document.getElementById('edit-user-role').value;
  if (!name || !email) { showToast('Name and email are required', 'error'); return; }
  try {
    await api(`/api/admin/users/${id}`, { method: 'PUT', body: JSON.stringify({ name, email, role }) });
    showToast('User updated');
    closeModal('edit-user-modal');
    loadStudents();
  } catch (err) { showToast('Failed to update user: ' + err.message, 'error'); }
});

document.getElementById('create-course-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    id: document.getElementById('new-course-id').value.trim(),
    title: document.getElementById('new-course-title').value.trim(),
    description: document.getElementById('new-course-desc').value.trim(),
    category: document.getElementById('new-course-category').value,
    difficulty: document.getElementById('new-course-difficulty').value,
    emoji: document.getElementById('new-course-emoji').value.trim(),
  };
  if (!data.id || !data.title) { showToast('ID and title are required', 'error'); return; }
  try {
    await api('/api/courses/admin/create', { method: 'POST', body: JSON.stringify(data) });
    showToast('Course created');
    closeModal('create-course-modal');
    await App._loadCourses();
    loadAdminCourses();
  } catch (err) { showToast('Failed to create course: ' + err.message, 'error'); }
});

document.getElementById('edit-course-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('edit-course-id').value;
  const data = {
    title: document.getElementById('edit-course-title').value.trim(),
    description: document.getElementById('edit-course-desc').value.trim(),
    category: document.getElementById('edit-course-category').value,
    difficulty: document.getElementById('edit-course-difficulty').value,
  };
  try {
    await api(`/api/courses/admin/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    showToast('Course updated');
    closeModal('edit-course-modal');
    await App._loadCourses();
    loadAdminCourses();
  } catch (err) { showToast('Failed to update course: ' + err.message, 'error'); }
});

// ============================================
// Course Management
// ============================================
function showCourseSelection() {
  App.show('course-select');
  document.getElementById('dashboard-screen').classList.add('hidden');
  document.getElementById('admin-screen').classList.add('hidden');
  renderCourseCards('course-select-grid');
}

function showCourses() {
  hideAllViews();
  document.getElementById('view-courses').classList.remove('hidden');
  document.querySelectorAll('#customer-sidebar .sidebar-nav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('#customer-sidebar .sidebar-nav-item')[1]?.classList.add('active');
  renderCourseCards('courses-view-grid');
}

function renderCourseCards(gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = App.state.courses.map(c => `
    <div class="course-card glass" onclick="selectCourse('${c.id}')">
      ${c.isEnrolled ? '<span class="course-card-enrolled">Enrolled</span>' : ''}
      ${c.id === App.state.courseId ? '<span class="course-card-enrolled" style="background:var(--gradient-primary)">Active</span>' : ''}
      <div class="course-card-icon">${c.emoji || ''} <i class="${c.icon || 'fas fa-book'}"></i></div>
      <h3>${escapeHtml(c.title)}</h3>
      <p>${escapeHtml(c.description)}</p>
      <div class="course-card-meta">
        <span class="course-card-tag"><i class="fas fa-signal me-1"></i>${c.difficulty}</span>
        <span class="course-card-tag"><i class="fas fa-clock me-1"></i>${c.modes?.includes('fast-track') ? (c.totalDays?.['fast-track'] || '?') + ' days' : ''}</span>
        ${c.hasTypingPractice ? '<span class="course-card-tag"><i class="fas fa-keyboard me-1"></i>Typing</span>' : ''}
      </div>
      ${c.isEnrolled ? `<div class="course-card-progress mt-4"><div class="progress-bar-glass"><div class="progress-bar-fill" style="width:${c.percentComplete || 0}%"></div></div><small class="text-muted">${c.percentComplete || 0}% complete</small></div>` : ''}
    </div>
  `).join('');
}

async function selectCourse(courseId) {
  try {
    await api(`/api/courses/${courseId}/enroll`, { method: 'POST' });
    await api('/api/courses/active-course', {
      method: 'PUT',
      body: JSON.stringify({ courseId }),
    });
    App.state.courseId = courseId;
    localStorage.setItem('wla_activeCourse', courseId);
    await App._loadCourses();
    showDashboard();
    showToast('Switched to ' + (App.state.courses.find(c => c.id === courseId)?.title || 'course'));
  } catch (err) {
    showToast('Failed to select course: ' + err.message, 'error');
  }
}

// ============================================
// Dashboard
// ============================================
async function showDashboard() {
  hideAllViews();
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('course-select-screen').classList.add('hidden');
  document.getElementById('view-dashboard').classList.remove('hidden');
  document.getElementById('dashboard-screen').classList.remove('hidden');
  document.getElementById('admin-screen').classList.add('hidden');

  document.querySelectorAll('#customer-sidebar .sidebar-nav-item').forEach(i => i.classList.remove('active'));
  document.querySelector('#customer-sidebar .sidebar-nav-item')?.classList.add('active');

  if (!App.state.courseId) { showCourseSelection(); return; }

  const course = App.state.courses.find(c => c.id === App.state.courseId);
  if (!course) { showCourseSelection(); return; }

  App.state.courseData = course;

  try {
    const { topics } = await api(`/api/courses/${App.state.courseId}`);
    App.state.topics = topics.map(t => ({
      ...t,
      dayNumber: App.state.mode === 'fast-track' ? (t.day_fast_track || 1) : (t.day_full_course || 1),
    }));
    App.state.topics.sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0));
  } catch (err) {
    console.error('Failed to load topics:', err);
    App.state.topics = [];
  }

  document.getElementById('welcome-text').textContent = `Hey ${escapeHtml(App.state.user?.name || 'there')}!`;
  document.getElementById('user-avatar').textContent = (App.state.user?.name || 'U')[0].toUpperCase();
  document.getElementById('sidebar-user-name').textContent = escapeHtml(App.state.user?.name || 'User');
  document.getElementById('sidebar-user-role').textContent = App.state.user?.role || 'Student';

  try {
    const progress = await api('/api/progress/summary');
    renderDashboard(App.state.topics, progress);
  } catch (err) {
    console.error('Failed to load progress:', err);
    renderDashboard(App.state.topics, { percentComplete: 0, completedTopics: 0, totalTopics: App.state.topics.length, currentDay: 1, totalDays: 15, streak: 0, topics: {} });
  }
}

function renderDashboard(topics, progress) {
  document.getElementById('stat-streak').textContent = progress.streak || 0;
  document.getElementById('stat-completed').textContent = `${progress.completedTopics}/${progress.totalTopics}`;
  document.getElementById('stat-day').textContent = `${progress.currentDay}/${progress.totalDays}`;
  document.getElementById('stat-progress').textContent = progress.percentComplete + '%';
  document.getElementById('progress-fill').style.width = progress.percentComplete + '%';
  document.getElementById('progress-percent').textContent = progress.percentComplete;
  document.getElementById('progress-topics').textContent = progress.completedTopics;

  const course = App.state.courseData;
  const totalFast = course?.totalDays?.['fast-track'] || topics.length;
  const totalFull = course?.totalDays?.['full-course'] || topics.length * 2;
  const modeEl = document.querySelector('.d-flex.gap-2.mb-4');
  if (modeEl) {
    modeEl.innerHTML = `
      <button class="btn-glass btn-glass-sm ${App.state.mode === 'fast-track' ? 'btn-glass-primary' : 'btn-glass-outline'}" data-mode="fast-track" onclick="setMode('fast-track')">${totalFast}-Day Fast Track</button>
      <button class="btn-glass btn-glass-sm ${App.state.mode === 'full-course' ? 'btn-glass-primary' : 'btn-glass-outline'}" data-mode="full-course" onclick="setMode('full-course')">Full Course (~${totalFull} Days)</button>
    `;
  }

  const grid = document.getElementById('topics-grid');
  grid.innerHTML = topics.map(t => {
    const p = progress.topics?.[t.id];
    const isComplete = p?.quickDone && p?.deepDone;
    const inProgress = (p?.quickDone || p?.deepDone) && !isComplete;
    return `
      <div class="topic-card glass ${isComplete ? 'completed' : ''} ${inProgress ? 'in-progress' : ''}" onclick="openTopic('${t.id}')">
        <div class="topic-card-icon">${t.icon || '📚'}</div>
        <span class="day-badge">Day ${t.dayNumber || '?'}</span>
        <h4>${escapeHtml(t.title)}</h4>
        <p class="description">${escapeHtml(t.description)}</p>
        ${inProgress ? '<span class="topic-progress-badge">In Progress</span>' : ''}
      </div>
    `;
  }).join('');
}

function showTopics() {
  hideAllViews();
  document.getElementById('view-topics').classList.remove('hidden');
  document.querySelectorAll('#customer-sidebar .sidebar-nav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('#customer-sidebar .sidebar-nav-item')[3]?.classList.add('active');
  const grid = document.getElementById('topics-list-grid');
  grid.innerHTML = App.state.topics.map(t => `
    <div class="topic-card glass" onclick="openTopic('${t.id}')">
      <div class="topic-card-icon">${t.icon || '📚'}</div>
      <span class="day-badge">Day ${t.dayNumber || '?'}</span>
      <h4>${escapeHtml(t.title)}</h4>
      <p class="description">${escapeHtml(t.description)}</p>
    </div>
  `).join('');
}

function showProgress() {
  hideAllViews();
  document.getElementById('view-progress').classList.remove('hidden');
  document.querySelectorAll('#customer-sidebar .sidebar-nav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('#customer-sidebar .sidebar-nav-item')[3]?.classList.add('active');
  api('/api/progress/summary').then(progress => {
    document.getElementById('progress-fill-detail').style.width = progress.percentComplete + '%';
    document.getElementById('detail-completed').textContent = progress.completedTopics;
    const inProgressCount = Object.values(progress.topics || {}).filter(t => (t.quickDone || t.deepDone) && !(t.quickDone && t.deepDone)).length;
    document.getElementById('detail-inprogress').textContent = inProgressCount;
    document.getElementById('detail-remaining').textContent = App.state.topics.length - progress.completedTopics - inProgressCount;
    const list = document.getElementById('progress-detail-list');
    list.innerHTML = App.state.topics.map(t => {
      const p = progress.topics?.[t.id];
      const isComplete = p?.quickDone && p?.deepDone;
      const inProgress = (p?.quickDone || p?.deepDone) && !isComplete;
      return `
        <div class="glass p-3 mb-3 d-flex align-items-center">
          <span style="font-size:24px;margin-right:16px">${t.icon || '📚'}</span>
          <div class="flex-grow-1">
            <h5 class="mb-1">${escapeHtml(t.title)}</h5>
            <small class="text-muted">Day ${t.dayNumber || '?'}${p?.quickDone ? ' - Quick lesson done' : ''}${p?.deepDone ? ' - Deep dive done' : ''}</small>
          </div>
          <span class="badge ${isComplete ? 'bg-success' : inProgress ? 'bg-warning' : 'bg-secondary'}">${isComplete ? 'Completed' : inProgress ? 'In Progress' : 'Not Started'}</span>
        </div>
      `;
    }).join('');
  }).catch(err => console.error('Failed to load progress:', err));
}

async function setMode(mode) {
  App.state.mode = mode;
  localStorage.setItem('wla_mode', mode);
  try {
    await api('/api/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify({ mode }),
    });
  } catch {}
  showDashboard();
}

function hideAllViews() {
  ['dashboard', 'courses', 'topics', 'progress', 'topic', 'typing'].forEach(v => {
    const el = document.getElementById('view-' + v);
    if (el) el.classList.add('hidden');
  });
}

function hideAllAdminViews() {
  document.querySelectorAll('#admin-view-dashboard, #admin-view-students, #admin-view-stats, #admin-view-courses').forEach(v => v.classList.add('hidden'));
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

function toggleMobileSidebar() {
  const sidebar = document.querySelector('.sidebar:not(.hidden)');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;
  const isOpen = sidebar.classList.contains('open');
  sidebar.classList.toggle('open');
  overlay?.classList.toggle('active');
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

// Close mobile sidebar when a nav item is clicked
document.querySelectorAll('.sidebar-nav-item').forEach(item => {
  item.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      const sidebar = document.querySelector('.sidebar.open');
      if (sidebar) toggleMobileSidebar();
    }
  });
});

// ============================================
// Topic View
// ============================================
async function openTopic(id) {
  hideAllViews();
  document.getElementById('view-topic').classList.remove('hidden');

  try {
    const content = await api(`/api/courses/${App.state.courseId}/topics/${id}`);
    App.state.currentTopic = content;
    App.state.currentSection = 'quick';
    document.getElementById('topic-title').textContent = content.meta?.title || id;
    document.getElementById('topic-description').textContent = content.meta?.description || '';
    document.querySelectorAll('.section-tab').forEach((tab, i) => tab.classList.toggle('active', i === 0));

    const course = App.state.courseData;
    adaptTabsForCourseType(course);

    renderSection('quick');
  } catch (err) {
    console.error('Failed to load topic:', err);
    showToast('Failed to load topic', 'error');
  }
}

function renderSection(name) {
  App.state.currentSection = name;
  document.querySelectorAll('.section-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.section === name) tab.classList.add('active');
  });
  document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));
  const section = document.getElementById('section-' + name);
  if (section) { void section.offsetWidth; section.classList.add('active'); }
  const content = App.state.currentTopic;
  if (!content) return;
  if (name === 'quick') renderQuick(content.quick, section);
  else if (name === 'deep') renderDeep(content.deep, section);
  else if (name === 'comparison') renderComparison(content.comparison, section);
  else if (name === 'interview') renderInterview(content.interview, section);
  else if (name === 'exercises') renderExercises(content.exercises, section);
}

function renderCode(code, lang) {
  if (!code) return '';
  const snippet = code.snippet || code.code || '';
  if (!snippet) return '';
  const escaped = snippet.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const langMap = { html: 'markup', js: 'javascript', javascript: 'javascript', python: 'python', css: 'css', graphql: 'graphql', text: 'text' };
  const prismLang = langMap[lang || code.language] || 'javascript';
  return `<div class="code-block"><span class="code-lang">${code.language || lang}</span><pre><code class="language-${prismLang}">${escaped}</code></pre></div>${code.explanation ? `<p class="text-muted mt-2 p-3" style="background:rgba(255,255,255,0.1);border-radius:8px;font-size:14px">${escapeHtml(code.explanation)}</p>` : ''}`;
}

function renderQuick(data, el) {
  if (!data?.sections) { el.innerHTML = '<p>Content loading...</p>'; return; }
  let html = `<h2 class="mb-4"><i class="fas fa-bolt me-2" style="color:var(--yellow-500)"></i>5-Minute Quick Lesson</h2>`;
  data.sections.forEach(s => {
    html += `<div class="mb-4"><h4 class="mb-3">${escapeHtml(s.heading)}</h4><p>${escapeHtml(s.body || '').replace(/\n/g, '<br>')}</p>`;
    if (s.code) html += renderCode(s.code);
    html += '</div>';
  });
  if (data.jargon?.length) {
    html += '<div class="jargon-list glass mt-4"><h5 class="mb-3"><i class="fas fa-book-open me-2"></i>Key Terms</h5>';
    data.jargon.forEach(j => { html += `<div class="jargon-item"><span class="jargon-term">${escapeHtml(j.term)}:</span> ${escapeHtml(j.definition)}</div>`; });
    html += '</div>';
  }
  if (data.summary) html += `<div class="summary-box mt-4"><h4><i class="fas fa-lightbulb me-2"></i>Summary</h4><p>${escapeHtml(data.summary)}</p></div>`;
  html += `<div class="mt-4"><button class="btn-glass btn-glass-primary" onclick="markSectionDone('quick', this)"><i class="fas fa-check me-2"></i>Mark as Completed</button></div>`;
  el.innerHTML = html;
}

function renderDeep(data, el) {
  if (!data?.sections) { el.innerHTML = '<p>Content loading...</p>'; return; }
  let html = `<h2 class="mb-4"><i class="fas fa-book me-2" style="color:var(--blue-500)"></i>15-Minute Deep Dive</h2>`;
  data.sections.forEach(s => {
    html += `<div class="mb-4"><h4 class="mb-3">${escapeHtml(s.heading)}</h4><p>${escapeHtml(s.body || '').replace(/\n/g, '<br>')}</p>`;
    if (s.code) html += renderCode(s.code);
    html += '</div>';
  });
  if (data.summary) html += `<div class="summary-box mt-4"><h4><i class="fas fa-lightbulb me-2"></i>Key Takeaways</h4><p>${escapeHtml(data.summary)}</p></div>`;
  html += `<div class="mt-4"><button class="btn-glass btn-glass-primary" onclick="markSectionDone('deep', this)"><i class="fas fa-check me-2"></i>Mark as Completed</button></div>`;
  el.innerHTML = html;
}

function renderComparison(data, el) {
  if (!data?.comparisons) { el.innerHTML = '<p>Content loading...</p>'; return; }
  let html = `<h2 class="mb-4"><i class="fas fa-columns me-2" style="color:var(--purple-500)"></i>JavaScript vs Python</h2>`;
  data.comparisons.forEach(c => {
    html += `<div class="mb-5"><h4 class="mb-3">${escapeHtml(c.concept)}</h4><div class="comparison-grid">
      <div class="comparison-side js glass"><div class="comparison-side-header"><i class="fab fa-js-square me-2"></i>JavaScript</div><div class="p-3">${renderCode(c.javascript, 'javascript')}</div></div>
      <div class="comparison-side py glass"><div class="comparison-side-header"><i class="fab fa-python me-2"></i>Python</div><div class="p-3">${renderCode(c.python, 'python')}</div></div>
    </div><div class="glass p-3 mt-3"><strong><i class="fas fa-info-circle me-2"></i>What stays the same:</strong> ${escapeHtml(c.explanation)}</div></div>`;
  });
  if (data.keyInsight) html += `<div class="summary-box mt-4"><h4><i class="fas fa-lightbulb me-2"></i>Key Insight</h4><p>${escapeHtml(data.keyInsight)}</p></div>`;
  el.innerHTML = html;
}

function renderInterview(data, el) {
  if (!data?.questions) { el.innerHTML = '<p>Content loading...</p>'; return; }
  let html = `<h2 class="mb-4"><i class="fas fa-question-circle me-2" style="color:var(--green-500)"></i>Interview Questions</h2><p class="text-muted mb-4">Click to reveal the model answer.</p>`;
  data.questions.forEach(q => {
    const diff = q.difficulty || 'medium';
    html += `<div class="interview-card glass" onclick="this.classList.toggle('open')"><div class="interview-question"><span><span class="difficulty-badge ${diff}">${diff}</span> ${escapeHtml(q.question)}</span><span class="arrow"><i class="fas fa-chevron-down"></i></span></div><div class="interview-answer"><p class="fw-semibold mb-2">Model Answer:</p><p>${escapeHtml(q.answer)}</p></div></div>`;
  });
  el.innerHTML = html;
}

function renderExercises(data, el) {
  if (!data?.exercises) { el.innerHTML = '<p>Content loading...</p>'; return; }
  let html = `<h2 class="mb-4"><i class="fas fa-code me-2" style="color:var(--red-500)"></i>Exercises</h2>`;
  data.exercises.forEach(ex => {
    const diff = ex.difficulty || 'medium';
    html += `<div class="exercise-card glass"><span class="difficulty-badge ${diff}">${diff}</span><h4>${escapeHtml(ex.title)}</h4><p>${escapeHtml(ex.description)}</p>
    <div class="hints mt-3"><span class="hints-toggle" onclick="this.parentElement.classList.toggle('open')"><i class="fas fa-lightbulb me-2"></i>Show Hints</span><ul class="hints-list">${(ex.hints || []).map(h => `<li>${escapeHtml(h)}</li>`).join('')}</ul></div></div>`;
  });
  el.innerHTML = html;
}

async function markSectionDone(section, btnEl) {
  const topicId = App.state.currentTopic?.meta?.id;
  if (!topicId) return;
  const btn = btnEl || event?.target?.closest('button');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...'; }
  try {
    await api(`/api/progress/topic/${topicId}`, {
      method: 'POST',
      body: JSON.stringify({
        courseId: App.state.courseId,
        [section + 'Done']: true,
      }),
    });
    showToast(`${section === 'quick' ? '5-Min Lesson' : 'Deep Dive'} marked as completed!`);
    await App._loadCourses();
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-check me-2"></i>Completed!';
      btn.classList.remove('btn-glass-primary');
      btn.classList.add('btn-glass-outline');
      btn.style.borderColor = 'var(--green-500)';
      btn.style.color = 'var(--green-500)';
    }
  } catch (err) {
    showToast('Failed to save progress', 'error');
    if (btn) { btn.disabled = false; btn.innerHTML = `<i class="fas fa-check me-2"></i>Mark as Completed`; }
  }
}

// ============================================
// Typing Practice
// ============================================
const TYPING_SENTENCES = {
  'hindi-typing': { 'default': 'मैं हिंदी सीखता हूँ\nयह मेरा नाम है\nक्या हाल है\nबहुत अच्छा\nघर वापस जाओ\nरात को जल्दी सो जाओ\nमेरे पास एक किताब है\nआज बहुत धूप है\nसुबह उठकर पढ़ाई करता हूँ' },
  'english-typing': { 'default': 'the quick brown fox jumps over the lazy dog\npack my box with five dozen liquor jugs\nhow vexingly quick daft zebras jump\nthe five boxing wizards jump quickly\nprogramming is not about typing it is about thinking\ncode is like humor when you have to explain it it is bad\nfirst solve the problem then write the code\nsimplicity is prerequisite for reliability' },
};
function getTypingText(courseId) {
  const texts = TYPING_SENTENCES[courseId];
  return texts ? texts.default : TYPING_SENTENCES['english-typing'].default;
}
function startTypingPractice() {
  if (!App.state.courseData?.hasTypingPractice) return;
  hideAllViews();
  document.getElementById('view-typing').classList.remove('hidden');
  document.getElementById('typing-topic-title').textContent = App.state.currentTopic?.meta?.title || 'Typing Practice';
  App.state.typingText = getTypingText(App.state.courseId);
  App.state.typingIndex = 0; App.state.typingCorrect = 0; App.state.typingTotal = 0;
  App.state.typingStartTime = null; App.state.typingActive = false;
  App.state.typingHistory = [];
  App.state.isHindiTyping = App.state.courseId === 'hindi-typing';
  renderTypingDisplay();
  document.getElementById('typing-wpm').textContent = '0';
  document.getElementById('typing-accuracy').textContent = '100';
  document.getElementById('typing-time').textContent = App.state.typingTimeLimit;
  document.getElementById('typing-timer-fill').style.width = '100%';
  const input = document.getElementById('typing-input');
  input.value = ''; input.disabled = false; input.focus();
  input.oninput = handleTypingInput;
}
function renderTypingDisplay() {
  const el = document.getElementById('typing-text-display');
  let html = '';
  for (let i = 0; i < App.state.typingText.length; i++) {
    let cls = 'pending';
    if (i < App.state.typingIndex) cls = App.state.typingHistory[i] === App.state.typingText[i] ? 'correct' : 'incorrect';
    else if (i === App.state.typingIndex) cls = 'current';
    const ch = App.state.typingText[i] === '\n' ? '↵<br>' : App.state.typingText[i] === ' ' ? '&nbsp;' : App.state.typingText[i];
    html += `<span class="char ${cls}">${ch}</span>`;
  }
  el.innerHTML = html;
}
function handleTypingInput(e) {
  const typed = e.target.value;
  if (!App.state.typingActive && typed.length > 0) startTypingTimer();
  const lastChar = typed[typed.length - 1];
  if (lastChar !== undefined && App.state.typingIndex < App.state.typingText.length) {
    const expected = App.state.typingText[App.state.typingIndex];
    App.state.typingHistory[App.state.typingIndex] = lastChar;
    App.state.typingIndex++;
    App.state.typingTotal++;
    if (lastChar === expected) App.state.typingCorrect++;
    if (App.state.typingIndex >= App.state.typingText.length) { stopTyping(); return; }
  }
  e.target.value = e.target.value.slice(-30);
  renderTypingDisplay();
  updateTypingStats();
}
function startTypingTimer() {
  App.state.typingActive = true;
  const startTime = Date.now();
  App.state.typingStartTime = startTime;
  App.state.typingTimer = setInterval(() => {
    const remaining = Math.max(0, App.state.typingTimeLimit - (Date.now() - startTime) / 1000);
    document.getElementById('typing-time').textContent = Math.ceil(remaining);
    document.getElementById('typing-timer-fill').style.width = ((remaining / App.state.typingTimeLimit) * 100) + '%';
    if (remaining <= 0) stopTyping();
  }, 100);
}
function stopTyping() {
  if (App.state.typingTimer) { clearInterval(App.state.typingTimer); App.state.typingTimer = null; }
  App.state.typingActive = false;
  document.getElementById('typing-input').disabled = true;
  updateTypingStats();
  showTypingResults();
  saveTypingScore();
}
function updateTypingStats() {
  if (!App.state.typingStartTime) return;
  const elapsed = (Date.now() - App.state.typingStartTime) / 1000 / 60;
  const wpm = elapsed > 0 ? Math.round((App.state.typingCorrect / 5) / elapsed) : 0;
  const accuracy = App.state.typingTotal > 0 ? Math.round((App.state.typingCorrect / App.state.typingTotal) * 100) : 100;
  document.getElementById('typing-wpm').textContent = wpm;
  document.getElementById('typing-accuracy').textContent = accuracy;
}
async function saveTypingScore() {
  const wpm = parseInt(document.getElementById('typing-wpm').textContent) || 0;
  const accuracy = parseInt(document.getElementById('typing-accuracy').textContent) || 100;
  try {
    await api('/api/progress/typing-score', {
      method: 'POST',
      body: JSON.stringify({
        courseId: App.state.courseId,
        topicId: App.state.currentTopic?.meta?.id || 'overall',
        wpm, accuracy,
        timeLimit: App.state.typingTimeLimit,
      }),
    });
  } catch {}
}
function showTypingResults() {
  document.getElementById('result-wpm').textContent = document.getElementById('typing-wpm').textContent;
  document.getElementById('result-accuracy').textContent = document.getElementById('typing-accuracy').textContent + '%';
  document.getElementById('result-correct').textContent = App.state.typingCorrect;
  document.getElementById('result-total').textContent = App.state.typingTotal;
  document.getElementById('typing-results').classList.remove('hidden');
}
function closeTypingResults() {
  document.getElementById('typing-results').classList.add('hidden');
  document.getElementById('typing-input').disabled = false;
  showDashboard();
}
function restartTyping() {
  document.getElementById('typing-results').classList.add('hidden');
  document.getElementById('typing-input').disabled = false;
  App.state.typingHistory = [];
  startTypingPractice();
}
function setTypingTime(seconds, e) {
  App.state.typingTimeLimit = seconds;
  document.querySelectorAll('.typing-time-btn').forEach(b => b.classList.remove('active'));
  if (e && e.target) e.target.classList.add('active');
  document.getElementById('typing-time').textContent = seconds;
  document.getElementById('typing-timer-fill').style.width = '100%';
}
function adaptTabsForCourseType(course) {
  const tabs = document.getElementById('section-tabs');
  if (!tabs || !course) return;
  tabs.classList.remove('typing-course');
  if (course.hasTypingPractice) {
    tabs.classList.add('typing-course');
    tabs.querySelectorAll('.section-tab').forEach(t => {
      const s = t.dataset.section;
      if (['comparison', 'interview', 'exercises'].includes(s)) t.style.display = 'none';
      if (s === 'practice') t.style.display = 'inline-flex';
      if (['quick', 'deep'].includes(s)) t.style.display = 'none';
    });
  } else {
    tabs.querySelectorAll('.section-tab').forEach(t => {
      const s = t.dataset.section;
      if (s === 'practice') t.style.display = 'none';
      else t.style.display = 'inline-flex';
    });
  }
}

// ============================================
// Admin
// ============================================
function showAdminDashboard() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('dashboard-screen').classList.add('hidden');
  document.getElementById('course-select-screen').classList.add('hidden');
  document.getElementById('admin-screen').classList.remove('hidden');
  hideAllAdminViews();
  document.getElementById('admin-view-dashboard').classList.remove('hidden');
  document.querySelectorAll('#admin-sidebar .sidebar-nav-item').forEach(i => i.classList.remove('active'));
  document.querySelector('#admin-sidebar .sidebar-nav-item')?.classList.add('active');
  loadAdminDashboard();
}
function highlightAdminNav(index) {
  document.querySelectorAll('#admin-sidebar .sidebar-nav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('#admin-sidebar .sidebar-nav-item')[index]?.classList.add('active');
}
async function loadAdminDashboard() {
  try {
    const data = await api('/api/admin/dashboard');
    document.getElementById('admin-total-users').textContent = data.studentCount;
    document.getElementById('admin-recent-users').textContent = data.recentUsers;
    document.getElementById('admin-completed').textContent = data.totalCompleted;
    document.getElementById('admin-avg-progress').textContent = data.avgCompletion + '%';
  } catch (err) {
    console.error('Failed to load admin dashboard:', err);
  }

  try {
    const { users } = await api('/api/admin/users?limit=5');
    const tbody = document.getElementById('admin-recent-tbody');
    tbody.innerHTML = users.map(u => `<tr><td><strong>${escapeHtml(u.name)}</strong></td><td>${escapeHtml(u.email)}</td><td>${new Date(u.createdAt).toLocaleDateString()}</td><td>${u.progress?.percentComplete || 0}%</td></tr>`).join('');
  } catch (err) {
    console.error('Failed to load recent users:', err);
  }
}
function showAdminStudents() {
  hideAllAdminViews(); document.getElementById('admin-view-students').classList.remove('hidden');
  highlightAdminNav(2); loadStudents();
}
async function loadStudents() {
  try {
    const search = App.state.adminSearch || '';
    const { users, pagination } = await api(`/api/admin/users?limit=50&search=${encodeURIComponent(search)}`);
    App.state._allUsers = users;
    const tbody = document.getElementById('admin-students-tbody');
    tbody.innerHTML = users.map(u => `<tr><td><strong>${escapeHtml(u.name)}</strong></td><td>${escapeHtml(u.email)}</td><td><span class="badge ${u.role === 'admin' ? 'bg-primary' : 'bg-secondary'}">${u.role}</span></td><td>${u.progress?.percentComplete || 0}%</td><td>${new Date(u.createdAt).toLocaleDateString()}</td><td><button class="btn-glass btn-glass-sm btn-glass-outline" onclick="editUser('${u.id}')"><i class="fas fa-edit"></i></button></td></tr>`).join('');
    document.getElementById('students-count').textContent = `Showing ${users.length} of ${pagination.total} students`;
  } catch (err) {
    console.error('Failed to load students:', err);
  }
}
function searchStudents() {
  App.state.adminSearch = document.getElementById('student-search').value;
  loadStudents();
}
async function showAdminStats() {
  hideAllAdminViews(); document.getElementById('admin-view-stats').classList.remove('hidden');
  highlightAdminNav(3);
  try {
    const data = await api('/api/admin/stats');
    const container = document.getElementById('admin-topic-stats');
    container.innerHTML = data.topicStats.slice(0, 20).map(t => `<div class="stat-card glass"><div class="stat-card-value">${t.completions}</div><div class="stat-card-label">${escapeHtml(t.title)}</div></div>`).join('');
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
}
function showAdminCourses() {
  hideAllAdminViews(); document.getElementById('admin-view-courses').classList.remove('hidden');
  highlightAdminNav(1); loadAdminCourses();
}
function loadAdminCourses() {
  const tbody = document.getElementById('admin-courses-tbody');
  tbody.innerHTML = App.state.courses.map(c => `<tr><td><strong>${escapeHtml(c.emoji || '')} ${escapeHtml(c.title)}</strong><br><small class="text-muted">${c.id}</small></td><td>${escapeHtml(c.category)}</td><td>${escapeHtml(c.difficulty)}</td><td>${c.totalTopics || 0}</td><td><span class="badge bg-success">Active</span></td><td><button class="btn-glass btn-glass-sm btn-glass-outline" onclick="editCourse('${c.id}')"><i class="fas fa-edit"></i></button></td></tr>`).join('');
}
function editUser(id) {
  const user = App.state._allUsers?.find(u => u.id === id);
  if (!user) { showToast('User not found', 'error'); return; }
  document.getElementById('edit-user-id').value = id;
  document.getElementById('edit-user-name').value = user.name || '';
  document.getElementById('edit-user-email').value = user.email || '';
  document.getElementById('edit-user-role').value = user.role || 'customer';
  document.getElementById('edit-user-modal').classList.add('active');
}
function deleteUser() {
  const id = document.getElementById('edit-user-id').value;
  if (!id) return;
  if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
  api(`/api/admin/users/${id}`, { method: 'DELETE' })
    .then(() => { showToast('User deleted'); closeModal('edit-user-modal'); loadStudents(); })
    .catch(err => showToast('Failed to delete user: ' + err.message, 'error'));
}
function showCreateCourseModal() {
  document.getElementById('create-course-form').reset();
  document.getElementById('create-course-modal').classList.add('active');
}
function editCourse(id) {
  const course = App.state.courses.find(c => c.id === id);
  if (!course) { showToast('Course not found', 'error'); return; }
  document.getElementById('edit-course-id').value = id;
  document.getElementById('edit-course-title').value = course.title || '';
  document.getElementById('edit-course-desc').value = course.description || '';
  document.getElementById('edit-course-category').value = course.category || 'general';
  document.getElementById('edit-course-difficulty').value = course.difficulty || 'beginner';
  document.getElementById('edit-course-modal').classList.add('active');
}
function deleteCourseConfirm() {
  const id = document.getElementById('edit-course-id').value;
  if (!id) return;
  if (!confirm('Are you sure you want to delete this course? This will soft-delete it.')) return;
  api(`/api/courses/admin/${id}`, { method: 'DELETE' })
    .then(() => { showToast('Course deleted'); closeModal('edit-course-modal'); App._loadCourses().then(loadAdminCourses); })
    .catch(err => showToast('Failed to delete course: ' + err.message, 'error'));
}

// ============================================
// Three.js Background
// ============================================
function initThreeBackground() {
  const canvas = document.getElementById('three-bg');
  if (!canvas || !window.THREE) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  scene.add(new THREE.AmbientLight(0x667eea, 0.6));
  const dirLight = new THREE.DirectionalLight(0x764ba2, 1.2); dirLight.position.set(10, 10, 10); scene.add(dirLight);
  const pl1 = new THREE.PointLight(0x38ef7d, 0.8, 50); pl1.position.set(-15, 10, 5); scene.add(pl1);
  const pl2 = new THREE.PointLight(0xf5576c, 0.6, 50); pl2.position.set(15, -10, 5); scene.add(pl2);
  const clock = new THREE.Clock();
  const floatingObjects = [];
  const mouse = { x: 0, y: 0 };
  const geos = [new THREE.IcosahedronGeometry(1, 0), new THREE.OctahedronGeometry(1, 0), new THREE.TetrahedronGeometry(1, 0), new THREE.TorusGeometry(0.7, 0.3, 8, 16), new THREE.DodecahedronGeometry(0.8, 0)];
  const colors = [0x667eea, 0x764ba2, 0x38ef7d, 0xf5576c, 0xf5af19, 0x8b5cf6];
  for (let i = 0; i < 18; i++) {
    const geo = geos[Math.floor(Math.random() * geos.length)];
    const mat = new THREE.MeshPhongMaterial({ color: colors[Math.floor(Math.random() * colors.length)], transparent: true, opacity: 0.35 + Math.random() * 0.25, wireframe: Math.random() > 0.5, shininess: 100 });
    const mesh = new THREE.Mesh(geo, mat);
    const s = 0.4 + Math.random() * 1.2; mesh.scale.set(s, s, s);
    mesh.position.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 35, (Math.random() - 0.5) * 20 - 5);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    scene.add(mesh);
    floatingObjects.push({ mesh, rotSpeed: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01, z: (Math.random() - 0.5) * 0.005 }, floatSpeed: 0.3 + Math.random() * 0.7, floatAmp: 0.5 + Math.random() * 1.5, phase: Math.random() * Math.PI * 2, origY: mesh.position.y });
  }
  const pc = 300, pGeo = new THREE.BufferGeometry(), pos = new Float32Array(pc * 3);
  for (let i = 0; i < pc; i++) { pos[i*3] = (Math.random()-0.5)*80; pos[i*3+1] = (Math.random()-0.5)*60; pos[i*3+2] = (Math.random()-0.5)*40-5; }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x667eea, size: 0.08, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(particles);
  const rGeo = new THREE.PlaneGeometry(60, 15, 80, 20);
  const rMat = new THREE.ShaderMaterial({ uniforms: { time: { value: 0 }, color1: { value: new THREE.Color(0x667eea) }, color2: { value: new THREE.Color(0x764ba2) }, opacity: { value: 0.12 } },
    vertexShader: `uniform float time;varying vec2 vUv;varying float vE;void main(){vUv=uv;vec3 p=position;p.z+=sin(p.x*0.3+time*0.5)*2.0+cos(p.x*0.5+time*0.3)*1.5+sin(p.x*0.8+time*0.7)*0.8;vE=p.z;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,
    fragmentShader: `uniform vec3 color1;uniform vec3 color2;uniform float opacity;varying vec2 vUv;varying float vE;void main(){float t=smoothstep(-3.0,3.0,vE);vec3 c=mix(color1,color2,t);float a=opacity*(1.0-abs(vUv.y-0.5)*2.0)*(0.7+t*0.3);gl_FragColor=vec4(c,a);}`,
    transparent: true, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
  const ribbon = new THREE.Mesh(rGeo, rMat); ribbon.position.set(0, -5, -10); ribbon.rotation.x = -0.3; scene.add(ribbon);
  document.addEventListener('mousemove', (e) => { mouse.x = (e.clientX / window.innerWidth) * 2 - 1; mouse.y = -(e.clientY / window.innerHeight) * 2 + 1; });
  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    floatingObjects.forEach(o => { o.mesh.rotation.x += o.rotSpeed.x; o.mesh.rotation.y += o.rotSpeed.y; o.mesh.rotation.z += o.rotSpeed.z; o.mesh.position.y = o.origY + Math.sin(t * o.floatSpeed + o.phase) * o.floatAmp; });
    particles.rotation.y = t * 0.02; particles.rotation.x = t * 0.01;
    rMat.uniforms.time.value = t;
    camera.position.x += (mouse.x * 3 - camera.position.x) * 0.02;
    camera.position.y += (mouse.y * 2 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
    pl1.position.x = Math.sin(t * 0.3) * 15; pl1.position.y = Math.cos(t * 0.2) * 10;
    pl2.position.x = Math.cos(t * 0.4) * 15; pl2.position.y = Math.sin(t * 0.3) * 10;
    renderer.render(scene, camera);
  })();
  window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
}

// ============================================
// Init
// ============================================
App.init();
initThreeBackground();
