// ============================================
// Analysis API — career analysis with research engine
// ============================================
const db = require('./lib/db');
const { requireAuth, setCorsHeaders, handleOptions } = require('./lib/auth');

// Inline analysis engine (portable, no filesystem dependencies)
const SKILL_DB = {
  'javascript': { importance: 'high', future: 'high', category: 'programming' },
  'python': { importance: 'high', future: 'very-high', category: 'programming' },
  'typescript': { importance: 'high', future: 'very-high', category: 'programming' },
  'react': { importance: 'high', future: 'high', category: 'framework' },
  'vue': { importance: 'medium', future: 'high', category: 'framework' },
  'node.js': { importance: 'high', future: 'high', category: 'backend' },
  'aws': { importance: 'high', future: 'very-high', category: 'cloud' },
  'docker': { importance: 'high', future: 'very-high', category: 'devops' },
  'kubernetes': { importance: 'medium', future: 'high', category: 'devops' },
  'machine learning': { importance: 'medium', future: 'very-high', category: 'ai' },
  'ai': { importance: 'medium', future: 'very-high', category: 'ai' },
  'sql': { importance: 'high', future: 'high', category: 'database' },
  'git': { importance: 'high', future: 'high', category: 'tools' },
  'ci/cd': { importance: 'high', future: 'very-high', category: 'devops' },
  'security': { importance: 'high', future: 'very-high', category: 'security' },
  'communication': { importance: 'high', future: 'high', category: 'soft' },
  'leadership': { importance: 'high', future: 'high', category: 'soft' },
  'problem solving': { importance: 'high', future: 'high', category: 'soft' },
};

const ROLE_DATA = {
  'full stack developer': { traditional: 'Building and maintaining web applications across the entire stack', modern: 'Full-stack development with cloud deployment, CI/CD, and AI integration', future: 'AI-augmented development, microservices architecture, and edge computing', avgSalary: '$80,000 - $150,000', growthPotential: 'High' },
  'data scientist': { traditional: 'Statistical analysis and data visualization', modern: 'Machine learning, deep learning, and predictive analytics', future: 'AI/ML engineering, MLOps, and automated insights', avgSalary: '$90,000 - $160,000', growthPotential: 'Very High' },
  'product manager': { traditional: 'Managing product roadmap and stakeholder communication', modern: 'Data-driven product decisions, agile methodologies, and user research', future: 'AI-powered product management and growth hacking', avgSalary: '$100,000 - $180,000', growthPotential: 'High' },
  'devops engineer': { traditional: 'Infrastructure management and deployment', modern: 'Cloud-native architecture, Kubernetes, and infrastructure as code', future: 'Platform engineering, AI-driven operations, and autonomous systems', avgSalary: '$90,000 - $160,000', growthPotential: 'Very High' },
};

