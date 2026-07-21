// ============================================
// Report Generator - Generate downloadable reports
// ============================================
// Creates HTML, PDF-ready, and Markdown reports

class ReportGenerator {
  constructor() {
    this.colors = {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#3b82f6'
    };
  }

  // Generate HTML report
  generateHTMLReport(analysis) {
    const { meta, roleAnalysis, marketDemand, skillMatrix, missingSkills, 
            missingTools, competitorBenchmark, futureForecast, gapAnalysis, 
            implementationRoadmap, projectRecommendations, aiOpportunities, 
            strategicReport } = analysis;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Strategic Analysis Report - ${meta.role}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; padding: 60px 20px; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%); border-radius: 20px; margin-bottom: 40px; }
    .header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; background: linear-gradient(90deg, #818cf8, #c084fc, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .header p { font-size: 1.1rem; color: #94a3b8; }
    .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 40px; }
    .meta-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; }
    .meta-card h4 { color: #818cf8; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .meta-card p { font-size: 1.1rem; font-weight: 600; }
    .section { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px; margin-bottom: 30px; }
    .section h2 { font-size: 1.5rem; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
    .section h2 i { color: #818cf8; }
    .section h3 { font-size: 1.2rem; margin: 20px 0 12px; color: #a5b4fc; }
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .card { background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; border: 1px solid rgba(255,255,255,0.08); }
    .card h4 { margin-bottom: 12px; color: #c4b5fd; }
    .card p { color: #94a3b8; font-size: 0.95rem; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
    th { background: rgba(99, 102, 241, 0.2); color: #a5b4fc; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px; }
    tr:hover { background: rgba(255,255,255,0.03); }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .badge-critical { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }
    .badge-high { background: rgba(245, 158, 11, 0.2); color: #fcd34d; }
    .badge-medium { background: rgba(59, 130, 246, 0.2); color: #93c5fd; }
    .badge-low { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; }
    .timeline { position: relative; padding-left: 30px; }
    .timeline::before { content: ''; position: absolute; left: 10px; top: 0; bottom: 0; width: 2px; background: linear-gradient(180deg, #818cf8, #c084fc); }
    .timeline-item { position: relative; margin-bottom: 30px; }
    .timeline-item::before { content: ''; position: absolute; left: -24px; top: 8px; width: 12px; height: 12px; background: #818cf8; border-radius: 50%; border: 2px solid #0f172a; }
    .timeline-item h4 { color: #c4b5fd; margin-bottom: 8px; }
    .list-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
    .list-item i { color: #818cf8; margin-top: 4px; }
    .footer { text-align: center; padding: 40px; color: #64748b; font-size: 0.9rem; }
    @media print { body { background: #fff; color: #1e293b; } .section { border-color: #e2e8f0; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1><i class="fas fa-chart-line"></i> Strategic Analysis Report</h1>
      <p>Comprehensive ${meta.role} Analysis | ${meta.industry || 'Multi-Industry'} | ${meta.region || 'Global'}</p>
      <p style="margin-top:10px;color:#64748b">Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>

    <div class="meta-grid">
      <div class="meta-card"><h4>Role</h4><p>${meta.role}</p></div>
      <div class="meta-card"><h4>Experience</h4><p>${meta.experienceLevel || 'Not specified'}</p></div>
      <div class="meta-card"><h4>Industry</h4><p>${meta.industry || 'General'}</p></div>
      <div class="meta-card"><h4>Region</h4><p>${meta.region || 'Global'}</p></div>
    </div>

    <!-- 1. Role Analysis -->
    <div class="section">
      <h2><i class="fas fa-user-tie"></i> 1. Current Role Analysis</h2>
      <div class="grid-2">
        <div class="card"><h4>Traditional Responsibilities</h4><p>${roleAnalysis.traditional}</p></div>
        <div class="card"><h4>Modern Responsibilities</h4><p>${roleAnalysis.modern}</p></div>
        <div class="card"><h4>Future Responsibilities (2026-2030)</h4><p>${roleAnalysis.future}</p></div>
        <div class="card"><h4>Market Position</h4><p><strong>Salary Range:</strong> ${roleAnalysis.avgSalary}<br><strong>Growth:</strong> ${roleAnalysis.growthPotential}<br><strong>Maturity:</strong> ${roleAnalysis.maturityLevel}</p></div>
      </div>
    </div>

    <!-- 2. Market Demand -->
    <div class="section">
      <h2><i class="fas fa-chart-bar"></i> 2. Market Demand Analysis</h2>
      <div class="grid-2">
        <div class="card"><h4>Current Demand</h4><p>${marketDemand.currentDemand.level} - ${marketDemand.currentDemand.description}</p></div>
        <div class="card"><h4>Growth Potential</h4><p>${marketDemand.growthPotential}</p></div>
      </div>
      <h3>Opportunities</h3>
      ${marketDemand.opportunities.map(o => `<div class="list-item"><i class="fas fa-check-circle"></i><span>${o}</span></div>`).join('')}
      <h3>Risk Factors</h3>
      ${marketDemand.riskFactors.map(r => `<div class="list-item"><i class="fas fa-exclamation-triangle" style="color:#f59e0b"></i><span>${r}</span></div>`).join('')}
    </div>

    <!-- 3. Skill Matrix -->
    <div class="section">
      <h2><i class="fas fa-table"></i> 3. Required Skill Matrix</h2>
      <h3>Technical Skills</h3>
      <table>
        <tr><th>Skill</th><th>Current Importance</th><th>Future Importance</th><th>Level Required</th></tr>
        ${skillMatrix.technical.map(s => `<tr><td>${s.skill}</td><td>${s.current}</td><td>${s.future}</td><td>${s.level}</td></tr>`).join('')}
      </table>
      <h3>Business Skills</h3>
      <table>
        <tr><th>Skill</th><th>Current Importance</th><th>Future Importance</th><th>Level Required</th></tr>
        ${skillMatrix.business.map(s => `<tr><td>${s.skill}</td><td>${s.current}</td><td>${s.future}</td><td>${s.level}</td></tr>`).join('')}
      </table>
    </div>

    <!-- 4. Missing Skills -->
    <div class="section">
      <h2><i class="fas fa-exclamation-circle"></i> 4. Missing Skills Identification</h2>
      <table>
        <tr><th>Skill</th><th>Why It Matters</th><th>Priority</th><th>Difficulty</th></tr>
        ${missingSkills.slice(0, 10).map(s => `<tr><td><strong>${s.skill}</strong></td><td>${s.whyItMatters}</td><td><span class="badge badge-${s.priority}">${s.priority}</span></td><td>${s.difficulty}</td></tr>`).join('')}
      </table>
    </div>

    <!-- 5. Missing Tools -->
    <div class="section">
      <h2><i class="fas fa-tools"></i> 5. Missing Tools & Technologies</h2>
      <div class="grid-2">
        ${missingTools.slice(0, 8).map(t => `<div class="card"><h4><i class="fas fa-wrench"></i> ${t.name}</h4><p><strong>Purpose:</strong> ${t.purpose}<br><strong>Priority:</strong> ${t.priority}<br><strong>Difficulty:</strong> ${t.difficulty}</p></div>`).join('')}
      </div>
    </div>

    <!-- 6. Competitor Benchmark -->
    <div class="section">
      <h2><i class="fas fa-building"></i> 6. Competitor Benchmark Analysis</h2>
      <table>
        <tr><th>Company</th><th>Features</th><th>Technology</th><th>Strength</th><th>Opportunity</th></tr>
        ${competitorBenchmark.map(c => `<tr><td><strong>${c.company}</strong></td><td>${c.features}</td><td>${c.technology}</td><td>${c.strength}</td><td>${c.opportunity}</td></tr>`).join('')}
      </table>
    </div>

    <!-- 7. Future Forecast -->
    <div class="section">
      <h2><i class="fas fa-rocket"></i> 7. Future Skill Forecast (2026-2030)</h2>
      <div class="grid-2">
        <div class="card"><h4><i class="fas fa-bolt" style="color:#fbbf24"></i> Learn NOW</h4>
          ${futureForecast.now.map(s => `<div class="list-item"><i class="fas fa-play"></i><span>${s}</span></div>`).join('')}
        </div>
        <div class="card"><h4><i class="fas fa-clock" style="color:#3b82f6"></i> Learn in 6-12 months</h4>
          ${futureForecast.next6to12.map(s => `<div class="list-item"><i class="fas fa-forward"></i><span>${s}</span></div>`).join('')}
        </div>
        <div class="card"><h4><i class="fas fa-rocket" style="color:#8b5cf6"></i> Prepare for 2-5 years</h4>
          ${futureForecast.next2to5.map(s => `<div class="list-item"><i class="fas fa-rocket"></i><span>${s}</span></div>`).join('')}
        </div>
        <div class="card"><h4><i class="fas fa-exclamation-triangle" style="color:#ef4444"></i> Becoming Outdated</h4>
          ${futureForecast.becomingOutdated.map(s => `<div class="list-item"><i class="fas fa-times-circle" style="color:#ef4444"></i><span>${s}</span></div>`).join('')}
        </div>
      </div>
    </div>

    <!-- 8. Gap Analysis -->
    <div class="section">
      <h2><i class="fas fa-bullseye"></i> 8. Personalized Gap Analysis</h2>
      <div class="grid-2">
        <div class="card"><h4>Current Level</h4><p>${gapAnalysis.currentLevel}</p></div>
        <div class="card"><h4>Target Level</h4><p>${gapAnalysis.targetLevel}</p></div>
      </div>
      <h3>Gaps Identified</h3>
      <table>
        <tr><th>Area</th><th>Current</th><th>Target</th><th>Gap</th></tr>
        ${gapAnalysis.gaps.map(g => `<tr><td>${g.area}</td><td>${g.current}/3</td><td>${g.target}/3</td><td>${g.gap}</td></tr>`).join('')}
      </table>
      <h3>What's Stopping Growth</h3>
      ${gapAnalysis.whatIsStoppingGrowth.map(g => `<div class="list-item"><i class="fas fa-ban" style="color:#ef4444"></i><span>${g}</span></div>`).join('')}
    </div>

    <!-- 9. Implementation Roadmap -->
    <div class="section">
      <h2><i class="fas fa-map"></i> 9. Implementation Roadmap</h2>
      <div class="timeline">
        ${Object.values(implementationRoadmap).map(phase => `
          <div class="timeline-item">
            <h4>${phase.name} (${phase.duration})</h4>
            <p><strong>Tasks:</strong> ${phase.tasks.join(' → ')}</p>
            <p style="margin-top:8px"><strong>Skills:</strong> ${phase.skills.join(', ')}</p>
            <p style="margin-top:8px;color:#6ee7b7"><strong>Result:</strong> ${phase.expectedResult}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 10. Project Recommendations -->
    <div class="section">
      <h2><i class="fas fa-project-diagram"></i> 10. Project Recommendations</h2>
      <div class="grid-2">
        ${projectRecommendations.map(p => `
          <div class="card">
            <h4>${p.name}</h4>
            <p>${p.purpose}</p>
            <p style="margin-top:8px"><strong>Tech:</strong> ${p.techStack}</p>
            <p><strong>Difficulty:</strong> ${p.difficulty} | <strong>Value:</strong> ${p.industryValue}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 11. AI Opportunities -->
    <div class="section">
      <h2><i class="fas fa-robot"></i> 11. AI Transformation Opportunities</h2>
      <div class="grid-2">
        <div class="card"><h4>Automation</h4>${aiOpportunities.automation.map(a => `<div class="list-item"><i class="fas fa-cog"></i><span>${a}</span></div>`).join('')}</div>
        <div class="card"><h4>AI Agents</h4>${aiOpportunities.agents.map(a => `<div class="list-item"><i class="fas fa-robot"></i><span>${a}</span></div>`).join('')}</div>
        <div class="card"><h4>Machine Learning</h4>${aiOpportunities.machineLearning.map(a => `<div class="list-item"><i class="fas fa-brain"></i><span>${a}</span></div>`).join('')}</div>
        <div class="card"><h4>Process Optimization</h4>${aiOpportunities.processOptimization.map(a => `<div class="list-item"><i class="fas fa-chart-line"></i><span>${a}</span></div>`).join('')}</div>
      </div>
    </div>

    <!-- 12. Strategic Report -->
    <div class="section">
      <h2><i class="fas fa-flag"></i> 12. Final Strategic Report</h2>
      <div class="grid-2">
        <div class="card">
          <h4><i class="fas fa-exclamation-circle" style="color:#ef4444"></i> Top 10 Missing Things</h4>
          <ol>${strategicReport.top10MissingThings.map(s => `<li>${s}</li>`).join('')}</ol>
        </div>
        <div class="card">
          <h4><i class="fas fa-graduation-cap" style="color:#8b5cf6"></i> Top 10 Skills to Learn</h4>
          <ol>${strategicReport.top10SkillsToLearn.map(s => `<li>${s}</li>`).join('')}</ol>
        </div>
        <div class="card">
          <h4><i class="fas fa-wrench" style="color:#3b82f6"></i> Top 10 Tools to Master</h4>
          <ol>${strategicReport.top10ToolsToMaster.map(s => `<li>${s}</li>`).join('')}</ol>
        </div>
        <div class="card">
          <h4><i class="fas fa-bolt" style="color:#f59e0b"></i> Top 10 Actions Now</h4>
          <ol>${strategicReport.top10Actions.map(s => `<li>${s}</li>`).join('')}</ol>
        </div>
      </div>
      <div class="grid-2" style="margin-top:20px">
        <div class="card"><h4><i class="fas fa-trophy" style="color:#10b981"></i> Biggest Opportunities</h4>${strategicReport.biggestOpportunities.map(o => `<div class="list-item"><i class="fas fa-check-circle" style="color:#10b981"></i><span>${o}</span></div>`).join('')}</div>
        <div class="card"><h4><i class="fas fa-exclamation-triangle" style="color:#ef4444"></i> Biggest Risks</h4>${strategicReport.biggestRisks.map(r => `<div class="list-item"><i class="fas fa-times-circle" style="color:#ef4444"></i><span>${r}</span></div>`).join('')}</div>
      </div>
    </div>

    <div class="footer">
      <p>Generated by WebLearn Academy AI Research & Analysis System</p>
      <p>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
    </div>
  </div>
</body>
</html>`;
  }

  // Generate Markdown report
  generateMarkdownReport(analysis) {
    const { meta, roleAnalysis, marketDemand, skillMatrix, missingSkills, 
            missingTools, competitorBenchmark, futureForecast, gapAnalysis, 
            implementationRoadmap, projectRecommendations, aiOpportunities, 
            strategicReport } = analysis;

    return `# Strategic Analysis Report
## ${meta.role} | ${meta.industry || 'Multi-Industry'} | ${meta.region || 'Global'}

**Generated:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

---

## 1. Current Role Analysis

| Aspect | Details |
|--------|---------|
| Traditional | ${roleAnalysis.traditional} |
| Modern | ${roleAnalysis.modern} |
| Future (2026-2030) | ${roleAnalysis.future} |
| Salary Range | ${roleAnalysis.avgSalary} |
| Growth Potential | ${roleAnalysis.growthPotential} |

---

## 2. Market Demand Analysis

- **Current Demand:** ${marketDemand.currentDemand.level} - ${marketDemand.currentDemand.description}
- **Growth Potential:** ${marketDemand.growthPotential}

### Opportunities
${marketDemand.opportunities.map(o => `- ${o}`).join('\n')}

### Risk Factors
${marketDemand.riskFactors.map(r => `- ${r}`).join('\n')}

---

## 3. Required Skill Matrix

### Technical Skills
| Skill | Current | Future | Level |
|-------|---------|--------|-------|
${skillMatrix.technical.map(s => `| ${s.skill} | ${s.current} | ${s.future} | ${s.level} |`).join('\n')}

### Business Skills
| Skill | Current | Future | Level |
|-------|---------|--------|-------|
${skillMatrix.business.map(s => `| ${s.skill} | ${s.current} | ${s.future} | ${s.level} |`).join('\n')}

---

## 4. Missing Skills

| Skill | Why It Matters | Priority | Difficulty |
|-------|----------------|----------|------------|
${missingSkills.slice(0, 10).map(s => `| ${s.skill} | ${s.whyItMatters} | ${s.priority} | ${s.difficulty} |`).join('\n')}

---

## 5. Missing Tools & Technologies

${missingTools.slice(0, 8).map(t => `- **${t.name}**: ${t.purpose} (${t.priority} priority, ${t.difficulty})`).join('\n')}

---

## 6. Competitor Benchmark

| Company | Technology | Strength | Opportunity |
|---------|------------|----------|-------------|
${competitorBenchmark.map(c => `| ${c.company} | ${c.technology} | ${c.strength} | ${c.opportunity} |`).join('\n')}

---

## 7. Future Skill Forecast (2026-2030)

### Learn NOW
${futureForecast.now.map(s => `- ${s}`).join('\n')}

### Learn in 6-12 months
${futureForecast.next6to12.map(s => `- ${s}`).join('\n')}

### Prepare for 2-5 years
${futureForecast.next2to5.map(s => `- ${s}`).join('\n')}

### Becoming Outdated
${futureForecast.becomingOutdated.map(s => `- ${s}`).join('\n')}

---

## 8. Gap Analysis

- **Current Level:** ${gapAnalysis.currentLevel}
- **Target Level:** ${gapAnalysis.targetLevel}

| Area | Current | Target | Gap |
|------|---------|--------|-----|
${gapAnalysis.gaps.map(g => `| ${g.area} | ${g.current}/3 | ${g.target}/3 | ${g.gap} |`).join('\n')}

---

## 9. Implementation Roadmap

${Object.values(implementationRoadmap).map(phase => `
### ${phase.name} (${phase.duration})
- **Tasks:** ${phase.tasks.join(' → ')}
- **Skills:** ${phase.skills.join(', ')}
- **Result:** ${phase.expectedResult}
`).join('\n')}

---

## 10. Project Recommendations

${projectRecommendations.map(p => `
### ${p.name}
- **Purpose:** ${p.purpose}
- **Tech Stack:** ${p.techStack}
- **Difficulty:** ${p.difficulty}
- **Value:** ${p.industryValue}
`).join('\n')}

---

## 11. AI Transformation Opportunities

### Automation
${aiOpportunities.automation.map(a => `- ${a}`).join('\n')}

### AI Agents
${aiOpportunities.agents.map(a => `- ${a}`).join('\n')}

### Machine Learning
${aiOpportunities.machineLearning.map(a => `- ${a}`).join('\n')}

---

## 12. Final Strategic Report

### Top 10 Missing Things
${strategicReport.top10MissingThings.map((s, i) => `${i + 1}. ${s}`).join('\n')}

### Top 10 Skills to Learn
${strategicReport.top10SkillsToLearn.map((s, i) => `${i + 1}. ${s}`).join('\n')}

### Top 10 Tools to Master
${strategicReport.top10ToolsToMaster.map((s, i) => `${i + 1}. ${s}`).join('\n')}

### Top 10 Actions Now
${strategicReport.top10Actions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

### Biggest Opportunities
${strategicReport.biggestOpportunities.map(o => `- ${o}`).join('\n')}

### Biggest Risks
${strategicReport.biggestRisks.map(r => `- ${r}`).join('\n')}

---

*Generated by WebLearn Academy AI Research & Analysis System*
`;
  }
}

module.exports = new ReportGenerator();
