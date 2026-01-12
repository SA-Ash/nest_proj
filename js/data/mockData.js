// ============================================
// MOCK DATA - Clinical Trial Dashboard
// Based on actual data structure from study files
// ============================================

const MockData = {
  // Last updated timestamp
  lastUpdated: new Date().toISOString(),
  previousSnapshotDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),

  // --------------------------------------------
  // STUDY OVERVIEW
  // --------------------------------------------
  study: {
    id: 'STUDY-2025-001',
    name: 'Phase III Cardiovascular Outcomes Trial',
    phase: 'Phase III',
    sponsor: 'Global Pharma Inc.',
    totalPatients: 2847,
    activeSites: 156,
    countries: 24,
    regions: 5
  },

  // --------------------------------------------
  // EXECUTIVE KPIs
  // --------------------------------------------
  executiveKPIs: {
    dqi: {
      current: 87.3,
      previous: 84.1,
      target: 95,
      trend: 'up'
    },
    cleanPatients: {
      current: 2156,
      total: 2847,
      percentage: 75.7,
      previousPercentage: 72.3,
      trend: 'up'
    },
    sitesAtRisk: {
      current: 12,
      previous: 15,
      trend: 'down'
    },
    openSAEs: {
      current: 8,
      critical: 3,
      previous: 11,
      trend: 'down'
    },
    readinessStatus: 'at-risk', // 'ready', 'at-risk', 'not-ready'
    queryResolution: {
      current: 94.2,
      target: 98,
      trend: 'up'
    }
  },

  // --------------------------------------------
  // READINESS CRITERIA
  // --------------------------------------------
  readinessCriteria: [
    { id: 'sae', label: 'Open SAEs', threshold: '= 0', current: 8, status: 'fail' },
    { id: 'clean', label: 'Clean Patient %', threshold: '≥ 95%', current: '75.7%', status: 'fail' },
    { id: 'lab', label: 'Critical Lab Blockers', threshold: '= 0', current: 3, status: 'fail' },
    { id: 'coding', label: 'Uncoded Terms', threshold: '= 0', current: 12, status: 'fail' },
    { id: 'signature', label: 'Pending PI Signatures', threshold: '= 0', current: 7, status: 'fail' },
    { id: 'query', label: 'Query Resolution %', threshold: '≥ 98%', current: '94.2%', status: 'fail' }
  ],

  // --------------------------------------------
  // GEOGRAPHICAL DATA
  // --------------------------------------------
  regions: [
    {
      id: 'na',
      name: 'North America',
      countries: [
        {
          id: 'usa',
          name: 'United States',
          sites: 42,
          patients: 856,
          dqi: 91.2,
          cleanPercent: 82.4,
          openSAE: 2,
          status: 'healthy'
        },
        {
          id: 'can',
          name: 'Canada',
          sites: 12,
          patients: 245,
          dqi: 88.7,
          cleanPercent: 78.9,
          openSAE: 1,
          status: 'healthy'
        }
      ]
    },
    {
      id: 'eu',
      name: 'Europe',
      countries: [
        {
          id: 'deu',
          name: 'Germany',
          sites: 18,
          patients: 312,
          dqi: 89.4,
          cleanPercent: 80.1,
          openSAE: 1,
          status: 'healthy'
        },
        {
          id: 'fra',
          name: 'France',
          sites: 14,
          patients: 267,
          dqi: 85.2,
          cleanPercent: 74.5,
          openSAE: 0,
          status: 'at-risk'
        },
        {
          id: 'gbr',
          name: 'United Kingdom',
          sites: 11,
          patients: 198,
          dqi: 92.1,
          cleanPercent: 84.2,
          openSAE: 0,
          status: 'healthy'
        }
      ]
    },
    {
      id: 'apac',
      name: 'Asia Pacific',
      countries: [
        {
          id: 'jpn',
          name: 'Japan',
          sites: 15,
          patients: 289,
          dqi: 94.5,
          cleanPercent: 88.1,
          openSAE: 1,
          status: 'healthy'
        },
        {
          id: 'chn',
          name: 'China',
          sites: 22,
          patients: 398,
          dqi: 72.3,
          cleanPercent: 61.4,
          openSAE: 2,
          status: 'critical'
        },
        {
          id: 'ind',
          name: 'India',
          sites: 12,
          patients: 187,
          dqi: 79.8,
          cleanPercent: 68.2,
          openSAE: 1,
          status: 'at-risk'
        }
      ]
    },
    {
      id: 'latam',
      name: 'Latin America',
      countries: [
        {
          id: 'bra',
          name: 'Brazil',
          sites: 8,
          patients: 145,
          dqi: 81.2,
          cleanPercent: 71.0,
          openSAE: 0,
          status: 'at-risk'
        }
      ]
    }
  ],

  // --------------------------------------------
  // SITE RANKINGS
  // --------------------------------------------
  topSites: [
    { id: 'JPN-008', name: 'Tokyo General Hospital', dqi: 98.2, cleanPercent: 94.5, patients: 45, openQueries: 2 },
    { id: 'GBR-003', name: 'London Royal Medical', dqi: 96.8, cleanPercent: 92.1, patients: 38, openQueries: 4 },
    { id: 'USA-015', name: 'Boston Medical Center', dqi: 95.4, cleanPercent: 91.8, patients: 52, openQueries: 6 },
    { id: 'DEU-007', name: 'Berlin University Clinic', dqi: 94.9, cleanPercent: 90.2, patients: 41, openQueries: 5 },
    { id: 'CAN-002', name: 'Toronto General', dqi: 94.1, cleanPercent: 89.5, patients: 35, openQueries: 7 }
  ],

  bottomSites: [
    { id: 'CHN-003', name: 'Shanghai Regional', dqi: 62.4, cleanPercent: 48.2, patients: 34, openQueries: 47, status: 'critical' },
    { id: 'CHN-008', name: 'Beijing Central', dqi: 65.1, cleanPercent: 52.3, patients: 29, openQueries: 38, status: 'critical' },
    { id: 'IND-005', name: 'Mumbai Medical', dqi: 68.9, cleanPercent: 55.7, patients: 22, openQueries: 31, status: 'at-risk' },
    { id: 'BRA-002', name: 'São Paulo Clinic', dqi: 71.2, cleanPercent: 58.4, patients: 28, openQueries: 28, status: 'at-risk' },
    { id: 'FRA-009', name: 'Lyon Hospital', dqi: 73.5, cleanPercent: 61.9, patients: 31, openQueries: 25, status: 'at-risk' }
  ],

  // --------------------------------------------
  // PATIENT DATA (Sample)
  // --------------------------------------------
  patients: [
    {
      id: 'PAT-0001',
      siteId: 'CHN-003',
      site: 'Shanghai Regional',
      status: 'flagged',
      dqi: 45.2,
      isClean: false,
      missingVisits: 3,
      missingPages: 5,
      openQueries: 8,
      labIssues: 2,
      saeStatus: 'open',
      saeCount: 1,
      lastActivity: '2025-11-08'
    },
    {
      id: 'PAT-0002',
      siteId: 'CHN-003',
      site: 'Shanghai Regional',
      status: 'flagged',
      dqi: 52.1,
      isClean: false,
      missingVisits: 2,
      missingPages: 4,
      openQueries: 6,
      labIssues: 1,
      saeStatus: 'open',
      saeCount: 1,
      lastActivity: '2025-11-10'
    },
    {
      id: 'PAT-0015',
      siteId: 'USA-012',
      site: 'Chicago Medical',
      status: 'flagged',
      dqi: 68.4,
      isClean: false,
      missingVisits: 1,
      missingPages: 2,
      openQueries: 3,
      labIssues: 0,
      saeStatus: 'open',
      saeCount: 1,
      lastActivity: '2025-11-12'
    },
    {
      id: 'PAT-0089',
      siteId: 'JPN-008',
      site: 'Tokyo General Hospital',
      status: 'clean',
      dqi: 98.5,
      isClean: true,
      missingVisits: 0,
      missingPages: 0,
      openQueries: 0,
      labIssues: 0,
      saeStatus: 'closed',
      saeCount: 0,
      lastActivity: '2025-11-14'
    },
    {
      id: 'PAT-0156',
      siteId: 'DEU-005',
      site: 'Munich University',
      status: 'flagged',
      dqi: 71.2,
      isClean: false,
      missingVisits: 0,
      missingPages: 1,
      openQueries: 2,
      labIssues: 1,
      saeStatus: 'open',
      saeCount: 1,
      lastActivity: '2025-11-11'
    }
  ],

  // --------------------------------------------
  // OPERATIONAL BOTTLENECKS
  // --------------------------------------------
  bottlenecks: {
    queries: {
      total: 1847,
      open: 342,
      closed: 1505,
      resolutionRate: 81.5,
      aging: {
        '0-7 days': 124,
        '8-14 days': 98,
        '15-30 days': 72,
        '>30 days': 48
      }
    },
    visits: {
      total: 8934,
      completed: 8156,
      overdue: 234,
      upcoming: 544,
      overdueByDays: {
        '1-7 days': 89,
        '8-14 days': 67,
        '15-30 days': 45,
        '>30 days': 33
      }
    },
    lab: {
      missingRanges: 23,
      missingLabNames: 8,
      unreconciled: 15
    },
    coding: {
      totalTerms: 4521,
      coded: 4509,
      uncoded: 12,
      meddraIssues: 7,
      whoddIssues: 5
    },
    sdv: {
      totalForms: 12456,
      verified: 11234,
      pending: 1222,
      verificationRate: 90.2
    },
    signatures: {
      required: 156,
      completed: 149,
      pending: 7,
      overdue: 4
    }
  },

  // --------------------------------------------
  // SAE DATA
  // --------------------------------------------
  saes: [
    {
      id: 'SAE-0042',
      patientId: 'PAT-0001',
      siteId: 'CHN-003',
      site: 'Shanghai Regional',
      event: 'Acute Myocardial Infarction',
      severity: 'Serious',
      status: 'Open',
      daysOpen: 34,
      reportedDate: '2025-10-05',
      blocking: true
    },
    {
      id: 'SAE-0045',
      patientId: 'PAT-0002',
      siteId: 'CHN-003',
      site: 'Shanghai Regional',
      event: 'Cerebrovascular Accident',
      severity: 'Serious',
      status: 'Open',
      daysOpen: 28,
      reportedDate: '2025-10-11',
      blocking: true
    },
    {
      id: 'SAE-0051',
      patientId: 'PAT-0015',
      siteId: 'USA-012',
      site: 'Chicago Medical',
      event: 'Severe Hypoglycemia',
      severity: 'Serious',
      status: 'Open',
      daysOpen: 15,
      reportedDate: '2025-10-24',
      blocking: true
    },
    {
      id: 'SAE-0053',
      patientId: 'PAT-0156',
      siteId: 'DEU-005',
      site: 'Munich University',
      event: 'Ventricular Arrhythmia',
      severity: 'Serious',
      status: 'Open',
      daysOpen: 12,
      reportedDate: '2025-10-27',
      blocking: false
    }
  ],

  // --------------------------------------------
  // AI INSIGHTS
  // --------------------------------------------
  aiInsights: [
    {
      id: 1,
      type: 'risk',
      icon: '⚠️',
      title: 'Site Performance Alert',
      summary: `<strong>Site CHN-003 (Shanghai Regional)</strong> shows a 15% decline in DQI over the past 2 weeks, 
                primarily driven by 47 unresolved queries and 2 open SAEs blocking database lock. 
                Query aging exceeds 30 days for 12 items. <strong>Immediate CRA intervention recommended.</strong>`,
      priority: 'critical',
      affectedSites: ['CHN-003'],
      generatedAt: new Date().toISOString()
    },
    {
      id: 2,
      type: 'blocker',
      icon: '🚫',
      title: 'Submission Readiness Blocker',
      summary: `<strong>8 patients have open SAEs</strong> blocking database lock across 4 sites: CHN-003 (2), USA-012 (1), 
                DEU-005 (1), and 4 others. SAE-0042 has been open for 34 days. 
                <strong>Safety team escalation required before interim analysis can proceed.</strong>`,
      priority: 'critical',
      affectedSites: ['CHN-003', 'USA-012', 'DEU-005'],
      generatedAt: new Date().toISOString()
    },
    {
      id: 3,
      type: 'trend',
      icon: '📈',
      title: 'Positive Trend - North America',
      summary: `<strong>North America region</strong> shows consistent improvement with DQI increasing from 87.2% to 91.2% 
                over the past month. Query resolution rate improved by 5.3%. 
                <strong>USA-015 (Boston Medical Center) is now the top-performing US site.</strong>`,
      priority: 'info',
      affectedSites: ['USA-015'],
      generatedAt: new Date().toISOString()
    },
    {
      id: 4,
      type: 'action',
      icon: '🔬',
      title: 'Lab Data Quality Gap',
      summary: `<strong>23 missing lab reference ranges</strong> identified across 8 sites, primarily affecting hematology 
                and chemistry panels. Sites in India and Brazil require reference range documentation. 
                <strong>DQT review required within 48 hours.</strong>`,
      priority: 'high',
      affectedSites: ['IND-005', 'BRA-002'],
      generatedAt: new Date().toISOString()
    }
  ],

  // --------------------------------------------
  // AGENTIC AI RECOMMENDATIONS
  // --------------------------------------------
  agentRecommendations: [
    {
      id: 1,
      role: 'CRA',
      priority: 'CRITICAL',
      action: 'Urgent Site Visit Required',
      target: 'CHN-003 (Shanghai Regional)',
      rationale: '47 queries aging >14 days, 2 open SAEs, DQI dropped 15% in 2 weeks',
      deadline: '2025-11-18',
      estimatedImpact: 'DQI +12% if resolved'
    },
    {
      id: 2,
      role: 'Safety',
      priority: 'CRITICAL',
      action: 'Expedite SAE Review',
      target: 'SAE-0042, SAE-0045',
      rationale: 'Open >30 days, blocking database lock for interim analysis',
      deadline: '2025-11-15',
      estimatedImpact: 'Unblocks 2 patients for submission'
    },
    {
      id: 3,
      role: 'DQT',
      priority: 'HIGH',
      action: 'Resolve Lab Reference Ranges',
      target: '23 missing ranges across 8 sites',
      rationale: 'Blocking automated range checks, creating manual verification burden',
      deadline: '2025-11-20',
      estimatedImpact: 'Clean Patient % +3.2%'
    },
    {
      id: 4,
      role: 'Site',
      priority: 'HIGH',
      action: 'Complete PI Signatures',
      target: '7 pending signatures (4 overdue)',
      rationale: 'SLA breach imminent for 4 forms, regulatory compliance risk',
      deadline: '2025-11-16',
      estimatedImpact: 'Avoid audit finding'
    },
    {
      id: 5,
      role: 'CRA',
      priority: 'MEDIUM',
      action: 'Follow-up Call',
      target: 'FRA-009 (Lyon Hospital)',
      rationale: '25 open queries, visit compliance at 78%, needs support',
      deadline: '2025-11-22',
      estimatedImpact: 'DQI +5%'
    },
    {
      id: 6,
      role: 'DQT',
      priority: 'MEDIUM',
      action: 'Complete Medical Coding',
      target: '12 uncoded terms (7 MedDRA, 5 WHO-DD)',
      rationale: 'Required for database lock, currently blocking 3 sites',
      deadline: '2025-11-19',
      estimatedImpact: 'Removes coding blockers'
    }
  ],

  // --------------------------------------------
  // TREND DATA (for charts)
  // --------------------------------------------
  trends: {
    dqi: [
      { date: '2025-10-01', value: 78.2 },
      { date: '2025-10-08', value: 79.5 },
      { date: '2025-10-15', value: 81.3 },
      { date: '2025-10-22', value: 82.8 },
      { date: '2025-10-29', value: 84.1 },
      { date: '2025-11-05', value: 85.6 },
      { date: '2025-11-12', value: 87.3 }
    ],
    cleanPatients: [
      { date: '2025-10-01', value: 68.4 },
      { date: '2025-10-08', value: 69.8 },
      { date: '2025-10-15', value: 70.9 },
      { date: '2025-10-22', value: 71.5 },
      { date: '2025-10-29', value: 72.3 },
      { date: '2025-11-05', value: 74.1 },
      { date: '2025-11-12', value: 75.7 }
    ],
    openQueries: [
      { date: '2025-10-01', value: 512 },
      { date: '2025-10-08', value: 478 },
      { date: '2025-10-15', value: 445 },
      { date: '2025-10-22', value: 421 },
      { date: '2025-10-29', value: 398 },
      { date: '2025-11-05', value: 367 },
      { date: '2025-11-12', value: 342 }
    ]
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MockData;
}
