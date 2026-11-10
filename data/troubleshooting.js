globalThis.TRACER_TROUBLESHOOTING = {
  "schemaVersion": 1,
  "safety": "De-energize, lock out and verify zero energy before touching conductors or doing insulation tests. Follow your employer’s procedures.",
  "techniques": {
    "wont": {
      "title": "Pump won't build pressure",
      "symptom": "A centrifugal water-pump system is delivering less pressure or head than expected under a documented demand.",
      "appliesTo": [
        "Centrifugal water pumps with an identified model, impeller configuration and applicable curve at the actual operating speed.",
        "For boosters, include inlet pressure: discharge gauge pressure alone is not pump differential head. Account for gauge locations, elevations and velocity-head differences where relevant.",
        "Use the pump-type paths for vertical turbine, submersible, jet or unidentified installations before applying this generic screen. This is not a positive-displacement-pump procedure."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Content-readiness pass clarified scope, unknown readings, actual-speed curve comparison and maintenance boundaries. Exact model/manual source verification and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Provisional field guidance, not a manufacturer-approved diagnostic tree. Retrieval of the existing PPS manual reference failed DNS checks during the 2026-11-10 readiness pass; no path-level source citation was verified. Obtain the installed pump curve, motor/drive documentation and station schematic before applying limits.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections.",
        "Use existing readings or approved observation points. Do not open electrical enclosures, change modes, command a restart or change parameters merely to answer this path.",
        "Do not run dry or close a discharge valve to create a shutoff/deadhead test. Any operating test needs a separate manufacturer-approved procedure with minimum-flow, pressure and stop limits.",
        "Before inspection of couplings, shafts or pump internals, isolate all energy, verify zero energy and isolate/depressurize the hydraulic system under the site procedure. Keep guards in place during operation."
      ],
      "verification": [
        "Record simultaneous flow, inlet and discharge pressure, actual speed, instrument units/locations and demand; compare differential total head with the correct impeller/speed curve, not discharge PSI alone.",
        "Compare motor current with the applicable nameplate and operating condition; normal or low amps alone do not prove pump health or identify a fault.",
        "Record before/after readings at comparable demand, with the original symptom addressed and all protections, guards and normal control ownership restored.",
        "Confirm the operating point meets documented flow, pressure, NPSH and equipment limits. If readings, curve or allowable limits are unavailable, stop at evidence collection rather than recording a pass."
      ],
      "equipmentOptional": false,
      "start": "a",
      "nodes": {
        "a": {
          "question": "From existing authorized readings, is actual speed known and consistent with the commanded, permitted operating point?",
          "options": [
            {
              "label": "No: pump is stopped or actual speed does not match the permitted command",
              "next": "e1"
            },
            {
              "label": "Yes: actual speed and operating condition are documented",
              "next": "b"
            },
            {
              "label": "Unknown: readings or the permitted operating point are not established",
              "next": "evidence"
            }
          ]
        },
        "e1": {
          "result": true,
          "domain": "ELECTRICAL / CONTROL",
          "assessment": "A stopped pump or speed mismatch may involve demand, permissives, command ownership, supply, drive or motor issues. A protective stop or intentional speed limit is not proof of a fault; do not override it.",
          "measurements": [
            "Record drive fault/status history, run demand and documented permissive state without clearing faults.",
            "Compare displayed commanded and actual speed, local/remote source and commissioned limits; do not select HAND/manual to force operation.",
            "Use existing power-quality records where available. Any new energized measurement requires a qualified electrical worker, an approved procedure and suitable instruments; VFD output is not ordinary line-frequency AC.",
            "Check documented rotation and motor/overload state; any new rotation or mechanical check requires the applicable guarded or isolated procedure."
          ],
          "search": "VFD pump will not reach commanded speed troubleshooting"
        },
        "b": {
          "question": "Using measured flow and differential total head, where is the operating point relative to the correct curve at the actual speed and impeller configuration?",
          "options": [
            {
              "label": "Flow is high and head is low relative to the documented duty",
              "next": "h1"
            },
            {
              "label": "Flow and head are low, with noise or vibration",
              "next": "c1"
            },
            {
              "label": "Flow and head are low, without an obvious suction-noise symptom",
              "next": "m1"
            },
            {
              "label": "Unknown, inconsistent readings, no matching curve, or none of these patterns",
              "next": "evidence"
            }
          ]
        },
        "h1": {
          "result": true,
          "domain": "HYDRAULIC",
          "assessment": "High flow with low head can indicate excess demand or reduced system resistance, such as a leak or unexpected valve state. First confirm the readings and curve; this pattern alone does not establish a broken line, failed PRV or pump defect.",
          "measurements": [
            "Compare inlet/discharge readings and a remote pressure reading with their locations and elevations recorded.",
            "Compare measured flow with the documented active-zone demand and valve states.",
            "Review PRV settings and leak indicators without changing them to fit an assumed diagnosis.",
            "Compare duty point with the manufacturer's allowable operating range and minimum-flow limits; do not assume a universal BEP/runout margin."
          ],
          "search": "pump running out of curve low pressure high flow irrigation mainline break",
          "tool": "sys"
        },
        "c1": {
          "result": true,
          "domain": "SUCTION / CAVITATION",
          "assessment": "Air entrainment, suction restriction or insufficient NPSHa are possibilities, not confirmed causes. Noise or vibration can also have mechanical causes.",
          "measurements": [
            "Record suction pressure/vacuum, water level, temperature, flow and actual speed under the same approved operating condition.",
            "Check recorded intake/strainer and valve condition; isolate and depressurize before opening any component.",
            "Compare calculated NPSHa with NPSHr at actual flow/speed and the manufacturer's required margin. An NPSHa estimate or noise change alone does not confirm cavitation."
          ],
          "search": "pump low pressure noise cavitation suction air leak troubleshooting",
          "tool": "npsh"
        },
        "m1": {
          "result": true,
          "domain": "MECHANICAL",
          "assessment": "Wear, blockage, incorrect rotation/speed, coupling problems or instrument error remain possibilities. Quiet operation and apparently normal current do not exclude suction or hydraulic problems.",
          "measurements": [
            "Recheck the curve, impeller configuration, actual speed and instrument accuracy before proposing teardown.",
            "Use existing commissioning/rotation records. Coupling, shaft and internal inspections require a qualified maintainer under full isolation and depressurization; do not reach past guards.",
            "Compare inspected clearances and condition with the exact service manual, not a generic wear limit.",
            "Check selected pump duty and pressure ratings against the approved design. There is no universal PSI cutoff that determines single-stage versus multistage selection."
          ],
          "search": "centrifugal pump worn impeller wear ring low pressure diagnosis"
        },
        "evidence": {
          "result": true,
          "domain": "INSUFFICIENT EVIDENCE",
          "assessment": "The cause is not established. Do not choose an electrical, suction or mechanical diagnosis from missing or inconsistent readings.",
          "measurements": [
            "Identify the pump, impeller configuration, actual speed and applicable curve/manual revision.",
            "Collect existing or separately authorized flow, inlet/discharge pressure and operating-state records with units, instrument locations and timestamps.",
            "If safe observation points, applicable limits or a qualified test procedure are unavailable, stop and escalate through the site's service process."
          ],
          "search": "centrifugal pump manufacturer operating curve troubleshooting measured head flow"
        }
      },
      "reviewFlags": [
        {
          "node": "a",
          "category": "source-verification",
          "note": "The linked PPS manual could not be retrieved during readiness checks. The exact installed curve/manual and qualified approval of this complete path are still required."
        },
        {
          "node": "e1",
          "category": "energized-testing",
          "note": "This screen is not a live electrical test procedure. A qualified electrical worker must establish isolation, instruments and the authorized measurement method, especially at VFD outputs."
        },
        {
          "node": "b",
          "category": "model-specific-limit",
          "note": "Verify the actual speed/impeller curve and differential total-head basis. Do not equate discharge PSI or normal amps with pump performance."
        },
        {
          "node": "m1",
          "category": "operating-test",
          "note": "No generic shutoff/deadhead or unguarded shaft test is authorized. Use existing records or a separate manufacturer-approved procedure."
        }
      ]
    },
    "hunt": {
      "title": "Pressure hunting",
      "symptom": "Pressure hunting",
      "appliesTo": [
        "Pressure-regulated pump systems; establish whether the drive or station controller owns the loop."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Existing diagnostic guidance with no traceable path-level source citation. Verify each model-specific instruction against the installed equipment documentation; search links are not verified sources.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Record pressure, setpoint, speed and demand through a representative operating cycle.",
        "Verify the original oscillation is resolved without violating commissioned limits or protection requirements."
      ],
      "equipmentOptional": false,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Does the hunting continue with the VFD in fixed/manual speed?",
          "options": [
            {
              "label": "Yes, it hunts at fixed speed",
              "next": "h"
            },
            {
              "label": "No, only in PID/auto control",
              "next": "b"
            }
          ]
        },
        "h": {
          "result": true,
          "domain": "HYDRAULIC / SYSTEM",
          "assessment": "Demand or system devices are cycling: PRV, check valve, air in line, tank precharge, cycling zones.",
          "measurements": [
            "Pressure trace at pump and remote point",
            "Zone sequencing at time of swings",
            "Tank precharge (if present), PRV behavior"
          ],
          "search": "irrigation pump station pressure fluctuating PRV hunting causes"
        },
        "b": {
          "question": "Is the transducer signal steady and in agreement with a reference gauge?",
          "options": [
            {
              "label": "No: noisy, drifting or disagreeing",
              "next": "s1"
            },
            {
              "label": "Yes: signal is stable and accurate",
              "next": "t1"
            }
          ]
        },
        "s1": {
          "result": true,
          "domain": "SENSOR / WIRING",
          "assessment": "Feedback is unreliable. Fix this before touching PID values.",
          "measurements": [
            "mA/V at the drive input vs gauge",
            "Shield termination and routing away from motor leads",
            "Supply voltage and scaling (low/high range)"
          ],
          "search": "VFD pressure transducer noise 4-20mA shielding scaling",
          "tool": "xdcr"
        },
        "t1": {
          "result": true,
          "domain": "CONTROL TUNING",
          "assessment": "Loop is too aggressive or ramps/minimum speed/sleep settings fight the system.",
          "measurements": [
            "Record ALL current PID, ramp and min-speed values first",
            "Change one parameter at a time and log the result",
            "Observe at low and high demand"
          ],
          "search": "VFD booster pump PID tuning hunting acceleration deceleration",
          "tool": "vfdsetup"
        }
      },
      "reviewFlags": [
        {
          "node": "a",
          "category": "operating-test",
          "note": "Use prior authorized fixed-speed evidence only. Do not switch to HAND/manual, defeat station logic or command a test from this question; unknown evidence must be collected under a separate approved procedure."
        },
        {
          "node": "s1",
          "category": "energized-testing",
          "note": "Sensor-loop measurements inside energized controls need a qualified worker, approved access and the exact signal/input documentation."
        },
        {
          "node": "t1",
          "category": "parameter-change",
          "note": "The suggested tuning area is a hypothesis, not authority to change PID. Establish control ownership, preserve a backup/rollback and obtain vendor/qualified review before any change."
        }
      ]
    },
    "trip": {
      "title": "VFD / motor trip",
      "symptom": "VFD / motor trip",
      "appliesTo": [
        "VFD-driven motors; use the exact drive fault code, motor data and station schematic."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Existing diagnostic guidance with no traceable path-level source citation. Verify each model-specific instruction against the installed equipment documentation; search links are not verified sources.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Record the original fault history and the evidence supporting its cause.",
        "Verify operation under the permitted duty condition with protections intact; do not use repeated resets as proof."
      ],
      "equipmentOptional": false,
      "start": "a",
      "nodes": {
        "a": {
          "question": "What did the drive report?",
          "options": [
            {
              "label": "Rain Bird CLP/ACLP named alarm (E16/E17/E18/PCH/AIE or Delta alarm)",
              "next": "flow:rbclp"
            },
            {
              "label": "Overcurrent / short circuit",
              "next": "oc"
            },
            {
              "label": "Ground fault / earth leakage",
              "next": "gf"
            },
            {
              "label": "Overload / thermal",
              "next": "ol"
            },
            {
              "label": "Over- or under-voltage",
              "next": "uv"
            },
            {
              "label": "No fault, but won’t accelerate",
              "next": "ac"
            }
          ]
        },
        "oc": {
          "result": true,
          "domain": "ELECTRICAL / MECHANICAL",
          "assessment": "Possible winding or cable fault, locked rotor/binding, or too-short acceleration ramp.",
          "measurements": [
            "Insulation resistance of motor and cable with leads disconnected from the drive",
            "Phase-to-phase resistance balance",
            "Shaft turns freely by hand; ramp time"
          ],
          "search": "VFD overcurrent fault pump motor insulation resistance test"
        },
        "gf": {
          "result": true,
          "domain": "ELECTRICAL",
          "assessment": "Leakage to ground in motor, cable or moisture ingress; surge damage possible.",
          "measurements": [
            "Megger phase-to-ground for motor and cable separately",
            "Look for water in junction box or conduit",
            "Check grounding and drive output filter/length"
          ],
          "search": "VFD ground fault motor cable megger insulation test"
        },
        "ol": {
          "result": true,
          "domain": "HYDRAULIC / MECHANICAL",
          "assessment": "Motor is loaded beyond nameplate. Often pump running out on the curve, bearing drag or voltage problem.",
          "measurements": [
            "Amps vs nameplate FLA/service factor each phase",
            "Flow and TDH vs curve (hydraulic overload?)",
            "Bearing condition, voltage balance"
          ],
          "search": "VFD motor overload pump running out of curve amps nameplate",
          "tool": "affinity"
        },
        "uv": {
          "result": true,
          "domain": "SUPPLY",
          "assessment": "Incoming power or decel energy issue.",
          "measurements": [
            "Line voltage at drive during start and run",
            "Voltage imbalance between phases",
            "Deceleration time (overvoltage on stopping)",
            "If Mitsubishi E.OV3 appears, check regenerative-avoidance/decel settings and verify utility voltage is not high at idle",
            "If utility voltage is stable but UV/OV repeats, inspect DC-bus ripple/capacitor health and rectifier condition per drive manual",
            "If OV-at-stop style faults persist after decel checks, evaluate grounding integrity and whether an AC line reactor is required per station/drive guidance"
          ],
          "search": "VFD overvoltage undervoltage fault pump supply voltage"
        },
        "ac": {
          "result": true,
          "domain": "PARAMETERS / PERMISSIVES",
          "assessment": "Drive is limited by a setting or command source, not necessarily a fault.",
          "measurements": [
            "Run/enable permissives and command source (local vs remote)",
            "Current limit, accel time, min/max frequency",
            "Motor data entered correctly; PID setpoint vs feedback"
          ],
          "search": "VFD will not accelerate pump parameters current limit reference source",
          "tool": "hz"
        }
      },
      "reviewFlags": [
        {
          "node": "oc",
          "category": "energized-testing",
          "note": "Insulation/continuity testing and shaft inspection require full isolation, discharge verification and the exact motor/drive procedure. Never insulation-test through a connected drive or sensitive electronics."
        },
        {
          "node": "gf",
          "category": "energized-testing",
          "note": "Confirm isolation and disconnect sensitive equipment per manufacturer instructions before any insulation test; this path supplies no test voltage or acceptance limit."
        },
        {
          "node": "uv",
          "category": "energized-testing",
          "note": "DC-bus, capacitor and rectifier checks are specialist work with stored-energy hazards, not an instruction to probe inside a drive."
        },
        {
          "node": "uv",
          "category": "parameter-change",
          "note": "Do not alter deceleration, regeneration or reactor configuration without the exact drive/station procedure and an approved baseline."
        },
        {
          "node": "ac",
          "category": "parameter-change",
          "note": "Review recorded limits and command sources; do not change permissives, current limits or motor data to force acceleration."
        }
      ]
    },
    "rbclp": {
      "title": "Rain Bird CLP/ACLP alarm map",
      "symptom": "Rain Bird CLP/ACLP alarm map",
      "appliesTo": [
        "Rain Bird CLP/ACLP stations; confirm platform, drive family, firmware and programming guide."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Existing diagnostic guidance with no traceable path-level source citation. Verify each model-specific instruction against the installed equipment documentation; search links are not verified sources.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Match the alarm to the exact station/drive manual and record supporting sensor or power measurements.",
        "Verify the corrected station completes the relevant start, run or shutdown sequence with protections intact."
      ],
      "equipmentOptional": false,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Which family and alarm pattern best matches the station?",
          "options": [
            {
              "label": "Mitsubishi alarms (E16/E17/E18/PCH/AIE/ILF/UVT)",
              "next": "m"
            },
            {
              "label": "Delta alarms (high/low pressure, overload, phase-loss, ACI-loss)",
              "next": "d"
            },
            {
              "label": "Station will not shut down after irrigation",
              "next": "sd"
            },
            {
              "label": "Small Platform symptom set (-62 PSI, max starts, prime loss, flow meter fault)",
              "next": "sp"
            }
          ]
        },
        "m": {
          "result": true,
          "domain": "RAIN BIRD MITSUBISHI ALARMS",
          "assessment": "Use alarm-specific checks before broad retuning.",
          "measurements": [
            "E16 loss of prime: verify suction condition and related low-pressure/frequency parameters in your current programming guide",
            "E17 pipe break: verify transducer truth first, then review the break-detection parameter group",
            "E18 deadhead: confirm discharge path (master/discharge/zone valves) and deadhead logic settings",
            "PCH precharge error: review precharge limits (for example Pr1175/Pr1176/Pr1177), avoid opening too many valves at once, and stage startup demand lower",
            "AIE analog input / ILF phase-loss: inspect wiring at the drive, transducer scaling and incoming power phase integrity",
            "On large platforms, read detailed VFD fault history directly at the drive if the HMI summary is vague"
          ],
          "search": "Rain Bird CLP ACLP Mitsubishi alarms E16 E17 E18 AIE ILF troubleshooting",
          "tool": "xdcr"
        },
        "d": {
          "result": true,
          "domain": "RAIN BIRD DELTA ALARMS",
          "assessment": "Validate sensor truth and power quality before changing PID or thresholds.",
          "measurements": [
            "High/low pressure alarms: compare VFD reading to a known-good gauge",
            "Overload/over-torque alarms: verify pump can turn freely, rotation is correct and demand is within curve",
            "Phase-loss alarms: verify all incoming legs under load and re-torque line/motor terminations",
            "ACI/PID input loss (<4 mA) alarms: inspect 4-20 mA loop wiring, power and transducer health",
            "If power-failure alarms coexist, verify phase monitor health and surge-arrestor indicator lights"
          ],
          "search": "Rain Bird Delta VFD alarm troubleshooting high low pressure overload phase loss ACI loss",
          "tool": "xdcr"
        },
        "sd": {
          "result": true,
          "domain": "WAKE / SLEEP & FLOW-SWITCH LOGIC",
          "assessment": "Shutdown problems are often wake/sleep or flow-switch behavior, not only pressure PID.",
          "measurements": [
            "Confirm pressure decay behavior and sleep timing are realistic for site volume and leak profile",
            "Review wake/sleep and flow-switch function settings per your current Rain Bird programming guide before raising thresholds",
            "On CLPRS flow-switch variants, verify sleep-test parameters match the intended mode (Test Timer / Retest Time / Max Retest are often fixed baseline values)",
            "Verify VFD minimum run/rest timers are not masking expected wake/sleep transitions during testing",
            "Test shutdown with known valve states and verify pressure switch/transducer feedback agrees during sleep"
          ],
          "search": "Rain Bird ACLP station does not shut down wake sleep flow switch troubleshooting"
        },
        "sp": {
          "question": "Which Small Platform symptom is closest?",
          "options": [
            {
              "label": "Touchscreen reads -62 PSI or pressure is clearly wrong",
              "next": "sp_pt"
            },
            {
              "label": "Max starts per hour / rapid cycling",
              "next": "sp_ms"
            },
            {
              "label": "Prime loss alarm",
              "next": "sp_pl"
            },
            {
              "label": "Flow meter fault or mismatch",
              "next": "sp_fm"
            },
            {
              "label": "Power-failure or phase-monitor alarm",
              "next": "sp_pf"
            },
            {
              "label": "VFD E.OV# or retries exceeded",
              "next": "sp_vfd"
            }
          ]
        },
        "sp_pt": {
          "result": true,
          "domain": "SMALL PLATFORM TRANSDUCER LOOP",
          "assessment": "Treat this as a signal/scaling path issue before PID changes.",
          "measurements": [
            "Compare displayed pressure with a reference gauge",
            "Confirm 4-20 mA loop wiring and signal at the expected PLC/VFD inputs (Input 4/PC on many revisions)",
            "If reading is fixed near -62 PSI, verify VFD-to-PLC communication path and test with a known-good Ethernet cable",
            "Review drive/controller scaling and analog-input mode for this station revision (for example, parameter 267 and DIP input mode where applicable)"
          ],
          "search": "Rain Bird small platform -62 PSI pressure transducer 4-20mA troubleshooting",
          "tool": "xdcr"
        },
        "sp_ms": {
          "result": true,
          "domain": "SMALL PLATFORM SHORT CYCLING",
          "assessment": "Frequent starts are usually demand-driven or leak-driven, not a pure drive problem.",
          "measurements": [
            "Find leaks (field, foot valve, filter train, check valve, PRV) before raising start limits",
            "Confirm start/stop delta and wake/sleep timing are reasonable for site volume",
            "Verify check valve and master-valve sealing after shutdown"
          ],
          "search": "Rain Bird small platform max starts per hour short cycling troubleshooting"
        },
        "sp_pl": {
          "result": true,
          "domain": "SMALL PLATFORM PRIME LOSS",
          "assessment": "Loss-of-prime alarms are commonly suction-side or prime-circuit issues.",
          "measurements": [
            "Suction line integrity, foot-valve orientation and open ball valves",
            "Prime-loss kit and regulator setting per your current station guidance",
            "Air leaks at flanges/high points and whether suction lines were fully purged"
          ],
          "search": "Rain Bird small platform prime loss alarm suction line foot valve troubleshooting",
          "tool": "npsh"
        },
        "sp_fm": {
          "result": true,
          "domain": "SMALL PLATFORM FLOW METER CHECK",
          "assessment": "Do not assume the meter is bad until speed, pressure and scaling agree.",
          "measurements": [
            "Confirm the station is configured for the correct sensor type (flow switch vs flow meter) and that the flow meter is enabled/installed in HMI logic",
            "Confirm pump is running and compare VFD speed/flow to expected zone demand",
            "For paddlewheel meters: verify K/offset, insertion depth/alignment, optical isolator path and clean sensor body",
            "For magmeters: verify output scaling and input configuration match schematic"
          ],
          "search": "Rain Bird small platform flow meter fault troubleshooting K factor magmeter",
          "tool": "flowcal"
        },
        "sp_pf": {
          "result": true,
          "domain": "SMALL PLATFORM POWER / PHASE",
          "assessment": "Phase-monitor and surge-protection faults can mimic unrelated alarms.",
          "measurements": [
            "Verify phase monitor power and output contact state during fault window",
            "Measure all three phases under load for imbalance or dropouts",
            "Inspect surge-arrestor indicators and replace failed modules before retesting"
          ],
          "search": "Rain Bird small platform phase monitor power failure alarm troubleshooting",
          "tool": "imb"
        },
        "sp_vfd": {
          "result": true,
          "domain": "SMALL PLATFORM VFD FAULT",
          "assessment": "Overvoltage/retry faults need power-quality and ramp checks before hardware swaps.",
          "measurements": [
            "Read exact VFD alarm history from the drive keypad/log",
            "Compare motor current to nameplate and review thermal/current-limit settings",
            "If E.OV# appears, review accel/decel and line-voltage behavior during stop/start",
            "If the drive shows E.RET (retries exceeded), correct the base fault and review retry count/delay before reset-only attempts",
            "If PS appears after a stop/reset event, clear with PU/EXT and confirm the station returned to the intended remote/auto command source"
          ],
          "search": "Rain Bird Mitsubishi F800 E.OV retries exceeded troubleshooting",
          "tool": "hz"
        }
      },
      "reviewFlags": [
        {
          "node": "m",
          "category": "model-specific-limit",
          "note": "Alarm meanings and example parameter numbers are unverified for the installed platform/firmware. Obtain the exact Rain Bird programming guide before applying any mapping."
        },
        {
          "node": "d",
          "category": "energized-testing",
          "note": "Separate energized voltage measurements from termination work. Re-torquing requires isolation, zero-energy verification and specified torque; never tighten live terminals."
        },
        {
          "node": "sd",
          "category": "parameter-change",
          "note": "Wake/sleep and test-timer values must come from the commissioned station baseline, not a generic fixed setting or raised alarm threshold."
        },
        {
          "node": "sp_pt",
          "category": "model-specific-limit",
          "note": "Example parameter 267 and input-switch references need the exact schematic/model/revision; do not change an analog-input mode from this path."
        },
        {
          "node": "sp_pf",
          "category": "energized-testing",
          "note": "Surge-module inspection/replacement needs the panel-specific isolation and service procedure; indicator state alone does not establish a safe enclosure."
        },
        {
          "node": "sp_vfd",
          "category": "parameter-change",
          "note": "The legacy PU/EXT/reset suggestion is not authorized: changing command source or resetting can permit unexpected restart. Follow the exact vendor-approved recovery procedure after correcting the fault."
        }
      ]
    },
    "cav": {
      "title": "Suspected cavitation",
      "symptom": "Suspected cavitation",
      "appliesTo": [
        "Pump suction systems; use the installed pump curve and current fluid/source conditions."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Existing diagnostic guidance with no traceable path-level source citation. Verify each model-specific instruction against the installed equipment documentation; search links are not verified sources.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Compare suction conditions and NPSHa with the pump curve and manufacturer-required margin at actual flow.",
        "Record noise, pressure, flow and suction behavior after correction at comparable demand."
      ],
      "equipmentOptional": false,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Does it get worse at higher flow or when more zones run?",
          "options": [
            {
              "label": "Yes, worse with high flow",
              "next": "h"
            },
            {
              "label": "No, it is steady or random",
              "next": "b"
            }
          ]
        },
        "h": {
          "result": true,
          "domain": "HYDRAULIC",
          "assessment": "Pump is far right on its curve where NPSHr is higher.",
          "measurements": [
            "Flow vs curve and NPSHr at that flow",
            "Throttle discharge slightly (if permitted) to see if noise clears",
            "Suction pressure at that flow"
          ],
          "search": "pump cavitation high flow NPSHr increases with flow",
          "tool": "npsh"
        },
        "b": {
          "question": "Found a restriction or air entry on the suction side (strainer, valve, intake level, fittings)?",
          "options": [
            {
              "label": "Yes",
              "next": "fx"
            },
            {
              "label": "No, suction looks clean",
              "next": "n1"
            }
          ]
        },
        "fx": {
          "result": true,
          "domain": "SUCTION",
          "assessment": "Correct it and re-test under load.",
          "measurements": [
            "Suction gauge before/after repair",
            "Noise and discharge pressure stability",
            "Amps and flow vs baseline"
          ],
          "search": "pump suction strainer air leak cavitation symptoms fix"
        },
        "n1": {
          "result": true,
          "domain": "NPSH / FLUID",
          "assessment": "Calculate NPSHa for real conditions: elevation, temperature, lift and friction.",
          "measurements": [
            "Water temperature and level",
            "Measured suction pressure",
            "NPSHr from curve at operating flow"
          ],
          "search": "NPSH available calculation suction lift temperature elevation",
          "tool": "npsh"
        }
      },
      "reviewFlags": [
        {
          "node": "h",
          "category": "operating-test",
          "note": "Throttling is not a general diagnostic instruction. A qualified operator must first establish manufacturer-permitted flow, pressure and stop limits; do not deadhead or reduce flow below minimum."
        }
      ]
    },
    "flow": {
      "title": "Flow reading disagrees",
      "symptom": "Flow reading disagrees",
      "appliesTo": [
        "Flow meter and controller signal paths; confirm sensor type, output units and installation requirements."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Existing diagnostic guidance with no traceable path-level source citation. Verify each model-specific instruction against the installed equipment documentation; search links are not verified sources.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Compare the controller reading with a suitable independent flow reference and the meter output.",
        "Record units, scaling and installation conditions; use the applicable meter accuracy specification, not an invented tolerance."
      ],
      "equipmentOptional": false,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Does the controller reading match the meter’s own local display/output?",
          "options": [
            {
              "label": "No, they differ",
              "next": "w"
            },
            {
              "label": "Yes, they match",
              "next": "b"
            }
          ]
        },
        "w": {
          "result": true,
          "domain": "SIGNAL / SCALING",
          "assessment": "The meter may be fine; units, K-factor/pulse scaling or signal type is off.",
          "measurements": [
            "Meter output (pulse/mA) with a meter",
            "Controller scaling units and K-factor",
            "Wiring, shielding and splices"
          ],
          "search": "flow sensor pulse K factor scaling irrigation controller wrong flow",
          "tool": "xdcr"
        },
        "b": {
          "question": "Is the meter installed to spec (straight runs, full pipe, correct size, clean)?",
          "options": [
            {
              "label": "No, or unknown",
              "next": "i"
            },
            {
              "label": "Yes",
              "next": "c"
            }
          ]
        },
        "i": {
          "result": true,
          "domain": "INSTALLATION",
          "assessment": "Turbulence, air or oversizing causes errors.",
          "measurements": [
            "Upstream/downstream straight pipe lengths",
            "Pipe full at low flow?",
            "Sensor fouling/debris"
          ],
          "search": "flow meter straight pipe requirements installation errors"
        },
        "c": {
          "result": true,
          "domain": "VERIFY INDEPENDENTLY",
          "assessment": "Compare with a second source before blaming the meter.",
          "measurements": [
            "Flow from pump curve (head, amps)",
            "Tank fill time or portable meter",
            "Pipe velocity from known zone demand"
          ],
          "search": "verify flow meter accuracy field check clamp-on",
          "tool": "pipe"
        }
      },
      "reviewFlags": [
        {
          "node": "c",
          "category": "model-specific-limit",
          "note": "Pump-curve or current-based flow inference is not an independent calibrated reference. Establish a suitable independent measurement and meter-specific uncertainty."
        }
      ]
    },
    "ctrl": {
      "title": "Controller vs hydraulic",
      "symptom": "Controller vs hydraulic",
      "appliesTo": [
        "Irrigation controller, field valve and hydraulic system; confirm conventional or decoder wiring."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Existing diagnostic guidance with no traceable path-level source citation. Verify each model-specific instruction against the installed equipment documentation; search links are not verified sources.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Verify the commanded valve responds and the measured flow/pressure matches the documented operating condition.",
        "Record evidence distinguishing command delivery, valve response and hydraulic capacity."
      ],
      "equipmentOptional": false,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Does the problem remain when you run the station manually at the valve?",
          "options": [
            {
              "label": "Yes, still wrong",
              "next": "h"
            },
            {
              "label": "No, manual works fine",
              "next": "b"
            }
          ]
        },
        "h": {
          "result": true,
          "domain": "HYDRAULIC",
          "assessment": "Fault is in the field/hydraulics, not the controller.",
          "measurements": [
            "Pressure/flow at the station",
            "Valve/solenoid condition, strainers, pipe size",
            "Compare with learned or expected flow"
          ],
          "search": "irrigation valve zone low flow hydraulic troubleshooting",
          "tool": "pipe"
        },
        "b": {
          "question": "Is solenoid/decoder voltage and response good at the valve during a command?",
          "options": [
            {
              "label": "No: low voltage or no response",
              "next": "t"
            },
            {
              "label": "Yes: command arrives properly",
              "next": "p"
            }
          ]
        },
        "t": {
          "result": true,
          "domain": "TWO-WIRE / ELECTRICAL",
          "assessment": "Command isn’t reaching the valve reliably.",
          "measurements": [
            "Voltage at decoder and at solenoid during command",
            "Line current/signal quality",
            "Splices, surge protection, ground"
          ],
          "search": "two wire decoder irrigation low voltage troubleshooting current draw"
        },
        "p": {
          "result": true,
          "domain": "CONTROLLER CONFIG",
          "assessment": "Look at stale learned flow, hydraulic tree/sequence, flow zones or schedule conflicts.",
          "measurements": [
            "Learned flow history vs measured",
            "Sequence/overlap and capacity settings",
            "Alarm timing and thresholds"
          ],
          "search": "WeatherTRAK OptiFlow learned flow flow alerts troubleshooting"
        }
      },
      "reviewFlags": [
        {
          "node": "a",
          "category": "operating-test",
          "note": "Use existing authorized manual-valve evidence; this question does not authorize opening a valve or changing demand. Establish pressure, flood and automatic-start hazards first."
        },
        {
          "node": "b",
          "category": "energized-testing",
          "note": "Conventional and proprietary decoder signals need different approved instruments/methods. Voltage/response checks require the installed controller/decoder procedure."
        },
        {
          "node": "p",
          "category": "parameter-change",
          "note": "Do not relearn flow or alter capacity, sequencing or alarm thresholds until the physical cause and commissioned baseline are established."
        }
      ]
    },
    "sfault": {
      "title": "Station safety fault",
      "symptom": "Station safety fault",
      "appliesTo": [
        "Pump stations with active safety faults; use the station-specific protection logic."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Existing diagnostic guidance with no traceable path-level source citation. Verify each model-specific instruction against the installed equipment documentation; search links are not verified sources.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Verify the triggering condition against an independent reading and the documented safety logic.",
        "Prove the cause is corrected without bypassing a safety or raising its limit merely to clear the fault."
      ],
      "equipmentOptional": false,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Which safety or fault is showing? (Find the cause; do not bypass a safety or raise its setpoint just to clear it.)",
          "options": [
            {
              "label": "Low discharge pressure",
              "next": "flow:wont"
            },
            {
              "label": "High discharge pressure",
              "next": "hp"
            },
            {
              "label": "Low inlet pressure / loss of prime / low level",
              "next": "lo"
            },
            {
              "label": "Phase fault",
              "next": "ph"
            },
            {
              "label": "VFD fault",
              "next": "flow:trip"
            },
            {
              "label": "Motor won’t start",
              "next": "flow:nostart"
            }
          ]
        },
        "hp": {
          "result": true,
          "domain": "HYDRAULIC / CONTROL",
          "assessment": "Pressure is above the safety limit. Confirm the reading is real before chasing the pump.",
          "measurements": [
            "Reference gauge vs transducer reading",
            "Regulating/PRV valves, closed downstream valves, zones not running",
            "Setpoint, PID overshoot and decel behavior"
          ],
          "search": "pump station high discharge pressure fault troubleshooting",
          "tool": "xdcr"
        },
        "lo": {
          "result": true,
          "domain": "SUCTION / SOURCE",
          "assessment": "Water source, intake or sensing problem.",
          "measurements": [
            "Source level and intake/screen condition",
            "Suction valves, strainers, air leaks, prime status",
            "Verify the low-level/low-inlet switch or transducer actually matches reality",
            "If suction-leak monitoring is present (for example Prime Assure), review recent leak-cycle and intake-pressure alerts before teardown"
          ],
          "search": "pump station low inlet pressure loss of prime low level fault troubleshooting",
          "tool": "npsh"
        },
        "ph": {
          "result": true,
          "domain": "SUPPLY",
          "assessment": "Incoming power or phase monitoring problem.",
          "measurements": [
            "Voltage on each phase at the service disconnect and at the panel",
            "Fuses/breakers, utility outage or single-phasing",
            "Phase monitor settings, sequence and imbalance thresholds",
            "Surge suppressor indicator state after recent events"
          ],
          "search": "pump station phase fault phase loss relay troubleshooting"
        }
      },
      "reviewFlags": [
        {
          "node": "ph",
          "category": "energized-testing",
          "note": "Service-disconnect/panel measurements are qualified electrical work under an approved procedure; the dashboard is not an access authorization."
        },
        {
          "node": "hp",
          "category": "parameter-change",
          "note": "Review the high-pressure cause and commissioned limits; do not change PID or protection settings merely to clear the safety."
        }
      ]
    },
    "nostart": {
      "title": "Motor won’t start",
      "symptom": "Motor won’t start",
      "appliesTo": [
        "Pump motor start chains; confirm drive/starter, command source and site permissives."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Existing diagnostic guidance with no traceable path-level source citation. Verify each model-specific instruction against the installed equipment documentation; search links are not verified sources.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Verify the authorized start command reaches the motor chain with required permissives intact.",
        "Record voltage, current, speed and delivered duty after the corrected start sequence."
      ],
      "equipmentOptional": false,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Is control power present, and is the station in the right mode with no active fault or safety?",
          "options": [
            {
              "label": "No: dead panel, fault or safety active",
              "next": "c1"
            },
            {
              "label": "Yes: ready and calling to run",
              "next": "b"
            }
          ]
        },
        "c1": {
          "result": true,
          "domain": "CONTROL / PERMISSIVES",
          "assessment": "Something in the start chain is open.",
          "measurements": [
            "Control power and control transformer fuses",
            "E-stop, door and safety interlocks, reset status",
            "HOA/local-remote mode state (HAND is test-only and may bypass safeties)",
            "Alarm/fault history on the panel display"
          ],
          "search": "pump station will not start control power safety interlock reset"
        },
        "b": {
          "question": "Does the drive or starter respond (contactor pulls in or drive shows run)?",
          "options": [
            {
              "label": "No response",
              "next": "c2"
            },
            {
              "label": "Yes, it energizes",
              "next": "c"
            }
          ]
        },
        "c2": {
          "result": true,
          "domain": "COMMAND CHAIN",
          "assessment": "Run command is not reaching the drive/starter.",
          "measurements": [
            "Run command voltage at the drive/starter input",
            "Local/remote/auto mode selection",
            "Permissive relays and PLC output status",
            "On CLP/ACLP variants, confirm required start permissive to the drive (for example clock/flow/PSR path) is present even in manual testing"
          ],
          "search": "VFD pump will not run start command local remote permissive"
        },
        "c": {
          "question": "What does motor current do while commanded to run?",
          "options": [
            {
              "label": "No current",
              "next": "o1"
            },
            {
              "label": "High current, shaft not turning",
              "next": "m1"
            }
          ]
        },
        "o1": {
          "result": true,
          "domain": "ELECTRICAL",
          "assessment": "Output path is open: contactor, overload, disconnected lead, or winding.",
          "measurements": [
            "Output voltage at drive/starter",
            "Overload relay state",
            "Winding continuity and insulation resistance with leads isolated (locked out)"
          ],
          "search": "3 phase motor no current open winding troubleshooting megger"
        },
        "m1": {
          "result": true,
          "domain": "MECHANICAL",
          "assessment": "Locked rotor or severe binding.",
          "measurements": [
            "Shaft turns by hand (locked out)",
            "Bearings, impeller binding, debris or ice",
            "Coupling/shaft condition"
          ],
          "search": "centrifugal pump motor locked rotor shaft seized troubleshooting"
        }
      },
      "reviewFlags": [
        {
          "node": "c1",
          "category": "operating-test",
          "note": "HAND/manual operation and reset may bypass normal logic or start equipment unexpectedly. Observe the recorded mode; do not use HAND to defeat an open permissive."
        },
        {
          "node": "c2",
          "category": "energized-testing",
          "note": "Run-command/permissive measurements require qualified access and the exact schematic; no jumper or override is authorized."
        },
        {
          "node": "o1",
          "category": "energized-testing",
          "note": "VFD output and winding tests need suitable instruments, isolation and separation from drive electronics under the manufacturer procedure."
        },
        {
          "node": "m1",
          "category": "operating-test",
          "note": "Shaft checks need full mechanical/electrical isolation, zero-energy verification and a qualified maintainer; keep guards in place during operation."
        }
      ]
    },
    "vib": {
      "title": "Seal leak / noise / vibration",
      "symptom": "Seal leak / noise / vibration",
      "appliesTo": [
        "Pump seals, bearings and coupled equipment; confirm pump construction and allowable operating range."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Existing diagnostic guidance with no traceable path-level source citation. Verify each model-specific instruction against the installed equipment documentation; search links are not verified sources.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Compare leakage, vibration or temperature with the applicable manufacturer limit at documented duty.",
        "Record the inspection/correction and repeat observations under comparable operating conditions."
      ],
      "equipmentOptional": false,
      "start": "a",
      "nodes": {
        "a": {
          "question": "What are you seeing?",
          "options": [
            {
              "label": "Leak at the mechanical seal",
              "next": "sl"
            },
            {
              "label": "Bearing noise or heat",
              "next": "br"
            },
            {
              "label": "Vibration or rumbling",
              "next": "b"
            }
          ]
        },
        "sl": {
          "result": true,
          "domain": "MECHANICAL",
          "assessment": "Seals fail from dry running, cavitation, misalignment, shaft runout or contamination. Find why before replacing.",
          "measurements": [
            "Leak source: seal vs casing/gland",
            "Shaft runout and alignment",
            "Evidence of dry running or cavitation upstream"
          ],
          "search": "centrifugal pump mechanical seal failure causes shaft runout alignment"
        },
        "br": {
          "result": true,
          "domain": "MECHANICAL",
          "assessment": "Check lubrication, alignment, load and contamination.",
          "measurements": [
            "Bearing temperature and lubrication",
            "Alignment and belt tension (if belt drive)",
            "Radial/axial load from piping strain"
          ],
          "search": "centrifugal pump bearing failure causes misalignment lubrication"
        },
        "b": {
          "question": "Does vibration change with flow or speed?",
          "options": [
            {
              "label": "Worse at high or low flow",
              "next": "h"
            },
            {
              "label": "Worse at a certain Hz/speed",
              "next": "r"
            },
            {
              "label": "Constant at all conditions",
              "next": "al"
            }
          ]
        },
        "h": {
          "result": true,
          "domain": "HYDRAULIC",
          "assessment": "Operating far from best efficiency point or cavitating.",
          "measurements": [
            "Flow vs pump curve and BEP",
            "Suction conditions and noise character"
          ],
          "search": "pump vibration away from best efficiency point recirculation cavitation",
          "tool": "npsh"
        },
        "r": {
          "result": true,
          "domain": "RESONANCE",
          "assessment": "A structural or piping resonance at a specific speed.",
          "measurements": [
            "Note the Hz where it peaks",
            "Use VFD skip/jump frequency per your manual",
            "Check supports, bases and pipe clamps"
          ],
          "search": "VFD skip frequency pump resonance vibration",
          "tool": "hz"
        },
        "al": {
          "result": true,
          "domain": "MECHANICAL",
          "assessment": "Typical: soft foot, misalignment, imbalance, pipe strain or worn bearings.",
          "measurements": [
            "Soft foot and base bolts",
            "Coupling alignment",
            "Impeller condition and pipe strain"
          ],
          "search": "centrifugal pump vibration alignment soft foot imbalance pipe strain"
        }
      },
      "reviewFlags": [
        {
          "node": "sl",
          "category": "operating-test",
          "note": "Seal, alignment and runout checks require the applicable guarded or isolated service procedure, including hydraulic depressurization."
        },
        {
          "node": "r",
          "category": "parameter-change",
          "note": "Changing skip/jump frequencies requires approved vibration evidence, the exact drive procedure and vendor review; do not select a generic exclusion band."
        }
      ]
    },
    "fa": {
      "title": "High / low flow alarm",
      "symptom": "High / low flow alarm",
      "appliesTo": [
        "Irrigation systems with flow monitoring; confirm controller, flow zone and alarm definition."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Existing diagnostic guidance with no traceable path-level source citation. Verify each model-specific instruction against the installed equipment documentation; search links are not verified sources.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Record the alarm category, measured flow, expected demand and the applicable controller threshold/delay.",
        "Verify the underlying flow condition and alarm behavior during the permitted operating sequence."
      ],
      "equipmentOptional": false,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Is the alarm confirmed by an independent source (second meter, pump curve, visual)?",
          "options": [
            {
              "label": "No / not sure",
              "next": "flow:flow"
            },
            {
              "label": "Yes, flow really is high",
              "next": "hi"
            },
            {
              "label": "Yes, flow really is low",
              "next": "lw"
            },
            {
              "label": "Rain Bird wording: Flow Meter Fault / Pipe Break / Starts Per Hour",
              "next": "flow:rbflow"
            }
          ]
        },
        "hi": {
          "result": true,
          "domain": "HYDRAULIC",
          "assessment": "Real excess flow: break, valve stuck open, damaged heads or overlapping zones.",
          "measurements": [
            "Pressure drop vs normal at same station",
            "Which zones are on when it starts",
            "Valve positions, mainline and lateral leak signs"
          ],
          "search": "irrigation high flow alarm mainline break stuck valve troubleshooting"
        },
        "lw": {
          "result": true,
          "domain": "HYDRAULIC / VALVE",
          "assessment": "Restriction or valves not opening.",
          "measurements": [
            "Strainers, filters, partially closed valves",
            "Pump output at this speed vs curve",
            "Valve/solenoid command and voltage"
          ],
          "search": "irrigation low flow alarm clogged strainer valve not opening troubleshooting",
          "tool": "pipe"
        }
      },
      "reviewFlags": [
        {
          "node": "lw",
          "category": "energized-testing",
          "note": "Valve/solenoid voltage checks require a qualified person and the controller-specific safe test method; a no-flow alarm does not prove an electrical fault."
        }
      ]
    },
    "rbflow": {
      "title": "Rain Bird flow/pressure alarms",
      "symptom": "Rain Bird flow/pressure alarms",
      "appliesTo": [
        "Rain Bird flow/pressure monitoring; confirm platform, sensor and alarm definition."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Existing diagnostic guidance with no traceable path-level source citation. Verify each model-specific instruction against the installed equipment documentation; search links are not verified sources.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Verify sensor readings and alarm conditions against the exact Rain Bird platform documentation.",
        "Record the corrected flow/pressure or filter-flush behavior without masking a real alarm."
      ],
      "equipmentOptional": false,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Which Rain Bird alarm pattern is active?",
          "options": [
            {
              "label": "Flow Meter Fault",
              "next": "fm"
            },
            {
              "label": "Pipe Break / High Flow",
              "next": "hf"
            },
            {
              "label": "Low Pressure Fault",
              "next": "lp"
            },
            {
              "label": "Pressure Transducer Fault",
              "next": "pt"
            },
            {
              "label": "Starts Per Hour",
              "next": "sh"
            },
            {
              "label": "Filter platform rinse/flush behavior",
              "next": "fi"
            }
          ]
        },
        "fm": {
          "result": true,
          "domain": "RAIN BIRD FLOW METER FAULT",
          "assessment": "This can mean low/no flow plus low pressure after pump run time; it does not automatically prove a bad meter.",
          "measurements": [
            "Typical trigger context in Rain Bird training is less than about 3 GPM with low pressure after run time (confirm against your controller revision)",
            "Confirm the commanded pump is truly running (breaker/contactor/VFD status)",
            "Verify controller logic is using the correct sensor type (flow switch vs flow meter) and that the meter is enabled where required",
            "Check discharge path and PRV/filter flushing behavior before replacing the meter",
            "Verify meter signal wiring and controller scaling at the input"
          ],
          "search": "Rain Bird flow meter fault low flow low pressure troubleshooting",
          "tool": "flowcal"
        },
        "hf": {
          "result": true,
          "domain": "RAIN BIRD PIPE BREAK / HIGH FLOW",
          "assessment": "High flow compares measured flow to computed capacity from alarm-flow-per-pump and running pumps.",
          "measurements": [
            "Alarm Flow per Pump setting versus actual pump capacity and staged pump count",
            "Leak path, stuck-open valve, or overlap timing when the event starts",
            "Whether the alarm is now blocked hard after repeated auto-resets"
          ],
          "search": "Rain Bird pipe break high flow alarm flow per pump troubleshooting",
          "tool": "pipe"
        },
        "lp": {
          "result": true,
          "domain": "RAIN BIRD LOW PRESSURE FAULT",
          "assessment": "Low pressure may be hydraulic demand, inlet condition, or an expected pump that is not actually running.",
          "measurements": [
            "Inlet pressure/lift and suction condition under load",
            "PRV stuck open, active filter flush, and discharge-valve position",
            "Expected running pumps versus actual running pumps (including tripped breakers)"
          ],
          "search": "Rain Bird low pressure fault irrigation pump station troubleshooting",
          "tool": "npsh"
        },
        "pt": {
          "result": true,
          "domain": "RAIN BIRD PRESSURE TRANSDUCER FAULT",
          "assessment": "No valid pressure signal under run conditions is often wiring/scaling/transducer failure, not PID.",
          "measurements": [
            "Reference gauge versus displayed pressure and live 4-20 mA signal",
            "Small-platform clue: -62 PSI often indicates loop/scaling or VFD-to-PLC communication setup issues (check Input 4/PC path and comm cable)",
            "Cable/terminal integrity and analog input health (including freeze damage) and verify transducer max scaling value for the installed sensor"
          ],
          "search": "Rain Bird pressure transducer fault -62 PSI troubleshooting",
          "tool": "xdcr"
        },
        "sh": {
          "result": true,
          "domain": "RAIN BIRD STARTS PER HOUR",
          "assessment": "Short cycling usually starts with system demand behavior, not with increasing alarm limits.",
          "measurements": [
            "Field leaks, overlap/program timing, hand watering/syringing, and check-valve sealing",
            "Remember: starts are triggered by low pressure and stops by low flow behavior",
            "Adjust wake/sleep margins only after the hydraulic cause is confirmed"
          ],
          "search": "Rain Bird starts per hour alarm short cycling troubleshooting"
        },
        "fi": {
          "result": true,
          "domain": "RAIN BIRD FILTER PLATFORM",
          "assessment": "Filter issues can mimic pump or flow faults if rinse hydraulics are wrong.",
          "measurements": [
            "Confirm rinse discharge goes to atmosphere (not submerged, not into a pressurized line)",
            "Verify rinse-line routing: avoid long runs/multiple bends and avoid downsizing",
            "Check wye strainer and speed regulator on hydraulic piston control tubing",
            "For hydraulic scanning filters, confirm rinse cycle time and rinse pressure (some training references target roughly 17-20 seconds)",
            "For HT stainless screen filters, verify flush speed-cycle setting and full piston stroke before retuning alarms"
          ],
          "search": "Rain Bird filter platform troubleshooting rinse cycle pressure differential wye strainer"
        }
      },
      "reviewFlags": [
        {
          "node": "hf",
          "category": "parameter-change",
          "note": "Do not clear repeated lockouts or change reset behavior to suppress an unresolved flow condition. Confirm the exact platform alarm/recovery logic."
        },
        {
          "node": "fi",
          "category": "operating-test",
          "note": "Strainer and hydraulic control-tubing work require isolation and depressurization; verify the filter/actuator service procedure before opening lines."
        }
      ]
    },
    "wtflow": {
      "title": "WeatherTRAK flow alerts",
      "symptom": "WeatherTRAK flow alerts",
      "appliesTo": [
        "WeatherTRAK flow monitoring; confirm controller model, firmware and applicable alert definition."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Existing diagnostic guidance with no traceable path-level source citation. Verify each model-specific instruction against the installed equipment documentation; search links are not verified sources.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Match the WeatherTRAK alert category to actual valve states, demand and independent readings.",
        "Record the corrected behavior under the documented flow-monitoring window and settings."
      ],
      "equipmentOptional": false,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Which WeatherTRAK flow condition are you troubleshooting?",
          "options": [
            {
              "label": "Controller high flow / mainline break",
              "next": "mh"
            },
            {
              "label": "Station high flow",
              "next": "sh"
            },
            {
              "label": "Station no flow",
              "next": "sn"
            },
            {
              "label": "Leak / extended leak",
              "next": "lk"
            },
            {
              "label": "Flow history does not match field evidence",
              "next": "vr"
            }
          ]
        },
        "mh": {
          "result": true,
          "domain": "CONTROL / FLOW CONFIG",
          "assessment": "Treat this as a potential mainline break until proven otherwise. WeatherTRAK logic can stop stations, test for continuing flow, and then close the master valve if break conditions persist.",
          "measurements": [
            "Mainline break threshold and delay (1-6 min) in controller/central settings",
            "Whether stations were stacked or overlapping when the alert occurred",
            "Flow after stations stop; if it remains above threshold, find leak path before restart",
            "Audit who issued remote event pause/shut-off and when"
          ],
          "search": "WeatherTRAK mainline break threshold delay troubleshooting"
        },
        "sh": {
          "result": true,
          "domain": "CONTROL / FLOW CONFIG",
          "assessment": "Station high flow uses learned/assigned station flow plus offsets or station-specific limits. False trips usually come from stale learned values, threshold drift, or hydraulic changes.",
          "measurements": [
            "Assigned/learned station flow vs measured station flow",
            "Global offset or station-specific high-flow threshold and delay",
            "Recent nozzle/valve/head changes since the last learn cycle",
            "Whether high-flow events escalated into mainline-break logic"
          ],
          "search": "WeatherTRAK station high flow learned flow threshold troubleshooting",
          "tool": "flowcal"
        },
        "sn": {
          "result": true,
          "domain": "CONTROL / FLOW CONFIG",
          "assessment": "No-flow alerts mean commanded irrigation with little/no measured flow (for example pump start fail, closed isolation/backflow, or scaling error).",
          "measurements": [
            "No-flow threshold/delay and any excluded stations",
            "Pump-start/master-valve output state during the event",
            "Upstream isolation/backflow status and station command voltage at valve",
            "If three stations in a row hit no-flow, verify why irrigation was suspended"
          ],
          "search": "WeatherTRAK station no flow alert troubleshooting pump start master valve"
        },
        "lk": {
          "result": true,
          "domain": "CONTROL / LEAK MONITORING",
          "assessment": "Leak monitoring is evaluated when no scheduled/manual station is running. Extended leak logic supports normally-open master-valve systems while reducing nuisance trips.",
          "measurements": [
            "Leak threshold and delay plus extended-leak settings",
            "Whether any station/manual run was active during the event window",
            "If normally-open MV is used, confirm extended-leak closure and reset behavior",
            "Trend overnight flow against baseline and recent alerts"
          ],
          "search": "WeatherTRAK extended leak detection normally open master valve troubleshooting"
        },
        "vr": {
          "result": true,
          "domain": "SIGNAL / SCALING",
          "assessment": "History mismatches are usually K/offset, wiring/signal, or installation-condition issues before they are software defects.",
          "measurements": [
            "Sensor type and K/offset at controller match the meter output/register",
            "Pulse/mA signal at controller input matches live meter output",
            "For FlowHD, verify straight-run and air-vent install guidance; for Flow3, verify register/output selection",
            "Compare alert timestamps with field operations and manual runs"
          ],
          "search": "WeatherTRAK flow history does not match field readings k factor offset troubleshooting",
          "tool": "flowcal"
        }
      },
      "reviewFlags": [
        {
          "node": "mh",
          "category": "model-specific-limit",
          "note": "The displayed delay range is legacy guidance, not a verified limit for every model/firmware. Confirm the installed alert definition and configured values."
        },
        {
          "node": "sn",
          "category": "energized-testing",
          "note": "Valve-command voltage measurements need the exact wiring/control procedure and qualified access."
        },
        {
          "node": "lk",
          "category": "parameter-change",
          "note": "Extended-leak, normally-open master-valve and reset behavior require model-specific confirmation; do not change protection or force a reset from this guide."
        }
      ]
    },
    "lflow": {
      "title": "Learned vs measured flow",
      "symptom": "Learned vs measured flow",
      "appliesTo": [
        "Irrigation flow-learning systems; confirm the learning conditions, sensor and hydraulic capacity."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Existing diagnostic guidance with no traceable path-level source citation. Verify each model-specific instruction against the installed equipment documentation; search links are not verified sources.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Compare learned and measured flow under equivalent pressure, valve and demand conditions.",
        "Document the cause of the mismatch before any authorized relearning or threshold change."
      ],
      "equipmentOptional": false,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Has anything changed hydraulically since the flow was learned (nozzles, heads, repairs, valve or zone changes, pump or pressure changes)?",
          "options": [
            {
              "label": "Yes, something changed",
              "next": "st"
            },
            {
              "label": "No / not sure",
              "next": "b"
            }
          ]
        },
        "st": {
          "result": true,
          "domain": "CONTROL CONFIG",
          "assessment": "Learned values may be stale for the new hydraulics. Fix any real problem first, then re-learn per the controller manual.",
          "measurements": [
            "What changed and when",
            "Pressure at the station now vs before",
            "Learned flow history vs current measured flow"
          ],
          "search": "central control learned flow out of date after changes relearn flow"
        },
        "b": {
          "question": "Does an independent flow reading (portable meter, tank fill, pump curve) agree with the flow sensor?",
          "options": [
            {
              "label": "Yes, the sensor is right",
              "next": "hy"
            },
            {
              "label": "No, they differ",
              "next": "flow:flow"
            }
          ]
        },
        "hy": {
          "result": true,
          "domain": "HYDRAULIC",
          "assessment": "Real flow differs from learned: leak, partial blockage, worn valve, overlapping stations, or a pressure shift.",
          "measurements": [
            "Station pressure vs normal at the same flow",
            "Which stations run together at alarm time",
            "Valve and strainer condition; signs of a leak"
          ],
          "search": "irrigation measured flow higher lower than learned flow causes",
          "tool": "pipe"
        }
      },
      "reviewFlags": [
        {
          "node": "st",
          "category": "parameter-change",
          "note": "Relearning affects the alarm baseline. Correct the physical cause and confirm controller learning conditions before any authorized relearn."
        }
      ]
    },
    "tw": {
      "title": "Two-wire / decoder problem",
      "symptom": "Two-wire / decoder problem",
      "appliesTo": [
        "Two-wire irrigation systems; use the exact compatible controller/decoder family and approved diagnostic method."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Existing diagnostic guidance with no traceable path-level source citation. Verify each model-specific instruction against the installed equipment documentation; search links are not verified sources.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Compare path measurements with the exact controller/decoder diagnostic procedure and documented baseline.",
        "Verify compatible devices and affected stations respond after repair; an idle-current subtotal alone is not a pass/fail test."
      ],
      "equipmentOptional": false,
      "start": "a",
      "nodes": {
        "a": {
          "question": "How much of the system is affected?",
          "options": [
            {
              "label": "One decoder/station",
              "next": "one"
            },
            {
              "label": "A branch or section",
              "next": "br"
            },
            {
              "label": "The whole line",
              "next": "all"
            },
            {
              "label": "Check expected idle current from decoder count",
              "next": "idle"
            }
          ]
        },
        "idle": {
          "result": true,
          "domain": "IDLE CURRENT / INVENTORY",
          "assessment": "Calculate a decoder-only idle subtotal for the exact family. Nominal figures without tolerances are not pass/fail limits.",
          "measurements": [
            "Physical decoder count on the measured path/module, not station or solenoid count",
            "No active stations or master valves; path powered in the specified diagnostic state",
            "Exact controller/decoder family and manufacturer-approved measurement method",
            "Unmodeled devices, path effects and known-good baseline; a current difference alone does not identify a fault"
          ],
          "search": "decoder standby idle current manufacturer troubleshooting",
          "tool": "decoderidle"
        },
        "one": {
          "result": true,
          "domain": "DECODER / LOCAL",
          "assessment": "Likely the decoder, solenoid or its splice at that valve.",
          "measurements": [
            "Voltage at the decoder and solenoid resistance (power off)",
            "Splice condition (water ingress)",
            "Swap test with a known-good decoder",
            "If WeatherTRAK, verify local WT2W-LSP/flow-decoder grounding is intact (50 Ω max target)"
          ],
          "search": "two wire decoder single station not working solenoid resistance splice"
        },
        "br": {
          "result": true,
          "domain": "WIRING",
          "assessment": "Break, bad splice or short on that branch.",
          "measurements": [
            "Line current with the branch connected vs isolated",
            "Continuity and insulation to ground on the branch (locked out)",
            "Splices between the last working and first failed decoder",
            "If WeatherTRAK star layout is used, verify WT2W-LSP placement: near controller, every 500 ft or 5 decoders, and at branch ends 25 ft or longer"
          ],
          "search": "two wire irrigation branch fault locating splice break short",
          "tool": "twvd"
        },
        "all": {
          "result": true,
          "domain": "ELECTRICAL / CONTROLLER",
          "assessment": "Controller output, short on the line, ground leakage, or surge damage.",
          "measurements": [
            "Line voltage at the controller output and at the far end",
            "Line current draw vs normal",
            "Insulation to ground, surge protection and ground rod condition",
            "If WeatherTRAK, confirm grounding targets: controller 10 Ω max and line surge protectors/flow decoders 50 Ω max"
          ],
          "search": "two wire decoder line short ground fault surge troubleshooting current draw",
          "tool": "twvd"
        }
      },
      "reviewFlags": [
        {
          "node": "one",
          "category": "energized-testing",
          "note": "Separate powered waveform/voltage checks from power-off solenoid-resistance checks. Use the exact compatible decoder diagnostic method and suitable instrument."
        },
        {
          "node": "br",
          "category": "energized-testing",
          "note": "Insulation/continuity tests require isolation and removal of sensitive decoders/modules as the manufacturer directs; do not apply a generic megger procedure to a connected path."
        },
        {
          "node": "all",
          "category": "energized-testing",
          "note": "Powered proprietary signal checks and isolated insulation tests are different procedures. Establish controller-specific test state, compatible instruments and equipment separation first."
        }
      ]
    },
    "comm": {
      "title": "Controller offline / comms",
      "symptom": "Controller offline / comms",
      "appliesTo": [
        "Irrigation controller communications; confirm local operation and the installed communication service."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Existing diagnostic guidance with no traceable path-level source citation. Verify each model-specific instruction against the installed equipment documentation; search links are not verified sources.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Verify the controller still operates locally and communication reports reach the intended platform.",
        "Record controller identity, connection type, report time and relevant service/firmware status."
      ],
      "equipmentOptional": false,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Does the controller have power and run its program locally?",
          "options": [
            {
              "label": "No: dead or not running",
              "next": "pw"
            },
            {
              "label": "Yes, it runs but isn’t reporting",
              "next": "b"
            }
          ]
        },
        "pw": {
          "result": true,
          "domain": "POWER",
          "assessment": "Check power before communications.",
          "measurements": [
            "Voltage at the controller input and breaker",
            "Transformer/fuse and battery",
            "Display and status LEDs"
          ],
          "search": "irrigation controller no power transformer fuse troubleshooting"
        },
        "b": {
          "question": "Is the signal strength/antenna indicator healthy and the service/account active?",
          "options": [
            {
              "label": "No: weak or no signal",
              "next": "sg"
            },
            {
              "label": "Signal looks fine",
              "next": "ac"
            }
          ]
        },
        "sg": {
          "result": true,
          "domain": "SIGNAL",
          "assessment": "Antenna or coverage problem.",
          "measurements": [
            "Signal strength indicator at the controller",
            "Antenna placement, cable and connectors",
            "Metal enclosure or obstruction effects"
          ],
          "search": "irrigation controller cellular antenna weak signal troubleshooting"
        },
        "ac": {
          "result": true,
          "domain": "ACCOUNT / SOFTWARE",
          "assessment": "Service, activation or firmware issue.",
          "measurements": [
            "Account, activation and subscription status",
            "Firmware version and update availability",
            "Communication alert indicators at controller (for example days-since-ET update / audible alert behavior)",
            "Contact manufacturer support with controller ID and the time it last reported"
          ],
          "search": "central control controller offline not communicating activation subscription firmware"
        }
      },
      "reviewFlags": [
        {
          "node": "pw",
          "category": "energized-testing",
          "note": "Incoming-power/breaker measurements require qualified electrical access; confirm the local power arrangement before opening an enclosure."
        }
      ]
    },
    "pstart": {
      "title": "Pump start / master valve not operating",
      "symptom": "Pump start / master valve not operating",
      "appliesTo": [
        "Irrigation pump-start and master-valve chains; confirm output assignment, relay and station interfaces."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Existing diagnostic guidance with no traceable path-level source citation. Verify each model-specific instruction against the installed equipment documentation; search links are not verified sources.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Verify the output, relay/master valve and station start sequence under an authorized command.",
        "Record command and response evidence; return the system to its documented normal operating mode."
      ],
      "equipmentOptional": false,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Does the controller show the pump-start or master-valve output as ON when it should?",
          "options": [
            {
              "label": "No, output not turning on",
              "next": "cf"
            },
            {
              "label": "Yes, it shows ON",
              "next": "b"
            }
          ]
        },
        "cf": {
          "result": true,
          "domain": "CONTROLLER CONFIG",
          "assessment": "Output is not being called.",
          "measurements": [
            "Pump-start/master-valve assignment on the running stations",
            "Watering window, pauses, rain or sensor holds, active alarms",
            "Output status in the controller diagnostics",
            "If a single POC is shared (FlowShare/FlowLink style), confirm controller water windows are not overlapping",
            "If a temporary commissioning jumper bypassed the pump-start relay, remove it before returning station to normal operation"
          ],
          "search": "irrigation controller pump start master valve output not activating"
        },
        "b": {
          "question": "Is voltage present at the relay coil or master-valve solenoid terminals while ON?",
          "options": [
            {
              "label": "No voltage",
              "next": "wr"
            },
            {
              "label": "Voltage present",
              "next": "c"
            }
          ]
        },
        "wr": {
          "result": true,
          "domain": "ELECTRICAL",
          "assessment": "Output path is broken between controller and relay/valve.",
          "measurements": [
            "Voltage at the controller output terminals",
            "Fuses, wiring and splices to the relay/valve",
            "Output module health per your manual"
          ],
          "search": "irrigation pump start relay no voltage controller output troubleshooting"
        },
        "c": {
          "question": "Does the relay/contactor or valve respond when energized?",
          "options": [
            {
              "label": "No: relay or valve does not act",
              "next": "rl"
            },
            {
              "label": "Yes, and the pump station still doesn’t start",
              "next": "flow:nostart"
            }
          ]
        },
        "rl": {
          "result": true,
          "domain": "COMPONENT",
          "assessment": "Coil, relay, contactor or master valve failure.",
          "measurements": [
            "Coil resistance and mechanical movement",
            "Relay contacts continuity (locked out)",
            "Replace with known-good and retest"
          ],
          "search": "pump start relay coil failure irrigation master valve solenoid test"
        }
      },
      "reviewFlags": [
        {
          "node": "cf",
          "category": "operating-test",
          "note": "Only an authorized technician may identify/remove a commissioning jumper under the site isolation/recommissioning procedure; this is not permission to install or touch a live bypass."
        },
        {
          "node": "b",
          "category": "energized-testing",
          "note": "Relay/solenoid voltage checks are powered tests with possible automatic starts; use the approved schematic, access and instrumentation."
        },
        {
          "node": "rl",
          "category": "operating-test",
          "note": "Coil, contact or replacement checks require isolation, zero-energy verification, compatible ratings and an approved retest; do not swap a live component."
        }
      ]
    },
    "ptype": {
      "title": "Pump type",
      "symptom": "Identify or troubleshoot the installed pump type.",
      "appliesTo": [
        "Pump identification only; confirm the nameplate and actual suction/intake arrangement."
      ],
      "revision": 1,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Migrated from the existing dashboard. The complete decision path has not received a documented technical review."
      },
      "evidence": {
        "kind": "field-guidance",
        "note": "Existing diagnostic guidance with no traceable path-level source citation. Verify each model-specific instruction against the installed equipment documentation; search links are not verified sources.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Confirm the selected pump type using the nameplate, installation record and actual water path.",
        "Continue with that type-specific path; identification alone does not establish a fault."
      ],
      "equipmentOptional": true,
      "start": "a",
      "nodes": {
        "a": {
          "question": "What type of pump is it? Check the nameplate and how the water reaches the pump.",
          "options": [
            {
              "label": "Suction lift: pump sits above the water and pulls it up",
              "next": "flow:pt_lift"
            },
            {
              "label": "Flooded suction: water level above the pump inlet",
              "next": "flow:pt_flood"
            },
            {
              "label": "Vertical turbine: bowls submerged on a lineshaft, motor on top",
              "next": "flow:pt_vt"
            },
            {
              "label": "Submersible: pump and motor submerged together",
              "next": "flow:pt_sub"
            },
            {
              "label": "Booster: takes pressurized water from a supply",
              "next": "flow:pt_boost"
            },
            {
              "label": "Jet pump: ejector (nozzle and venturi) assists suction",
              "next": "flow:pt_jet"
            }
          ]
        }
      }
    },
    "pt_lift": {
      "title": "Suction lift pump",
      "symptom": "Identify or troubleshoot the installed suction lift pump.",
      "appliesTo": [
        "Suction-lift pumps; verify priming arrangement, installed lift, curve and source level."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "engineering-guidance",
        "note": "Basis: engineering fundamentals and common industry practice, not manufacturer specifications. Minimum submergence, minimum flow, operating range, clearances and adjustment values come from your pump’s manual and curve. Items marked PROBABLE are hypotheses to confirm.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Verify prime retention and suction behavior at the documented duty and current water level.",
        "Compare delivered head/flow and NPSH conditions with the exact pump documentation."
      ],
      "equipmentOptional": true,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Does it lose prime, pull air, or surge (no pressure after start)?",
          "options": [
            {
              "label": "Yes: loses prime, surges or sucks air",
              "next": "b"
            },
            {
              "label": "No: it primes, but flow is low or it is noisy",
              "next": "c"
            }
          ]
        },
        "b": {
          "question": "With the pump locked out, do the suction line and foot valve hold water or vacuum?",
          "options": [
            {
              "label": "No: loses water or vacuum",
              "next": "leak"
            },
            {
              "label": "Yes: holds",
              "next": "sh"
            }
          ]
        },
        "leak": {
          "result": true,
          "domain": "SUCTION AIR LEAK / FOOT VALVE",
          "assessment": "PROBABLE: Air is entering or water is draining back through the foot valve, a loose or cracked suction fitting, a worn shaft seal, a casing gasket or a strainer lid. Air breaks prime and cuts capacity before it looks like classic cavitation.",
          "measurements": [
            "Fill the suction line with the pump off and watch the level drop to test the foot valve and joints",
            "Look for bubbles in a clear section or at the priming port while running",
            "Vacuum gauge: a fluttering or creeping needle points to air; a steady high reading points to lift or restriction",
            "Seal, packing and gasket condition on the suction side",
            "Suction line profile stays below pump and slopes to source with no crowns/high points that trap air",
            "Verify intake pipe joints/material are vacuum-tight; long large-diameter PVC runs are often leak-prone"
          ],
          "search": "centrifugal pump loses prime suction air leak foot valve troubleshooting",
          "tool": "npsh"
        },
        "sh": {
          "result": true,
          "domain": "PRIMING DEVICE / PUMP",
          "assessment": "PROBABLE: Suction is tight but prime is not established or held. For a self-priming pump check the priming chamber level, wear clearances and rotation; for an external priming system check the vacuum pump, ejector or priming valve.",
          "measurements": [
            "Casing or priming chamber filled to the level the manual states before start",
            "Rotation and speed (a VFD running slow can also fail to prime)",
            "Prime time against the manufacturer’s expectation for this lift",
            "Priming system operation and any air-release path on the discharge",
            "Prime the intake line and pump casing per OEM procedure before start (unless automated vacuum priming is installed)",
            "If a high-point air relief is installed, confirm it vents trapped air without pulling air during operation"
          ],
          "search": "self priming centrifugal pump will not prime troubleshooting wear plate clearance"
        },
        "c": {
          "question": "Have you measured suction vacuum at the pump inlet while running at duty flow?",
          "options": [
            {
              "label": "Yes: high vacuum, noise, flow falling",
              "next": "vp"
            },
            {
              "label": "No: not measured yet",
              "next": "m"
            }
          ]
        },
        "m": {
          "result": true,
          "domain": "SUCTION / MEASUREMENT",
          "assessment": "UNKNOWN until suction is measured at the inlet while running at duty flow, not static.",
          "measurements": [
            "Vacuum gauge at the suction flange at running flow",
            "Conversion (CALCULATED): 1 inHg is about 1.13 ft of water; 1 psi is 2.31 ft",
            "Actual lift: water level to pump centerline, and strainer or intake condition",
            "Compare running suction with calculated NPSHa and the NPSHr on the curve",
            "Measure lift at the current seasonal water level, not only design water level",
            "Check intake line size versus flow; same-size or one-size-larger suction line is common guidance for lift systems"
          ],
          "search": "pump suction vacuum gauge reading NPSH lift measure",
          "tool": "sys"
        },
        "vp": {
          "question": "As flow increases, what does the suction vacuum pattern look like?",
          "options": [
            {
              "label": "Vacuum rises rapidly with flow",
              "next": "vr"
            },
            {
              "label": "Vacuum rises then suddenly drops as prime is lost",
              "next": "vl"
            },
            {
              "label": "Vacuum does not rise as expected and discharge head collapses when flow opens",
              "next": "vi"
            },
            {
              "label": "Pattern unclear, but vacuum remains high and unstable",
              "next": "nl"
            }
          ]
        },
        "vr": {
          "result": true,
          "domain": "SUCTION RESTRICTION",
          "assessment": "PROBABLE: Restriction on the suction side (screen, strainer, valve, intake path). A restricted intake commonly shows rapid vacuum rise as flow increases.",
          "measurements": [
            "Pressure/vacuum drop across suction-side strainers and valves",
            "Intake screen condition and source level during demand",
            "Suction line sizing/route and high-friction sections"
          ],
          "search": "suction lift pump restriction rapid rise vacuum gauge troubleshooting",
          "tool": "npsh"
        },
        "vl": {
          "result": true,
          "domain": "SUCTION AIR LEAK",
          "assessment": "PROBABLE: Air leak in suction piping or fittings. A common signature is normal vacuum rise, then sudden drop with loss of prime as vacuum opens the leak path.",
          "measurements": [
            "Inspect suction-side joints/fittings, especially long PVC runs and any hairline cracks",
            "Watch gauge behavior on shutdown; rising vacuum with water draining back can indicate leak path",
            "Check foot valve seal and suction-line hold test before restart"
          ],
          "search": "suction lift pump vacuum rises then drops loss of prime air leak",
          "tool": "npsh"
        },
        "vi": {
          "result": true,
          "domain": "IMPELLER / INTERNAL BLOCKAGE",
          "assessment": "PROBABLE: Impeller blockage or internal flow restriction. A telltale pattern is weak vacuum-rise response with discharge pressure that deadheads correctly but falls quickly when flow is introduced.",
          "measurements": [
            "Compare deadhead pressure to curve versus pressure under flow",
            "Inspect impeller/eye for blockage and wear",
            "Confirm rotation/speed and re-test with clean suction path"
          ],
          "search": "centrifugal pump impeller blockage deadhead ok pressure falls with flow troubleshooting"
        },
        "nl": {
          "result": true,
          "domain": "HYDRAULIC / SUCTION",
          "assessment": "PROBABLE: High lift plus friction leaves little NPSHa. Atmosphere supports about 34 ft of water at sea level in theory (CALCULATED), and the practical lift is far lower after vapor pressure, suction friction and the pump’s NPSHr. Warmer water, a falling water level or a fouled strainer each reduce NPSHa.",
          "measurements": [
            "Actual lift now versus at installation (water level change)",
            "Vacuum drop across strainer, screen and foot valve",
            "Suction pipe size, length and velocity at flow",
            "NPSHa minus NPSHr at the real flow",
            "Compare measured lift to the station or pump model limits; many packaged lift systems de-rate pressure as lift increases",
            "If the line has crests/high points, rework venting or routing before chasing pump internals"
          ],
          "search": "suction lift pump cavitation NPSHa reduce lift larger suction pipe",
          "tool": "sys"
        }
      },
      "reviewFlags": [
        {
          "node": "leak",
          "category": "operating-test",
          "note": "Filling, venting or observing a priming port must follow the exact pump procedure with pressure/energy hazards controlled; do not open a running pressurized casing."
        },
        {
          "node": "sh",
          "category": "model-specific-limit",
          "note": "Priming times, levels and wear clearances are pump-specific. Do not run dry or change speed to force priming."
        },
        {
          "node": "vi",
          "category": "operating-test",
          "note": "The legacy deadhead comparison is not authorization for a shutoff test. Use existing records or a separate manufacturer-approved test with minimum-flow and pressure limits."
        }
      ]
    },
    "pt_flood": {
      "title": "Flooded suction pump",
      "symptom": "Identify or troubleshoot the installed flooded suction pump.",
      "appliesTo": [
        "Flooded-suction pumps; verify source pressure, intake arrangement and pump curve."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "engineering-guidance",
        "note": "Basis: engineering fundamentals and common industry practice, not manufacturer specifications. Minimum submergence, minimum flow, operating range, clearances and adjustment values come from your pump’s manual and curve. Items marked PROBABLE are hypotheses to confirm.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Compare static and running inlet pressure, flow and intake conditions after correction.",
        "Verify the operating point and NPSH conditions against the pump curve and manufacturer requirements."
      ],
      "equipmentOptional": true,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Compare suction pressure at the pump while running at duty flow with the static (pump off) value.",
          "options": [
            {
              "label": "Drops a lot when running",
              "next": "b"
            },
            {
              "label": "Little change, still noisy or low flow",
              "next": "c"
            },
            {
              "label": "Not measured",
              "next": "m"
            }
          ]
        },
        "m": {
          "result": true,
          "domain": "SUCTION / MEASUREMENT",
          "assessment": "UNKNOWN until suction pressure is measured static and running.",
          "measurements": [
            "Suction gauge static and at duty flow, same gauge",
            "Discharge pressure and flow at the same time",
            "Water level, water temperature and elevation for NPSHa"
          ],
          "search": "flooded suction pump measure suction pressure running versus static NPSH",
          "tool": "sys"
        },
        "b": {
          "question": "Is any suction valve partly closed, or a strainer, screen or intake plugged?",
          "options": [
            {
              "label": "Yes or unsure",
              "next": "r1"
            },
            {
              "label": "No: valves open, screens clean",
              "next": "p1"
            }
          ]
        },
        "r1": {
          "result": true,
          "domain": "SUCTION RESTRICTION",
          "assessment": "PROBABLE: A large drop from static to running suction pressure means friction or a restriction between the source and the pump inlet.",
          "measurements": [
            "Pressure on both sides of each strainer, valve and screen",
            "Valve position: confirm fully open (a disc can come loose from its stem)",
            "Intake screen debris and water level",
            "Verify gauge accuracy before concluding"
          ],
          "search": "pump suction strainer plugged pressure drop flooded suction troubleshooting"
        },
        "p1": {
          "result": true,
          "domain": "SUCTION PIPING",
          "assessment": "PROBABLE: Suction velocity or friction is too high for the flow, or air is trapped. Flooded suction helps NPSHa but does not guarantee it.",
          "measurements": [
            "Suction pipe size and velocity at flow (Pipe velocity tool)",
            "Elbows or reducers close to the inlet; eccentric reducers are commonly installed flat side up on horizontal suction so air does not trap (confirm in your pump manual)",
            "High points in the suction line that trap air, and venting",
            "NPSHa versus NPSHr at the operating flow",
            "Check inlet submergence against inlet velocity; conservative field guidance is about 1 ft submergence per 1 ft/s unless OEM says otherwise"
          ],
          "search": "flooded suction pump air trapped suction piping eccentric reducer cavitation",
          "tool": "pipe"
        },
        "c": {
          "question": "Is there a vortex or air entry at the intake (low level, inlet near the surface, wall or a tank outlet)?",
          "options": [
            {
              "label": "Yes or likely",
              "next": "v"
            },
            {
              "label": "No",
              "next": "n"
            }
          ]
        },
        "v": {
          "result": true,
          "domain": "INTAKE / AIR ENTRAINMENT",
          "assessment": "PROBABLE: Air drawn in at the intake gives noise, surging and falling head, which sounds like cavitation but is a different cause.",
          "measurements": [
            "Water level versus the submergence your pump manufacturer or intake guidance requires",
            "Surface vortices, swirl, and returns dropping water near the intake",
            "Air in a clear pipe section or at a high-point vent",
            "Level control setpoints on the tank, pond or wet well",
            "In wells or wet wells, verify inlet-to-wall clearance per pump type and manufacturer guidance (common references: submersible about 0.25D, line-shaft turbine about 0.75D)"
          ],
          "search": "pump intake vortex air entrainment submergence wet well troubleshooting"
        },
        "n": {
          "result": true,
          "domain": "HYDRAULIC / NPSH",
          "assessment": "UNKNOWN until NPSHa is calculated. Hot water, high elevation, long suction friction, or running far right on the curve (higher NPSHr) can still cause cavitation.",
          "measurements": [
            "NPSHa with the System check tool, using a negative lift for flooded suction",
            "Operating flow on the curve versus BEP and NPSHr at that flow",
            "Water temperature"
          ],
          "search": "flooded suction pump cavitation NPSHa NPSHr operating point",
          "tool": "sys"
        }
      },
      "reviewFlags": [
        {
          "node": "p1",
          "category": "model-specific-limit",
          "note": "The legacy submergence-per-velocity rule is not a verified intake design criterion. Use the installed intake/pump requirements and an appropriate design review."
        },
        {
          "node": "v",
          "category": "model-specific-limit",
          "note": "The legacy 0.25D/0.75D wall-clearance examples are not verified for this intake. Do not use them as installation or operating approval."
        }
      ]
    },
    "pt_vt": {
      "title": "Vertical turbine pump",
      "symptom": "Identify or troubleshoot the installed vertical turbine pump.",
      "appliesTo": [
        "Vertical turbine pumps; verify bowl setting, driver, lineshaft and pumping water level."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "engineering-guidance",
        "note": "Basis: engineering fundamentals and common industry practice, not manufacturer specifications. Minimum submergence, minimum flow, operating range, clearances and adjustment values come from your pump’s manual and curve. Items marked PROBABLE are hypotheses to confirm.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections.",
        "Wet wells, vaults and ponds can be confined spaces. Rig and lift only at the manufacturer’s lifting points, and keep clear of the open discharge head and column during pulls."
      ],
      "verification": [
        "Record pumping water level, submergence, speed, flow and delivered head at the tested duty.",
        "Verify vibration, lubrication and operating range against the installed turbine/driver documentation."
      ],
      "equipmentOptional": true,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Do you know the static and pumping (drawdown) water level at this flow?",
          "options": [
            {
              "label": "Yes: measured or readable",
              "next": "b"
            },
            {
              "label": "No: not available",
              "next": "m"
            }
          ]
        },
        "m": {
          "result": true,
          "domain": "SUCTION / MEASUREMENT",
          "assessment": "UNKNOWN: A turbine has no suction gauge. The water level over the first bowl is the suction condition.",
          "measurements": [
            "Static and pumping water level at running flow (sounder, airline or transducer as installed)",
            "Discharge pressure at the head and flow at the same time",
            "Setting depth and bowl data from the pump record, and the curve for this model"
          ],
          "search": "vertical turbine pump measure pumping water level drawdown submergence",
          "tool": "sys"
        },
        "b": {
          "question": "Is the pumping level close to the first bowl, or falling over time?",
          "options": [
            {
              "label": "Yes: low submergence or falling level",
              "next": "s1"
            },
            {
              "label": "No: plenty of submergence",
              "next": "c"
            }
          ]
        },
        "s1": {
          "result": true,
          "domain": "HYDRAULIC / SUBMERGENCE",
          "assessment": "PROBABLE: Too little submergence over the first impeller gives cavitation and vortexing. The requirement (NPSHr plus minimum submergence) comes from the manufacturer.",
          "measurements": [
            "Minimum submergence in the manual versus actual pumping level",
            "Seasonal or drought decline in the source; wet well or pond level control",
            "Swirl or vortex at the intake",
            "Setting depth and bowl position in the pump record"
          ],
          "search": "vertical turbine pump minimum submergence vortex cavitation NPSH"
        },
        "c": {
          "question": "Compared with the curve at the measured flow, is total head low? Total head is lift to the surface plus discharge pressure plus column loss.",
          "options": [
            {
              "label": "Head or flow low versus the curve",
              "next": "d"
            },
            {
              "label": "Matches the curve but vibration, noise or amps are odd",
              "next": "e"
            }
          ]
        },
        "d": {
          "result": true,
          "domain": "MECHANICAL / HYDRAULIC",
          "assessment": "PROBABLE (confirm one at a time): impeller lateral setting wrong or impellers worn, bowl wear, wrong rotation or speed, a column or discharge head leak, a broken lineshaft or coupling, a closed or partly closed valve, air, or sand.",
          "measurements": [
            "Rotation and VFD output frequency",
            "Impeller adjustment per the manufacturer’s procedure for the motor type (hollow shaft or solid shaft)",
            "Column joints, discharge head, check valve and air/vacuum release valve operation",
            "Lineshaft coupling integrity and thread orientation for this model (some turbine couplings are left-handed)",
            "Amps versus the curve brake horsepower at the measured head and flow",
            "Sand or debris in the water (wears bowls)"
          ],
          "search": "vertical turbine pump low flow low pressure impeller adjustment bowl wear troubleshooting",
          "tool": "affinity"
        },
        "e": {
          "result": true,
          "domain": "MECHANICAL",
          "assessment": "PROBABLE: Vibration or noise at a normal operating point points to lineshaft bearings or lubrication, a bent shaft, driver and discharge head misalignment, resonance, or intake turbulence.",
          "measurements": [
            "Vibration at the motor and discharge head versus speed (VFD resonance and skip frequencies per the manual)",
            "Lineshaft lubrication: oil tube drip rate or water supply to the bearings, per the manual",
            "Motor thrust bearing condition and non-reverse ratchet",
            "Base alignment and piping strain at the discharge head"
          ],
          "search": "vertical turbine pump vibration lineshaft bearing lubrication resonance VFD"
        }
      },
      "reviewFlags": [
        {
          "node": "s1",
          "category": "model-specific-limit",
          "note": "Minimum submergence, vortex criteria and NPSH requirements are distinct checks; do not assume that NPSHr plus a generic submergence allowance is an approved design rule."
        },
        {
          "node": "d",
          "category": "operating-test",
          "note": "Impeller/lateral adjustment, coupling and column inspection require the exact turbine/driver procedure, isolation and qualified rigging/service personnel."
        },
        {
          "node": "e",
          "category": "parameter-change",
          "note": "Skip-frequency changes and lubrication adjustments need the exact turbine/driver requirements and approved evidence, not generic tuning."
        }
      ]
    },
    "pt_sub": {
      "title": "Submersible pump",
      "symptom": "Identify or troubleshoot the installed submersible pump.",
      "appliesTo": [
        "Submersible pumps and motors; verify motor cooling, cable, pump curve and submergence requirements."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "engineering-guidance",
        "note": "Basis: engineering fundamentals and common industry practice, not manufacturer specifications. Minimum submergence, minimum flow, operating range, clearances and adjustment values come from your pump’s manual and curve. Items marked PROBABLE are hypotheses to confirm.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections.",
        "Submerged cable and motor can hold dangerous voltage. Lock out and verify before pulling the pump; rig at the manufacturer’s lifting points; treat wet wells and vaults as confined spaces."
      ],
      "verification": [
        "Record water level, flow, head, motor current and cooling conditions at the tested duty.",
        "Verify electrical/cable results and operating range against the installed motor and pump requirements."
      ],
      "equipmentOptional": true,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Is the motor tripping on overload, drawing unbalanced amps, or reading low insulation resistance?",
          "options": [
            {
              "label": "Yes: overload, imbalance or low insulation resistance",
              "next": "el"
            },
            {
              "label": "No: it runs, but flow or pressure is low or it is noisy",
              "next": "b"
            }
          ]
        },
        "el": {
          "result": true,
          "domain": "ELECTRICAL",
          "assessment": "PROBABLE (confirm with measurements): damaged cable or splice, water ingress to the motor, supply imbalance, a VFD output problem (long cable, voltage spikes), or the pump binding from sand or debris.",
          "measurements": [
            "Insulation resistance: cable alone versus cable and motor, compared with the manufacturer’s minimum and earlier readings",
            "Phase resistance balance, voltage and current per phase",
            "Cable splice and cable condition; voltage drop over the cable run",
            "VFD output filter or reactor requirements for this motor and cable length, per the manufacturer",
            "Cooling flow past the motor, per the manual"
          ],
          "search": "submersible motor insulation resistance megger cable testing troubleshooting",
          "tool": "imb"
        },
        "b": {
          "question": "Is the water level near the pump intake, or could air or a vortex enter at the intake?",
          "options": [
            {
              "label": "Low level or vortex possible",
              "next": "lv"
            },
            {
              "label": "Level is fine",
              "next": "c"
            }
          ]
        },
        "lv": {
          "result": true,
          "domain": "SUCTION / SUBMERGENCE",
          "assessment": "PROBABLE: Low submergence causes air entrainment and can reduce motor cooling. Minimum submergence and cooling requirements come from the manufacturer.",
          "measurements": [
            "Water level versus the manufacturer’s minimum submergence",
            "Level control and float or transducer settings",
            "Intake screen condition and distance from walls or the surface",
            "Motor temperature if monitored"
          ],
          "search": "submersible pump minimum submergence cooling air entrainment vortex"
        },
        "c": {
          "question": "Where is it operating: far from the curve, or at reduced VFD speed?",
          "options": [
            {
              "label": "Far right (low head, high flow) or near shutoff",
              "next": "up"
            },
            {
              "label": "Reduced speed on a VFD",
              "next": "vfd"
            },
            {
              "label": "Normal point on the curve",
              "next": "cr"
            }
          ]
        },
        "up": {
          "result": true,
          "domain": "HYDRAULIC / MECHANICAL",
          "assessment": "PROBABLE: Staged pumps are built for an operating range. Far-right operation can cause upthrust and wear; near shutoff causes heat, recirculation and downthrust. Limits come from the manufacturer.",
          "measurements": [
            "Flow and head versus the curve and the manufacturer’s allowable range",
            "Discharge valve, check valve and system pressure changes",
            "Pressure setpoint and PID behavior on a VFD",
            "Motor amps versus nameplate"
          ],
          "search": "submersible pump upthrust operating range runout shutoff troubleshooting",
          "tool": "affinity"
        },
        "vfd": {
          "result": true,
          "domain": "CONTROL / COOLING",
          "assessment": "PROBABLE: At reduced speed the flow past the motor falls. Below the manufacturer’s minimum speed or flow the motor may overheat.",
          "measurements": [
            "Programmed minimum frequency versus the manufacturer’s minimum",
            "Cooling flow past the motor or the cooling sleeve in this installation",
            "Motor temperature if monitored",
            "Pump head at minimum speed versus system static head (it may not deliver at all)"
          ],
          "search": "submersible motor minimum speed VFD cooling flow sleeve",
          "tool": "affinity"
        },
        "cr": {
          "result": true,
          "domain": "MECHANICAL / HYDRAULIC",
          "assessment": "UNKNOWN until head and flow are compared with the curve. Look for sand wear, rotation, a clogged intake screen, a discharge leak or a stuck check valve.",
          "measurements": [
            "Head and flow versus the curve at the actual speed",
            "Rotation and amps per phase",
            "Intake screen, check valve and discharge piping",
            "Sand or debris in the water"
          ],
          "search": "submersible pump low flow low pressure worn impeller intake screen check valve troubleshooting"
        }
      },
      "reviewFlags": [
        {
          "node": "el",
          "category": "energized-testing",
          "note": "Motor/cable tests and VFD output evaluation require the exact isolation, disconnected-equipment and test-instrument procedure; no generic insulation-test value is supplied."
        },
        {
          "node": "lv",
          "category": "model-specific-limit",
          "note": "Minimum submergence and cooling flow are motor/pump/installation-specific; a level reading alone does not establish safe cooling."
        },
        {
          "node": "vfd",
          "category": "parameter-change",
          "note": "Minimum speed and cooling-sleeve decisions require pump/motor vendor limits; do not lower speed restrictions or operate below required flow."
        }
      ]
    },
    "pt_boost": {
      "title": "Booster pump",
      "symptom": "Identify or troubleshoot the installed booster pump.",
      "appliesTo": [
        "Booster pumps on a pressurized supply; verify available inlet pressure and upstream capacity."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "engineering-guidance",
        "note": "Basis: engineering fundamentals and common industry practice, not manufacturer specifications. Minimum submergence, minimum flow, operating range, clearances and adjustment values come from your pump’s manual and curve. Items marked PROBABLE are hypotheses to confirm.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Record inlet and outlet pressure simultaneously with flow and speed.",
        "Verify differential head against the curve and confirm the supply and low-suction protections remain adequate."
      ],
      "equipmentOptional": true,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Does inlet pressure at the booster drop when it runs?",
          "options": [
            {
              "label": "Yes: inlet pressure collapses at running flow",
              "next": "b"
            },
            {
              "label": "No: inlet stays steady",
              "next": "c"
            },
            {
              "label": "Not measured",
              "next": "m"
            }
          ]
        },
        "m": {
          "result": true,
          "domain": "MEASUREMENT",
          "assessment": "UNKNOWN: A booster only adds to what the supply provides, so you need inlet pressure, outlet pressure and flow together.",
          "measurements": [
            "Inlet and outlet pressure at the same time at running flow; the difference is the head the pump adds (CALCULATED: psi × 2.31 = ft)",
            "Static (pump off) versus running inlet pressure",
            "Flow at the same moment, compared with the curve"
          ],
          "search": "booster pump measure inlet outlet pressure differential head curve"
        },
        "b": {
          "question": "Can the supply (main, tank or upstream pump) deliver the booster’s flow?",
          "options": [
            {
              "label": "No or unsure: limited or fed by another pump",
              "next": "sup"
            },
            {
              "label": "Yes: supply is adequate",
              "next": "c"
            }
          ]
        },
        "sup": {
          "result": true,
          "domain": "SUPPLY / SUCTION",
          "assessment": "PROBABLE: Booster demand exceeds the supply, so inlet pressure collapses, NPSHa falls, and the booster cavitates or trips on its low-suction safety. Repairing the pump will not fix the supply. Do not defeat or lower the low-suction cutoff to keep it running.",
          "measurements": [
            "Upstream pressure, valves, strainers and backflow or PRV assemblies (pressure drop across each)",
            "Upstream pump or tank capability at this flow",
            "Low-suction cutoff setpoint versus actual inlet pressure, and that the sensor reads true",
            "NPSHa (CALCULATED): absolute inlet pressure × 2.31 minus vapor head. In the System check tool use inlet gauge psi × 2.31 as a negative lift with suction length 0"
          ],
          "search": "booster pump low inlet pressure cavitation supply NPSHa low suction cutoff",
          "tool": "sys"
        },
        "c": {
          "question": "How is it operating?",
          "options": [
            {
              "label": "Near shutoff, hot, or cycling on and off",
              "next": "low"
            },
            {
              "label": "High flow, running out the curve",
              "next": "high"
            },
            {
              "label": "Neither: head or flow does not match the curve",
              "next": "cur"
            }
          ]
        },
        "low": {
          "result": true,
          "domain": "HYDRAULIC / CONTROL",
          "assessment": "PROBABLE: Low-flow operation heats the water in the casing and causes recirculation, vibration and seal or bearing damage. Short cycling stresses the motor and starter. The minimum flow comes from the manual.",
          "measurements": [
            "Casing and seal temperature and noise",
            "Minimum continuous flow in the manual versus actual flow",
            "Pressure setpoint, deadband, tank precharge and check valve",
            "VFD minimum speed and sleep or boost settings"
          ],
          "search": "booster pump minimum flow shutoff overheating short cycling pressure tank VFD sleep"
        },
        "high": {
          "result": true,
          "domain": "HYDRAULIC",
          "assessment": "PROBABLE: More flow than designed (open lines, a break) moves the pump right on the curve, where NPSHr and motor load rise, while inlet pressure falls.",
          "measurements": [
            "Flow versus design and versus the curve",
            "Inlet pressure at that flow",
            "Motor amps versus nameplate",
            "Downstream leaks or valves stuck open"
          ],
          "search": "booster pump running out of curve high flow overload cavitation",
          "tool": "sys"
        },
        "cur": {
          "result": true,
          "domain": "MECHANICAL / HYDRAULIC",
          "assessment": "UNKNOWN until the differential head and flow are compared with the curve. A mismatch can come from rotation or speed, wear, instrument error, or a changed system.",
          "measurements": [
            "Rotation and VFD speed",
            "Gauge and transducer accuracy",
            "Impeller diameter and wear",
            "Strainers and valves in the discharge"
          ],
          "search": "booster pump low pressure differential head curve wear rotation troubleshooting",
          "tool": "affinity"
        }
      },
      "reviewFlags": [
        {
          "node": "low",
          "category": "parameter-change",
          "note": "Review tank/precharge and sleep/deadband behavior under the applicable service procedure; changing these can alter pressure and start frequency."
        }
      ]
    },
    "pt_jet": {
      "title": "Jet pump",
      "symptom": "Identify or troubleshoot the installed jet pump.",
      "appliesTo": [
        "Jet pumps; verify well depth and the installed nozzle/venturi and one- or two-pipe arrangement."
      ],
      "revision": 2,
      "review": {
        "status": "needs-review",
        "reviewedOn": null,
        "note": "Readiness wording scan identified unresolved step-specific review flags. Exact sources, safe test procedures and qualified technical approval remain pending; this is not a completed technical review."
      },
      "evidence": {
        "kind": "engineering-guidance",
        "note": "Basis: engineering fundamentals and common industry practice, not manufacturer specifications. Minimum submergence, minimum flow, operating range, clearances and adjustment values come from your pump’s manual and curve. Items marked PROBABLE are hypotheses to confirm.",
        "sources": []
      },
      "safetyPrerequisites": [
        "Follow the site authorization and equipment isolation procedure before any inspection or test.",
        "Use qualified personnel and the exact equipment manual for energized measurements or operating tests. Do not bypass protections."
      ],
      "verification": [
        "Compare pressure and delivered flow with the correct ejector performance table at actual water depth.",
        "Verify prime retention and operating behavior after the authorized correction."
      ],
      "equipmentOptional": true,
      "start": "a",
      "nodes": {
        "a": {
          "question": "Does it prime and hold pressure?",
          "options": [
            {
              "label": "No: loses prime or no pressure",
              "next": "p"
            },
            {
              "label": "Yes: it primes, but flow or pressure is low",
              "next": "q"
            }
          ]
        },
        "p": {
          "result": true,
          "domain": "SUCTION AIR / FOOT VALVE",
          "assessment": "PROBABLE: A jet pump needs tight suction and drive piping. Air in the suction line, a leaking foot valve or an empty casing stops it from priming.",
          "measurements": [
            "Casing and pipes filled with water per the manual before start",
            "Foot valve seat and all fittings (on a two-pipe deep-well system check both pipes)",
            "Vacuum and pressure gauges steady or fluttering",
            "Rotation"
          ],
          "search": "jet pump loses prime foot valve air leak troubleshooting"
        },
        "q": {
          "question": "Has the ejector (nozzle and venturi) been checked for plugging, wear, or a mismatch with the well depth?",
          "options": [
            {
              "label": "Not checked, or suspect it",
              "next": "ej"
            },
            {
              "label": "Checked and clean",
              "next": "pc"
            }
          ]
        },
        "ej": {
          "result": true,
          "domain": "EJECTOR",
          "assessment": "PROBABLE: The nozzle and venturi pair sets performance for a given depth and pressure. Plugging from sand or scale, wear, or the wrong combination reduces flow and priming ability.",
          "measurements": [
            "Installed nozzle and venturi part numbers versus the manufacturer’s performance table for your depth",
            "Inspect and clean them with the pump locked out and depressurized",
            "Foot valve screen or strainer",
            "Pressure switch, regulator and tank precharge"
          ],
          "search": "jet pump nozzle venturi ejector plugged performance table well depth"
        },
        "pc": {
          "result": true,
          "domain": "HYDRAULIC",
          "assessment": "UNKNOWN: A jet pump recirculates part of its flow, so efficiency is low and output falls as the water level (drawdown) falls. Compare pressure and flow with the manufacturer’s performance table at the actual depth.",
          "measurements": [
            "Depth to water now versus at installation",
            "Pressure and flow versus the table",
            "Motor amps versus nameplate",
            "Pressure-control valve on the return line, if fitted"
          ],
          "search": "jet pump low flow low pressure drawdown water level performance curve"
        }
      },
      "reviewFlags": [
        {
          "node": "p",
          "category": "operating-test",
          "note": "Priming and opening piping require the exact jet-pump procedure and pressure/energy control; do not run dry or open an energized system."
        },
        {
          "node": "ej",
          "category": "model-specific-limit",
          "note": "Use the exact depth/ejector table, and isolate/depressurize before nozzle or venturi inspection. Switch/regulator/precharge changes need an approved baseline."
        }
      ]
    }
  }
};
