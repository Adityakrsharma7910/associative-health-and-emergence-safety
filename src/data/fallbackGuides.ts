import { OfflineGuide, StructuredEmergencyResponse } from '../types';

export const FALLBACK_GUIDES: OfflineGuide[] = [
  {
    id: 'bleeding',
    title: 'Minor Bleeding & Cuts',
    category: 'injury',
    urgency: 'low',
    icon: 'Droplet',
    shortSummary: 'Clean, direct pressure first aid for surface cuts and abrasions.',
    steps: [
      'Wash your hands or use sterile gloves if available.',
      'Apply firm, continuous pressure directly over the wound with a clean cloth or gauze for 5-10 minutes.',
      'Gently rinse the wound under clean running tap water to remove debris.',
      'Apply an antiseptic or petroleum jelly, then cover with a sterile bandage.',
      'Keep the injured area elevated above heart level if comfortable.'
    ],
    avoid: [
      'Do not remove deeply embedded objects yourself.',
      'Do not use dirty or fuzzy cloths that can leave fibers in the wound.',
      'Do not blow on the wound or rub vigorously.'
    ],
    redFlags: [
      'Spurting blood or blood soaking through bandages rapidly',
      'Numbness or loss of sensation beyond the cut',
      'Cut caused by a rusty or dirty object requiring tetanus review',
      'Edges of the wound gaping open or exposed muscle/fat'
    ],
    recommendedContact: 'Campus Medical Room',
    keywords: ['bleeding', 'cut', 'blood', 'wound', 'scrape', 'knife', 'glass cut', 'abrasion']
  },
  {
    id: 'burns',
    title: 'Minor Thermal Burns',
    category: 'injury',
    urgency: 'moderate',
    icon: 'Flame',
    shortSummary: 'Cooling and protection steps for first and minor second-degree burns.',
    steps: [
      'Immediately cool the burn under gentle, cool running tap water for 10-20 minutes.',
      'Remove tight rings, watches, or clothing near the burn before swelling begins (unless stuck to skin).',
      'Cover loosely with a clean, non-stick sterile gauze or plastic food wrap.',
      'Keep the burned area elevated to minimize swelling.',
      'Drink plenty of water to stay hydrated.'
    ],
    avoid: [
      'Never apply ice or iced water directly to a burn (causes tissue damage).',
      'Never burst any blisters (increases severe infection risk).',
      'Never apply butter, oil, toothpaste, or home grease remedies.'
    ],
    redFlags: [
      'Burn covers a large area (larger than the palm of the hand)',
      'Burn appears charred white, brown, or leathery (3rd degree)',
      'Burns on the face, hands, feet, groin, or major joints',
      'Chemical or electrical burns'
    ],
    recommendedContact: 'Campus Medical Room',
    keywords: ['burn', 'hot water', 'steam', 'blister', 'scald', 'fire burn', 'heat']
  },
  {
    id: 'sprain',
    title: 'Ankle / Joint Sprain & Possible Fracture',
    category: 'injury',
    urgency: 'moderate',
    icon: 'Activity',
    shortSummary: 'Rest, Ice, Compression, Elevation (R.I.C.E.) protocol for joint injuries.',
    steps: [
      'Stop walking immediately and support the injured joint in a comfortable resting position.',
      'Apply a cold pack wrapped in a clean cloth for 15-20 minutes every 2-3 hours.',
      'Provide gentle support with an elastic bandage without wrapping too tightly.',
      'Elevate the injured limb on a backpack or cushion above heart level.',
      'Assist the person to the campus health center or seating area.'
    ],
    avoid: [
      'Do not force the person to bear weight or walk on the limb.',
      'Do not apply direct heat or massage the swollen area during the first 48 hours.',
      'Do not attempt to straighten or manipulate a deformed bone or joint.'
    ],
    redFlags: [
      'Visible bone deformity, unnatural angle, or bone protruding through skin',
      'Inability to move toes or fingers, or severe numbness/blue discoloration',
      'Severe intolerable pain or popping sound heard at time of injury',
      'Rapid severe swelling with throbbing sensation'
    ],
    recommendedContact: 'Campus Medical Room',
    keywords: ['sprain', 'twist', 'ankle', 'wrist', 'knee', 'fell', 'fall', 'swollen', 'fracture', 'bone']
  },
  {
    id: 'fainting',
    title: 'Fainting / Syncope & Dizziness',
    category: 'medical_illness',
    urgency: 'high',
    icon: 'UserX',
    shortSummary: 'First aid for fainting, lightheadedness, or brief loss of consciousness.',
    steps: [
      'Lay the person flat on their back on the floor and elevate their feet about 12 inches.',
      'Loosen any tight clothing around the neck, chest, or waist to ease breathing.',
      'Ensure the area has plenty of fresh air and ask crowding bystanders to step back.',
      'Check if they are breathing regularly and regain alertness within 1 minute.',
      'Keep them lying down for at least 10-15 minutes before slowly helping them sit.'
    ],
    avoid: [
      'Do not give fluids or food while the person is unconscious or groggy.',
      'Do not slap their face or splash cold water on them.',
      'Do not let them stand up quickly immediately after waking.'
    ],
    redFlags: [
      'Person remains unconscious for more than 1 minute',
      'Fainting was accompanied by chest pain, irregular heartbeat, or shortness of breath',
      'Head injury sustained during the fall',
      'Seizure or jerky movements occurred'
    ],
    recommendedContact: 'Campus Medical Room (Urgent)',
    keywords: ['faint', 'fainted', 'unconscious', 'passed out', 'collapsed', 'dizzy', 'blackout', 'syncope']
  },
  {
    id: 'choking',
    title: 'Choking / Airway Obstruction',
    category: 'medical_illness',
    urgency: 'high',
    icon: 'AlertTriangle',
    shortSummary: 'Immediate airway clearance steps for choking adults and teens.',
    steps: [
      'Ask loudly: "Are you choking? Can you speak or cough?"',
      'If they can cough forcefully, encourage them to keep coughing.',
      'If unable to speak, breath, or make sound: Stand behind them and lean them forward.',
      'Deliver up to 5 sharp back blows between the shoulder blades with the heel of your hand.',
      'If unsuccessful, perform abdominal thrusts (Heimlich maneuver): fist above navel, pull inward and upward firmly.',
      'Alternate 5 back blows and 5 abdominal thrusts until object is cleared.'
    ],
    avoid: [
      'Do not perform blind finger sweeps in the mouth (can push object deeper).',
      'Do not offer water while the airway is obstructed.',
      'Do not delay calling campus emergency if object does not clear immediately.'
    ],
    redFlags: [
      'Lips or fingernails turning blue or purple (cyanosis)',
      'Person collapses or loses consciousness (start CPR immediately)',
      'High-pitched wheezing sounds when trying to inhale'
    ],
    recommendedContact: 'Campus Emergency / 911 / Medical Room',
    keywords: ['choking', 'choke', 'food stuck', 'throat', 'cannot breathe', 'gasping']
  },
  {
    id: 'electrical_hazard',
    title: 'Exposed Electrical Wire / Shock Hazard',
    category: 'hazard',
    urgency: 'high',
    icon: 'Zap',
    shortSummary: 'Campus electrical hazard containment and shock response.',
    steps: [
      'STAY BACK: Maintain at least 10-15 feet distance from any fallen or exposed wires.',
      'DO NOT TOUCH the person or wire if power source is still active.',
      'Alert all students and staff nearby to steer clear of the area.',
      'Locate main circuit breaker / power switch if trained and safely accessible.',
      'Immediately call Campus Security and Facilities Maintenance to cordon off the hazard.'
    ],
    avoid: [
      'Never touch a person connected to a live wire with bare hands or metal.',
      'Never use water or wet materials near electrical hazards.',
      'Never assume a fallen cable or wire is dead.'
    ],
    redFlags: [
      'Sparks, smoke, or buzzing sounds from wiring',
      'Water on the floor near exposed electricity',
      'Victim has collapsed or suffered visible burn marks'
    ],
    recommendedContact: 'Campus Security & Facilities Maintenance',
    keywords: ['electric', 'wire', 'shock', 'spark', 'short circuit', 'live wire', 'power cable', 'voltage']
  },
  {
    id: 'chemical_hazard',
    title: 'Chemical Spill / Lab Exposure',
    category: 'hazard',
    urgency: 'high',
    icon: 'FlaskConical',
    shortSummary: 'Laboratory spill containment and ocular/skin wash protocols.',
    steps: [
      'Evacuate the immediate spill area and notify the lab supervisor / professor.',
      'If chemicals contacted skin or eyes, flush immediately under the eyewash/emergency shower for 15+ minutes.',
      'Remove contaminated lab coats or clothing while flushing.',
      'Ensure high room ventilation / turn on fume hoods.',
      'Contact Campus Security and EHS (Environmental Health & Safety).'
    ],
    avoid: [
      'Do not touch, smell, or attempt to mop unfamiliar chemicals with paper towels.',
      'Do not neutralize acids with bases yourself without proper spill kit PPE.',
      'Do not re-enter the lab until cleared by safety officers.'
    ],
    redFlags: [
      'Chemical vapors causing burning in eyes, throat, or lungs',
      'Fuming, bubbling, or volatile organic solvent fires',
      'Corrosive burn on skin or eyes'
    ],
    recommendedContact: 'Campus EHS & Security',
    keywords: ['chemical', 'spill', 'acid', 'lab', 'reagent', 'toxic', 'solvent', 'eye burn']
  },
  {
    id: 'fire_smoke',
    title: 'Fire / Heavy Smoke Hazard',
    category: 'hazard',
    urgency: 'high',
    icon: 'Flame',
    shortSummary: 'Immediate building evacuation and alarm activation.',
    steps: [
      'Activate the nearest manual fire pull alarm box immediately.',
      'Evacuate the building via the nearest designated emergency stairs.',
      'Stay low under smoke where the air is cleaner and cooler.',
      'Close doors behind you to slow fire and smoke spread.',
      'Gather at the designated campus assembly point outside.'
    ],
    avoid: [
      'Never use elevators during a fire evacuation.',
      'Do not go back inside for personal belongings.',
      'Do not open doors that feel hot to the touch.'
    ],
    redFlags: [
      'Dense black smoke filling corridors',
      'Trapped individuals or blocked fire exits',
      'Explosive or rapidly expanding flames'
    ],
    recommendedContact: 'Campus Security & Fire Emergency (911/112)',
    keywords: ['fire', 'smoke', 'flames', 'alarm', 'burning', 'evacuation']
  },
  {
    id: 'wet_floor',
    title: 'Slippery / Wet Floor Hazard',
    category: 'hazard',
    urgency: 'low',
    icon: 'AlertCircle',
    shortSummary: 'Slip-and-fall prevention and hazard reporting.',
    steps: [
      'Walk carefully around the wet or soapy area.',
      'Warn other students nearby so they do not slip.',
      'Place a "Wet Floor" sign or chair nearby as a visible temporary barrier if available.',
      'Notify campus housekeeping or facility services for immediate cleanup.'
    ],
    avoid: [
      'Do not run or hurry across wet surfaces.',
      'Do not ignore spills on staircases or high-traffic corridors.'
    ],
    redFlags: [
      'Spill located directly on stairs or ramps',
      'Oily, slippery substance that water will not clear',
      'Someone has already fallen and sustained an injury'
    ],
    recommendedContact: 'Campus Facilities / Housekeeping',
    keywords: ['wet floor', 'water', 'slip', 'slippery', 'liquid', 'spilled water', 'puddle']
  },
  {
    id: 'nosebleed',
    title: 'Nosebleed (Epistaxis)',
    category: 'injury',
    urgency: 'low',
    icon: 'Shield',
    shortSummary: 'Safe compression technique to stop active nasal bleeding.',
    steps: [
      'Sit upright and lean forward slightly (do not tilt head back).',
      'Firmly pinch the soft part of the nose just below the nasal bone with your thumb and index finger.',
      'Breathe through your mouth and maintain continuous pressure for 10-15 minutes without releasing.',
      'Apply a cold compress or ice pack over the bridge of the nose or back of neck.',
      'Rest quietly after the bleeding stops and avoid blowing your nose for several hours.'
    ],
    avoid: [
      'Never tilt the head backward (causes blood to drain into stomach/airway causing nausea).',
      'Do not pack the nose with tissue paper or cloth balls.',
      'Do not blow or pick the nose immediately after bleeding stops.'
    ],
    redFlags: [
      'Bleeding continues unabated after 20-30 minutes of direct pressure',
      'Nosebleed occurred after a significant blow or head trauma',
      'Feeling dizzy, lightheaded, or short of breath'
    ],
    recommendedContact: 'Campus Medical Room',
    keywords: ['nosebleed', 'nose', 'epistaxis', 'nasal blood', 'bleeding nose']
  }
];

export function findMatchingFallbackGuide(queryText: string): StructuredEmergencyResponse {
  const normalized = (queryText || '').toLowerCase();

  let matchedGuide = FALLBACK_GUIDES.find(guide => 
    guide.keywords.some(kw => normalized.includes(kw))
  );

  if (!matchedGuide) {
    // Default general injury guide
    matchedGuide = FALLBACK_GUIDES[0];
  }

  return {
    incident: matchedGuide.title,
    category: matchedGuide.category,
    urgency: matchedGuide.urgency,
    summary: matchedGuide.shortSummary,
    steps: matchedGuide.steps,
    avoid: matchedGuide.avoid,
    redFlags: matchedGuide.redFlags,
    callEmergencyServices: matchedGuide.urgency === 'high',
    recommendedContact: matchedGuide.recommendedContact,
    disclaimer: 'SafeGuard AI provides general first-response guidance and does not replace trained medical professionals or emergency services.',
    source: 'fallback',
    timestamp: new Date().toISOString()
  };
}
