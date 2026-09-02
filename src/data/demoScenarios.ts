import { DemoScenario } from '../types';

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'demo-ankle-sprain',
    title: 'Ankle Sprain (Canteen Slip)',
    subtitle: 'Fall injury with swelling and pain',
    badge: 'Medical First Aid',
    category: 'injury',
    urgency: 'moderate',
    promptText: 'My friend slipped near the canteen and his ankle is swollen and painful to walk on.',
    mockResponse: {
      incident: 'Possible Ankle Sprain / Joint Injury',
      category: 'injury',
      urgency: 'moderate',
      summary: 'The person appears to have sustained an acute ankle sprain from a slip and fall.',
      steps: [
        'Have the person immediately stop walking and sit comfortably.',
        'Support the injured ankle in a relaxed position without bearing weight.',
        'Apply a cold ice pack wrapped in a clean towel for 15-20 minutes.',
        'Elevate the foot on a backpack or chair above hip level.',
        'Escort or assist them to the Campus Medical Room for an evaluation.'
      ],
      avoid: [
        'Do not force them to walk or test their weight on the ankle.',
        'Do not massage or vigorously rub the swollen joint.',
        'Do not apply direct heat or hot water packs within the first 48 hours.'
      ],
      redFlags: [
        'Severe visible deformity or bone protruding through the skin',
        'Complete numbness, tingling, or toes turning blue or cold',
        'Severe unbearable pain with inability to move toes'
      ],
      callEmergencyServices: false,
      recommendedContact: 'Campus Medical Room',
      disclaimer: 'SafeGuard AI provides general first-response guidance and does not replace professional medical diagnosis.',
      criticalQuestions: [
        'Can they wiggle their toes without sharp bone pain?',
        'Was there a loud popping sound during the fall?'
      ],
      source: 'demo'
    }
  },
  {
    id: 'demo-electrical-hazard',
    title: 'Exposed Wire (Lab Hazard)',
    subtitle: 'Physical campus electrical safety risk',
    badge: 'Campus Safety Hazard',
    category: 'hazard',
    urgency: 'high',
    promptText: 'There is an exposed electrical wire sparking near our electronics lab hallway.',
    mockResponse: {
      incident: 'High-Voltage Exposed Electrical Wire Hazard',
      category: 'hazard',
      urgency: 'high',
      summary: 'An exposed live electrical cable presents an immediate shock and fire hazard to students and staff.',
      steps: [
        'STAY BACK: Maintain a safe perimeter of at least 15 feet from the wire.',
        'Immediately caution students nearby to stay away from the corridor.',
        'Do NOT touch the wire or attempt to move it with any object.',
        'Contact Campus Security and Facilities Maintenance immediately.',
        'If safe and accessible by trained staff, locate the circuit breaker switch.'
      ],
      avoid: [
        'Never touch fallen or exposed cables with bare hands or metal items.',
        'Never spray water or use wet materials anywhere near the area.',
        'Never allow anyone into the hallway until safety teams clear the area.'
      ],
      redFlags: [
        'Sparks, smoke, or burning ozone smell',
        'Water on the floor near the exposed wiring',
        'Anyone in direct contact with the electric current (Do not touch them directly)'
      ],
      callEmergencyServices: true,
      recommendedContact: 'Campus Security & Facilities Maintenance',
      disclaimer: 'SafeGuard AI provides first-response safety guidance. For active electrical emergencies, notify security immediately.',
      criticalQuestions: [
        'Is there any water or liquid on the floor near the wire?',
        'Has anyone suffered an electric shock?'
      ],
      hazardDetails: {
        hazardType: 'Electrical Shock & Fire Risk',
        riskLevel: 'HIGH',
        notifyDepartment: 'Campus Security & Electrical Maintenance',
        immediateAction: 'Cordon off area and isolate power'
      },
      source: 'demo'
    }
  },
  {
    id: 'demo-hand-burn',
    title: 'Hand Burn (Chemistry / Hot Liquid)',
    subtitle: 'Thermal skin burn requiring cooling',
    badge: 'Medical First Aid',
    category: 'injury',
    urgency: 'moderate',
    promptText: 'My friend has a small burn on his hand from boiling water in the pantry. It is red and stinging.',
    mockResponse: {
      incident: 'Superficial Thermal Hand Burn',
      category: 'injury',
      urgency: 'moderate',
      summary: 'The skin shows localized redness and pain consistent with a minor first or second-degree scald burn.',
      steps: [
        'Immediately hold the burned hand under gentle, cool running tap water for 10-15 minutes.',
        'Carefully remove any rings, wristbands, or tight watches before swelling starts.',
        'Gently pat dry with a clean cloth without rubbing.',
        'Cover loosely with a clean, sterile non-stick bandage or clean cling film.',
        'Keep the hand elevated above heart level to decrease throbbing pain.'
      ],
      avoid: [
        'Never apply ice or freezing cold water (causes deep tissue damage).',
        'Never burst blisters or peel peeling skin.',
        'Never apply butter, cooking oils, toothpaste, or unverified home pastes.'
      ],
      redFlags: [
        'Burn spans larger than the victim\'s palm',
        'Skin appears charred, waxy white, or leathery (deep 3rd degree)',
        'Severe blistering across knuckles or fingertips'
      ],
      callEmergencyServices: false,
      recommendedContact: 'Campus Medical Room',
      disclaimer: 'SafeGuard AI provides general first-response guidance and does not replace professional medical diagnosis.',
      criticalQuestions: [
        'Was the burn caused by a chemical or hot liquid?',
        'Are there any large blisters forming on the fingers?'
      ],
      source: 'demo'
    }
  },
  {
    id: 'demo-classroom-fainting',
    title: 'Student Fainted in Class',
    subtitle: 'Sudden collapse / loss of consciousness',
    badge: 'Urgent Medical Attention',
    category: 'medical_illness',
    urgency: 'high',
    promptText: 'Someone suddenly fainted in class and is lying on the floor.',
    mockResponse: {
      incident: 'Sudden Syncope / Brief Loss of Consciousness',
      category: 'medical_illness',
      urgency: 'high',
      summary: 'A student has collapsed with sudden loss of consciousness, requiring immediate airway assessment and emergency monitoring.',
      steps: [
        'Position the person flat on their back on the floor and elevate their feet 12 inches.',
        'Loosen tight collars, ties, or belts to ensure unobstructed breathing.',
        'Ask students to step back to give the person ample fresh air.',
        'Check for normal breathing and pulse; confirm they regain responsiveness within 1 minute.',
        'Call the Campus Medical Room immediately to dispatch a responder.'
      ],
      avoid: [
        'Do not try to force the person to stand up quickly after regaining consciousness.',
        'Do not administer drinks or food while they are groggy or semi-conscious.',
        'Do not shake or slap the person.'
      ],
      redFlags: [
        'Person remains unresponsive for more than 60 seconds',
        'Difficulty breathing, choking sounds, or turning blue',
        'Seizure activity or head injury from the fall',
        'Chest pain or irregular heartbeat prior to collapsing'
      ],
      callEmergencyServices: true,
      recommendedContact: 'Campus Medical Room (Urgent Dispatch)',
      disclaimer: 'SafeGuard AI provides first-response guidance. Syncope cases should always be evaluated by medical personnel.',
      criticalQuestions: [
        'Are they breathing normally right now?',
        'Did they hit their head when they fell?'
      ],
      source: 'demo'
    }
  }
];