function generateAnalysis(input) {
  const { role, industry, currentSkills, experienceLevel, goal, region } = input;
  const normalizedRole = role.toLowerCase();
  const roleInfo = ROLE_DATA[normalizedRole] || { traditional: `Core responsibilities in ${role}`, modern: `Modern practices for ${role}`, future: `Emerging trends for ${role}`, avgSalary: 'Varies', growthPotential: 'High' };

  const current = (currentSkills || []).map(s => s.toLowerCase());
  const missing = Object.entries(SKILL_DB)
    .filter(([skill]) => !current.includes(skill))
    .map(([skill, data]) => ({
      skill,
      whyItMatters: `Essential for modern ${role} professionals`,
      currentDemand: data.importance,
      futureDemand: data.future,
      difficulty: 'intermediate',
      priority: data.future === 'very-high' && data.importance === 'high' ? 'critical' : data.future === 'very-high' ? 'high' : 'medium',
    }))
    .sort((a, b) => (a.priority === 'critical' ? 0 : a.priority === 'high' ? 1 : 2) - (b.priority === 'critical' ? 0 : b.priority === 'high' ? 1 : 2))
    .slice(0, 15);

  return {
    meta: { role, industry, experienceLevel, goal, region, timestamp: new Date().toISOString() },
    roleAnalysis: { ...roleInfo, maturityLevel: 'Mature' },
    marketDemand: {
      currentDemand: { level: 'High', description: 'Strong demand with many openings' },
      growthPotential: '15-25% over next 5 years',
      riskFactors: ['AI automation potentially replacing routine tasks', 'Rapid technology changes requiring constant upskilling'],
      opportunities: ['Growing demand for AI/ML skills', 'Remote work expanding global opportunities', 'Digital transformation driving new roles'],
    },
    skillMatrix: {
      technical: [
        { skill: 'Programming', current: 'High', future: 'Very High', level: 'Advanced' },
        { skill: 'AI/ML Tools', current: 'Medium', future: 'Very High', level: 'Intermediate' },
        { skill: 'Cloud Platforms', current: 'High', future: 'Very High', level: 'Intermediate' },
        { skill: 'DevOps/CI/CD', current: 'Medium', future: 'High', level: 'Intermediate' },
        { skill: 'Cybersecurity', current: 'Medium', future: 'Very High', level: 'Intermediate' },
      ],
      business: [
        { skill: 'Communication', current: 'High', future: 'High', level: 'Advanced' },
        { skill: 'Leadership', current: 'Medium', future: 'High', level: 'Intermediate' },
        { skill: 'Problem Solving', current: 'High', future: 'Very High', level: 'Advanced' },
      ],
    },
    missingSkills: missing,
    missingTools: [
      { name: 'VS Code', purpose: 'Code editor', priority: 'high', difficulty: 'beginner' },
      { name: 'GitHub', purpose: 'Version control', priority: 'high', difficulty: 'beginner' },
      { name: 'Docker', purpose: 'Containerization', priority: 'high', difficulty: 'intermediate' },
      { name: 'Postman', purpose: 'API testing', priority: 'medium', difficulty: 'beginner' },
    ],
    competitorBenchmark: [
      { company: 'Google', technology: 'TensorFlow, Kubernetes, GCP', strength: 'Innovation, Scale', opportunity: 'AI integration' },
      { company: 'Microsoft', technology: 'Azure, GitHub Copilot, VS Code', strength: 'Enterprise reach', opportunity: 'AI-powered dev experience' },
      { company: 'Amazon', technology: 'AWS, Lambda, SageMaker', strength: 'Market share', opportunity: 'Serverless AI applications' },
    ],
    futureForecast: {
      now: ['Master core programming skills', 'Learn cloud platforms', 'Understand AI/ML basics', 'Practice version control (Git)'],
      next6to12: ['AI-powered development tools', 'Advanced cloud architecture', 'DevOps and CI/CD pipelines'],
      next2to5: ['AI/ML engineering', 'Quantum computing basics', 'Edge computing'],
      becomingOutdated: ['Manual testing', 'Basic CRUD development', 'Manual deployment'],
    },
    gapAnalysis: {
      currentLevel: experienceLevel || 'intermediate',
      targetLevel: goal || 'expert',
      gaps: [
        { area: 'Technical Skills', current: 1, target: 3, gap: 2 },
        { area: 'AI/ML Knowledge', current: 0, target: 3, gap: 3 },
        { area: 'Cloud Architecture', current: 1, target: 3, gap: 2 },
      ],
    },
    implementationRoadmap: {
      phase1: { name: 'Foundation', duration: '0-30 days', tasks: ['Set up development environment', 'Master Git', 'Learn core programming'], skills: ['Git', 'VS Code', 'Basic programming'] },
      phase2: { name: 'Growth', duration: '1-3 months', tasks: ['Build portfolio projects', 'Learn a modern framework', 'Understand databases'], skills: ['React/Vue', 'Node.js', 'Databases'] },
      phase3: { name: 'Professional', duration: '3-6 months', tasks: ['Master cloud deployment', 'Implement CI/CD', 'Learn advanced AI tools'], skills: ['Docker', 'Kubernetes', 'AWS'] },
    },
    projectRecommendations: [
      { name: 'AI-Powered Portfolio', purpose: 'Showcase skills with AI integration', techStack: 'React, Node.js, OpenAI API', difficulty: 'Intermediate' },
      { name: 'Task Management SaaS', purpose: 'Build a complete SaaS product', techStack: 'Next.js, PostgreSQL, Stripe', difficulty: 'Advanced' },
    ],
    aiOpportunities: {
      automation: ['Automate repetitive coding tasks', 'Use AI for code review', 'Automate testing with AI tools'],
      agents: ['AI coding assistants', 'AI testing agents', 'AI deployment agents'],
    },
    strategicReport: {
      top10MissingThings: missing.slice(0, 10).map(s => s.skill),
      top10SkillsToLearn: ['AI/ML Fundamentals', 'Cloud Architecture', 'System Design', 'Advanced Git', 'Docker', 'TypeScript', 'Database Optimization', 'Security', 'API Design', 'Technical Leadership'],
      top10ToolsToMaster: ['GitHub Copilot', 'VS Code', 'Docker', 'AWS', 'Figma', 'Postman', 'Git', 'Jira', 'Grafana', 'Terraform'],
      top10Actions: ['Start building projects', 'Learn AI tools', 'Get cloud certification', 'Contribute to open source', 'Build a portfolio'],
      biggestOpportunities: ['AI/ML integration', 'Remote work opportunities', 'Cloud-native development'],
      biggestRisks: ['AI automating routine tasks', 'Skills becoming outdated', 'Global competition'],
    },
  };
}

