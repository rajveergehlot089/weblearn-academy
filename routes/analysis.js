// ============================================
// Analysis Routes - PostgreSQL-backed
// ============================================
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const researchEngine = require('../utils/researchEngine');
const analysisEngine = require('../utils/analysisEngine');
const reportGenerator = require('../utils/reportGenerator');
const db = require('../utils/db');
const { validate, analysisGenerateSchema, analysisReportSchema } = require('../middleware/validate');

// POST /api/analysis/generate
router.post('/generate', auth, validate(analysisGenerateSchema), async (req, res) => {
  try {
    const { role, industry, currentSkills, experienceLevel, goal, region } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    const [jobMarket, industryTrends, techLandscape] = await Promise.all([
      researchEngine.searchJobMarket(role, region).catch(() => null),
      researchEngine.searchIndustryTrends(industry || role).catch(() => null),
      researchEngine.searchTechLandscape(role).catch(() => null)
    ]);

    const analysis = await analysisEngine.generateAnalysis({
      role,
      industry,
      currentSkills: currentSkills || [],
      experienceLevel: experienceLevel || 'intermediate',
      goal,
      region: region || 'global'
    });

    if (jobMarket) analysis.researchData = { jobMarket };
    if (industryTrends) analysis.researchData = { ...analysis.researchData, industryTrends };
    if (techLandscape) analysis.researchData = { ...analysis.researchData, techLandscape };

    const id = `analysis_${Date.now()}`;
    await db.saveAnalysis(req.user.id, id, analysis);

    res.json({ id, analysis });
  } catch (error) {
    console.error('Analysis generation error:', error);
    res.status(500).json({ error: 'Failed to generate analysis' });
  }
});

// POST /api/analysis/report
router.post('/report', auth, validate(analysisReportSchema), async (req, res) => {
  try {
    const { analysis, format } = req.body;

    if (!analysis) {
      return res.status(400).json({ error: 'Analysis data is required' });
    }

    let report;
    let contentType;
    let extension;

    if (format === 'markdown') {
      report = reportGenerator.generateMarkdownReport(analysis);
      contentType = 'text/markdown';
      extension = 'md';
    } else {
      report = reportGenerator.generateHTMLReport(analysis);
      contentType = 'text/html';
      extension = 'html';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="analysis-report.${extension}"`);
    res.send(report);
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// GET /api/analysis/history
router.get('/history', auth, async (req, res) => {
  try {
    const history = await db.getAnalysisHistory(req.user.id);
    const formatted = history.map(h => ({
      id: h.id,
      analysis: JSON.parse(h.analysis),
      timestamp: h.createdAt,
    }));
    res.json({ history: formatted });
  } catch (error) {
    console.error('Analysis history error:', error);
    res.status(500).json({ error: 'Failed to load history' });
  }
});

// GET /api/analysis/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await db.getAnalysisById(req.params.id);
    if (!item || item.userId !== req.user.id) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    res.json({
      id: item.id,
      analysis: JSON.parse(item.analysis),
      timestamp: item.createdAt,
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: 'Failed to get analysis' });
  }
});

// DELETE /api/analysis/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await db.getAnalysisById(req.params.id);
    if (!item || item.userId !== req.user.id) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    await db.deleteAnalysis(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({ error: 'Failed to delete analysis' });
  }
});

module.exports = router;
