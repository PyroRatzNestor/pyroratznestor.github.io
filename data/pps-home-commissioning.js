globalThis.TRACER_PPS_HOME_COMMISSIONING = {
  formId: "pps-home-commissioning",
  version: 1,
  title: "PPS Home Station Start-Up & Commissioning",
  source: "PPS QF-16.5 Start-Up and Commissioning Form, Rev B, 01/22/25; owner-supplied screenshots, pages 1-4.",
  applicabilityNote: "The official form separates a PPS/PAS-provided control panel from a PPS-provided pump skid. Select each scope independently. If a skid was not provided by PPS, its checklist is skipped but the Pump/Motor and Settings Table remains.",
  duplicateNote: "Items marked * are repeated elsewhere on the PPS form; keep each occurrence recorded in its own section.",
  headerFields: [
    {id: "header_panelSerial", label: "Panel serial number"},
    {id: "header_jobName", label: "Job / end-user name"},
    {id: "header_technician", label: "Start-up technician"},
    {id: "header_company", label: "Technician company"},
    {id: "header_signature", label: "Technician signature (typed record only)"},
    {id: "header_phone", label: "Technician phone (optional)", type: "tel"},
    {id: "header_date", label: "Start-up date", type: "date"}
  ],
  attendeeFields: [
    {id: "name", label: "Printed name"},
    {id: "company", label: "Company"},
    {id: "signature", label: "Signature (typed record only)"},
    {id: "date", label: "Date", type: "date"}
  ],
  completionFields: [
    {id: "name", label: "Printed name"},
    {id: "company", label: "Company"},
    {id: "signature", label: "Authorized signature (typed record only)"},
    {id: "date", label: "Date", type: "date"},
    {id: "title", label: "Title"}
  ],
  sectionFields: [
    {id: "jobName", label: "Job / end-user name"},
    {id: "date", label: "Date", type: "date"},
    {id: "siteContact", label: "Site contact"},
    {id: "technician", label: "Technician"}
  ],
  pumpCounts: [
    {id: "jockey", label: "Jockey pumps"},
    {id: "intermediate", label: "Intermediate pumps"},
    {id: "duty", label: "Duty pumps"},
    {id: "highFlow", label: "High-flow pumps"},
    {id: "well", label: "Well pumps"},
    {id: "recirc", label: "Recirculation pumps"},
    {id: "primer", label: "Primer pumps"},
    {id: "otherName", label: "Other pump type / name"},
    {id: "otherCount", label: "Other pump count"}
  ],
  pumpFields: [
    {id: "name", label: "Pump name"},
    {id: "motorFla", label: "Motor FLA"},
    {id: "position", label: "Pump position"},
    {id: "sleepSettings", label: "Sleep settings"},
    {id: "sleepDelay", label: "Sleep delay"},
    {id: "wakeDeviation", label: "Wake-up deviation"},
    {id: "wakeDelay", label: "Wake-up delay"},
    {id: "underload", label: "Underload Hz / %"},
    {id: "underloadDelay", label: "Underload delay"}
  ],
  readings: [
    {id: "l1g", label: "L1 / G (V)"},
    {id: "l1l2", label: "L1 / L2 (V)"},
    {id: "l2g", label: "L2 / G (V)"},
    {id: "l1l3", label: "L1 / L3 (V)"},
    {id: "l3g", label: "L3 / G (V)"},
    {id: "l2l3", label: "L2 / L3 (V)"},
    {id: "fullRunVolts", label: "Full-run volts (V)"},
    {id: "psiSetpoint", label: "PSI setpoint"},
    {id: "highPressureSwitch", label: "High-pressure switch (PSI)"},
    {id: "lowPressureAlarm", label: "Low-PSI alarm"},
    {id: "highPressureAlarm", label: "High-PSI alarm"},
    {id: "prvCrack", label: "PRV crack pressure (PSI)"},
    {id: "pressureTank", label: "Pressure tank (PSI)"}
  ],
  panel: {
    prePower: [
      {id: "siteReadiness", label: "Record the site electrical/mechanical readiness and safety review."},
      {id: "incomingConductors", label: "Verify incoming line conductors are on the intended main-disconnect input."},
      {id: "incomingPower", label: "Record incoming voltage and grounding results in the skid table."},
      {id: "connectionCondition", label: "Inspect power connections for conductor and insulation/jacket condition."},
      {id: "protectiveRatings", label: "Verify breaker trip ratings and overload settings against the applicable requirements."},
      {id: "vfdConnections", label: "Record the VFD power-connection inspection using the approved isolation procedure."},
      {id: "wireRetention", label: "Record the panel wire-retention check and any required corrections."},
      {id: "lowWater", label: "Check/set the low-water float and transmitter for the highest-set pump.", duplicate: true},
      {id: "hoaOff", label: "Confirm all Hand/Off/Auto switches are OFF before continuing."}
    ],
    powerOn: [
      {id: "panelEnergization", label: "Record panel power-on with the door closed and latched. If phase reversal is reported, refer correction to the contracted electrician."},
      {id: "pressureSetpoint", label: "Enter the approved pressure setpoint on the HMI and record it in the settings table."},
      {id: "vfdData", label: "Check VFD motor data and limits against the exact motor/equipment documentation; record any approved changes."},
      {id: "pumpRotation", label: "With the isolation valve closed, record the rotation check for each VFD-driven pump.", duplicate: true},
      {id: "smallPumpPressure", label: "With the isolation valve closed, record the form's pressure-up check using the smallest pump.", duplicate: true},
      {id: "highPressureSwitch", label: "Check the high-pressure switch and record its setting in the table.", duplicate: true},
      {id: "lowPressureSwitch", label: "Check the low-pressure switch and record its setting in the table.", duplicate: true},
      {id: "pressureTransmitter", label: "Check pressure-transmitter scaling in the station automation."},
      {id: "fillMode", label: "Record the approved fill-mode sequence, AUTO selection and gradual mainline fill."},
      {id: "cooling", label: "Check cooling components such as radiators, fans or air conditioning."},
      {id: "automationPid", label: "Review automation settings; record only vendor-approved PID adjustments."},
      {id: "indicatorLamps", label: "Check indicator lamps and bulbs."},
      {id: "manualMotorOperation", label: "Record the prescribed motor-operation check using the listed HOA/speed controls."},
      {id: "vfdSequence", label: "Check overall VFD operation and lag-pump starts/stops under the approved procedure."},
      {id: "sitePhotos", label: "Complete the site-photo checklist and record archive handoff if required.", duplicate: true},
      {id: "sitePin", label: "Record sending the Google Earth site pin with the job name.", duplicate: true},
      {id: "modemDemo", label: "If fitted, record the modem/remote-operation demonstration with the end user."},
      {id: "demoMode", label: "Only after PPS/PAS confirms authorization, record demo-mode activation. Never store an activation or lockout code here."}
    ]
  },
  skid: {
    prePower: [
      {id: "waterSupply", label: "Record the wet-well/intake availability and debris check."},
      {id: "motorOil", label: "Check motor oil level against the motor documentation."},
      {id: "lowWater", label: "Check/set the low-water float and transmitter for the highest-set pump.", duplicate: true},
      {id: "drainsClosed", label: "Confirm drain valves and ports are closed."}
    ],
    powerOn: [
      {id: "filterSwitches", label: "Check filter limit-switch operation in test, then return the filter to AUTO per its procedure."},
      {id: "smallPumpPressure", label: "With the isolation valve closed, record the form's pressure-up check using the smallest pump.", duplicate: true},
      {id: "pressureTank", label: "Check pressure-tank setting and record it in the table."},
      {id: "highPressureSwitch", label: "Check the high-pressure switch and record its setting in the table.", duplicate: true},
      {id: "lowPressureSwitch", label: "Check the low-pressure switch and record its setting in the table.", duplicate: true},
      {id: "prvCrack", label: "Check the PRV crack-pressure setting and record it in the table."},
      {id: "manualValves", label: "Record manual valves set to their operating positions."},
      {id: "checkValves", label: "Record the check-valve pressure-holding checks."},
      {id: "electricalValves", label: "Record electrical-valve checks."},
      {id: "filterFlush", label: "Inspect filter-flush installation and record the functionality check."},
      {id: "skidLeaks", label: "Inspect the skid for leaks and record any correction."},
      {id: "sitePhotos", label: "Complete the site-photo checklist and record archive handoff if required.", duplicate: true},
      {id: "sitePin", label: "Record sending the Google Earth site pin with the job name.", duplicate: true}
    ]
  },
  photos: {
    controlPanel: [
      "Full control panel with doors closed",
      "Full control panel with doors open and supplied instrumentation wired",
      "If wired on site, motor-wire terminations in the panel",
      "Close view of terminal blocks and instrumentation wiring",
      "Close view of incoming wiring at the main disconnect",
      "Panel changes from the as-built configuration"
    ],
    pumpSkid: [
      "Full skid from front, back, left and right",
      "If wired on site, motor-wire terminations in the motor enclosure",
      "Mainline tie-ins: intake where applicable and discharge",
      "Skid changes from the as-built configuration"
    ],
    overallSite: [
      "Full station/enclosure closed: front, back, left and right",
      "Full station/enclosure open: front, back, left and right",
      "Distance view showing site condition at start-up",
      "Changes to the PPS-provided enclosure or pump house"
    ]
  },
  noteLines: 14
};
