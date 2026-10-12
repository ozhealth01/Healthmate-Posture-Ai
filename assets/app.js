// Healthmate demo app.
// Everything here is sample data held in the browser tab. No real analysis runs,
// nothing is sent anywhere, and role checks are for demonstration only: a real
// build must enforce permissions on the server.
(function () {
  'use strict';

  var KEY = 'healthmate-demo';
  var root = document.getElementById('app');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmt(iso) {
    var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var p = iso.split('-');
    return Number(p[2]) + ' ' + m[Number(p[1]) - 1] + ' ' + p[0];
  }
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  // ---------- Roles ----------
  var ROLES = {
    clinician: {
      name: 'Mei Tan', title: 'Physiotherapist', org: 'clinic',
      nav: [['dashboard', 'Dashboard'], ['patients', 'Patients'], ['assess', 'New assessment'], ['reports', 'Reports'],
            ['progress', 'Progress'], ['exercises', 'Exercise guidance'], ['products', 'Products'], ['analytics', 'Analytics'],
            ['settings', 'Settings'], ['help', 'Help']],
      also: ['patient', 'assessment', 'report']
    },
    patient: {
      name: 'Daniel Lim', title: 'Patient', org: 'clinic', patientId: 'p2',
      nav: [['dashboard', 'Home'], ['reports', 'My reports'], ['progress', 'My progress'], ['exercises', 'My guidance'],
            ['permissions', 'Permissions'], ['help', 'Help']],
      also: ['report']
    },
    retail: {
      name: 'Sam Ortega', title: 'Retail operator', orgName: 'Greenleaf Pharmacy',
      nav: [['dashboard', 'Home'], ['screening', 'Quick screening'], ['products', 'Products'], ['help', 'Help']],
      also: []
    },
    owner: {
      name: 'Rachel Wong', title: 'Organisation owner', org: 'clinic',
      nav: [['dashboard', 'Dashboard'], ['organization', 'Team and branding'], ['billing', 'Billing and usage'],
            ['analytics', 'Analytics'], ['settings', 'Settings'], ['help', 'Help']],
      also: []
    },
    trimax: {
      name: 'Jordan Lee', title: 'TRIMAX admin', orgName: 'TRIMAX Healthcare',
      nav: [['dashboard', 'Dashboard'], ['partners', 'Partner accounts'], ['analytics', 'Aggregate analytics'],
            ['audit', 'Audit log'], ['help', 'Help']],
      also: []
    }
  };

  // ---------- Sample data ----------
  var TEMPLATES = {
    posture: {
      label: 'Full-body posture',
      observations: [
        { area: 'Head and neck', basis: 'Estimated', confidence: 'Moderate', text: 'Head appears positioned forward of the shoulder line in the lateral view.' },
        { area: 'Shoulders', basis: 'Observed', confidence: 'Higher', text: 'Right shoulder appears lower than the left in the anterior view.' },
        { area: 'Pelvis', basis: 'Observed', confidence: 'Higher', text: 'Pelvis appears level in the anterior view.' },
        { area: 'Knees', basis: 'Observed', confidence: 'Moderate', text: 'No clear asymmetry observed at the knees.' }
      ],
      limitations: ['Loose clothing reduced landmark visibility at the hips.', 'Single standing capture. Posture varies through the day.']
    },
    lowerlimb: {
      label: 'Foot and lower limb',
      observations: [
        { area: 'Arch', basis: 'Estimated', confidence: 'Moderate', text: 'Left arch appears lower than the right when standing.' },
        { area: 'Heel', basis: 'Estimated', confidence: 'Lower', text: 'Left heel appears to angle outward in the posterior view.' },
        { area: 'Knees', basis: 'Observed', confidence: 'Moderate', text: 'Knees appear to track slightly inward in the anterior view.' },
        { area: 'Forefoot', basis: 'Observed', confidence: 'Moderate', text: 'No bunion-related indicators observed in this capture.' }
      ],
      limitations: ['Foot observations are from images only. No pressure or scan data was used.', 'Standing capture only. Walking was not assessed.']
    }
  };

  function copyObs(type) {
    return TEMPLATES[type].observations.map(function (o) { return { area: o.area, basis: o.basis, confidence: o.confidence, text: o.text }; });
  }

  function seed() {
    var a1 = copyObs('posture');
    a1[1].text = 'Right shoulder appears noticeably lower than the left in the anterior view.';
    var a2 = copyObs('posture');
    a2[0].text = 'Head appears slightly forward of the shoulder line in the lateral view.';
    a2[1].text = 'Shoulders appear closer to level than at the previous assessment.';
    return {
      role: null,
      clinicName: 'Harbour Physio',
      patients: [
        { id: 'p1', name: 'Aisha Rahman', born: 1988, consent: true },
        { id: 'p2', name: 'Daniel Lim', born: 1975, consent: true },
        { id: 'p3', name: 'Priya Nair', born: 1994, consent: true },
        { id: 'p4', name: 'Tom Fletcher', born: 1962, consent: false }
      ],
      assessments: [
        { id: 'a1', patientId: 'p2', type: 'posture', date: '2026-08-04', method: 'Tablet camera', status: 'approved', approvedBy: 'Mei Tan, Physiotherapist', observations: a1, limitations: TEMPLATES.posture.limitations.slice(), notes: 'Reports desk work most of the day. Reviewed in clinic.' },
        { id: 'a2', patientId: 'p2', type: 'posture', date: '2026-10-06', method: 'Tablet camera', status: 'approved', approvedBy: 'Mei Tan, Physiotherapist', observations: a2, limitations: TEMPLATES.posture.limitations.slice(), notes: 'Follow-up after eight weeks of home exercises.' },
        { id: 'a3', patientId: 'p1', type: 'posture', date: '2026-10-09', method: 'Smartphone camera', status: 'draft', observations: copyObs('posture'), limitations: TEMPLATES.posture.limitations.slice(), notes: '' },
        { id: 'a4', patientId: 'p3', type: 'lowerlimb', date: '2026-10-10', method: 'Photo upload', status: 'draft', observations: copyObs('lowerlimb'), limitations: TEMPLATES.lowerlimb.limitations.slice(), notes: '' }
      ],
      plans: { p2: ['e1', 'e2'] },
      permissions: { shareWithClinic: true, productInfo: false },
      team: [
        { name: 'Rachel Wong', role: 'Organisation owner' },
        { name: 'Mei Tan', role: 'Clinician' },
        { name: 'Arjun Patel', role: 'Clinician' },
        { name: 'Lina Chua', role: 'Clinical assistant' },
        { name: 'Ben Hart', role: 'Billing and admin' }
      ],
      screenings: 0,
      audit: [
        { when: '2026-10-10 14:12', who: 'Mei Tan', what: 'Created draft assessment for a patient record' },
        { when: '2026-10-06 10:40', who: 'Mei Tan', what: 'Approved assessment and generated report' },
        { when: '2026-10-01 09:05', who: 'Rachel Wong', what: 'Invited a clinical assistant to the organisation' }
      ]
    };
  }

  var EXERCISES = [
    { id: 'e1', name: 'Chin tucks', area: 'Head and neck', how: 'Seated or standing, draw the chin straight back and hold briefly.' },
    { id: 'e2', name: 'Shoulder blade squeezes', area: 'Shoulders', how: 'Gently draw the shoulder blades together and down, then release.' },
    { id: 'e3', name: 'Hip hinge practice', area: 'Pelvis and hips', how: 'Bend from the hips with a long spine, using a wall for reference.' },
    { id: 'e4', name: 'Calf raises', area: 'Foot and lower limb', how: 'Rise onto the balls of the feet and lower slowly, holding a support.' }
  ];

  var PARTNERS = [
    { name: 'Harbour Physio', type: 'Clinic', status: 'Active', count: 46 },
    { name: 'Northside Medical Centre', type: 'Hospital', status: 'Onboarding', count: 0 },
    { name: 'Greenleaf Pharmacy', type: 'Retail', status: 'Active', count: 112 },
    { name: 'Health expo stand', type: 'Event demo', status: 'Scheduled', count: 0 }
  ];

  // ---------- State ----------
  var db;
  function load() {
    try {
      var raw = sessionStorage.getItem(KEY);
      if (raw) { db = JSON.parse(raw); return; }
    } catch (e) { /* storage unavailable: fall through to fresh sample data */ }
    db = seed();
  }
  function save() {
    try { sessionStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* demo still works for this page view */ }
  }
  function log(what) {
    var d = new Date();
    var when = today() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    db.audit.unshift({ when: when, who: ROLES[db.role].name, what: what });
  }

  var wiz = null;       // new assessment wizard
  var scr = null;       // retail screening
  var sel = { patient: 'p2', view: 'Anterior' };

  function role() { return ROLES[db.role]; }
  function orgName() { var r = role(); return r.orgName || db.clinicName; }
  function patient(id) { return db.patients.filter(function (p) { return p.id === id; })[0]; }
  function assessment(id) { return db.assessments.filter(function (a) { return a.id === id; })[0]; }
  function byPatient(id) { return db.assessments.filter(function (a) { return a.patientId === id; }); }
  function statusTag(a) {
    return a.status === 'approved' ? '<span class="tag tag-approved">Approved</span>' : '<span class="tag tag-review">Draft · needs review</span>';
  }

  // ---------- Shared pieces ----------
  function figure() {
    return '<svg viewBox="0 0 140 280" aria-hidden="true">' +
      '<line x1="70" y1="8" x2="70" y2="272" stroke="#94A3B8" stroke-width="1" stroke-dasharray="3 5" opacity="0.6"/>' +
      '<g fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round"><circle cx="70" cy="30" r="15"/>' +
      '<path d="M70 45 V62 M42 68 H98 M42 68 L34 122 M98 68 L106 122 M70 62 V138 M52 142 H88 M52 142 L50 204 L48 262 M88 142 L90 204 L92 262"/></g>' +
      '<g stroke="#06B6D4" stroke-width="1.5"><line x1="42" y1="68" x2="98" y2="68"/><line x1="52" y1="142" x2="88" y2="142"/><line x1="50" y1="204" x2="90" y2="204"/></g>' +
      '<g fill="#06B6D4"><circle cx="42" cy="68" r="4"/><circle cx="98" cy="68" r="4"/><circle cx="52" cy="142" r="4"/><circle cx="88" cy="142" r="4"/>' +
      '<circle cx="50" cy="204" r="4"/><circle cx="90" cy="204" r="4"/><circle cx="48" cy="262" r="4"/><circle cx="92" cy="262" r="4"/></g></svg>';
  }
  function head(title, sub, right, crumb) {
    return '<div class="page-head"><div>' + (crumb ? '<p class="crumb">' + crumb + '</p>' : '') +
      '<h1>' + esc(title) + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (right ? '<div class="actions no-print">' + right + '</div>' : '') + '</div>';
  }
  function tile(n, k) { return '<div class="tile"><div class="n">' + n + '</div><div class="k">' + esc(k) + '</div></div>'; }
  function patientSelect() {
    return '<label class="small muted" for="psel">Patient</label><br><select class="inp" id="psel" data-change="pick-patient">' +
      db.patients.map(function (p) { return '<option value="' + p.id + '"' + (p.id === sel.patient ? ' selected' : '') + '>' + esc(p.name) + '</option>'; }).join('') + '</select>';
  }
  function assessmentRows(list, showPatient) {
    if (!list.length) return '<p class="empty">Nothing here yet.</p>';
    return '<div class="table-wrap"><table><thead><tr>' + (showPatient ? '<th>Patient</th>' : '') + '<th>Assessment</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody>' +
      list.map(function (a) {
        var link = a.status === 'approved' ? '<a href="#/report/' + a.id + '">View report</a>' : '<a href="#/assessment/' + a.id + '">Review draft</a>';
        return '<tr>' + (showPatient ? '<td>' + esc(patient(a.patientId).name) + '</td>' : '') + '<td>' + TEMPLATES[a.type].label + '</td><td>' + fmt(a.date) + '</td><td>' + statusTag(a) + '</td><td>' + link + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  // ---------- Views ----------
  var views = {};

  views.dashboard = function () {
    var r = db.role;
    if (r === 'clinician') {
      var drafts = db.assessments.filter(function (a) { return a.status === 'draft'; });
      return head('Good to see you, Mei', 'Your clinical queue for ' + esc(db.clinicName) + '.', '<a class="btn btn-primary" href="#/assess">New assessment</a>') +
        '<div class="grid c3">' + tile(drafts.length, 'Drafts awaiting your review') + tile(db.patients.length, 'Patients') +
        tile(db.assessments.length - drafts.length, 'Approved assessments') + '</div>' +
        '<div class="box" style="margin-top:20px"><h2>Awaiting your review</h2>' + assessmentRows(drafts, true) + '</div>';
    }
    if (r === 'patient') {
      var mine = byPatient(role().patientId).filter(function (a) { return a.status === 'approved'; });
      var latest = mine[mine.length - 1];
      return '<div class="plain">' + head('Hello, Daniel', 'Here is what your clinic has shared with you.') +
        '<div class="box"><h2>Your latest report</h2>' + (latest ? '<p>' + TEMPLATES[latest.type].label + ' from ' + fmt(latest.date) + ', reviewed by ' + esc(latest.approvedBy) + '.</p><p style="margin-top:16px"><a class="btn btn-primary" href="#/report/' + latest.id + '">Read your report</a></p>' : '<p class="empty">No reports have been shared with you yet.</p>') + '</div>' +
        '<div class="box"><h2>Your next steps</h2><p>Keep going with the exercises your clinician chose for you. You can find them under <a href="#/exercises">My guidance</a>.</p></div></div>';
    }
    if (r === 'retail') {
      return head('Quick screening', esc(orgName()) + ' · counter mode') +
        '<div class="box big-start"><h2>Ready for the next customer?</h2><p class="muted">A short, educational screening. It does not diagnose.</p><a class="btn btn-primary" href="#/screening">Start a screening</a></div>' +
        '<div class="grid c2" style="margin-top:20px">' + tile(db.screenings, 'Screenings completed this session') + tile('0', 'Identifiable records stored') + '</div>';
    }
    if (r === 'owner') {
      return head(db.clinicName, 'Organisation overview.') +
        '<div class="grid c4">' + tile(db.team.length, 'Team members') + tile(db.patients.length, 'Patients') + tile(db.assessments.length, 'Assessments') + tile('1', 'Location') + '</div>' +
        '<div class="grid c2" style="margin-top:20px"><div class="box"><h2>Team and branding</h2><p>Manage who has access and how your reports look.</p><p style="margin-top:14px"><a class="btn btn-secondary btn-sm" href="#/organization">Open</a></p></div>' +
        '<div class="box"><h2>Billing and usage</h2><p>See your plan and how assessments are being used.</p><p style="margin-top:14px"><a class="btn btn-secondary btn-sm" href="#/billing">Open</a></p></div></div>';
    }
    var active = PARTNERS.filter(function (p) { return p.status === 'Active'; }).length;
    return head('TRIMAX operations', 'Partner accounts and aggregate activity.') +
      '<div class="grid c3">' + tile(PARTNERS.length, 'Partner accounts') + tile(active, 'Active') + tile(PARTNERS.length - active, 'Onboarding or scheduled') + '</div>' +
      '<div class="notice" style="margin-top:20px"><strong>Aggregate view only.</strong> This role does not have access to identifiable patient records. Patient lists, assessments and reports are not available here.</div>';
  };

  views.patients = function () {
    return head('Patients', 'Access-controlled records for ' + esc(db.clinicName) + '.') +
      '<div class="box"><div class="table-wrap"><table><thead><tr><th>Name</th><th>Born</th><th>Consent</th><th>Assessments</th><th></th></tr></thead><tbody>' +
      db.patients.map(function (p) {
        return '<tr><td><a href="#/patient/' + p.id + '">' + esc(p.name) + '</a></td><td>' + p.born + '</td><td>' +
          (p.consent ? '<span class="tag tag-approved">Recorded</span>' : '<span class="tag tag-review">Not recorded</span>') + '</td><td>' + byPatient(p.id).length + '</td><td><a href="#/patient/' + p.id + '">Open</a></td></tr>';
      }).join('') + '</tbody></table></div></div>';
  };

  views.patient = function (id) {
    var p = patient(id);
    if (!p) return notFound();
    return head(p.name, 'Born ' + p.born + ' · Consent ' + (p.consent ? 'recorded' : 'not yet recorded'),
        '<a class="btn btn-primary" href="#/assess" data-action="assess-for" data-id="' + p.id + '">New assessment</a>', '<a href="#/patients">Patients</a> / Record') +
      '<div class="box"><h2>Assessment history</h2>' + assessmentRows(byPatient(p.id), false) + '</div>';
  };

  views.assess = function () {
    if (!wiz) wiz = { step: 1, patientId: null, type: null, method: null };
    var names = ['Patient and consent', 'Assessment type', 'Capture', 'Quality check'];
    var steps = '<ol class="wiz-steps">' + names.map(function (n, i) {
      return '<li class="' + (i + 1 === wiz.step ? 'on' : (i + 1 < wiz.step ? 'done' : '')) + '">' + (i + 1) + ' · ' + n + '</li>';
    }).join('') + '</ol>';
    var body = '';
    if (wiz.step === 1) {
      body = '<h2>Who is this assessment for?</h2><div class="choice" style="margin-top:14px">' + db.patients.map(function (p) {
        return '<label><input type="radio" name="wp" value="' + p.id + '"' + (wiz.patientId === p.id ? ' checked' : '') + '><span><strong>' + esc(p.name) + '</strong><span>Born ' + p.born + ' · consent ' + (p.consent ? 'on record' : 'not yet recorded') + '</span></span></label>';
      }).join('') + '</div><label class="check"><input type="checkbox" id="wconsent"><span>The patient has been told what will be captured and how it will be used, and has given consent for this assessment.</span></label>';
    } else if (wiz.step === 2) {
      body = '<h2>Which assessment?</h2><div class="choice" style="margin-top:14px">' +
        '<label><input type="radio" name="wt" value="posture"' + (wiz.type === 'posture' ? ' checked' : '') + '><span><strong>Full-body posture</strong><span>Anterior, posterior and lateral views</span></span></label>' +
        '<label><input type="radio" name="wt" value="lowerlimb"' + (wiz.type === 'lowerlimb' ? ' checked' : '') + '><span><strong>Foot and lower limb</strong><span>Arch, heel, knee and bunion-related indicators</span></span></label>' +
        '<label class="off"><input type="radio" name="wt" disabled><span><strong>Movement</strong><span>Not available. Subject to validation.</span></span></label>' +
        '<label class="off"><input type="radio" name="wt" disabled><span><strong>Balance</strong><span>Not available. Subject to validation.</span></span></label></div>';
    } else if (wiz.step === 3) {
      body = '<h2>How are you capturing?</h2><div class="choice" style="margin-top:14px">' +
        ['Smartphone camera', 'Tablet camera', 'Laptop or desktop webcam', 'Photo or video upload'].map(function (m) {
          return '<label><input type="radio" name="wm" value="' + m + '"' + (wiz.method === m ? ' checked' : '') + '><span><strong>' + m + '</strong></span></label>';
        }).join('') + '</div><div class="notice warn" style="margin-top:18px"><strong>Demo.</strong> No camera is used and nothing is uploaded. A sample capture stands in for the real one.</div>';
    } else {
      body = '<h2>Capture quality</h2><p class="muted" style="margin:6px 0 16px">Analysis only runs on a capture that passes these checks.</p>' +
        '<ul class="qc"><li>Whole body in frame</li><li>Lighting adequate</li><li>Standing position suitable</li><li>All required views captured</li></ul>' +
        '<div class="notice warn" style="margin-top:18px"><strong>Simulated result.</strong> In the demo every capture passes. A real capture that fails would be sent back for a retake.</div>';
    }
    return head('New assessment', 'Guided capture for ' + esc(db.clinicName) + '.') + steps +
      '<div class="box" style="max-width:720px">' + body + '<p class="err" role="alert" id="werr"></p><div class="actions">' +
      (wiz.step > 1 ? '<button class="btn btn-secondary" data-action="wiz-back">Back</button>' : '') +
      '<button class="btn btn-primary" data-action="wiz-next">' + (wiz.step === 4 ? 'Run analysis' : 'Continue') + '</button></div></div>';
  };

  views.assessment = function (id) {
    var a = assessment(id);
    if (!a) return notFound();
    var p = patient(a.patientId);
    var draft = a.status === 'draft';
    var obs = a.observations.map(function (o, i) {
      return '<div class="ob"><div class="ob-head"><strong>' + esc(o.area) + '</strong><span>' + esc(o.basis) + (o.confidence ? ' · confidence: ' + esc(o.confidence) : '') + '</span></div>' +
        (draft ? '<label class="small muted" for="ob' + i + '">Wording (editable)</label><textarea id="ob' + i + '" data-ob="' + i + '">' + esc(o.text) + '</textarea><button class="rm" data-action="ob-remove" data-i="' + i + '">Remove this observation</button>' : '<p>' + esc(o.text) + '</p>') + '</div>';
    }).join('') || '<p class="empty">No observations.</p>';
    var views3 = ['Anterior', 'Posterior', 'Lateral'].map(function (v) {
      return '<button type="button" data-action="view" data-v="' + v + '" aria-pressed="' + (sel.view === v) + '">' + v + '</button>';
    }).join('');
    return head(TEMPLATES[a.type].label, esc(p.name) + ' · ' + fmt(a.date) + ' · ' + esc(a.method), statusTag(a),
        '<a href="#/patients">Patients</a> / <a href="#/patient/' + p.id + '">' + esc(p.name) + '</a> / Assessment') +
      '<div class="assess"><div class="panel"><div class="panel-bar"><span class="label">AI analysis · ' + sel.view + '</span>' +
        (draft ? '<span class="tag tag-draft">Draft</span>' : '<span class="tag tag-ok">Approved</span>') + '</div>' +
        '<div class="views">' + views3 + '</div><div class="figure">' + figure() + '</div>' +
        '<p class="panel-foot">Sample capture. Overlay is illustrative.<br>Model: demo placeholder, not a real model.</p></div>' +
      '<div class="stack"><div class="box"><h2>' + (draft ? 'AI-assisted draft observations' : 'Approved observations') + '</h2>' +
        (draft ? '<p class="muted small" style="margin-bottom:14px">Compare with your own examination. Edit, remove or add before approving.</p>' : '') + obs +
        (draft ? '<p style="margin-top:14px"><button class="btn btn-secondary btn-sm" data-action="ob-add">Add an observation</button></p>' : '') + '</div>' +
        '<div class="box"><h2>Limitations of this capture</h2><ul class="limits">' + a.limitations.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="box"><h2>Clinician notes</h2>' + (draft ? '<label class="small muted" for="notes">Your notes</label><textarea class="notes" id="notes">' + esc(a.notes) + '</textarea>' : '<p>' + (esc(a.notes) || '<span class="muted">No notes.</span>') + '</p>') + '</div>' +
        '<div class="actions">' + (draft
          ? '<button class="btn btn-secondary" data-action="save-draft" data-id="' + a.id + '">Save draft</button><button class="btn btn-primary" data-action="approve" data-id="' + a.id + '">Approve findings</button><span class="muted small" id="saved" role="status"></span>'
          : '<a class="btn btn-primary" href="#/report/' + a.id + '">View report</a><span class="muted small">Approved by ' + esc(a.approvedBy) + '</span>') + '</div></div></div>';
  };

  views.reports = function () {
    if (db.role === 'patient') {
      var mine = byPatient(role().patientId).filter(function (a) { return a.status === 'approved'; });
      return '<div class="plain">' + head('My reports', 'Reports your clinic has approved and shared with you.') + '<div class="box">' + assessmentRows(mine, false) + '</div></div>';
    }
    var approved = db.assessments.filter(function (a) { return a.status === 'approved'; });
    var drafts = db.assessments.filter(function (a) { return a.status === 'draft'; });
    return head('Reports', 'A report can be generated once a clinician has approved the findings.') +
      '<div class="box"><h2>Approved reports</h2>' + assessmentRows(approved, true) + '</div>' +
      '<div class="box"><h2>Drafts not yet reportable</h2>' + assessmentRows(drafts, true) + '</div>';
  };

  views.report = function (id) {
    var a = assessment(id);
    if (!a) return notFound();
    if (db.role === 'patient' && a.patientId !== role().patientId) return denied();
    if (a.status !== 'approved') {
      return head('Report not available', 'This assessment is still a draft. A clinician must approve the findings before a report can be shared.',
        db.role === 'clinician' ? '<a class="btn btn-primary" href="#/assessment/' + a.id + '">Review draft</a>' : '');
    }
    var p = patient(a.patientId);
    var plan = (db.plans[p.id] || []).map(function (eid) { return EXERCISES.filter(function (e) { return e.id === eid; })[0]; });
    // Embedded viewers block the print dialog, so only offer it when the site is opened directly.
    var printBtn = window.self === window.top ? '<button class="btn btn-secondary" data-action="print">Print or save as PDF</button>' : '';
    return head('Report', '', printBtn, '<a href="#/reports">Reports</a> / ' + esc(p.name)) +
      '<div class="sheet"><div class="sheet-head"><div><div class="clinic">' + esc(db.clinicName) + '</div><div class="muted small">' + TEMPLATES[a.type].label + ' report</div></div>' +
      '<div><span class="tag tag-approved">Approved</span></div></div>' +
      '<dl><dt>Patient</dt><dd>' + esc(p.name) + '</dd><dt>Assessment date</dt><dd>' + fmt(a.date) + '</dd><dt>Capture method</dt><dd>' + esc(a.method) + '</dd><dt>Reviewed and approved by</dt><dd>' + esc(a.approvedBy) + '</dd></dl>' +
      '<h2>What was observed</h2>' + a.observations.map(function (o) { return '<div class="find"><strong>' + esc(o.area) + '</strong>' + esc(o.text) + ' <span class="muted small">(' + esc(o.basis.toLowerCase()) + ')</span></div>'; }).join('') +
      (a.notes ? '<h2>Your clinician\'s notes</h2><p>' + esc(a.notes) + '</p>' : '') +
      '<h2>Things to keep in mind</h2><ul class="limits">' + a.limitations.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' +
      (plan.length ? '<h2>Guidance from your clinician</h2><ul class="limits">' + plan.map(function (e) { return '<li><strong>' + esc(e.name) + '.</strong> ' + esc(e.how) + '</li>'; }).join('') + '</ul>' : '') +
      '<p class="foot">This report describes AI-assisted observations that have been reviewed by a clinician. It is not a diagnosis. Speak to your clinician if you have pain or concerns. Demo report: sample data only.</p></div>';
  };

  views.progress = function () {
    var isPatient = db.role === 'patient';
    var pid = isPatient ? role().patientId : sel.patient;
    var list = byPatient(pid).filter(function (a) { return a.status === 'approved'; });
    var body;
    if (list.length < 2) {
      body = '<p class="empty">Progress needs at least two approved assessments. ' + (list.length ? 'There is one so far.' : 'There are none yet.') + '</p>';
    } else {
      var first = list[0], last = list[list.length - 1];
      var areas = last.observations.map(function (o) { return o.area; });
      body = '<div class="table-wrap"><table><thead><tr><th>Area</th><th>' + fmt(first.date) + '</th><th>' + fmt(last.date) + '</th></tr></thead><tbody>' +
        areas.map(function (ar) {
          var f = first.observations.filter(function (o) { return o.area === ar; })[0];
          var l = last.observations.filter(function (o) { return o.area === ar; })[0];
          return '<tr><td><strong>' + esc(ar) + '</strong></td><td>' + (f ? esc(f.text) : '<span class="muted">Not recorded</span>') + '</td><td>' + esc(l.text) + '</td></tr>';
        }).join('') + '</tbody></table></div><p class="muted small" style="margin-top:14px">Comparison uses approved assessments only. Wording is the clinician-approved observation from each visit, not a score.</p>';
    }
    var h = head(isPatient ? 'My progress' : 'Progress', 'Earliest and latest approved assessments, side by side.', isPatient ? '' : patientSelect());
    return (isPatient ? '<div class="plain">' : '') + h + '<div class="box">' + body + '</div>' + (isPatient ? '</div>' : '');
  };

  views.exercises = function () {
    var isPatient = db.role === 'patient';
    var pid = isPatient ? role().patientId : sel.patient;
    var plan = db.plans[pid] || [];
    if (isPatient) {
      var mine = EXERCISES.filter(function (e) { return plan.indexOf(e.id) > -1; });
      return '<div class="plain">' + head('My guidance', 'Exercises your clinician has chosen for you.') +
        (mine.length ? mine.map(function (e) { return '<div class="box"><h2>' + esc(e.name) + '</h2><p>' + esc(e.how) + '</p></div>'; }).join('') : '<div class="box"><p class="empty">Your clinician has not added any guidance yet.</p></div>') +
        '<p class="muted small" style="margin-top:20px">Stop and speak to your clinician if an exercise causes pain.</p></div>';
    }
    return head('Exercise guidance', 'Choose guidance for a patient\'s plan. It appears in their portal and on their report.', patientSelect()) +
      '<div class="notice warn" style="margin-bottom:20px"><strong>Sample library.</strong> These four entries are placeholders. The real library must be written and reviewed by clinicians.</div>' +
      '<div class="grid c2">' + EXERCISES.map(function (e) {
        var on = plan.indexOf(e.id) > -1;
        return '<div class="box" style="margin-top:0"><p class="crumb">' + esc(e.area) + '</p><h2>' + esc(e.name) + '</h2><p>' + esc(e.how) + '</p><p style="margin-top:14px"><button class="btn btn-sm ' + (on ? 'btn-secondary' : 'btn-primary') + '" data-action="plan-toggle" data-id="' + e.id + '">' + (on ? 'Remove from plan' : 'Add to plan') + '</button></p></div>';
      }).join('') + '</div>';
  };

  views.products = function () {
    return head('Products', 'Optional product information. Kept separate from clinical findings.') +
      '<div class="notice" style="margin-bottom:20px"><strong>Commercial content.</strong> Nothing on this page is a clinical recommendation. Showing it to a patient or customer is always optional.</div>' +
      '<div class="grid c3">' + ['Axign Medical', 'Archline Australia', 'OZ Health'].map(function (b) {
        return '<div class="box commercial" style="margin-top:0"><p class="label">Product information</p><h2 style="margin-top:8px">' + b + '</h2><p class="muted">Catalogue to be supplied by TRIMAX. No products are listed in this demo.</p></div>';
      }).join('') + '</div>';
  };

  views.analytics = function () {
    if (db.role === 'trimax') {
      return head('Aggregate analytics', 'Operational totals across partner accounts. No patient-level data.') +
        '<div class="box"><h2>Assessments and screenings this month (sample figures)</h2>' + PARTNERS.map(function (p) {
          return '<div class="bar-row"><span>' + esc(p.name) + '</span><div class="bar"><i style="width:' + Math.min(100, p.count) + '%"></i></div><span class="mono">' + p.count + '</span></div>';
        }).join('') + '</div>';
    }
    var total = db.assessments.length || 1;
    var types = Object.keys(TEMPLATES).map(function (t) {
      var n = db.assessments.filter(function (a) { return a.type === t; }).length;
      return '<div class="bar-row"><span>' + TEMPLATES[t].label + '</span><div class="bar"><i style="width:' + Math.round(n / total * 100) + '%"></i></div><span class="mono">' + n + '</span></div>';
    }).join('');
    var approved = db.assessments.filter(function (a) { return a.status === 'approved'; }).length;
    return head('Analytics', 'Usage for ' + esc(db.clinicName) + ', counted from the sample records in this demo.') +
      '<div class="grid c3">' + tile(db.assessments.length, 'Assessments') + tile(approved, 'Approved') + tile(db.assessments.length - approved, 'Awaiting review') + '</div>' +
      '<div class="box" style="margin-top:20px"><h2>Assessments by type</h2>' + types + '</div>';
  };

  views.screening = function () {
    if (!scr) scr = { step: 1 };
    var body;
    if (scr.step === 1) {
      body = '<div class="box"><h2>Before we start</h2><p>This is a short screening of standing posture. It takes a few photos and gives a simple summary of what can be seen.</p>' +
        '<p style="margin-top:12px">It is <strong>not a diagnosis</strong> and does not replace seeing a clinician.</p>' +
        '<label class="check"><input type="checkbox" id="sconsent"><span>The customer has read this and agrees to take part.</span></label>' +
        '<p class="err" role="alert" id="serr"></p><button class="btn btn-primary" data-action="scr-next">Continue</button></div>';
    } else if (scr.step === 2) {
      body = '<div class="box"><h2>Capture</h2><p>Ask the customer to stand facing the camera, feet hip-width apart, arms relaxed.</p>' +
        '<div class="notice warn" style="margin:18px 0"><strong>Demo.</strong> No camera is used. A sample capture stands in.</div>' +
        '<button class="btn btn-primary" data-action="scr-next">Capture and continue</button></div>';
    } else {
      body = '<div class="box"><p class="crumb">Screening summary · not a diagnosis</p><h2>What we noticed</h2>' +
        '<ul class="limits" style="margin-top:12px"><li>One shoulder looks a little lower than the other.</li><li>Your head sits slightly forward of your shoulders when viewed from the side.</li><li>Your hips look level.</li></ul>' +
        '<p class="muted small" style="margin-top:12px">These are general observations from photos. Small differences like these are common.</p></div>' +
        '<div class="box"><h2>A good next step</h2><p>If you have pain, stiffness or any concern, a physiotherapist or other clinician can examine you properly and advise you.</p></div>' +
        '<div class="box commercial"><p class="label">Optional · product information</p><h2 style="margin-top:8px">Would you like to hear about products?</h2><p class="muted">Only if the customer asks. This is separate from the screening summary and is not a clinical recommendation.</p></div>' +
        '<p style="margin-top:20px"><button class="btn btn-primary" data-action="scr-finish">Finish screening</button></p>';
    }
    return '<div class="plain">' + head('Quick screening', 'Step ' + scr.step + ' of 3') + body + '</div>';
  };

  views.organization = function () {
    return head('Team and branding', 'Who has access, and how your reports are presented.') +
      '<div class="box"><h2>Report branding</h2><label class="small muted" for="cname">Clinic name shown on reports</label><br>' +
      '<div class="actions" style="margin-top:6px"><input class="inp" id="cname" value="' + esc(db.clinicName) + '" maxlength="60"><button class="btn btn-primary" data-action="save-clinic">Save</button><span class="muted small" id="saved" role="status"></span></div>' +
      '<p class="muted small" style="margin-top:12px">Branding changes the heading on reports. It does not change the clinical safeguards.</p></div>' +
      '<div class="box"><h2>Team</h2><div class="table-wrap"><table><thead><tr><th>Name</th><th>Role</th></tr></thead><tbody>' +
      db.team.map(function (t) { return '<tr><td>' + esc(t.name) + '</td><td>' + esc(t.role) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<p style="margin-top:14px"><button class="btn btn-secondary btn-sm" disabled>Invite a team member</button> <span class="muted small">Not available in the demo.</span></p></div>';
  };

  views.billing = function () {
    return head('Billing and usage', 'Your plan and how it is being used.') +
      '<div class="grid c2"><div class="box" style="margin-top:0"><h2>Plan</h2><p><span class="tag tag-neutral">Demo plan</span></p><p class="muted" style="margin-top:12px">Plans and prices have not been set. See the <a href="pricing.html">pricing page</a> for the models being considered.</p></div>' +
      '<div class="box" style="margin-top:0"><h2>Usage</h2><p><span class="mono" style="font-size:1.6rem;color:var(--navy)">' + db.assessments.length + '</span> assessments recorded in this demo.</p></div></div>' +
      '<div class="box"><h2>Invoices</h2><p class="empty">No invoices. Billing and payments are not built in this demo.</p></div>';
  };

  views.partners = function () {
    return head('Partner accounts', 'Organisations provisioned by TRIMAX.', '<button class="btn btn-secondary" disabled>Provision a partner</button>') +
      '<div class="box"><div class="table-wrap"><table><thead><tr><th>Organisation</th><th>Type</th><th>Status</th><th>Activity this month</th></tr></thead><tbody>' +
      PARTNERS.map(function (p) {
        return '<tr><td>' + esc(p.name) + '</td><td>' + p.type + '</td><td><span class="tag ' + (p.status === 'Active' ? 'tag-approved' : 'tag-neutral') + '">' + p.status + '</span></td><td class="mono">' + p.count + '</td></tr>';
      }).join('') + '</tbody></table></div><p class="muted small" style="margin-top:14px">Sample organisations and figures. Provisioning is not available in the demo.</p></div>';
  };

  views.audit = function () {
    return head('Audit log', 'A record of actions. Entries from this demo session appear at the top.') +
      '<div class="box"><div class="table-wrap"><table><thead><tr><th>When</th><th>Who</th><th>Action</th></tr></thead><tbody>' +
      db.audit.map(function (e) { return '<tr><td class="mono">' + esc(e.when) + '</td><td>' + esc(e.who) + '</td><td>' + esc(e.what) + '</td></tr>'; }).join('') + '</tbody></table></div></div>';
  };

  views.permissions = function () {
    function row(key, title, text) {
      return '<label class="check"><input type="checkbox" data-change="perm" data-key="' + key + '"' + (db.permissions[key] ? ' checked' : '') + '><span><strong style="color:var(--navy)">' + title + '</strong><br>' + text + '</span></label>';
    }
    return '<div class="plain">' + head('Permissions', 'You decide what is shared. You can change these at any time.') + '<div class="box">' +
      row('shareWithClinic', 'Share my assessments with my clinic', 'Lets your clinician see your results and track your progress.') +
      row('productInfo', 'Show me product information', 'Optional. Product information is separate from your clinical results.') +
      '<p class="muted small" id="saved" role="status" style="margin-top:16px"></p></div></div>';
  };

  views.settings = function () {
    var r = role();
    return head('Settings', 'Your profile for this demo session.') +
      '<div class="box"><h2>Profile</h2><div class="table-wrap"><table><tbody><tr><td class="muted">Name</td><td>' + esc(r.name) + '</td></tr><tr><td class="muted">Role</td><td>' + esc(r.title) + '</td></tr><tr><td class="muted">Organisation</td><td>' + esc(orgName()) + '</td></tr></tbody></table></div></div>' +
      '<div class="box"><h2>Demo data</h2><p>Put every sample record back to how it started.</p><p style="margin-top:14px"><button class="btn btn-danger" data-action="reset">Reset demo data</button></p></div>';
  };

  views.help = function () {
    var tips = {
      clinician: ['Open a draft from the dashboard, edit the wording and approve it.', 'Once approved, open the report and try Print or save as PDF.', 'Start a New assessment to walk through consent, capture and the quality check.', 'Add exercises to a patient\'s plan, then view their report again.'],
      patient: ['Read your latest report from Home.', 'Compare your two visits under My progress.', 'Change what you share under Permissions.'],
      retail: ['Start a screening and walk through the three steps.', 'Notice that results are short, plain and not a diagnosis.'],
      owner: ['Change the clinic name under Team and branding. It appears on every report.', 'See usage under Billing and usage.'],
      trimax: ['Review partner accounts and aggregate activity.', 'Open the Audit log to see actions from this session.', 'Note that patient records are not available to this role.']
    }[db.role];
    return head('Help', 'Things to try in this demo.') + '<div class="box"><h2>As ' + esc(role().title.toLowerCase()) + '</h2><ul class="limits">' +
      tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="box"><h2>More</h2><p><a href="resources.html">Frequently asked questions</a> · <a href="clinical-limitations.html">Clinical limitations</a> · <a href="login.html">Switch role</a></p></div>';
  };

  function notFound() { return head('Not found', 'That record does not exist in the demo data.', '<a class="btn btn-secondary" href="#/dashboard">Back to start</a>'); }
  function denied() { return head('Not available for this role', 'Your role does not have access to this page.', '<a class="btn btn-secondary" href="#/dashboard">Back to start</a>'); }

  // ---------- Shell and routing ----------
  function allowed(key) {
    var r = role();
    return r.also.indexOf(key) > -1 || r.nav.some(function (n) { return n[0] === key; });
  }
  function route() {
    var parts = (location.hash || '#/dashboard').replace(/^#\//, '').split('/');
    return { key: parts[0] || 'dashboard', id: parts[1] };
  }
  function render() {
    var rt = route();
    var r = role();
    var navKey = { patient: 'patients', assessment: 'patients', report: 'reports' }[rt.key] || rt.key;
    var html = !views[rt.key] ? notFound() : (allowed(rt.key) ? views[rt.key](rt.id) : denied());
    root.innerHTML =
      '<div class="demo-bar"><span>Demo mode · sample data only · no real analysis runs</span><span><a href="index.html" style="color:inherit">Back to website</a> · <button data-action="reset">Reset demo data</button></span></div>' +
      '<div class="shell"><aside class="side"><a class="wordmark" href="#/dashboard">Healthmate<span>POSTURE AI</span></a>' +
      '<nav aria-label="App"><ul>' + r.nav.map(function (n) {
        return '<li><a href="#/' + n[0] + '"' + (n[0] === navKey ? ' aria-current="page"' : '') + '>' + n[1] + '</a></li>';
      }).join('') + '</ul></nav>' +
      '<div class="who"><div><strong>' + esc(r.name) + '</strong><span>' + esc(r.title) + '</span><span>' + esc(orgName()) + '</span></div>' +
      '<button class="btn btn-secondary btn-sm" data-action="signout">Sign out</button></div></aside>' +
      '<main class="main" id="main" tabindex="-1">' + html + '</main></div>';
    document.title = 'Healthmate demo · ' + r.title;
  }
  function go(hash) {
    if (location.hash === hash) render(); else location.hash = hash;
  }
  function flash(text) {
    var el = document.getElementById('saved');
    if (el) el.textContent = text;
  }

  // Read edits from the review screen back into the assessment record.
  function collect(a) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-ob]'), function (t) {
      var o = a.observations[Number(t.getAttribute('data-ob'))];
      if (o) o.text = t.value.trim();
    });
    var n = document.getElementById('notes');
    if (n) a.notes = n.value.trim();
  }

  var actions = {
    signout: function () { db.role = null; save(); location.href = 'login.html'; },
    reset: function () { var keep = db.role; db = seed(); db.role = keep; wiz = null; scr = null; save(); go('#/dashboard'); },
    print: function () { window.print(); },
    view: function (el) { var a = assessment(route().id); if (a && a.status === 'draft') collect(a); sel.view = el.getAttribute('data-v'); render(); },
    'assess-for': function (el) { wiz = { step: 1, patientId: el.getAttribute('data-id'), type: null, method: null }; },
    'wiz-back': function () { wiz.step -= 1; render(); },
    'wiz-next': function () {
      var err = document.getElementById('werr');
      var pick = function (name) { var c = document.querySelector('input[name="' + name + '"]:checked'); return c ? c.value : null; };
      if (wiz.step === 1) {
        wiz.patientId = pick('wp');
        if (!wiz.patientId) { err.textContent = 'Choose a patient to continue.'; return; }
        if (!document.getElementById('wconsent').checked) { err.textContent = 'Consent must be confirmed before any capture.'; return; }
        patient(wiz.patientId).consent = true;
      } else if (wiz.step === 2) {
        wiz.type = pick('wt');
        if (!wiz.type) { err.textContent = 'Choose an assessment type to continue.'; return; }
      } else if (wiz.step === 3) {
        wiz.method = pick('wm');
        if (!wiz.method) { err.textContent = 'Choose a capture method to continue.'; return; }
      } else {
        var id = 'a' + (db.assessments.length + 1);
        db.assessments.push({ id: id, patientId: wiz.patientId, type: wiz.type, date: today(), method: wiz.method, status: 'draft',
          observations: copyObs(wiz.type), limitations: TEMPLATES[wiz.type].limitations.slice(), notes: '' });
        log('Created draft assessment for a patient record');
        wiz = null; save(); go('#/assessment/' + id); return;
      }
      wiz.step += 1; save(); render();
    },
    'ob-remove': function (el) { var a = assessment(route().id); collect(a); a.observations.splice(Number(el.getAttribute('data-i')), 1); save(); render(); },
    'ob-add': function () {
      var a = assessment(route().id); collect(a);
      a.observations.push({ area: 'Clinician observation', basis: 'Added by clinician', confidence: '', text: '' });
      save(); render();
      var boxes = document.querySelectorAll('[data-ob]');
      if (boxes.length) boxes[boxes.length - 1].focus();
    },
    'save-draft': function (el) { var a = assessment(el.getAttribute('data-id')); collect(a); save(); flash('Draft saved.'); },
    approve: function (el) {
      var a = assessment(el.getAttribute('data-id')); collect(a);
      a.observations = a.observations.filter(function (o) { return o.text; });
      if (!a.observations.length) { save(); render(); flash('Add at least one observation before approving.'); return; }
      a.status = 'approved'; a.approvedBy = role().name + ', ' + role().title;
      log('Approved assessment findings'); save(); render();
    },
    'plan-toggle': function (el) {
      var id = el.getAttribute('data-id'); var plan = db.plans[sel.patient] || (db.plans[sel.patient] = []);
      var i = plan.indexOf(id); if (i > -1) plan.splice(i, 1); else plan.push(id);
      log('Updated a patient\'s exercise plan'); save(); render();
    },
    'scr-next': function () {
      if (scr.step === 1 && !document.getElementById('sconsent').checked) { document.getElementById('serr').textContent = 'The customer needs to agree before the screening starts.'; return; }
      scr.step += 1; render();
    },
    'scr-finish': function () { db.screenings += 1; scr = null; log('Completed a retail screening (no identifiable data stored)'); save(); go('#/dashboard'); },
    'save-clinic': function () {
      var v = document.getElementById('cname').value.trim();
      if (!v) { flash('Enter a clinic name.'); return; }
      db.clinicName = v; log('Changed report branding'); save(); render(); flash('Saved. Reports now show this name.');
    }
  };

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    var fn = actions[el.getAttribute('data-action')];
    if (fn) fn(el);
  });
  document.addEventListener('change', function (e) {
    var kind = e.target.getAttribute('data-change');
    if (kind === 'pick-patient') { sel.patient = e.target.value; render(); }
    if (kind === 'perm') { db.permissions[e.target.getAttribute('data-key')] = e.target.checked; log('Changed a sharing permission'); save(); flash('Saved.'); }
  });
  window.addEventListener('hashchange', function () {
    render();
    var m = document.getElementById('main');
    if (m) { m.focus(); window.scrollTo(0, 0); }
  });

  // ---------- Start ----------
  load();
  var asked = new URLSearchParams(location.search).get('role');
  // The login page also hands the role over in storage, for hosts that drop the query string.
  try {
    asked = asked || sessionStorage.getItem('healthmate-role');
    sessionStorage.removeItem('healthmate-role');
  } catch (e) { /* fall back to the query string only */ }
  if (asked && ROLES[asked]) {
    db.role = asked; wiz = null; scr = null;
    log('Signed in to the demo');
    save();
    history.replaceState(null, '', location.pathname + '#/dashboard');
  }
  if (!db.role || !ROLES[db.role]) { location.replace('login.html'); return; }
  render();
})();
