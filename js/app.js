// ============================================
// CLINICAL TRIAL DASHBOARD - Main Application
// Phase 2: Real Data Integration
// 
// GOVERNANCE STATEMENT:
// AI components operate exclusively on validated, pre-computed metrics and 
// do not perform clinical, statistical, or regulatory calculations.
// All metric derivations are deterministic, explainable, and auditable.
// ============================================

class ClinicalDashboard {
  constructor() {
    this.data = null;
    this.charts = {};
    this.currentRole = 'all';
    this.useRealData = true; // Set to true to use real data
    this.initAsync();
  }

  async initAsync() {
    // Load real data or fall back to mock data
    if (this.useRealData && typeof getRealDashboardData === 'function') {
      try {
        console.log('[Dashboard] Loading real clinical trial data...');
        this.data = await getRealDashboardData();
        console.log('[Dashboard] Real data loaded successfully:', {
          dqi: this.data?.executiveKPIs?.dqi?.current,
          openSAEs: this.data?.executiveKPIs?.openSAEs?.current,
          regions: this.data?.regions?.length,
          source: this.data?.dataSource
        });
      } catch (error) {
        console.warn('[Dashboard] Failed to load real data, falling back to mock:', error);
        this.data = MockData;
      }
    } else {
      console.log('[Dashboard] Using mock data');
      this.data = MockData;
    }

    // Validate data before rendering
    if (!this.data || !this.data.executiveKPIs) {
      console.error('[Dashboard] Invalid data structure, using mock data');
      this.data = MockData;
    }

    this.init();
  }

  init() {
    this.updateLastUpdated();
    this.renderExecutiveKPIs();
    this.renderCharts();
    this.renderGeographicalView();
    this.renderPatientTable();
    this.renderBottleneckAnalysis();
    this.renderSafetyReadiness();
    this.renderAIInsights();
    this.renderRecommendations();
    this.bindEvents();

    // Log data source for traceability
    console.log('[Dashboard] Render complete. Data source:', this.data?.dataSource || 'Mock');
  }

  // ============================================
  // TIMESTAMP & REFRESH
  // ============================================
  updateLastUpdated() {
    const now = new Date();
    const formatted = now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    document.getElementById('lastUpdatedTime').textContent = `Last updated: ${formatted}`;
  }

  // ============================================
  // EXECUTIVE KPIs
  // ============================================
  renderExecutiveKPIs() {
    const kpis = this.data.executiveKPIs;

    // DQI
    const dqiValue = document.getElementById('dqiValue');
    dqiValue.textContent = `${kpis.dqi.current}%`;
    dqiValue.className = `kpi-value ${this.getStatusClass(kpis.dqi.current, 95, 85)}`;
    this.renderTrend('dqiTrend', kpis.dqi.current - kpis.dqi.previous, '%');
    this.updateCardStatus('kpiDQI', kpis.dqi.current, 95, 85);

    // Clean Patients
    document.getElementById('cleanValue').textContent = `${kpis.cleanPatients.percentage}%`;
    document.getElementById('cleanProgress').style.width = `${kpis.cleanPatients.percentage}%`;
    this.renderTrend('cleanTrend', kpis.cleanPatients.percentage - kpis.cleanPatients.previousPercentage, '%');
    this.updateCardStatus('kpiClean', kpis.cleanPatients.percentage, 95, 80);

    // Sites at Risk
    document.getElementById('sitesAtRiskValue').textContent = kpis.sitesAtRisk.current;
    this.renderTrend('sitesRiskTrend', kpis.sitesAtRisk.previous - kpis.sitesAtRisk.current, '', true);

    // Open SAE
    document.getElementById('openSAEValue').textContent = kpis.openSAEs.current;
    document.getElementById('criticalSAEBadge').textContent = `${kpis.openSAEs.critical} critical`;
    this.renderTrend('saeTrend', kpis.openSAEs.previous - kpis.openSAEs.current, '', true);

    // Readiness Status
    this.renderReadinessStatus(kpis.readinessStatus);
  }

  getStatusClass(value, greenThreshold, amberThreshold) {
    if (value >= greenThreshold) return 'text-success';
    if (value >= amberThreshold) return 'text-warning';
    return 'text-danger';
  }