function generateHTMLReport(analysis) {
  const { meta, roleAnalysis, missingSkills, strategicReport } = analysis;
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Analysis - ${meta.role}</title><style>body{font-family:sans-serif;max-width:900px;margin:0 auto;padding:20px;background:#0f172a;color:#e2e8f0}h1{color:#818cf8}h2{color:#a5b4fc;margin-top:30px}.card{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;margin:10px 0}</style></head><body><h1>Strategic Analysis: ${meta.role}</h1><p>${meta.industry || 'Multi-Industry'} | ${meta.region || 'Global'} | Generated: ${new Date().toLocaleDateString()}</p><h2>Role Analysis</h2><div class="card"><p><strong>Traditional:</strong> ${roleAnalysis.traditional}</p><p><strong>Modern:</strong> ${roleAnalysis.modern}</p><p><strong>Future:</strong> ${roleAnalysis.future}</p><p><strong>Salary:</strong> ${roleAnalysis.avgSalary}</p></div><h2>Missing Skills</h2><table style="width:100%;border-collapse:collapse"><tr><th style="text-align:left;padding:8px;border-bottom:1px solid #334155">Skill</th><th style="text-align:left;padding:8px;border-bottom:1px solid #334155">Priority</th></tr>${missingSkills.slice(0, 10).map(s => `<tr><td style="padding:8px;border-bottom:1px solid #1e293b">${s.skill}</td><td style="padding:8px;border-bottom:1px solid #1e293b">${s.priority}</td></tr>`).join('')}</table><h2>Top Actions</h2><ol>${strategicReport.top10Actions.map(a => `<li style="padding:4px 0">${a}</li>`).join('')}</ol></body></html>`;
}

function generateMarkdownReport(analysis) {
  const { meta, roleAnalysis, missingSkills, strategicReport } = analysis;
  return `# Strategic Analysis: ${meta.role}\n\n${meta.industry || 'Multi-Industry'} | ${meta.region || 'Global'}\n\n## Role Analysis\n- Traditional: ${roleAnalysis.traditional}\n- Modern: ${roleAnalysis.modern}\n- Future: ${roleAnalysis.future}\n- Salary: ${roleAnalysis.avgSalary}\n\n## Missing Skills\n${missingSkills.slice(0, 10).map(s => `- **${s.skill}** (${s.priority})`).join('\n')}\n\n## Top Actions\n${strategicReport.top10Actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n`;
}

module.exports = async (req, res) => {
  setCorsHeaders(res);
  if (handleOptions(req, res)) return;
  await db.initSchema();

  const url = new URL(req.url, 'http://localhost');
  const pathParts = url.pathname.replace('/api/analysis', '').split('/').filter(Boolean);
  const action = pathParts[0] || '';
  const id = pathParts[1] || '';

  try {
    // POST /api/analysis/generate
    if (req.method === 'POST' && action === 'generate') {
      const user = await requireAuth(req, res);
      if (!user) return;
      const { role, industry, currentSkills, experienceLevel, goal, region } = req.body || {};
      if (!role) return res.status(400).json({ error: 'Role is required' });

      const analysis = generateAnalysis({ role, industry, currentSkills, experienceLevel, goal, region });
      const analysisId = `analysis_${Date.now()}`;
      await db.run('INSERT INTO analysis_history (id, "userId", analysis, "createdAt") VALUES ($1,$2,$3,$4)', [analysisId, user.id, JSON.stringify(analysis), new Date().toISOString()]);
      return res.json({ id: analysisId, analysis });
    }

    // POST /api/analysis/report
    if (req.method === 'POST' && action === 'report') {
      const user = await requireAuth(req, res);
      if (!user) return;
      const { analysis, format } = req.body || {};
      if (!analysis) return res.status(400).json({ error: 'Analysis data is required' });

      let report, contentType, extension;
      if (format === 'markdown') {
        report = generateMarkdownReport(analysis);
        contentType = 'text/markdown';
        extension = 'md';
      } else {
        report = generateHTMLReport(analysis);
        contentType = 'text/html';
        extension = 'html';
      }
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="analysis-report.${extension}"`);
      return res.send(report);
    }

    // GET /api/analysis/history
    if (req.method === 'GET' && action === 'history') {
      const user = await requireAuth(req, res);
      if (!user) return;
      const history = await db.query('SELECT id, analysis, "createdAt" FROM analysis_history WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 20', [user.id]);
      return res.json({ history: history.map(h => ({ id: h.id, analysis: JSON.parse(h.analysis), timestamp: h.createdAt })) });
    }

    // GET /api/analysis/:id
    if (req.method === 'GET' && action && !['history', 'generate', 'report'].includes(action)) {
      const user = await requireAuth(req, res);
      if (!user) return;
      const item = await db.one('SELECT * FROM analysis_history WHERE id = $1', [action]);
      if (!item || item.userId !== user.id) return res.status(404).json({ error: 'Analysis not found' });
      return res.json({ id: item.id, analysis: JSON.parse(item.analysis), timestamp: item.createdAt });
    }

    // DELETE /api/analysis/:id
    if (req.method === 'DELETE' && action) {
      const user = await requireAuth(req, res);
      if (!user) return;
      const item = await db.one('SELECT * FROM analysis_history WHERE id = $1', [action]);
      if (!item || item.userId !== user.id) return res.status(404).json({ error: 'Analysis not found' });
      await db.run('DELETE FROM analysis_history WHERE id = $1', [action]);
      return res.json({ success: true });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
