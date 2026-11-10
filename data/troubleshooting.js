globalThis.TRACER_TROUBLESHOOTING = {
  "schemaVersion": 1,
  "safety": "De-energize, lock out and verify zero energy before touching conductors or doing insulation tests. Follow your employer’s procedures.",
  "techniques": {
    "wont": {
      "n": "Pump won't build pressure",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Is the pump running at full speed, with motor amps near expected for this flow?",
          "o": [
            [
              "No: low/zero amps or speed below command",
              "e1"
            ],
            [
              "Yes: speed and amps look normal",
              "b"
            ]
          ]
        },
        "e1": {
          "r": 1,
          "domain": "ELECTRICAL / CONTROL",
          "text": "Pump is not being driven properly. Separate supply, drive and command problems.",
          "measure": [
            "Drive fault/status codes",
            "Voltage on all three phases at drive input and motor",
            "Commanded Hz vs actual Hz and Hand/Auto/remote source",
            "Rotation direction and motor overload state"
          ],
          "search": "VFD pump will not reach commanded speed troubleshooting"
        },
        "b": {
          "q": "With flow and pressure measured, where does the point sit on the pump curve?",
          "o": [
            [
              "Flow HIGH, pressure low (running out the curve)",
              "h1"
            ],
            [
              "Flow LOW, pressure low, noisy or vibrating",
              "c1"
            ],
            [
              "Flow and pressure both low, amps normal/high, quiet",
              "m1"
            ]
          ]
        },
        "h1": {
          "r": 1,
          "domain": "HYDRAULIC",
          "text": "Demand exceeds what the system restricts: open or broken line, stuck-open valve, failed PRV, too many zones.",
          "measure": [
            "Pressure at pump vs far end of system",
            "Flow vs expected zone demand",
            "Valve positions, PRV settings, mainline leak indicators",
            "Duty point vs pump operating window (BEP vicinity, above MCSF, below runout)"
          ],
          "search": "pump running out of curve low pressure high flow irrigation mainline break",
          "tool": "affinity"
        },
        "c1": {
          "r": 1,
          "domain": "SUCTION / CAVITATION",
          "text": "Likely air entrainment, restricted suction or insufficient NPSHa.",
          "measure": [
            "Suction gauge (vacuum/pressure)",
            "Strainer/intake condition, water level, suction valve position",
            "Calculated NPSHa vs NPSHr"
          ],
          "search": "pump low pressure noise cavitation suction air leak troubleshooting",
          "tool": "npsh"
        },
        "m1": {
          "r": 1,
          "domain": "MECHANICAL",
          "text": "Worn or damaged impeller/wear rings, wrong rotation, clogged impeller or slipping coupling.",
          "measure": [
            "Compare shutoff head to curve (if safe)",
            "Rotation, coupling and shaft turning",
            "Impeller clearance/condition at inspection",
            "If required head is very high (around/above 150 psi), verify this station uses the correct multistage or high-head pump design"
          ],
          "search": "centrifugal pump worn impeller wear ring low pressure diagnosis"
        }
      }
    },
    "hunt": {
      "n": "Pressure hunting",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Does the hunting continue with the VFD in fixed/manual speed?",
          "o": [
            [
              "Yes, it hunts at fixed speed",
              "h"
            ],
            [
              "No, only in PID/auto control",
              "b"
            ]
          ]
        },
        "h": {
          "r": 1,
          "domain": "HYDRAULIC / SYSTEM",
          "text": "Demand or system devices are cycling: PRV, check valve, air in line, tank precharge, cycling zones.",
          "measure": [
            "Pressure trace at pump and remote point",
            "Zone sequencing at time of swings",
            "Tank precharge (if present), PRV behavior"
          ],
          "search": "irrigation pump station pressure fluctuating PRV hunting causes"
        },
        "b": {
          "q": "Is the transducer signal steady and in agreement with a reference gauge?",
          "o": [
            [
              "No: noisy, drifting or disagreeing",
              "s1"
            ],
            [
              "Yes: signal is stable and accurate",
              "t1"
            ]
          ]
        },
        "s1": {
          "r": 1,
          "domain": "SENSOR / WIRING",
          "text": "Feedback is unreliable. Fix this before touching PID values.",
          "measure": [
            "mA/V at the drive input vs gauge",
            "Shield termination and routing away from motor leads",
            "Supply voltage and scaling (low/high range)"
          ],
          "search": "VFD pressure transducer noise 4-20mA shielding scaling",
          "tool": "xdcr"
        },
        "t1": {
          "r": 1,
          "domain": "CONTROL TUNING",
          "text": "Loop is too aggressive or ramps/minimum speed/sleep settings fight the system.",
          "measure": [
            "Record ALL current PID, ramp and min-speed values first",
            "Change one parameter at a time and log the result",
            "Observe at low and high demand"
          ],
          "search": "VFD booster pump PID tuning hunting acceleration deceleration",
          "tool": "vfdsetup"
        }
      }
    },
    "trip": {
      "n": "VFD / motor trip",
      "s": "a",
      "nodes": {
        "a": {
          "q": "What did the drive report?",
          "o": [
            [
              "Rain Bird CLP/ACLP named alarm (E16/E17/E18/PCH/AIE or Delta alarm)",
              "flow:rbclp"
            ],
            [
              "Overcurrent / short circuit",
              "oc"
            ],
            [
              "Ground fault / earth leakage",
              "gf"
            ],
            [
              "Overload / thermal",
              "ol"
            ],
            [
              "Over- or under-voltage",
              "uv"
            ],
            [
              "No fault, but won’t accelerate",
              "ac"
            ]
          ]
        },
        "oc": {
          "r": 1,
          "domain": "ELECTRICAL / MECHANICAL",
          "text": "Possible winding or cable fault, locked rotor/binding, or too-short acceleration ramp.",
          "measure": [
            "Insulation resistance of motor and cable with leads disconnected from the drive",
            "Phase-to-phase resistance balance",
            "Shaft turns freely by hand; ramp time"
          ],
          "search": "VFD overcurrent fault pump motor insulation resistance test"
        },
        "gf": {
          "r": 1,
          "domain": "ELECTRICAL",
          "text": "Leakage to ground in motor, cable or moisture ingress; surge damage possible.",
          "measure": [
            "Megger phase-to-ground for motor and cable separately",
            "Look for water in junction box or conduit",
            "Check grounding and drive output filter/length"
          ],
          "search": "VFD ground fault motor cable megger insulation test"
        },
        "ol": {
          "r": 1,
          "domain": "HYDRAULIC / MECHANICAL",
          "text": "Motor is loaded beyond nameplate. Often pump running out on the curve, bearing drag or voltage problem.",
          "measure": [
            "Amps vs nameplate FLA/service factor each phase",
            "Flow and TDH vs curve (hydraulic overload?)",
            "Bearing condition, voltage balance"
          ],
          "search": "VFD motor overload pump running out of curve amps nameplate",
          "tool": "affinity"
        },
        "uv": {
          "r": 1,
          "domain": "SUPPLY",
          "text": "Incoming power or decel energy issue.",
          "measure": [
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
          "r": 1,
          "domain": "PARAMETERS / PERMISSIVES",
          "text": "Drive is limited by a setting or command source, not necessarily a fault.",
          "measure": [
            "Run/enable permissives and command source (local vs remote)",
            "Current limit, accel time, min/max frequency",
            "Motor data entered correctly; PID setpoint vs feedback"
          ],
          "search": "VFD will not accelerate pump parameters current limit reference source",
          "tool": "hz"
        }
      }
    },
    "rbclp": {
      "n": "Rain Bird CLP/ACLP alarm map",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Which family and alarm pattern best matches the station?",
          "o": [
            [
              "Mitsubishi alarms (E16/E17/E18/PCH/AIE/ILF/UVT)",
              "m"
            ],
            [
              "Delta alarms (high/low pressure, overload, phase-loss, ACI-loss)",
              "d"
            ],
            [
              "Station will not shut down after irrigation",
              "sd"
            ],
            [
              "Small Platform symptom set (-62 PSI, max starts, prime loss, flow meter fault)",
              "sp"
            ]
          ]
        },
        "m": {
          "r": 1,
          "domain": "RAIN BIRD MITSUBISHI ALARMS",
          "text": "Use alarm-specific checks before broad retuning.",
          "measure": [
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
          "r": 1,
          "domain": "RAIN BIRD DELTA ALARMS",
          "text": "Validate sensor truth and power quality before changing PID or thresholds.",
          "measure": [
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
          "r": 1,
          "domain": "WAKE / SLEEP & FLOW-SWITCH LOGIC",
          "text": "Shutdown problems are often wake/sleep or flow-switch behavior, not only pressure PID.",
          "measure": [
            "Confirm pressure decay behavior and sleep timing are realistic for site volume and leak profile",
            "Review wake/sleep and flow-switch function settings per your current Rain Bird programming guide before raising thresholds",
            "On CLPRS flow-switch variants, verify sleep-test parameters match the intended mode (Test Timer / Retest Time / Max Retest are often fixed baseline values)",
            "Verify VFD minimum run/rest timers are not masking expected wake/sleep transitions during testing",
            "Test shutdown with known valve states and verify pressure switch/transducer feedback agrees during sleep"
          ],
          "search": "Rain Bird ACLP station does not shut down wake sleep flow switch troubleshooting"
        },
        "sp": {
          "q": "Which Small Platform symptom is closest?",
          "o": [
            [
              "Touchscreen reads -62 PSI or pressure is clearly wrong",
              "sp_pt"
            ],
            [
              "Max starts per hour / rapid cycling",
              "sp_ms"
            ],
            [
              "Prime loss alarm",
              "sp_pl"
            ],
            [
              "Flow meter fault or mismatch",
              "sp_fm"
            ],
            [
              "Power-failure or phase-monitor alarm",
              "sp_pf"
            ],
            [
              "VFD E.OV# or retries exceeded",
              "sp_vfd"
            ]
          ]
        },
        "sp_pt": {
          "r": 1,
          "domain": "SMALL PLATFORM TRANSDUCER LOOP",
          "text": "Treat this as a signal/scaling path issue before PID changes.",
          "measure": [
            "Compare displayed pressure with a reference gauge",
            "Confirm 4-20 mA loop wiring and signal at the expected PLC/VFD inputs (Input 4/PC on many revisions)",
            "If reading is fixed near -62 PSI, verify VFD-to-PLC communication path and test with a known-good Ethernet cable",
            "Review drive/controller scaling and analog-input mode for this station revision (for example, parameter 267 and DIP input mode where applicable)"
          ],
          "search": "Rain Bird small platform -62 PSI pressure transducer 4-20mA troubleshooting",
          "tool": "xdcr"
        },
        "sp_ms": {
          "r": 1,
          "domain": "SMALL PLATFORM SHORT CYCLING",
          "text": "Frequent starts are usually demand-driven or leak-driven, not a pure drive problem.",
          "measure": [
            "Find leaks (field, foot valve, filter train, check valve, PRV) before raising start limits",
            "Confirm start/stop delta and wake/sleep timing are reasonable for site volume",
            "Verify check valve and master-valve sealing after shutdown"
          ],
          "search": "Rain Bird small platform max starts per hour short cycling troubleshooting"
        },
        "sp_pl": {
          "r": 1,
          "domain": "SMALL PLATFORM PRIME LOSS",
          "text": "Loss-of-prime alarms are commonly suction-side or prime-circuit issues.",
          "measure": [
            "Suction line integrity, foot-valve orientation and open ball valves",
            "Prime-loss kit and regulator setting per your current station guidance",
            "Air leaks at flanges/high points and whether suction lines were fully purged"
          ],
          "search": "Rain Bird small platform prime loss alarm suction line foot valve troubleshooting",
          "tool": "npsh"
        },
        "sp_fm": {
          "r": 1,
          "domain": "SMALL PLATFORM FLOW METER CHECK",
          "text": "Do not assume the meter is bad until speed, pressure and scaling agree.",
          "measure": [
            "Confirm the station is configured for the correct sensor type (flow switch vs flow meter) and that the flow meter is enabled/installed in HMI logic",
            "Confirm pump is running and compare VFD speed/flow to expected zone demand",
            "For paddlewheel meters: verify K/offset, insertion depth/alignment, optical isolator path and clean sensor body",
            "For magmeters: verify output scaling and input configuration match schematic"
          ],
          "search": "Rain Bird small platform flow meter fault troubleshooting K factor magmeter",
          "tool": "flowcal"
        },
        "sp_pf": {
          "r": 1,
          "domain": "SMALL PLATFORM POWER / PHASE",
          "text": "Phase-monitor and surge-protection faults can mimic unrelated alarms.",
          "measure": [
            "Verify phase monitor power and output contact state during fault window",
            "Measure all three phases under load for imbalance or dropouts",
            "Inspect surge-arrestor indicators and replace failed modules before retesting"
          ],
          "search": "Rain Bird small platform phase monitor power failure alarm troubleshooting",
          "tool": "imb"
        },
        "sp_vfd": {
          "r": 1,
          "domain": "SMALL PLATFORM VFD FAULT",
          "text": "Overvoltage/retry faults need power-quality and ramp checks before hardware swaps.",
          "measure": [
            "Read exact VFD alarm history from the drive keypad/log",
            "Compare motor current to nameplate and review thermal/current-limit settings",
            "If E.OV# appears, review accel/decel and line-voltage behavior during stop/start",
            "If the drive shows E.RET (retries exceeded), correct the base fault and review retry count/delay before reset-only attempts",
            "If PS appears after a stop/reset event, clear with PU/EXT and confirm the station returned to the intended remote/auto command source"
          ],
          "search": "Rain Bird Mitsubishi F800 E.OV retries exceeded troubleshooting",
          "tool": "hz"
        }
      }
    },
    "cav": {
      "n": "Suspected cavitation",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Does it get worse at higher flow or when more zones run?",
          "o": [
            [
              "Yes, worse with high flow",
              "h"
            ],
            [
              "No, it is steady or random",
              "b"
            ]
          ]
        },
        "h": {
          "r": 1,
          "domain": "HYDRAULIC",
          "text": "Pump is far right on its curve where NPSHr is higher.",
          "measure": [
            "Flow vs curve and NPSHr at that flow",
            "Throttle discharge slightly (if permitted) to see if noise clears",
            "Suction pressure at that flow"
          ],
          "search": "pump cavitation high flow NPSHr increases with flow",
          "tool": "npsh"
        },
        "b": {
          "q": "Found a restriction or air entry on the suction side (strainer, valve, intake level, fittings)?",
          "o": [
            [
              "Yes",
              "fx"
            ],
            [
              "No, suction looks clean",
              "n1"
            ]
          ]
        },
        "fx": {
          "r": 1,
          "domain": "SUCTION",
          "text": "Correct it and re-test under load.",
          "measure": [
            "Suction gauge before/after repair",
            "Noise and discharge pressure stability",
            "Amps and flow vs baseline"
          ],
          "search": "pump suction strainer air leak cavitation symptoms fix"
        },
        "n1": {
          "r": 1,
          "domain": "NPSH / FLUID",
          "text": "Calculate NPSHa for real conditions: elevation, temperature, lift and friction.",
          "measure": [
            "Water temperature and level",
            "Measured suction pressure",
            "NPSHr from curve at operating flow"
          ],
          "search": "NPSH available calculation suction lift temperature elevation",
          "tool": "npsh"
        }
      }
    },
    "flow": {
      "n": "Flow reading disagrees",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Does the controller reading match the meter’s own local display/output?",
          "o": [
            [
              "No, they differ",
              "w"
            ],
            [
              "Yes, they match",
              "b"
            ]
          ]
        },
        "w": {
          "r": 1,
          "domain": "SIGNAL / SCALING",
          "text": "The meter may be fine; units, K-factor/pulse scaling or signal type is off.",
          "measure": [
            "Meter output (pulse/mA) with a meter",
            "Controller scaling units and K-factor",
            "Wiring, shielding and splices"
          ],
          "search": "flow sensor pulse K factor scaling irrigation controller wrong flow",
          "tool": "xdcr"
        },
        "b": {
          "q": "Is the meter installed to spec (straight runs, full pipe, correct size, clean)?",
          "o": [
            [
              "No, or unknown",
              "i"
            ],
            [
              "Yes",
              "c"
            ]
          ]
        },
        "i": {
          "r": 1,
          "domain": "INSTALLATION",
          "text": "Turbulence, air or oversizing causes errors.",
          "measure": [
            "Upstream/downstream straight pipe lengths",
            "Pipe full at low flow?",
            "Sensor fouling/debris"
          ],
          "search": "flow meter straight pipe requirements installation errors"
        },
        "c": {
          "r": 1,
          "domain": "VERIFY INDEPENDENTLY",
          "text": "Compare with a second source before blaming the meter.",
          "measure": [
            "Flow from pump curve (head, amps)",
            "Tank fill time or portable meter",
            "Pipe velocity from known zone demand"
          ],
          "search": "verify flow meter accuracy field check clamp-on",
          "tool": "pipe"
        }
      }
    },
    "ctrl": {
      "n": "Controller vs hydraulic",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Does the problem remain when you run the station manually at the valve?",
          "o": [
            [
              "Yes, still wrong",
              "h"
            ],
            [
              "No, manual works fine",
              "b"
            ]
          ]
        },
        "h": {
          "r": 1,
          "domain": "HYDRAULIC",
          "text": "Fault is in the field/hydraulics, not the controller.",
          "measure": [
            "Pressure/flow at the station",
            "Valve/solenoid condition, strainers, pipe size",
            "Compare with learned or expected flow"
          ],
          "search": "irrigation valve zone low flow hydraulic troubleshooting",
          "tool": "pipe"
        },
        "b": {
          "q": "Is solenoid/decoder voltage and response good at the valve during a command?",
          "o": [
            [
              "No: low voltage or no response",
              "t"
            ],
            [
              "Yes: command arrives properly",
              "p"
            ]
          ]
        },
        "t": {
          "r": 1,
          "domain": "TWO-WIRE / ELECTRICAL",
          "text": "Command isn’t reaching the valve reliably.",
          "measure": [
            "Voltage at decoder and at solenoid during command",
            "Line current/signal quality",
            "Splices, surge protection, ground"
          ],
          "search": "two wire decoder irrigation low voltage troubleshooting current draw"
        },
        "p": {
          "r": 1,
          "domain": "CONTROLLER CONFIG",
          "text": "Look at stale learned flow, hydraulic tree/sequence, flow zones or schedule conflicts.",
          "measure": [
            "Learned flow history vs measured",
            "Sequence/overlap and capacity settings",
            "Alarm timing and thresholds"
          ],
          "search": "WeatherTRAK OptiFlow learned flow flow alerts troubleshooting"
        }
      }
    },
    "sfault": {
      "n": "Station safety fault",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Which safety or fault is showing? (Find the cause; do not bypass a safety or raise its setpoint just to clear it.)",
          "o": [
            [
              "Low discharge pressure",
              "flow:wont"
            ],
            [
              "High discharge pressure",
              "hp"
            ],
            [
              "Low inlet pressure / loss of prime / low level",
              "lo"
            ],
            [
              "Phase fault",
              "ph"
            ],
            [
              "VFD fault",
              "flow:trip"
            ],
            [
              "Motor won’t start",
              "flow:nostart"
            ]
          ]
        },
        "hp": {
          "r": 1,
          "domain": "HYDRAULIC / CONTROL",
          "text": "Pressure is above the safety limit. Confirm the reading is real before chasing the pump.",
          "measure": [
            "Reference gauge vs transducer reading",
            "Regulating/PRV valves, closed downstream valves, zones not running",
            "Setpoint, PID overshoot and decel behavior"
          ],
          "search": "pump station high discharge pressure fault troubleshooting",
          "tool": "xdcr"
        },
        "lo": {
          "r": 1,
          "domain": "SUCTION / SOURCE",
          "text": "Water source, intake or sensing problem.",
          "measure": [
            "Source level and intake/screen condition",
            "Suction valves, strainers, air leaks, prime status",
            "Verify the low-level/low-inlet switch or transducer actually matches reality",
            "If suction-leak monitoring is present (for example Prime Assure), review recent leak-cycle and intake-pressure alerts before teardown"
          ],
          "search": "pump station low inlet pressure loss of prime low level fault troubleshooting",
          "tool": "npsh"
        },
        "ph": {
          "r": 1,
          "domain": "SUPPLY",
          "text": "Incoming power or phase monitoring problem.",
          "measure": [
            "Voltage on each phase at the service disconnect and at the panel",
            "Fuses/breakers, utility outage or single-phasing",
            "Phase monitor settings, sequence and imbalance thresholds",
            "Surge suppressor indicator state after recent events"
          ],
          "search": "pump station phase fault phase loss relay troubleshooting"
        }
      }
    },
    "nostart": {
      "n": "Motor won’t start",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Is control power present, and is the station in the right mode with no active fault or safety?",
          "o": [
            [
              "No: dead panel, fault or safety active",
              "c1"
            ],
            [
              "Yes: ready and calling to run",
              "b"
            ]
          ]
        },
        "c1": {
          "r": 1,
          "domain": "CONTROL / PERMISSIVES",
          "text": "Something in the start chain is open.",
          "measure": [
            "Control power and control transformer fuses",
            "E-stop, door and safety interlocks, reset status",
            "HOA/local-remote mode state (HAND is test-only and may bypass safeties)",
            "Alarm/fault history on the panel display"
          ],
          "search": "pump station will not start control power safety interlock reset"
        },
        "b": {
          "q": "Does the drive or starter respond (contactor pulls in or drive shows run)?",
          "o": [
            [
              "No response",
              "c2"
            ],
            [
              "Yes, it energizes",
              "c"
            ]
          ]
        },
        "c2": {
          "r": 1,
          "domain": "COMMAND CHAIN",
          "text": "Run command is not reaching the drive/starter.",
          "measure": [
            "Run command voltage at the drive/starter input",
            "Local/remote/auto mode selection",
            "Permissive relays and PLC output status",
            "On CLP/ACLP variants, confirm required start permissive to the drive (for example clock/flow/PSR path) is present even in manual testing"
          ],
          "search": "VFD pump will not run start command local remote permissive"
        },
        "c": {
          "q": "What does motor current do while commanded to run?",
          "o": [
            [
              "No current",
              "o1"
            ],
            [
              "High current, shaft not turning",
              "m1"
            ]
          ]
        },
        "o1": {
          "r": 1,
          "domain": "ELECTRICAL",
          "text": "Output path is open: contactor, overload, disconnected lead, or winding.",
          "measure": [
            "Output voltage at drive/starter",
            "Overload relay state",
            "Winding continuity and insulation resistance with leads isolated (locked out)"
          ],
          "search": "3 phase motor no current open winding troubleshooting megger"
        },
        "m1": {
          "r": 1,
          "domain": "MECHANICAL",
          "text": "Locked rotor or severe binding.",
          "measure": [
            "Shaft turns by hand (locked out)",
            "Bearings, impeller binding, debris or ice",
            "Coupling/shaft condition"
          ],
          "search": "centrifugal pump motor locked rotor shaft seized troubleshooting"
        }
      }
    },
    "vib": {
      "n": "Seal leak / noise / vibration",
      "s": "a",
      "nodes": {
        "a": {
          "q": "What are you seeing?",
          "o": [
            [
              "Leak at the mechanical seal",
              "sl"
            ],
            [
              "Bearing noise or heat",
              "br"
            ],
            [
              "Vibration or rumbling",
              "b"
            ]
          ]
        },
        "sl": {
          "r": 1,
          "domain": "MECHANICAL",
          "text": "Seals fail from dry running, cavitation, misalignment, shaft runout or contamination. Find why before replacing.",
          "measure": [
            "Leak source: seal vs casing/gland",
            "Shaft runout and alignment",
            "Evidence of dry running or cavitation upstream"
          ],
          "search": "centrifugal pump mechanical seal failure causes shaft runout alignment"
        },
        "br": {
          "r": 1,
          "domain": "MECHANICAL",
          "text": "Check lubrication, alignment, load and contamination.",
          "measure": [
            "Bearing temperature and lubrication",
            "Alignment and belt tension (if belt drive)",
            "Radial/axial load from piping strain"
          ],
          "search": "centrifugal pump bearing failure causes misalignment lubrication"
        },
        "b": {
          "q": "Does vibration change with flow or speed?",
          "o": [
            [
              "Worse at high or low flow",
              "h"
            ],
            [
              "Worse at a certain Hz/speed",
              "r"
            ],
            [
              "Constant at all conditions",
              "al"
            ]
          ]
        },
        "h": {
          "r": 1,
          "domain": "HYDRAULIC",
          "text": "Operating far from best efficiency point or cavitating.",
          "measure": [
            "Flow vs pump curve and BEP",
            "Suction conditions and noise character"
          ],
          "search": "pump vibration away from best efficiency point recirculation cavitation",
          "tool": "npsh"
        },
        "r": {
          "r": 1,
          "domain": "RESONANCE",
          "text": "A structural or piping resonance at a specific speed.",
          "measure": [
            "Note the Hz where it peaks",
            "Use VFD skip/jump frequency per your manual",
            "Check supports, bases and pipe clamps"
          ],
          "search": "VFD skip frequency pump resonance vibration",
          "tool": "hz"
        },
        "al": {
          "r": 1,
          "domain": "MECHANICAL",
          "text": "Typical: soft foot, misalignment, imbalance, pipe strain or worn bearings.",
          "measure": [
            "Soft foot and base bolts",
            "Coupling alignment",
            "Impeller condition and pipe strain"
          ],
          "search": "centrifugal pump vibration alignment soft foot imbalance pipe strain"
        }
      }
    },
    "fa": {
      "n": "High / low flow alarm",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Is the alarm confirmed by an independent source (second meter, pump curve, visual)?",
          "o": [
            [
              "No / not sure",
              "flow:flow"
            ],
            [
              "Yes, flow really is high",
              "hi"
            ],
            [
              "Yes, flow really is low",
              "lw"
            ],
            [
              "Rain Bird wording: Flow Meter Fault / Pipe Break / Starts Per Hour",
              "flow:rbflow"
            ]
          ]
        },
        "hi": {
          "r": 1,
          "domain": "HYDRAULIC",
          "text": "Real excess flow: break, valve stuck open, damaged heads or overlapping zones.",
          "measure": [
            "Pressure drop vs normal at same station",
            "Which zones are on when it starts",
            "Valve positions, mainline and lateral leak signs"
          ],
          "search": "irrigation high flow alarm mainline break stuck valve troubleshooting"
        },
        "lw": {
          "r": 1,
          "domain": "HYDRAULIC / VALVE",
          "text": "Restriction or valves not opening.",
          "measure": [
            "Strainers, filters, partially closed valves",
            "Pump output at this speed vs curve",
            "Valve/solenoid command and voltage"
          ],
          "search": "irrigation low flow alarm clogged strainer valve not opening troubleshooting",
          "tool": "pipe"
        }
      }
    },
    "rbflow": {
      "n": "Rain Bird flow/pressure alarms",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Which Rain Bird alarm pattern is active?",
          "o": [
            [
              "Flow Meter Fault",
              "fm"
            ],
            [
              "Pipe Break / High Flow",
              "hf"
            ],
            [
              "Low Pressure Fault",
              "lp"
            ],
            [
              "Pressure Transducer Fault",
              "pt"
            ],
            [
              "Starts Per Hour",
              "sh"
            ],
            [
              "Filter platform rinse/flush behavior",
              "fi"
            ]
          ]
        },
        "fm": {
          "r": 1,
          "domain": "RAIN BIRD FLOW METER FAULT",
          "text": "This can mean low/no flow plus low pressure after pump run time; it does not automatically prove a bad meter.",
          "measure": [
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
          "r": 1,
          "domain": "RAIN BIRD PIPE BREAK / HIGH FLOW",
          "text": "High flow compares measured flow to computed capacity from alarm-flow-per-pump and running pumps.",
          "measure": [
            "Alarm Flow per Pump setting versus actual pump capacity and staged pump count",
            "Leak path, stuck-open valve, or overlap timing when the event starts",
            "Whether the alarm is now blocked hard after repeated auto-resets"
          ],
          "search": "Rain Bird pipe break high flow alarm flow per pump troubleshooting",
          "tool": "pipe"
        },
        "lp": {
          "r": 1,
          "domain": "RAIN BIRD LOW PRESSURE FAULT",
          "text": "Low pressure may be hydraulic demand, inlet condition, or an expected pump that is not actually running.",
          "measure": [
            "Inlet pressure/lift and suction condition under load",
            "PRV stuck open, active filter flush, and discharge-valve position",
            "Expected running pumps versus actual running pumps (including tripped breakers)"
          ],
          "search": "Rain Bird low pressure fault irrigation pump station troubleshooting",
          "tool": "npsh"
        },
        "pt": {
          "r": 1,
          "domain": "RAIN BIRD PRESSURE TRANSDUCER FAULT",
          "text": "No valid pressure signal under run conditions is often wiring/scaling/transducer failure, not PID.",
          "measure": [
            "Reference gauge versus displayed pressure and live 4-20 mA signal",
            "Small-platform clue: -62 PSI often indicates loop/scaling or VFD-to-PLC communication setup issues (check Input 4/PC path and comm cable)",
            "Cable/terminal integrity and analog input health (including freeze damage) and verify transducer max scaling value for the installed sensor"
          ],
          "search": "Rain Bird pressure transducer fault -62 PSI troubleshooting",
          "tool": "xdcr"
        },
        "sh": {
          "r": 1,
          "domain": "RAIN BIRD STARTS PER HOUR",
          "text": "Short cycling usually starts with system demand behavior, not with increasing alarm limits.",
          "measure": [
            "Field leaks, overlap/program timing, hand watering/syringing, and check-valve sealing",
            "Remember: starts are triggered by low pressure and stops by low flow behavior",
            "Adjust wake/sleep margins only after the hydraulic cause is confirmed"
          ],
          "search": "Rain Bird starts per hour alarm short cycling troubleshooting"
        },
        "fi": {
          "r": 1,
          "domain": "RAIN BIRD FILTER PLATFORM",
          "text": "Filter issues can mimic pump or flow faults if rinse hydraulics are wrong.",
          "measure": [
            "Confirm rinse discharge goes to atmosphere (not submerged, not into a pressurized line)",
            "Verify rinse-line routing: avoid long runs/multiple bends and avoid downsizing",
            "Check wye strainer and speed regulator on hydraulic piston control tubing",
            "For hydraulic scanning filters, confirm rinse cycle time and rinse pressure (some training references target roughly 17-20 seconds)",
            "For HT stainless screen filters, verify flush speed-cycle setting and full piston stroke before retuning alarms"
          ],
          "search": "Rain Bird filter platform troubleshooting rinse cycle pressure differential wye strainer"
        }
      }
    },
    "wtflow": {
      "n": "WeatherTRAK flow alerts",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Which WeatherTRAK flow condition are you troubleshooting?",
          "o": [
            [
              "Controller high flow / mainline break",
              "mh"
            ],
            [
              "Station high flow",
              "sh"
            ],
            [
              "Station no flow",
              "sn"
            ],
            [
              "Leak / extended leak",
              "lk"
            ],
            [
              "Flow history does not match field evidence",
              "vr"
            ]
          ]
        },
        "mh": {
          "r": 1,
          "domain": "CONTROL / FLOW CONFIG",
          "text": "Treat this as a potential mainline break until proven otherwise. WeatherTRAK logic can stop stations, test for continuing flow, and then close the master valve if break conditions persist.",
          "measure": [
            "Mainline break threshold and delay (1-6 min) in controller/central settings",
            "Whether stations were stacked or overlapping when the alert occurred",
            "Flow after stations stop; if it remains above threshold, find leak path before restart",
            "Audit who issued remote event pause/shut-off and when"
          ],
          "search": "WeatherTRAK mainline break threshold delay troubleshooting"
        },
        "sh": {
          "r": 1,
          "domain": "CONTROL / FLOW CONFIG",
          "text": "Station high flow uses learned/assigned station flow plus offsets or station-specific limits. False trips usually come from stale learned values, threshold drift, or hydraulic changes.",
          "measure": [
            "Assigned/learned station flow vs measured station flow",
            "Global offset or station-specific high-flow threshold and delay",
            "Recent nozzle/valve/head changes since the last learn cycle",
            "Whether high-flow events escalated into mainline-break logic"
          ],
          "search": "WeatherTRAK station high flow learned flow threshold troubleshooting",
          "tool": "flowcal"
        },
        "sn": {
          "r": 1,
          "domain": "CONTROL / FLOW CONFIG",
          "text": "No-flow alerts mean commanded irrigation with little/no measured flow (for example pump start fail, closed isolation/backflow, or scaling error).",
          "measure": [
            "No-flow threshold/delay and any excluded stations",
            "Pump-start/master-valve output state during the event",
            "Upstream isolation/backflow status and station command voltage at valve",
            "If three stations in a row hit no-flow, verify why irrigation was suspended"
          ],
          "search": "WeatherTRAK station no flow alert troubleshooting pump start master valve"
        },
        "lk": {
          "r": 1,
          "domain": "CONTROL / LEAK MONITORING",
          "text": "Leak monitoring is evaluated when no scheduled/manual station is running. Extended leak logic supports normally-open master-valve systems while reducing nuisance trips.",
          "measure": [
            "Leak threshold and delay plus extended-leak settings",
            "Whether any station/manual run was active during the event window",
            "If normally-open MV is used, confirm extended-leak closure and reset behavior",
            "Trend overnight flow against baseline and recent alerts"
          ],
          "search": "WeatherTRAK extended leak detection normally open master valve troubleshooting"
        },
        "vr": {
          "r": 1,
          "domain": "SIGNAL / SCALING",
          "text": "History mismatches are usually K/offset, wiring/signal, or installation-condition issues before they are software defects.",
          "measure": [
            "Sensor type and K/offset at controller match the meter output/register",
            "Pulse/mA signal at controller input matches live meter output",
            "For FlowHD, verify straight-run and air-vent install guidance; for Flow3, verify register/output selection",
            "Compare alert timestamps with field operations and manual runs"
          ],
          "search": "WeatherTRAK flow history does not match field readings k factor offset troubleshooting",
          "tool": "flowcal"
        }
      }
    },
    "lflow": {
      "n": "Learned vs measured flow",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Has anything changed hydraulically since the flow was learned (nozzles, heads, repairs, valve or zone changes, pump or pressure changes)?",
          "o": [
            [
              "Yes, something changed",
              "st"
            ],
            [
              "No / not sure",
              "b"
            ]
          ]
        },
        "st": {
          "r": 1,
          "domain": "CONTROL CONFIG",
          "text": "Learned values may be stale for the new hydraulics. Fix any real problem first, then re-learn per the controller manual.",
          "measure": [
            "What changed and when",
            "Pressure at the station now vs before",
            "Learned flow history vs current measured flow"
          ],
          "search": "central control learned flow out of date after changes relearn flow"
        },
        "b": {
          "q": "Does an independent flow reading (portable meter, tank fill, pump curve) agree with the flow sensor?",
          "o": [
            [
              "Yes, the sensor is right",
              "hy"
            ],
            [
              "No, they differ",
              "flow:flow"
            ]
          ]
        },
        "hy": {
          "r": 1,
          "domain": "HYDRAULIC",
          "text": "Real flow differs from learned: leak, partial blockage, worn valve, overlapping stations, or a pressure shift.",
          "measure": [
            "Station pressure vs normal at the same flow",
            "Which stations run together at alarm time",
            "Valve and strainer condition; signs of a leak"
          ],
          "search": "irrigation measured flow higher lower than learned flow causes",
          "tool": "pipe"
        }
      }
    },
    "tw": {
      "n": "Two-wire / decoder problem",
      "s": "a",
      "nodes": {
        "a": {
          "q": "How much of the system is affected?",
          "o": [
            [
              "One decoder/station",
              "one"
            ],
            [
              "A branch or section",
              "br"
            ],
            [
              "The whole line",
              "all"
            ],
            [
              "Check expected idle current from decoder count",
              "idle"
            ]
          ]
        },
        "idle": {
          "r": 1,
          "domain": "IDLE CURRENT / INVENTORY",
          "text": "Calculate a decoder-only idle subtotal for the exact family. Nominal figures without tolerances are not pass/fail limits.",
          "measure": [
            "Physical decoder count on the measured path/module, not station or solenoid count",
            "No active stations or master valves; path powered in the specified diagnostic state",
            "Exact controller/decoder family and manufacturer-approved measurement method",
            "Unmodeled devices, path effects and known-good baseline; a current difference alone does not identify a fault"
          ],
          "search": "decoder standby idle current manufacturer troubleshooting",
          "tool": "decoderidle"
        },
        "one": {
          "r": 1,
          "domain": "DECODER / LOCAL",
          "text": "Likely the decoder, solenoid or its splice at that valve.",
          "measure": [
            "Voltage at the decoder and solenoid resistance (power off)",
            "Splice condition (water ingress)",
            "Swap test with a known-good decoder",
            "If WeatherTRAK, verify local WT2W-LSP/flow-decoder grounding is intact (50 Ω max target)"
          ],
          "search": "two wire decoder single station not working solenoid resistance splice"
        },
        "br": {
          "r": 1,
          "domain": "WIRING",
          "text": "Break, bad splice or short on that branch.",
          "measure": [
            "Line current with the branch connected vs isolated",
            "Continuity and insulation to ground on the branch (locked out)",
            "Splices between the last working and first failed decoder",
            "If WeatherTRAK star layout is used, verify WT2W-LSP placement: near controller, every 500 ft or 5 decoders, and at branch ends 25 ft or longer"
          ],
          "search": "two wire irrigation branch fault locating splice break short",
          "tool": "twvd"
        },
        "all": {
          "r": 1,
          "domain": "ELECTRICAL / CONTROLLER",
          "text": "Controller output, short on the line, ground leakage, or surge damage.",
          "measure": [
            "Line voltage at the controller output and at the far end",
            "Line current draw vs normal",
            "Insulation to ground, surge protection and ground rod condition",
            "If WeatherTRAK, confirm grounding targets: controller 10 Ω max and line surge protectors/flow decoders 50 Ω max"
          ],
          "search": "two wire decoder line short ground fault surge troubleshooting current draw",
          "tool": "twvd"
        }
      }
    },
    "comm": {
      "n": "Controller offline / comms",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Does the controller have power and run its program locally?",
          "o": [
            [
              "No: dead or not running",
              "pw"
            ],
            [
              "Yes, it runs but isn’t reporting",
              "b"
            ]
          ]
        },
        "pw": {
          "r": 1,
          "domain": "POWER",
          "text": "Check power before communications.",
          "measure": [
            "Voltage at the controller input and breaker",
            "Transformer/fuse and battery",
            "Display and status LEDs"
          ],
          "search": "irrigation controller no power transformer fuse troubleshooting"
        },
        "b": {
          "q": "Is the signal strength/antenna indicator healthy and the service/account active?",
          "o": [
            [
              "No: weak or no signal",
              "sg"
            ],
            [
              "Signal looks fine",
              "ac"
            ]
          ]
        },
        "sg": {
          "r": 1,
          "domain": "SIGNAL",
          "text": "Antenna or coverage problem.",
          "measure": [
            "Signal strength indicator at the controller",
            "Antenna placement, cable and connectors",
            "Metal enclosure or obstruction effects"
          ],
          "search": "irrigation controller cellular antenna weak signal troubleshooting"
        },
        "ac": {
          "r": 1,
          "domain": "ACCOUNT / SOFTWARE",
          "text": "Service, activation or firmware issue.",
          "measure": [
            "Account, activation and subscription status",
            "Firmware version and update availability",
            "Communication alert indicators at controller (for example days-since-ET update / audible alert behavior)",
            "Contact manufacturer support with controller ID and the time it last reported"
          ],
          "search": "central control controller offline not communicating activation subscription firmware"
        }
      }
    },
    "pstart": {
      "n": "Pump start / master valve not operating",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Does the controller show the pump-start or master-valve output as ON when it should?",
          "o": [
            [
              "No, output not turning on",
              "cf"
            ],
            [
              "Yes, it shows ON",
              "b"
            ]
          ]
        },
        "cf": {
          "r": 1,
          "domain": "CONTROLLER CONFIG",
          "text": "Output is not being called.",
          "measure": [
            "Pump-start/master-valve assignment on the running stations",
            "Watering window, pauses, rain or sensor holds, active alarms",
            "Output status in the controller diagnostics",
            "If a single POC is shared (FlowShare/FlowLink style), confirm controller water windows are not overlapping",
            "If a temporary commissioning jumper bypassed the pump-start relay, remove it before returning station to normal operation"
          ],
          "search": "irrigation controller pump start master valve output not activating"
        },
        "b": {
          "q": "Is voltage present at the relay coil or master-valve solenoid terminals while ON?",
          "o": [
            [
              "No voltage",
              "wr"
            ],
            [
              "Voltage present",
              "c"
            ]
          ]
        },
        "wr": {
          "r": 1,
          "domain": "ELECTRICAL",
          "text": "Output path is broken between controller and relay/valve.",
          "measure": [
            "Voltage at the controller output terminals",
            "Fuses, wiring and splices to the relay/valve",
            "Output module health per your manual"
          ],
          "search": "irrigation pump start relay no voltage controller output troubleshooting"
        },
        "c": {
          "q": "Does the relay/contactor or valve respond when energized?",
          "o": [
            [
              "No: relay or valve does not act",
              "rl"
            ],
            [
              "Yes, and the pump station still doesn’t start",
              "flow:nostart"
            ]
          ]
        },
        "rl": {
          "r": 1,
          "domain": "COMPONENT",
          "text": "Coil, relay, contactor or master valve failure.",
          "measure": [
            "Coil resistance and mechanical movement",
            "Relay contacts continuity (locked out)",
            "Replace with known-good and retest"
          ],
          "search": "pump start relay coil failure irrigation master valve solenoid test"
        }
      }
    },
    "ptype": {
      "n": "Pump type",
      "pt": 1,
      "s": "a",
      "nodes": {
        "a": {
          "q": "What type of pump is it? Check the nameplate and how the water reaches the pump.",
          "o": [
            [
              "Suction lift: pump sits above the water and pulls it up",
              "flow:pt_lift"
            ],
            [
              "Flooded suction: water level above the pump inlet",
              "flow:pt_flood"
            ],
            [
              "Vertical turbine: bowls submerged on a lineshaft, motor on top",
              "flow:pt_vt"
            ],
            [
              "Submersible: pump and motor submerged together",
              "flow:pt_sub"
            ],
            [
              "Booster: takes pressurized water from a supply",
              "flow:pt_boost"
            ],
            [
              "Jet pump: ejector (nozzle and venturi) assists suction",
              "flow:pt_jet"
            ]
          ]
        }
      }
    },
    "pt_lift": {
      "n": "Suction lift pump",
      "pt": 1,
      "basis": "Basis: engineering fundamentals and common industry practice, not manufacturer specifications. Minimum submergence, minimum flow, operating range, clearances and adjustment values come from your pump’s manual and curve. Items marked PROBABLE are hypotheses to confirm.",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Does it lose prime, pull air, or surge (no pressure after start)?",
          "o": [
            [
              "Yes: loses prime, surges or sucks air",
              "b"
            ],
            [
              "No: it primes, but flow is low or it is noisy",
              "c"
            ]
          ]
        },
        "b": {
          "q": "With the pump locked out, do the suction line and foot valve hold water or vacuum?",
          "o": [
            [
              "No: loses water or vacuum",
              "leak"
            ],
            [
              "Yes: holds",
              "sh"
            ]
          ]
        },
        "leak": {
          "r": 1,
          "domain": "SUCTION AIR LEAK / FOOT VALVE",
          "text": "PROBABLE: Air is entering or water is draining back through the foot valve, a loose or cracked suction fitting, a worn shaft seal, a casing gasket or a strainer lid. Air breaks prime and cuts capacity before it looks like classic cavitation.",
          "measure": [
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
          "r": 1,
          "domain": "PRIMING DEVICE / PUMP",
          "text": "PROBABLE: Suction is tight but prime is not established or held. For a self-priming pump check the priming chamber level, wear clearances and rotation; for an external priming system check the vacuum pump, ejector or priming valve.",
          "measure": [
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
          "q": "Have you measured suction vacuum at the pump inlet while running at duty flow?",
          "o": [
            [
              "Yes: high vacuum, noise, flow falling",
              "vp"
            ],
            [
              "No: not measured yet",
              "m"
            ]
          ]
        },
        "m": {
          "r": 1,
          "domain": "SUCTION / MEASUREMENT",
          "text": "UNKNOWN until suction is measured at the inlet while running at duty flow, not static.",
          "measure": [
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
          "q": "As flow increases, what does the suction vacuum pattern look like?",
          "o": [
            [
              "Vacuum rises rapidly with flow",
              "vr"
            ],
            [
              "Vacuum rises then suddenly drops as prime is lost",
              "vl"
            ],
            [
              "Vacuum does not rise as expected and discharge head collapses when flow opens",
              "vi"
            ],
            [
              "Pattern unclear, but vacuum remains high and unstable",
              "nl"
            ]
          ]
        },
        "vr": {
          "r": 1,
          "domain": "SUCTION RESTRICTION",
          "text": "PROBABLE: Restriction on the suction side (screen, strainer, valve, intake path). A restricted intake commonly shows rapid vacuum rise as flow increases.",
          "measure": [
            "Pressure/vacuum drop across suction-side strainers and valves",
            "Intake screen condition and source level during demand",
            "Suction line sizing/route and high-friction sections"
          ],
          "search": "suction lift pump restriction rapid rise vacuum gauge troubleshooting",
          "tool": "npsh"
        },
        "vl": {
          "r": 1,
          "domain": "SUCTION AIR LEAK",
          "text": "PROBABLE: Air leak in suction piping or fittings. A common signature is normal vacuum rise, then sudden drop with loss of prime as vacuum opens the leak path.",
          "measure": [
            "Inspect suction-side joints/fittings, especially long PVC runs and any hairline cracks",
            "Watch gauge behavior on shutdown; rising vacuum with water draining back can indicate leak path",
            "Check foot valve seal and suction-line hold test before restart"
          ],
          "search": "suction lift pump vacuum rises then drops loss of prime air leak",
          "tool": "npsh"
        },
        "vi": {
          "r": 1,
          "domain": "IMPELLER / INTERNAL BLOCKAGE",
          "text": "PROBABLE: Impeller blockage or internal flow restriction. A telltale pattern is weak vacuum-rise response with discharge pressure that deadheads correctly but falls quickly when flow is introduced.",
          "measure": [
            "Compare deadhead pressure to curve versus pressure under flow",
            "Inspect impeller/eye for blockage and wear",
            "Confirm rotation/speed and re-test with clean suction path"
          ],
          "search": "centrifugal pump impeller blockage deadhead ok pressure falls with flow troubleshooting"
        },
        "nl": {
          "r": 1,
          "domain": "HYDRAULIC / SUCTION",
          "text": "PROBABLE: High lift plus friction leaves little NPSHa. Atmosphere supports about 34 ft of water at sea level in theory (CALCULATED), and the practical lift is far lower after vapor pressure, suction friction and the pump’s NPSHr. Warmer water, a falling water level or a fouled strainer each reduce NPSHa.",
          "measure": [
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
      }
    },
    "pt_flood": {
      "n": "Flooded suction pump",
      "pt": 1,
      "basis": "Basis: engineering fundamentals and common industry practice, not manufacturer specifications. Minimum submergence, minimum flow, operating range, clearances and adjustment values come from your pump’s manual and curve. Items marked PROBABLE are hypotheses to confirm.",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Compare suction pressure at the pump while running at duty flow with the static (pump off) value.",
          "o": [
            [
              "Drops a lot when running",
              "b"
            ],
            [
              "Little change, still noisy or low flow",
              "c"
            ],
            [
              "Not measured",
              "m"
            ]
          ]
        },
        "m": {
          "r": 1,
          "domain": "SUCTION / MEASUREMENT",
          "text": "UNKNOWN until suction pressure is measured static and running.",
          "measure": [
            "Suction gauge static and at duty flow, same gauge",
            "Discharge pressure and flow at the same time",
            "Water level, water temperature and elevation for NPSHa"
          ],
          "search": "flooded suction pump measure suction pressure running versus static NPSH",
          "tool": "sys"
        },
        "b": {
          "q": "Is any suction valve partly closed, or a strainer, screen or intake plugged?",
          "o": [
            [
              "Yes or unsure",
              "r1"
            ],
            [
              "No: valves open, screens clean",
              "p1"
            ]
          ]
        },
        "r1": {
          "r": 1,
          "domain": "SUCTION RESTRICTION",
          "text": "PROBABLE: A large drop from static to running suction pressure means friction or a restriction between the source and the pump inlet.",
          "measure": [
            "Pressure on both sides of each strainer, valve and screen",
            "Valve position: confirm fully open (a disc can come loose from its stem)",
            "Intake screen debris and water level",
            "Verify gauge accuracy before concluding"
          ],
          "search": "pump suction strainer plugged pressure drop flooded suction troubleshooting"
        },
        "p1": {
          "r": 1,
          "domain": "SUCTION PIPING",
          "text": "PROBABLE: Suction velocity or friction is too high for the flow, or air is trapped. Flooded suction helps NPSHa but does not guarantee it.",
          "measure": [
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
          "q": "Is there a vortex or air entry at the intake (low level, inlet near the surface, wall or a tank outlet)?",
          "o": [
            [
              "Yes or likely",
              "v"
            ],
            [
              "No",
              "n"
            ]
          ]
        },
        "v": {
          "r": 1,
          "domain": "INTAKE / AIR ENTRAINMENT",
          "text": "PROBABLE: Air drawn in at the intake gives noise, surging and falling head, which sounds like cavitation but is a different cause.",
          "measure": [
            "Water level versus the submergence your pump manufacturer or intake guidance requires",
            "Surface vortices, swirl, and returns dropping water near the intake",
            "Air in a clear pipe section or at a high-point vent",
            "Level control setpoints on the tank, pond or wet well",
            "In wells or wet wells, verify inlet-to-wall clearance per pump type and manufacturer guidance (common references: submersible about 0.25D, line-shaft turbine about 0.75D)"
          ],
          "search": "pump intake vortex air entrainment submergence wet well troubleshooting"
        },
        "n": {
          "r": 1,
          "domain": "HYDRAULIC / NPSH",
          "text": "UNKNOWN until NPSHa is calculated. Hot water, high elevation, long suction friction, or running far right on the curve (higher NPSHr) can still cause cavitation.",
          "measure": [
            "NPSHa with the System check tool, using a negative lift for flooded suction",
            "Operating flow on the curve versus BEP and NPSHr at that flow",
            "Water temperature"
          ],
          "search": "flooded suction pump cavitation NPSHa NPSHr operating point",
          "tool": "sys"
        }
      }
    },
    "pt_vt": {
      "n": "Vertical turbine pump",
      "pt": 1,
      "basis": "Basis: engineering fundamentals and common industry practice, not manufacturer specifications. Minimum submergence, minimum flow, operating range, clearances and adjustment values come from your pump’s manual and curve. Items marked PROBABLE are hypotheses to confirm.",
      "x": "Wet wells, vaults and ponds can be confined spaces. Rig and lift only at the manufacturer’s lifting points, and keep clear of the open discharge head and column during pulls.",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Do you know the static and pumping (drawdown) water level at this flow?",
          "o": [
            [
              "Yes: measured or readable",
              "b"
            ],
            [
              "No: not available",
              "m"
            ]
          ]
        },
        "m": {
          "r": 1,
          "domain": "SUCTION / MEASUREMENT",
          "text": "UNKNOWN: A turbine has no suction gauge. The water level over the first bowl is the suction condition.",
          "measure": [
            "Static and pumping water level at running flow (sounder, airline or transducer as installed)",
            "Discharge pressure at the head and flow at the same time",
            "Setting depth and bowl data from the pump record, and the curve for this model"
          ],
          "search": "vertical turbine pump measure pumping water level drawdown submergence",
          "tool": "sys"
        },
        "b": {
          "q": "Is the pumping level close to the first bowl, or falling over time?",
          "o": [
            [
              "Yes: low submergence or falling level",
              "s1"
            ],
            [
              "No: plenty of submergence",
              "c"
            ]
          ]
        },
        "s1": {
          "r": 1,
          "domain": "HYDRAULIC / SUBMERGENCE",
          "text": "PROBABLE: Too little submergence over the first impeller gives cavitation and vortexing. The requirement (NPSHr plus minimum submergence) comes from the manufacturer.",
          "measure": [
            "Minimum submergence in the manual versus actual pumping level",
            "Seasonal or drought decline in the source; wet well or pond level control",
            "Swirl or vortex at the intake",
            "Setting depth and bowl position in the pump record"
          ],
          "search": "vertical turbine pump minimum submergence vortex cavitation NPSH"
        },
        "c": {
          "q": "Compared with the curve at the measured flow, is total head low? Total head is lift to the surface plus discharge pressure plus column loss.",
          "o": [
            [
              "Head or flow low versus the curve",
              "d"
            ],
            [
              "Matches the curve but vibration, noise or amps are odd",
              "e"
            ]
          ]
        },
        "d": {
          "r": 1,
          "domain": "MECHANICAL / HYDRAULIC",
          "text": "PROBABLE (confirm one at a time): impeller lateral setting wrong or impellers worn, bowl wear, wrong rotation or speed, a column or discharge head leak, a broken lineshaft or coupling, a closed or partly closed valve, air, or sand.",
          "measure": [
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
          "r": 1,
          "domain": "MECHANICAL",
          "text": "PROBABLE: Vibration or noise at a normal operating point points to lineshaft bearings or lubrication, a bent shaft, driver and discharge head misalignment, resonance, or intake turbulence.",
          "measure": [
            "Vibration at the motor and discharge head versus speed (VFD resonance and skip frequencies per the manual)",
            "Lineshaft lubrication: oil tube drip rate or water supply to the bearings, per the manual",
            "Motor thrust bearing condition and non-reverse ratchet",
            "Base alignment and piping strain at the discharge head"
          ],
          "search": "vertical turbine pump vibration lineshaft bearing lubrication resonance VFD"
        }
      }
    },
    "pt_sub": {
      "n": "Submersible pump",
      "pt": 1,
      "basis": "Basis: engineering fundamentals and common industry practice, not manufacturer specifications. Minimum submergence, minimum flow, operating range, clearances and adjustment values come from your pump’s manual and curve. Items marked PROBABLE are hypotheses to confirm.",
      "x": "Submerged cable and motor can hold dangerous voltage. Lock out and verify before pulling the pump; rig at the manufacturer’s lifting points; treat wet wells and vaults as confined spaces.",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Is the motor tripping on overload, drawing unbalanced amps, or reading low insulation resistance?",
          "o": [
            [
              "Yes: overload, imbalance or low insulation resistance",
              "el"
            ],
            [
              "No: it runs, but flow or pressure is low or it is noisy",
              "b"
            ]
          ]
        },
        "el": {
          "r": 1,
          "domain": "ELECTRICAL",
          "text": "PROBABLE (confirm with measurements): damaged cable or splice, water ingress to the motor, supply imbalance, a VFD output problem (long cable, voltage spikes), or the pump binding from sand or debris.",
          "measure": [
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
          "q": "Is the water level near the pump intake, or could air or a vortex enter at the intake?",
          "o": [
            [
              "Low level or vortex possible",
              "lv"
            ],
            [
              "Level is fine",
              "c"
            ]
          ]
        },
        "lv": {
          "r": 1,
          "domain": "SUCTION / SUBMERGENCE",
          "text": "PROBABLE: Low submergence causes air entrainment and can reduce motor cooling. Minimum submergence and cooling requirements come from the manufacturer.",
          "measure": [
            "Water level versus the manufacturer’s minimum submergence",
            "Level control and float or transducer settings",
            "Intake screen condition and distance from walls or the surface",
            "Motor temperature if monitored"
          ],
          "search": "submersible pump minimum submergence cooling air entrainment vortex"
        },
        "c": {
          "q": "Where is it operating: far from the curve, or at reduced VFD speed?",
          "o": [
            [
              "Far right (low head, high flow) or near shutoff",
              "up"
            ],
            [
              "Reduced speed on a VFD",
              "vfd"
            ],
            [
              "Normal point on the curve",
              "cr"
            ]
          ]
        },
        "up": {
          "r": 1,
          "domain": "HYDRAULIC / MECHANICAL",
          "text": "PROBABLE: Staged pumps are built for an operating range. Far-right operation can cause upthrust and wear; near shutoff causes heat, recirculation and downthrust. Limits come from the manufacturer.",
          "measure": [
            "Flow and head versus the curve and the manufacturer’s allowable range",
            "Discharge valve, check valve and system pressure changes",
            "Pressure setpoint and PID behavior on a VFD",
            "Motor amps versus nameplate"
          ],
          "search": "submersible pump upthrust operating range runout shutoff troubleshooting",
          "tool": "affinity"
        },
        "vfd": {
          "r": 1,
          "domain": "CONTROL / COOLING",
          "text": "PROBABLE: At reduced speed the flow past the motor falls. Below the manufacturer’s minimum speed or flow the motor may overheat.",
          "measure": [
            "Programmed minimum frequency versus the manufacturer’s minimum",
            "Cooling flow past the motor or the cooling sleeve in this installation",
            "Motor temperature if monitored",
            "Pump head at minimum speed versus system static head (it may not deliver at all)"
          ],
          "search": "submersible motor minimum speed VFD cooling flow sleeve",
          "tool": "affinity"
        },
        "cr": {
          "r": 1,
          "domain": "MECHANICAL / HYDRAULIC",
          "text": "UNKNOWN until head and flow are compared with the curve. Look for sand wear, rotation, a clogged intake screen, a discharge leak or a stuck check valve.",
          "measure": [
            "Head and flow versus the curve at the actual speed",
            "Rotation and amps per phase",
            "Intake screen, check valve and discharge piping",
            "Sand or debris in the water"
          ],
          "search": "submersible pump low flow low pressure worn impeller intake screen check valve troubleshooting"
        }
      }
    },
    "pt_boost": {
      "n": "Booster pump",
      "pt": 1,
      "basis": "Basis: engineering fundamentals and common industry practice, not manufacturer specifications. Minimum submergence, minimum flow, operating range, clearances and adjustment values come from your pump’s manual and curve. Items marked PROBABLE are hypotheses to confirm.",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Does inlet pressure at the booster drop when it runs?",
          "o": [
            [
              "Yes: inlet pressure collapses at running flow",
              "b"
            ],
            [
              "No: inlet stays steady",
              "c"
            ],
            [
              "Not measured",
              "m"
            ]
          ]
        },
        "m": {
          "r": 1,
          "domain": "MEASUREMENT",
          "text": "UNKNOWN: A booster only adds to what the supply provides, so you need inlet pressure, outlet pressure and flow together.",
          "measure": [
            "Inlet and outlet pressure at the same time at running flow; the difference is the head the pump adds (CALCULATED: psi × 2.31 = ft)",
            "Static (pump off) versus running inlet pressure",
            "Flow at the same moment, compared with the curve"
          ],
          "search": "booster pump measure inlet outlet pressure differential head curve"
        },
        "b": {
          "q": "Can the supply (main, tank or upstream pump) deliver the booster’s flow?",
          "o": [
            [
              "No or unsure: limited or fed by another pump",
              "sup"
            ],
            [
              "Yes: supply is adequate",
              "c"
            ]
          ]
        },
        "sup": {
          "r": 1,
          "domain": "SUPPLY / SUCTION",
          "text": "PROBABLE: Booster demand exceeds the supply, so inlet pressure collapses, NPSHa falls, and the booster cavitates or trips on its low-suction safety. Repairing the pump will not fix the supply. Do not defeat or lower the low-suction cutoff to keep it running.",
          "measure": [
            "Upstream pressure, valves, strainers and backflow or PRV assemblies (pressure drop across each)",
            "Upstream pump or tank capability at this flow",
            "Low-suction cutoff setpoint versus actual inlet pressure, and that the sensor reads true",
            "NPSHa (CALCULATED): absolute inlet pressure × 2.31 minus vapor head. In the System check tool use inlet gauge psi × 2.31 as a negative lift with suction length 0"
          ],
          "search": "booster pump low inlet pressure cavitation supply NPSHa low suction cutoff",
          "tool": "sys"
        },
        "c": {
          "q": "How is it operating?",
          "o": [
            [
              "Near shutoff, hot, or cycling on and off",
              "low"
            ],
            [
              "High flow, running out the curve",
              "high"
            ],
            [
              "Neither: head or flow does not match the curve",
              "cur"
            ]
          ]
        },
        "low": {
          "r": 1,
          "domain": "HYDRAULIC / CONTROL",
          "text": "PROBABLE: Low-flow operation heats the water in the casing and causes recirculation, vibration and seal or bearing damage. Short cycling stresses the motor and starter. The minimum flow comes from the manual.",
          "measure": [
            "Casing and seal temperature and noise",
            "Minimum continuous flow in the manual versus actual flow",
            "Pressure setpoint, deadband, tank precharge and check valve",
            "VFD minimum speed and sleep or boost settings"
          ],
          "search": "booster pump minimum flow shutoff overheating short cycling pressure tank VFD sleep"
        },
        "high": {
          "r": 1,
          "domain": "HYDRAULIC",
          "text": "PROBABLE: More flow than designed (open lines, a break) moves the pump right on the curve, where NPSHr and motor load rise, while inlet pressure falls.",
          "measure": [
            "Flow versus design and versus the curve",
            "Inlet pressure at that flow",
            "Motor amps versus nameplate",
            "Downstream leaks or valves stuck open"
          ],
          "search": "booster pump running out of curve high flow overload cavitation",
          "tool": "sys"
        },
        "cur": {
          "r": 1,
          "domain": "MECHANICAL / HYDRAULIC",
          "text": "UNKNOWN until the differential head and flow are compared with the curve. A mismatch can come from rotation or speed, wear, instrument error, or a changed system.",
          "measure": [
            "Rotation and VFD speed",
            "Gauge and transducer accuracy",
            "Impeller diameter and wear",
            "Strainers and valves in the discharge"
          ],
          "search": "booster pump low pressure differential head curve wear rotation troubleshooting",
          "tool": "affinity"
        }
      }
    },
    "pt_jet": {
      "n": "Jet pump",
      "pt": 1,
      "basis": "Basis: engineering fundamentals and common industry practice, not manufacturer specifications. Minimum submergence, minimum flow, operating range, clearances and adjustment values come from your pump’s manual and curve. Items marked PROBABLE are hypotheses to confirm.",
      "s": "a",
      "nodes": {
        "a": {
          "q": "Does it prime and hold pressure?",
          "o": [
            [
              "No: loses prime or no pressure",
              "p"
            ],
            [
              "Yes: it primes, but flow or pressure is low",
              "q"
            ]
          ]
        },
        "p": {
          "r": 1,
          "domain": "SUCTION AIR / FOOT VALVE",
          "text": "PROBABLE: A jet pump needs tight suction and drive piping. Air in the suction line, a leaking foot valve or an empty casing stops it from priming.",
          "measure": [
            "Casing and pipes filled with water per the manual before start",
            "Foot valve seat and all fittings (on a two-pipe deep-well system check both pipes)",
            "Vacuum and pressure gauges steady or fluttering",
            "Rotation"
          ],
          "search": "jet pump loses prime foot valve air leak troubleshooting"
        },
        "q": {
          "q": "Has the ejector (nozzle and venturi) been checked for plugging, wear, or a mismatch with the well depth?",
          "o": [
            [
              "Not checked, or suspect it",
              "ej"
            ],
            [
              "Checked and clean",
              "pc"
            ]
          ]
        },
        "ej": {
          "r": 1,
          "domain": "EJECTOR",
          "text": "PROBABLE: The nozzle and venturi pair sets performance for a given depth and pressure. Plugging from sand or scale, wear, or the wrong combination reduces flow and priming ability.",
          "measure": [
            "Installed nozzle and venturi part numbers versus the manufacturer’s performance table for your depth",
            "Inspect and clean them with the pump locked out and depressurized",
            "Foot valve screen or strainer",
            "Pressure switch, regulator and tank precharge"
          ],
          "search": "jet pump nozzle venturi ejector plugged performance table well depth"
        },
        "pc": {
          "r": 1,
          "domain": "HYDRAULIC",
          "text": "UNKNOWN: A jet pump recirculates part of its flow, so efficiency is low and output falls as the water level (drawdown) falls. Compare pressure and flow with the manufacturer’s performance table at the actual depth.",
          "measure": [
            "Depth to water now versus at installation",
            "Pressure and flow versus the table",
            "Motor amps versus nameplate",
            "Pressure-control valve on the return line, if fitted"
          ],
          "search": "jet pump low flow low pressure drawdown water level performance curve"
        }
      }
    }
  }
};