  updateCardStatus(cardId, value, greenThreshold, amberThreshold) {
    const card = document.getElementById(cardId);
    card.classList.remove('status-green', 'status-amber', 'status-red');
    if (value >= greenThreshold) card.classList.add('status-green');
    else if (value >= amberThreshold) card.classList.add('status-amber');
    else card.classList.add('status-red');
  }

  renderTrend(elementId, change, unit = '', invertColors = false) {
    const el = document.getElementById(elementId);
    const formattedChange = change > 0 ? `+${change.toFixed(1)}${unit}` : `${change.toFixed(1)}${unit}`;
    const isPositive = invertColors ? change > 0 : change > 0;

    el.innerHTML = `
      <span>${isPositive ? '↑' : '↓'}</span>
      <span>${formattedChange} vs last week</span>
    `;
    el.className = `kpi-trend ${isPositive ? 'up' : 'down'}`;
  }

  renderReadinessStatus(status) {
    const statusEl = document.getElementById('readinessStatus');
    const iconEl = document.getElementById('readinessIcon');
    const textEl = document.getElementById('readinessText');

    statusEl.classList.remove('ready', 'at-risk', 'not-ready');

    switch (status) {
      case 'ready':
        statusEl.classList.add('ready');
        iconEl.textContent = '✅';
        textEl.textContent = 'READY';
        break;
      case 'at-risk':
        statusEl.classList.add('at-risk');
        iconEl.textContent = '⚠️';
        textEl.textContent = 'AT RISK';
        break;
      default:
        statusEl.classList.add('not-ready');
        iconEl.textContent = '❌';
        textEl.textContent = 'NOT READY';
    }
  }

  // ============================================
  // CHARTS
  // ============================================
  renderCharts() {
    this.renderDQITrendChart();
    this.renderQueryTrendChart();
    this.renderQueryGauge();
    this.renderVisitGauge();
  }

  renderDQITrendChart() {
    const ctx = document.getElementById('dqiTrendChart').getContext('2d');
    const trends = this.data.trends.dqi;

    // Debug logging for chart data
    console.log('[Dashboard] DQI Trend data:', trends);

    // Calculate dynamic Y-axis range based on actual data
    const values = trends.map(t => t.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const yMin = Math.max(0, Math.floor(minValue / 10) * 10 - 10);
    const yMax = Math.min(100, Math.ceil(maxValue / 10) * 10 + 10);

    console.log('[Dashboard] Y-axis range:', yMin, '-', yMax, 'Values:', values);

    this.charts.dqiTrend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: trends.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [{
          label: 'DQI %',
          data: values,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          borderWidth: 3
        }, {
          label: 'Target (95%)',
          data: trends.map(() => 95),
          borderColor: '#10b981',
          borderDash: [5, 5],
          pointRadius: 0,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: { color: '#94a3b8', font: { size: 11 } }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.dataset.label + ': ' + context.parsed.y + '%';
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
            ticks: { color: '#94a3b8' }
          },
          y: {
            min: yMin,
            max: yMax,
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
            ticks: {
              color: '#94a3b8',
              callback: function (value) {
                return value + '%';
              }
            }
          }
        }
      }
    });
  }

  renderQueryTrendChart() {
    const ctx = document.getElementById('queryTrendChart').getContext('2d');
    const trends = this.data.trends.openQueries;

    this.charts.queryTrend = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: trends.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [{
          label: 'Open Queries',
          data: trends.map(t => t.value),
          backgroundColor: trends.map(t => t.value > 400 ? '#ef4444' : t.value > 350 ? '#f59e0b' : '#10b981'),
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8' }
          },
          y: {
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    });
  }

  renderQueryGauge() {
    const ctx = document.getElementById('queryGauge').getContext('2d');
    const queries = this.data.bottlenecks.queries;

    this.charts.queryGauge = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Open', 'Closed'],
        datasets: [{
          data: [queries.open, queries.closed],
          backgroundColor: ['#f59e0b', 'rgba(16, 185, 129, 0.3)'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: { display: false }
        }
      }
    });

    document.getElementById('queryOpenCount').textContent = queries.open;
    document.getElementById('queryAge1').textContent = queries.aging['0-7 days'];
    document.getElementById('queryAge2').textContent = queries.aging['8-14 days'];
    document.getElementById('queryAge3').textContent = queries.aging['15-30 days'];
    document.getElementById('queryAge4').textContent = queries.aging['>30 days'];
  }

  renderVisitGauge() {
    const ctx = document.getElementById('visitGauge').getContext('2d');
    const visits = this.data.bottlenecks.visits;

    this.charts.visitGauge = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Overdue', 'Completed'],
        datasets: [{
          data: [visits.overdue, visits.completed],
          backgroundColor: ['#ef4444', 'rgba(16, 185, 129, 0.3)'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: { display: false }
        }
      }
    });

    document.getElementById('visitOverdueCount').textContent = visits.overdue;
    document.getElementById('visitAge1').textContent = visits.overdueByDays['1-7 days'];
    document.getElementById('visitAge2').textContent = visits.overdueByDays['8-14 days'];
    document.getElementById('visitAge3').textContent = visits.overdueByDays['15-30 days'];
    document.getElementById('visitAge4').textContent = visits.overdueByDays['>30 days'];
  }

  // ============================================
  // GEOGRAPHICAL VIEW
  // ============================================
  renderGeographicalView() {
    this.renderRegionHeatmap();
    this.renderSiteRankings();
  }

  renderRegionHeatmap() {
    const container = document.getElementById('regionHeatmap');
    const regions = this.data.regions;

    let html = '<div class="dashboard-grid grid-2" style="gap: 1rem;">';

    regions.forEach(region => {
      html += `
        <div class="card" style="padding: 1rem; cursor: pointer;" onclick="dashboard.showRegionDetails('${region.id}')">
          <div class="font-semibold mb-sm">${region.name}</div>
          <div class="dashboard-grid grid-2" style="gap: 0.5rem;">
      `;

      region.countries.forEach(country => {
        const statusClass = this.getHeatmapClass(country.dqi);
        html += `
          <div class="heatmap-cell ${statusClass}" style="padding: 0.5rem; border-radius: 0.5rem;">
            <div class="text-xs">${country.name}</div>
            <div class="font-bold">${country.dqi}%</div>
          </div>
        `;
      });

      html += '</div></div>';
    });

    html += '</div>';
    container.innerHTML = html;
  }

  getHeatmapClass(dqi) {
    if (dqi >= 90) return 'level-1';
    if (dqi >= 85) return 'level-2';
    if (dqi >= 75) return 'level-3';
    if (dqi >= 65) return 'level-4';
    return 'level-5';
  }

  renderSiteRankings() {
    // Top Sites
    const topTable = document.getElementById('topSitesTable');
    topTable.innerHTML = this.data.topSites.map((site, i) => `
      <tr onclick="dashboard.showSiteDetails('${site.id}')" style="cursor: pointer;">
        <td><span class="badge badge-success">#${i + 1}</span></td>
        <td>
          <div class="font-semibold">${site.id}</div>
          <div class="text-xs text-muted">${site.name}</div>
        </td>
        <td class="text-success font-semibold">${site.dqi}%</td>
        <td>${site.cleanPercent}%</td>
        <td>${site.openQueries}</td>
      </tr>
    `).join('');

    // Bottom Sites
    const bottomTable = document.getElementById('bottomSitesTable');
    bottomTable.innerHTML = this.data.bottomSites.map(site => `
      <tr class="priority-high" onclick="dashboard.showSiteDetails('${site.id}')" style="cursor: pointer;">
        <td>
          <div class="font-semibold">${site.id}</div>
          <div class="text-xs text-muted">${site.name}</div>
        </td>
        <td class="text-danger font-semibold">${site.dqi}%</td>
        <td class="text-danger">${site.cleanPercent}%</td>
        <td class="text-warning">${site.openQueries}</td>
        <td><span class="badge ${site.status === 'critical' ? 'badge-danger' : 'badge-warning'}">${site.status}</span></td>
      </tr>
    `).join('');
  }

  // ============================================
  // PATIENT TABLE
  // ============================================
  renderPatientTable() {
    const patients = this.data.patients;
    const flagged = patients.filter(p => p.status === 'flagged');
    const withSAE = patients.filter(p => p.saeStatus === 'open');

    document.getElementById('flaggedPatientCount').textContent = `${flagged.length} flagged`;
    document.getElementById('saePatientCount').textContent = `${withSAE.length} with SAE`;

    const tbody = document.getElementById('patientTableBody');
    tbody.innerHTML = patients.map(p => `
      <tr class="${p.saeStatus === 'open' ? 'priority-high' : ''}" onclick="dashboard.showPatientDetails('${p.id}')" style="cursor: pointer;">
        <td class="font-semibold">${p.id}</td>
        <td>
          <div>${p.siteId}</div>
          <div class="text-xs text-muted">${p.site}</div>
        </td>
        <td class="${this.getStatusClass(p.dqi, 90, 70)}">${p.dqi}%</td>
        <td>${p.missingVisits > 0 ? `<span class="badge badge-warning">${p.missingVisits}</span>` : '<span class="text-muted">0</span>'}</td>
        <td>${p.openQueries > 0 ? `<span class="badge badge-warning">${p.openQueries}</span>` : '<span class="text-muted">0</span>'}</td>
        <td>${p.labIssues > 0 ? `<span class="badge badge-warning">${p.labIssues}</span>` : '<span class="text-muted">0</span>'}</td>
        <td>
          ${p.saeStatus === 'open'
        ? `<span class="badge badge-danger">🚨 OPEN (${p.saeCount})</span>`
        : '<span class="badge badge-success">Closed</span>'}
        </td>
        <td>
          ${p.isClean
        ? '<span class="badge badge-success">✅ Clean</span>'
        : '<span class="badge badge-danger">❌ Flagged</span>'}
        </td>
      </tr>
    `).join('');
  }

  // ============================================
  // BOTTLENECK ANALYSIS
  // ============================================
  renderBottleneckAnalysis() {
    const bn = this.data.bottlenecks;

    // Lab & Coding
    document.getElementById('labRangesCount').textContent = bn.lab.missingRanges;
    document.getElementById('uncodedCount').textContent = bn.coding.uncoded;
    document.getElementById('edrrCount').textContent = bn.lab.unreconciled;

    const labProgress = 100 - (bn.lab.missingRanges / 50 * 100);
    document.getElementById('labProgress').style.width = `${labProgress}%`;

    const codingProgress = (bn.coding.coded / bn.coding.totalTerms * 100);
    document.getElementById('codingProgress').style.width = `${codingProgress}%`;

    // SDV & Signatures
    document.getElementById('sdvPending').textContent = bn.sdv.pending;
    document.getElementById('sdvProgress').style.width = `${bn.sdv.verificationRate}%`;
    document.getElementById('sdvRate').textContent = `${bn.sdv.verificationRate}%`;

    document.getElementById('sigPending').textContent = `${bn.signatures.pending} pending`;
    document.getElementById('sigOverdue').textContent = `${bn.signatures.overdue} overdue`;
  }

  // ============================================
  // SAFETY & READINESS
  // ============================================
  renderSafetyReadiness() {
    // Readiness Checklist
    const checklist = document.getElementById('readinessChecklist');
    checklist.innerHTML = this.data.readinessCriteria.map(criteria => `
      <div class="readiness-item">
        <div class="readiness-icon ${criteria.status}">
          ${criteria.status === 'pass' ? '✓' : '✗'}
        </div>
        <span class="readiness-label">${criteria.label}</span>
        <span class="readiness-value">${criteria.threshold}</span>
        <span class="badge ${criteria.status === 'pass' ? 'badge-success' : 'badge-danger'}">
          ${criteria.current}
        </span>
      </div>
    `).join('');

    // SAE Table
    const blockingSAEs = this.data.saes.filter(s => s.blocking);
    document.getElementById('blockingSAECount').textContent = `${blockingSAEs.length} blocking`;

    const saeBody = document.getElementById('saeTableBody');
    saeBody.innerHTML = this.data.saes.map(sae => `
      <tr class="${sae.blocking ? 'priority-high' : ''}">
        <td class="font-semibold">${sae.id}</td>
        <td>
          <div>${sae.siteId}</div>
          <div class="text-xs text-muted">${sae.site}</div>
        </td>
        <td>${sae.event}</td>
        <td class="${sae.daysOpen > 30 ? 'text-danger font-semibold' : sae.daysOpen > 14 ? 'text-warning' : ''}">
          ${sae.daysOpen} days
        </td>
        <td>
          ${sae.blocking
        ? '<span class="badge badge-danger">🚫 Blocking</span>'
        : '<span class="badge badge-warning">Open</span>'}
        </td>
      </tr>
    `).join('');
  }

  // ============================================
  // AI INSIGHTS
  // ============================================
  renderAIInsights() {
    const container = document.getElementById('insightsGrid');
    container.innerHTML = this.data.aiInsights.map(insight => `
      <div class="ai-insight-panel">
        <div class="ai-insight-header">
          <span class="ai-badge">
            <span>🤖</span>
            <span>AI Insight</span>
          </span>
          <span class="badge ${this.getPriorityBadgeClass(insight.priority)}">${insight.priority}</span>
        </div>
        <div class="font-semibold mb-sm" style="display: flex; align-items: center; gap: 0.5rem;">
          <span>${insight.icon}</span>
          <span>${insight.title}</span>
        </div>
        <div class="ai-insight-content">
          ${insight.summary}
        </div>
        <div class="mt-md text-xs text-muted" style="margin-top: 1rem;">
          Generated: ${new Date(insight.generatedAt).toLocaleString()}
        </div>
      </div>
    `).join('');
  }

  getPriorityBadgeClass(priority) {
    switch (priority) {
      case 'critical': return 'badge-danger';
      case 'high': return 'badge-warning';
      default: return 'badge-neutral';
    }
  }

  // ============================================
  // AGENTIC RECOMMENDATIONS
  // ============================================
  renderRecommendations(role = 'all') {
    const container = document.getElementById('recommendationsGrid');
    let recommendations = this.data.agentRecommendations;

    if (role !== 'all') {
      recommendations = recommendations.filter(r => r.role === role);
    }

    container.innerHTML = recommendations.map(rec => `
      <div class="action-card">
        <div class="action-priority ${rec.priority.toLowerCase()}">
          ${rec.priority === 'CRITICAL' ? '!' : rec.priority === 'HIGH' ? '!!' : '•'}
        </div>
        <div class="action-content">
          <div class="action-title">${rec.action}</div>
          <div class="action-description">
            <strong>Target:</strong> ${rec.target}
          </div>
          <div class="action-description">
            <strong>Rationale:</strong> ${rec.rationale}
          </div>
          <div class="action-meta">
            <span class="action-role">${rec.role}</span>
            <span>Due: ${rec.deadline}</span>
            <span class="text-success">${rec.estimatedImpact}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ============================================
  // DRILL-DOWN PANELS
  // ============================================
  showSiteDetails(siteId) {
    const site = [...this.data.topSites, ...this.data.bottomSites].find(s => s.id === siteId);
    if (!site) return;

    const panel = document.getElementById('drillDownPanel');
    document.getElementById('drillDownTitle').textContent = `Site: ${site.id}`;
    document.getElementById('drillDownContent').innerHTML = `
      <div class="mb-lg">
        <h4 class="mb-sm">${site.name}</h4>
        <div class="badge ${site.dqi >= 90 ? 'badge-success' : site.dqi >= 75 ? 'badge-warning' : 'badge-danger'}">
          DQI: ${site.dqi}%
        </div>
      </div>
      
      <div class="card mb-md">
        <div class="card-header"><span class="card-title">Key Metrics</span></div>
        <div class="card-body">
          <div class="flex justify-between mb-sm">
            <span>Patients</span>
            <span class="font-semibold">${site.patients}</span>
          </div>
          <div class="flex justify-between mb-sm">
            <span>Clean %</span>
            <span class="font-semibold">${site.cleanPercent}%</span>
          </div>
          <div class="flex justify-between">
            <span>Open Queries</span>
            <span class="font-semibold">${site.openQueries}</span>
          </div>
        </div>
      </div>
      
      <div class="flex gap-sm">
        <button class="btn btn-primary">Schedule Visit</button>
        <button class="btn btn-secondary">View Patients</button>
      </div>
    `;

    panel.classList.add('active');
  }

  showPatientDetails(patientId) {
    const patient = this.data.patients.find(p => p.id === patientId);
    if (!patient) return;

    const panel = document.getElementById('drillDownPanel');
    document.getElementById('drillDownTitle').textContent = `Patient: ${patient.id}`;
    document.getElementById('drillDownContent').innerHTML = `
      <div class="mb-lg">
        <div class="text-muted mb-sm">Site: ${patient.site}</div>
        <div class="badge ${patient.isClean ? 'badge-success' : 'badge-danger'}">
          ${patient.isClean ? '✅ Clean' : '❌ Flagged'}
        </div>
      </div>
      
      <div class="card mb-md">
        <div class="card-header"><span class="card-title">Patient DQI</span></div>
        <div class="card-body text-center">
          <div class="kpi-value ${this.getStatusClass(patient.dqi, 90, 70)}" style="font-size: 2.5rem;">
            ${patient.dqi}%
          </div>
        </div>
      </div>
      
      <div class="card mb-md">
        <div class="card-header"><span class="card-title">Issues</span></div>
        <div class="card-body">
          <div class="flex justify-between mb-sm">
            <span>Missing Visits</span>
            <span class="badge ${patient.missingVisits > 0 ? 'badge-warning' : 'badge-success'}">${patient.missingVisits}</span>
          </div>
          <div class="flex justify-between mb-sm">
            <span>Missing Pages</span>
            <span class="badge ${patient.missingPages > 0 ? 'badge-warning' : 'badge-success'}">${patient.missingPages}</span>
          </div>
          <div class="flex justify-between mb-sm">
            <span>Open Queries</span>
            <span class="badge ${patient.openQueries > 0 ? 'badge-warning' : 'badge-success'}">${patient.openQueries}</span>
          </div>
          <div class="flex justify-between mb-sm">
            <span>Lab Issues</span>
            <span class="badge ${patient.labIssues > 0 ? 'badge-warning' : 'badge-success'}">${patient.labIssues}</span>
          </div>
          <div class="flex justify-between">
            <span>SAE Status</span>
            <span class="badge ${patient.saeStatus === 'open' ? 'badge-danger' : 'badge-success'}">
              ${patient.saeStatus === 'open' ? '🚨 OPEN' : 'Closed'}
            </span>
          </div>
        </div>
      </div>
      
      <div class="text-xs text-muted">
        Last Activity: ${patient.lastActivity}
      </div>
    `;

    panel.classList.add('active');
  }

  showRegionDetails(regionId) {
    const region = this.data.regions.find(r => r.id === regionId);
    if (!region) return;

    const panel = document.getElementById('drillDownPanel');
    document.getElementById('drillDownTitle').textContent = `Region: ${region.name}`;

    const totalPatients = region.countries.reduce((sum, c) => sum + c.patients, 0);
    const totalSites = region.countries.reduce((sum, c) => sum + c.sites, 0);
    const avgDQI = (region.countries.reduce((sum, c) => sum + c.dqi, 0) / region.countries.length).toFixed(1);

    document.getElementById('drillDownContent').innerHTML = `
      <div class="card mb-md">
        <div class="card-header"><span class="card-title">Summary</span></div>
        <div class="card-body">
          <div class="flex justify-between mb-sm">
            <span>Countries</span>
            <span class="font-semibold">${region.countries.length}</span>
          </div>
          <div class="flex justify-between mb-sm">
            <span>Sites</span>
            <span class="font-semibold">${totalSites}</span>
          </div>
          <div class="flex justify-between mb-sm">
            <span>Patients</span>
            <span class="font-semibold">${totalPatients}</span>
          </div>
          <div class="flex justify-between">
            <span>Avg DQI</span>
            <span class="font-semibold ${this.getStatusClass(avgDQI, 90, 80)}">${avgDQI}%</span>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header"><span class="card-title">Countries</span></div>
        <div class="card-body">
          ${region.countries.map(c => `
            <div class="flex justify-between items-center mb-sm" style="padding: 0.5rem; background: rgba(0,0,0,0.2); border-radius: 0.5rem;">
              <div>
                <div class="font-semibold">${c.name}</div>
                <div class="text-xs text-muted">${c.sites} sites • ${c.patients} patients</div>
              </div>
              <div class="badge ${this.getStatusClass(c.dqi, 90, 80) === 'text-success' ? 'badge-success' : this.getStatusClass(c.dqi, 90, 80) === 'text-warning' ? 'badge-warning' : 'badge-danger'}">
                ${c.dqi}%
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    panel.classList.add('active');
  }

  // ============================================
  // EVENT BINDINGS
  // ============================================
  bindEvents() {
    // Role filter tabs for recommendations
    document.querySelectorAll('#agenticRecommendations .tabs .tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('#agenticRecommendations .tabs .tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.renderRecommendations(e.target.dataset.role);
      });
    });

    // Header tabs
    document.querySelectorAll('.header-controls .tabs .tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.header-controls .tabs .tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        // Could implement view switching here
      });
    });
  }
}

// Close drill-down panel
function closeDrillDown() {
  document.getElementById('drillDownPanel').classList.remove('active');
}

// Close panel on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDrillDown();
  }
});

// Initialize dashboard
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
  dashboard = new ClinicalDashboard();
});
