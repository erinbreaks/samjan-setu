export type CognitiveParameter = "language" | "recall" | "concept" | "application";

export type DifficultyLevel = "easy" | "medium" | "hard";

export interface QuestionOption {
  id: string;
  textEn: string;
  textGu: string;
}

export interface Keyword {
  en: string;
  gu: string;
}

export interface WaterCycleQuestion {
  id: string;
  difficulty: DifficultyLevel;
  parameter: CognitiveParameter;
  parameterLabel: {
    en: string;
    gu: string;
  };
  questionEn: string;
  questionGu: string;
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption];
  correctOptionId: string;
  solutionEn: string;
  solutionGu: string;
  breakdownHintsGu: string[];
  keywords: Keyword[];
  signConceptKey: "evaporation" | "clouds" | "rain" | "water" | "sunlight" | "plant";
}

// 1. DIAGNOSTIC QUESTIONS (Questions 1-3, All Medium Difficulty)
export const DIAGNOSTIC_QUESTIONS: WaterCycleQuestion[] = [
  {
    id: "diag-1",
    difficulty: "medium",
    parameter: "concept",
    parameterLabel: {
      en: "Concept (સમજણ - Causality)",
      gu: "સમજણ (કારણ અને અસર)"
    },
    questionEn: "Why does liquid water turn into invisible water vapor when heated by the sun?",
    questionGu: "સૂર્યની ગરમી મળવાથી પ્રવાહી પાણી અદ્રશ્ય જળવાષ્પમાં (વરાળમાં) કેમ ફેરવાય છે?",
    options: [
      {
        id: "A",
        textEn: "Water molecules gain thermal energy and disperse into the air (Evaporation)",
        textGu: "પાણીના અણુઓ ઉષ્મા ઊર્જા મેળવી હવામાં મુક્ત થાય છે (બાષ્પીભવન)"
      },
      {
        id: "B",
        textEn: "Water becomes heavier and sinks into the earth",
        textGu: "પાણી ભારે બની જમીનમાં નીચે ઊતરી જાય છે"
      },
      {
        id: "C",
        textEn: "Water freezes into small invisible ice crystals immediately",
        textGu: "પાણી તરત જ નાના અદ્રશ્ય બરફના કણોમાં થીજી જાય છે"
      },
      {
        id: "D",
        textEn: "Air pressure crushes the water into dust particles",
        textGu: "હવાનું દબાણ પાણીને ધૂળના કણોમાં ફેરવી નાખે છે"
      }
    ],
    correctOptionId: "A",
    solutionEn: "When the sun radiates thermal energy, liquid water molecules absorb heat, move faster, break hydrogen surface bonds, and transition from liquid to gas (water vapor) in a process called Evaporation.",
    solutionGu: "જ્યારે સૂર્ય ગરમી આપે છે, ત્યારે પ્રવાહી પાણીના અણુઓ ઊર્જા મેળવીને ઝડપથી ગતિ કરે છે અને પ્રવાહીમાંથી વાયુ (વરાળ) સ્વરૂપમાં ફેરવાય છે. આ પ્રક્રિયાને બાષ્પીભવન કહે છે.",
    breakdownHintsGu: [
      "પગલું ૧: સૂર્યની ગરમી (ઉષ્મા) વિશે વિચારો - ગરમી પ્રવાહીને શું કરે છે?",
      "પગલું ૨: પાણી ગરમ થતાં તે ઉપર તરફ વરાળ બની ચડે છે.",
      "પગલું ૩: આ પ્રક્રિયાને ગુજરાતીમાં 'બાષ્પીભવન' (Evaporation) કહેવાય છે."
    ],
    keywords: [
      { en: "Thermal Energy", gu: "ઉષ્મા ઊર્જા" },
      { en: "Evaporation", gu: "બાષ્પીભવન" },
      { en: "Molecules", gu: "અણુઓ" }
    ],
    signConceptKey: "evaporation"
  },
  {
    id: "diag-2",
    difficulty: "medium",
    parameter: "recall",
    parameterLabel: {
      en: "Recall (સ્મૃતિ - Process Sequence)",
      gu: "સ્મૃતિ (પ્રક્રિયા ક્રમ)"
    },
    questionEn: "As rising water vapor reaches the cold upper atmosphere, what physical transformation occurs to form clouds?",
    questionGu: "ઊંચે ચડતી જળવાષ્પ ઠંડા ઉપલા વાતાવરણમાં પહોંચે ત્યારે વાદળો બનવા માટે કયો ભૌતિક ફેરફાર થાય છે?",
    options: [
      {
        id: "A",
        textEn: "Sublimation directly into solid volcanic rock",
        textGu: "જળવાષ્પ સીધી નક્કર પથ્થરમાં ફેરવાઈ જાય છે"
      },
      {
        id: "B",
        textEn: "Condensation into microscopic liquid water droplets around dust particles",
        textGu: "રજકણોની આસપાસ સૂક્ષ્મ પ્રવાહી જલબિંદુઓમાં ઘનીભવન (સંઘનન) થાય છે"
      },
      {
        id: "C",
        textEn: "Evaporation accelerates even more due to high altitude",
        textGu: "ઊંચાઈના કારણે બાષ્પીભવન વધારે ઝડપી બને છે"
      },
      {
        id: "D",
        textEn: "The vapor dissolves permanently into pure nitrogen gas",
        textGu: "વરાળ કાયમ માટે શુદ્ધ નાઇટ્રોજન વાયુમાં ઓગળી જાય છે"
      }
    ],
    correctOptionId: "B",
    solutionEn: "As warm vapor ascends, atmospheric temperature drops. The vapor cools to its dew point and condenses into tiny water droplets or ice crystals around condensation nuclei (dust/smoke), coalescing into visible clouds.",
    solutionGu: "વાતાવરણમાં ઊંચે જતાં તાપમાન ઘટે છે. ઠંડીના કારણે વરાળ ફરીથી પાણીના નાના-નાના ટીપાંમાં ફેરવાય છે (ઘનીભવન/સંઘનન), જે આકાશમાં વાદળો સ્વરૂપે એકત્રિત થાય છે.",
    breakdownHintsGu: [
      "પગલું ૧: યાદ કરો, ઉપર આકાશમાં વાતાવરણ ગરમ હોય કે ઠંડું? ત્યાં ખૂબ ઠંડક હોય છે.",
      "પગલું ૨: વરાળ ઠંડી પડે ત્યારે ફરીથી પાણીનાં નાનાં ટીપાં બને છે.",
      "પગલું ૩: આને 'ઘનીભવન' અથવા 'સંઘનન' (Condensation) કહેવાય છે."
    ],
    keywords: [
      { en: "Condensation", gu: "ઘનીભવન / સંઘનન" },
      { en: "Cooling", gu: "શીતળા / ઠંડક" },
      { en: "Clouds", gu: "વાદળો" }
    ],
    signConceptKey: "clouds"
  },
  {
    id: "diag-3",
    difficulty: "medium",
    parameter: "application",
    parameterLabel: {
      en: "Application (પ્રયોગ - Environmental)",
      gu: "પ્રયોગ (પર્યાવરણીય ઉપયોગ)"
    },
    questionEn: "When cloud droplets grow too heavy for atmospheric updrafts to support, gravity pulls them down. What is this phase called?",
    questionGu: "જ્યારે વાદળમાં રહેલા પાણીના ટીપાં ખૂબ ભારે થઈ જાય અને હવામાં ટકી ન શકે, ત્યારે ગુરુત્વાકર્ષણથી નીચે પડે છે. આ તબક્કાને શું કહે છે?",
    options: [
      {
        id: "A",
        textEn: "Precipitation (Rain, snow, sleet, or hail)",
        textGu: "વરસાદ / વર્ષણ (વરસાદ, બરફ, કરા)"
      },
      {
        id: "B",
        textEn: "Transpiration through plant stomata",
        textGu: "છોડના પર્ણરંધ્રો દ્વારા બાષ્પોત્સર્જન"
      },
      {
        id: "C",
        textEn: "Filtration into deep tectonic plates",
        textGu: "ઊંડા ભૂસ્તરીય સ્તરોમાં ગાળણ"
      },
      {
        id: "D",
        textEn: "Atmospheric sublimation without falling",
        textGu: "નીચે પડ્યા વિના જ વાતાવરણમાં વિલીનીકરણ"
      }
    ],
    correctOptionId: "A",
    solutionEn: "Precipitation occurs when condensed water droplets in clouds merge and grow heavy enough that upward air currents cannot hold them, falling to Earth as rain, snow, hail, or sleet under gravity.",
    solutionGu: "જ્યારે વાદળમાં સંઘનિત થયેલાં પાણીનાં ટીપાં એકબીજા સાથે જોડાઈને ભારે થાય છે, ત્યારે ગુરુત્વાકર્ષણ બળથી પૃથ્વી પર વરસે છે, જેને વરસાદ અથવા વર્ષણ (Precipitation) કહે છે.",
    breakdownHintsGu: [
      "પગલું ૧: ભારે થયેલા વાદળોમાંથી નીચે પૃથ્વી પર શું પડે છે?",
      "પગલું ૨: આપણે આને વરસાદ, કરા કે બરફ કહીએ છીએ.",
      "પગલું ૩: વૈજ્ઞાનિક ભાષામાં આને 'વર્ષણ' (Precipitation) તરીકે ઓળખવામાં આવે છે."
    ],
    keywords: [
      { en: "Precipitation", gu: "વર્ષણ / વરસાદ" },
      { en: "Gravity", gu: "ગુરુત્વાકર્ષણ" },
      { en: "Water Droplets", gu: "જલબિંદુઓ" }
    ],
    signConceptKey: "rain"
  }
];

// 2. EASY QUESTIONS POOL (For Struggling Learners, Questions 4-10)
export const EASY_QUESTIONS: WaterCycleQuestion[] = [
  {
    id: "easy-4",
    difficulty: "easy",
    parameter: "language",
    parameterLabel: {
      en: "Language (શબ્દભંડોળ - ISL Term)",
      gu: "શબ્દભંડોળ (સંકેત ભાષા શબ્દ)"
    },
    questionEn: "In Indian Sign Language (ISL), what is the basic sign for 'Water' (પાણી)?",
    questionGu: "ભારતીય સંકેત ભાષા (ISL) માં 'પાણી' (Water) માટેનો મૂળભૂત સંકેત કયો છે?",
    options: [
      {
        id: "A",
        textEn: "'W' handshape tapped gently twice on the chin",
        textGu: "દાઢી પર 'W' આકારની ત્રણ આંગળીઓ બે વાર અડકાડવી"
      },
      {
        id: "B",
        textEn: "Covering both eyes with closed fists",
        textGu: "બંને મુઠ્ઠીઓથી આંખો ઢાંકવી"
      },
      {
        id: "C",
        textEn: "Waving both hands sideways like airplane wings",
        textGu: "વિમાનની પાંખોની જેમ બંને હાથ હલાવવા"
      },
      {
        id: "D",
        textEn: "Clapping hands loudly three times",
        textGu: "ત્રણ વખત જોરથી તાળીઓ પાડવી"
      }
    ],
    correctOptionId: "A",
    solutionEn: "In Indian Sign Language (ISL), 'Water' is signed by forming a 'W' handshape (index, middle, ring fingers spread) and tapping the index finger twice against the chin.",
    solutionGu: "ભારતીય સંકેત ભાષામાં 'પાણી' નો સંકેત દર્શાવવા માટે દાઢી પાસે 'W' મુદ્રા રાખીને બે વાર સ્પર્શ કરવામાં આવે છે.",
    breakdownHintsGu: [
      "પગલું ૧: 3D અવતાર દાઢી પાસે હાથ કેવી રીતે લાવે છે તે જુઓ.",
      "પગલું ૨: પાણી પીવાનો સંકેત મોં અને દાઢી સાથે સંકળાયેલો હોય છે.",
      "પગલું ૩: 'W' આકાર (ત્રણ આંગળીઓ) દાઢી પર ટેપ કરો."
    ],
    keywords: [
      { en: "Water Sign", gu: "પાણીનો સંકેત" },
      { en: "W Handshape", gu: "W આકાર" },
      { en: "Chin Tap", gu: "દાઢી પર સ્પર્શ" }
    ],
    signConceptKey: "water"
  },
  {
    id: "easy-5",
    difficulty: "easy",
    parameter: "recall",
    parameterLabel: {
      en: "Recall (સ્મૃતિ - Energy Source)",
      gu: "સ્મૃતિ (ઊર્જા સ્ત્રોત)"
    },
    questionEn: "Which celestial body provides the main heat energy that drives the entire water cycle?",
    questionGu: "કયો આકાશી પદાર્થ મુખ્ય ઉષ્મા ઊર્જા પૂરી પાડે છે જે સમગ્ર જળચક્રને ગતિ આપે છે?",
    options: [
      {
        id: "A",
        textEn: "The Sun (સૂર્ય)",
        textGu: "સૂર્ય (The Sun)"
      },
      {
        id: "B",
        textEn: "The Moon (ચંદ્ર)",
        textGu: "ચંદ્ર (The Moon)"
      },
      {
        id: "C",
        textEn: "Shooting Stars (ખરતા તારા)",
        textGu: "ખરતા તારા (Shooting Stars)"
      },
      {
        id: "D",
        textEn: "Artificial street lights (શેરીની લાઇટો)",
        textGu: "શેરીની લાઇટો (Street Lights)"
      }
    ],
    correctOptionId: "A",
    solutionEn: "The Sun is the primary engine of the water cycle. Its solar radiation warms oceans, lakes, and rivers, driving continuous evaporation.",
    solutionGu: "સૂર્ય સમગ્ર જળચક્રનું મુખ્ય ચાલક બળ છે. સૂર્યના કિરણો સમુદ્રો અને નદીઓના પાણીને ગરમ કરી બાષ્પીભવન કરાવે છે.",
    breakdownHintsGu: [
      "પગલું ૧: પૃથ્વી પર સૌથી મોટી ગરમી અને પ્રકાશ કોણ આપે છે?",
      "પગલું ૨: દિવસે આકાશમાં ચમકતો સૂર્ય જળચક્રનું હૃદય છે.",
      "પગલું ૩: સાચો જવાબ છે: સૂર્ય (Sun)."
    ],
    keywords: [
      { en: "The Sun", gu: "સૂર્ય" },
      { en: "Solar Energy", gu: "સૌર ઊર્જા" },
      { en: "Heat Driver", gu: "મુખ્ય ગરમી" }
    ],
    signConceptKey: "sunlight"
  },
  {
    id: "easy-6",
    difficulty: "easy",
    parameter: "concept",
    parameterLabel: {
      en: "Concept (સમજણ - Daily Observation)",
      gu: "સમજણ (રોજિંદી ઘટના)"
    },
    questionEn: "After rainfall, a puddle on a playground dries up under sunny weather. Where did that water go?",
    questionGu: "વરસાદ પછી મેદાનમાં ભરાયેલું ખાબોચિયું તડકામાં સુકાઈ જાય છે. તે પાણી ક્યાં ગયું?",
    options: [
      {
        id: "A",
        textEn: "It evaporated into the air as water vapor",
        textGu: "તે જળવાષ્પ (વરાળ) બનીને હવામાં ઊડી ગયું (બાષ્પીભવન)"
      },
      {
        id: "B",
        textEn: "It was permanently destroyed and erased from Earth",
        textGu: "તે કાયમ માટે નાશ પામ્યું અને પૃથ્વી પરથી ગાયબ થઈ ગયું"
      },
      {
        id: "C",
        textEn: "The sunlight turned it into liquid petrol",
        textGu: "સૂર્યપ્રકાશે તેને પેટ્રોલમાં ફેરવી દીધું"
      },
      {
        id: "D",
        textEn: "Earth swallowed it without turning into vapor",
        textGu: "પૃથ્વીએ તેને વરાળ બન્યા વિના જ ગળી લીધું"
      }
    ],
    correctOptionId: "A",
    solutionEn: "Water in the puddle absorbs heat from sunlight and ambient air, turning into water vapor (gas) through evaporation and joining the atmosphere.",
    solutionGu: "ખાબોચિયાનું પાણી સૂર્યપ્રકાશની ગરમી શોષીને અદ્રશ્ય વરાળ બનીને હવામાં ભળી જાય છે. આને બાષ્પીભવન કહે છે.",
    breakdownHintsGu: [
      "પગલું ૧: ગરમ તડકામાં ભીના કપડાં કેમ સુકાઈ જાય છે તે યાદ કરો.",
      "પગલું ૨: પાણી નષ્ટ થતું નથી, પણ વરાળ બની હવામાં ઊડી જાય છે.",
      "પગલું ૩: આ ક્રિયાને 'બાષ્પીભવન' (Evaporation) કહેવાય."
    ],
    keywords: [
      { en: "Puddle Drying", gu: "ખાબોચિયું સુકાવું" },
      { en: "Vapor in Air", gu: "હવામાં વરાળ" },
      { en: "Phase Change", gu: "અવસ્થા પરિવર્તન" }
    ],
    signConceptKey: "evaporation"
  },
  {
    id: "easy-7",
    difficulty: "easy",
    parameter: "language",
    parameterLabel: {
      en: "Language (શબ્દભંડોળ - ISL Sign)",
      gu: "શબ્દભંડોળ (વાદળનો સંકેત)"
    },
    questionEn: "How does Indian Sign Language (ISL) depict 'Clouds' (વાદળો)?",
    questionGu: "ભારતીય સંકેત ભાષા (ISL) માં 'વાદળો' (Clouds) નો સંકેત કેવી રીતે દર્શાવાય છે?",
    options: [
      {
        id: "A",
        textEn: "Both curved hands shaping billowing puffs above eye level",
        textGu: "બંને વળેલા હાથથી આંખોની ઊંચાઈએ ફૂલેલા ગોળ વાદળોનો આકાર બનાવવો"
      },
      {
        id: "B",
        textEn: "Tapping the foot rhythmically on the ground",
        textGu: "જમીન પર લયબદ્ધ પગ પછાડવો"
      },
      {
        id: "C",
        textEn: "Pointing a single index finger down toward toes",
        textGu: "પગના અંગૂઠા તરફ એક આંગળી ચીંધવી"
      },
      {
        id: "D",
        textEn: "Snapping fingers continuously behind the back",
        textGu: "પીઠ પાછળ સતત ચપટી વગાડવી"
      }
    ],
    correctOptionId: "A",
    solutionEn: "In ISL, 'Clouds' is expressed with both curved hands forming soft puffy shapes at head/eye level, representing vapor clusters in the sky.",
    solutionGu: "ISL માં 'વાદળ' દર્શાવવા બંને હાથના પંજા અર્ધગોળાકાર રાખીને આકાશમાં ફૂલેલા વાદળાઓનો ગોળાકાર આકાર રચવામાં આવે છે.",
    breakdownHintsGu: [
      "પગલું ૧: આકાશમાં વાદળ કેવા દેખાય છે? રૂના ઢગલા જેવા ગોળાકાર.",
      "પગલું ૨: બંને હાથથી માથા પાસે ફૂલેલો આકાર દર્શાવવામાં આવે છે.",
      "પગલું ૩: 3D અવતારના વાદળ દર્શાવતા સંકેતને ધ્યાનમાં લો."
    ],
    keywords: [
      { en: "Cloud Shape", gu: "વાદળનો આકાર" },
      { en: "Bilateral Sign", gu: "દ્વિ-હસ્ત મુદ્રા" },
      { en: "Puffy Vapor", gu: "વરાળનો જથ્થો" }
    ],
    signConceptKey: "clouds"
  },
  {
    id: "easy-8",
    difficulty: "easy",
    parameter: "recall",
    parameterLabel: {
      en: "Recall (સ્મૃતિ - Transpiration)",
      gu: "સ્મૃતિ (છોડમાંથી બાષ્પોત્સર્જન)"
    },
    questionEn: "Plants absorb water through roots and release extra water vapor through microscopic leaf pores. What is this called?",
    questionGu: "છોડ મૂળ દ્વારા પાણી શોષે છે અને પાંદડાં દ્વારા વધારાની વરાળ હવામાં મુક્ત કરે છે. આ ક્રિયાને શું કહે છે?",
    options: [
      {
        id: "A",
        textEn: "Transpiration (બાષ્પોત્સર્જન)",
        textGu: "બાષ્પોત્સર્જન (Transpiration)"
      },
      {
        id: "B",
        textEn: "Hibernation (શિયાળુ નિંદ્રા)",
        textGu: "શિયાળુ નિંદ્રા (Hibernation)"
      },
      {
        id: "C",
        textEn: "Earthquake vibration (ભૂકંપ)",
        textGu: "ભૂકંપ કંપન (Vibration)"
      },
      {
        id: "D",
        textEn: "Fossilization (અશ્મિભવન)",
        textGu: "અશ્મિભવન (Fossilization)"
      }
    ],
    correctOptionId: "A",
    solutionEn: "Transpiration is the biological process where plant roots take up groundwater, distribute nutrients, and release moisture into the atmosphere through leaf stomata.",
    solutionGu: "છોડના પાંદડામાંથી પાણીની વરાળ વાતાવરણમાં ભળવાની આ વનસ્પતિજન્ય પ્રક્રિયાને બાષ્પોત્સર્જન (Transpiration) કહેવામાં આવે છે.",
    breakdownHintsGu: [
      "પગલું ૧: જંગલો અને છોડ પણ વાતાવરણને ભેજ પૂરો પાડે છે.",
      "પગલું ૨: પાંદડામાંથી પાણી બહાર નીકળવાની ક્રિયાને બાષ્પોત્સર્જન કહે છે.",
      "પગલું ૩: સાચો શબ્દ: Transpiration / બાષ્પોત્સર્જન."
    ],
    keywords: [
      { en: "Transpiration", gu: "બાષ્પોત્સર્જન" },
      { en: "Leaf Stomata", gu: "પર્ણરંધ્ર" },
      { en: "Plant Moisture", gu: "છોડનો ભેજ" }
    ],
    signConceptKey: "plant"
  },
  {
    id: "easy-9",
    difficulty: "easy",
    parameter: "application",
    parameterLabel: {
      en: "Application (પ્રયોગ - Collection)",
      gu: "પ્રયોગ (પાણી સંગ્રહ)"
    },
    questionEn: "When rain falls onto mountains and plains, where does most of the surface runoff eventually collect?",
    questionGu: "જ્યારે પહાડો અને મેદાનો પર વરસાદ પડે છે, ત્યારે મોટાભાગનું પાણી વહીને છેવટે ક્યાં એકત્રિત થાય છે?",
    options: [
      {
        id: "A",
        textEn: "Oceans, rivers, and groundwater aquifers (જળાશયો અને સમુદ્ર)",
        textGu: "સમુદ્ર, નદીઓ, સરોવરો અને ભૂગર્ભ જળમાં (Collection)"
      },
      {
        id: "B",
        textEn: "Directly into deep space beyond the moon",
        textGu: "સીધું ચંદ્રની પાર અવકાશમાં"
      },
      {
        id: "C",
        textEn: "Trapped inside dry stones forever",
        textGu: "કાયમ માટે સૂકા પથ્થરોની અંદર"
      },
      {
        id: "D",
        textEn: "Into electric power lines",
        textGu: "ઇલેક્ટ્રિક વાયરોમાં"
      }
    ],
    correctOptionId: "A",
    solutionEn: "Precipitation flows downhill through streams, rivers, and underground aquifers, ultimately collecting in reservoirs, lakes, and the ocean where the cycle restarts.",
    solutionGu: "વરસાદનું પાણી નદીઓ અને નાળાઓ મારફતે વહીને તળાવો અને વિશાળ સમુદ્રમાં એકત્ર થાય છે, જેને સંગ્રહ (Collection) કહે છે.",
    breakdownHintsGu: [
      "પગલું ૧: વરસાદનું પાણી વહીને નદીઓમાં જાય છે.",
      "પગલું ૨: બધી નદીઓ અંતે ક્યાં મળે છે? સમુદ્રમાં!",
      "પગલું ૩: આને 'જળ સંગ્રહ' (Collection) કહે છે."
    ],
    keywords: [
      { en: "Collection", gu: "પાણી સંગ્રહ" },
      { en: "Rivers to Ocean", gu: "નદીથી સમુદ્ર" },
      { en: "Runoff", gu: "પ્રવાહ" }
    ],
    signConceptKey: "water"
  },
  {
    id: "easy-10",
    difficulty: "easy",
    parameter: "concept",
    parameterLabel: {
      en: "Concept (સમજણ - Cycle Loop)",
      gu: "સમજણ (ચક્રનું પુનરાવર્તન)"
    },
    questionEn: "Why is it called the Water 'Cycle'?",
    questionGu: "તેને જળ 'ચક્ર' (Water Cycle) શા માટે કહેવામાં આવે છે?",
    options: [
      {
        id: "A",
        textEn: "Because water continuously circulates in a never-ending loop without beginning or end",
        textGu: "કારણ કે પાણી સતત એક અવિરત ગોળ ચક્રમાં ફરે છે અને ક્યારેય ખૂટતું નથી"
      },
      {
        id: "B",
        textEn: "Because water only flows when someone pedals a bicycle",
        textGu: "કારણ કે કોઈ સાયકલ ચલાવે ત્યારે જ પાણી વહે છે"
      },
      {
        id: "C",
        textEn: "Because it stops forever after raining 5 times",
        textGu: "કારણ કે 5 વાર વરસાદ પડ્યા પછી તે કાયમ માટે બંધ થઈ જાય છે"
      },
      {
        id: "D",
        textEn: "Because all water turns into solid iron wheels",
        textGu: "કારણ કે બધું પાણી લોખંડના પૈડામાં ફેરવાઈ જાય છે"
      }
    ],
    correctOptionId: "A",
    solutionEn: "It is called a cycle because the same water moves continuously between Earth's surface and atmosphere: Evaporating, Condensing, Precipitating, and Collecting indefinitely.",
    solutionGu: "તેને ચક્ર એટલે કહેવાય છે કારણ કે પૃથ્વીનું પાણી સતત બાષ્પીભવન -> ઘનીભવન -> વરસાદ -> સંગ્રહના એક અખંડ ચક્રમાં પુનરાવર્તિત થાય છે.",
    breakdownHintsGu: [
      "પગલું ૧: ચક્ર એટલે કે જે સતત ગોળ ગોળ ફર્યા કરે.",
      "પગલું ૨: પાણી બાષ્પીભવન થાય, વાદળ બને, વરસાદ પડે અને ફરી સમુદ્રમાં જાય.",
      "પગલું ૩: આ એક અવિરત કુદરતી ચક્ર (Continuous Loop) છે."
    ],
    keywords: [
      { en: "Continuous Loop", gu: "અવિરત ચક્ર" },
      { en: "Recycling Water", gu: "પાણીનું પુનઃચક્રણ" },
      { en: "Hydrologic Cycle", gu: "જળચક્ર" }
    ],
    signConceptKey: "rain"
  }
];

// 3. HARD QUESTIONS POOL (For Confident Learners, Questions 4-10)
export const HARD_QUESTIONS: WaterCycleQuestion[] = [
  {
    id: "hard-4",
    difficulty: "hard",
    parameter: "concept",
    parameterLabel: {
      en: "Concept (સમજણ - Latent Heat)",
      gu: "સમજણ (ગુપ્ત ઉષ્મા - Latent Heat)"
    },
    questionEn: "During evaporation at the ocean surface, what thermodynamic effect happens to the surrounding water layer?",
    questionGu: "સમુદ્રની સપાટી પર બાષ્પીભવન દરમિયાન આસપાસના પાણીના સ્તર પર કઈ થર્મોડાયનેમિક અસર થાય છે?",
    options: [
      {
        id: "A",
        textEn: "Evaporative cooling occurs as high-energy molecules escape, absorbing latent heat of vaporization",
        textGu: "ઉચ્ચ ઊર્જાવાળા અણુઓ બાષ્પીભવન ગુપ્ત ઉષ્મા લઈને મુક્ત થતાં સપાટી પર શીતળા (ઠંડક) પેદા થાય છે"
      },
      {
        id: "B",
        textEn: "The remaining ocean water instantly boils to 200°C",
        textGu: "બાકીનું સમુદ્રનું પાણી તરત જ 200°C પર ઊકળવા લાગે છે"
      },
      {
        id: "C",
        textEn: "Salinity drops to absolute zero",
        textGu: "ક્ષારતા ઘટીને શૂન્ય થઈ જાય છે"
      },
      {
        id: "D",
        textEn: "Surrounding water expands into radioactive plasma",
        textGu: "આસપાસનું પાણી રેડિયોએક્ટિવ પ્લાઝ્મામાં ફેરવાય છે"
      }
    ],
    correctOptionId: "A",
    solutionEn: "Evaporation requires the Latent Heat of Vaporization (~2260 J/g). As the fastest-moving molecules escape into the vapor phase, the average kinetic energy of the remaining liquid drops, causing evaporative cooling.",
    solutionGu: "બાષ્પીભવન માટે ગુપ્ત ઉષ્માની જરૂર પડે છે. ઉચ્ચ ગતિ ઊર્જા ધરાવતા અણુઓ વરાળ બનીને ઊડી જવાથી બાકી રહેલા પ્રવાહીનું સરેરાશ તાપમાન ઘટે છે (Evaporative Cooling).",
    breakdownHintsGu: [
      "પગલું ૧: પરસેવો વળીને સુકાય ત્યારે આપણને ઠંડક કેમ લાગે છે તે વિચારો.",
      "પગલું ૨: વરાળ બનતી વખતે અણુઓ સપાટી પરથી ગરમી (Latent Heat) શોષીને લઈ જાય છે.",
      "પગલું ૩: આને 'બાષ્પીભવન શીતળા' (Evaporative Cooling) કહે છે."
    ],
    keywords: [
      { en: "Latent Heat", gu: "ગુપ્ત ઉષ્મા" },
      { en: "Evaporative Cooling", gu: "બાષ્પીભવન શીતળા" },
      { en: "Thermodynamics", gu: "ઉષ્માગતિશાસ્ત્ર" }
    ],
    signConceptKey: "evaporation"
  },
  {
    id: "hard-5",
    difficulty: "hard",
    parameter: "application",
    parameterLabel: {
      en: "Application (પ્રયોગ - Agro-Forestry Transpiration)",
      gu: "પ્રયોગ (વનસ્પતિ વાતાવરણીય ભેજ)"
    },
    questionEn: "How does large-scale deforestation in tropical regions directly disrupt regional hydrological cycles?",
    questionGu: "વિશાળ જંગલોનો નાશ (ડિફોરેસ્ટેશન) પ્રાદેશિક જળચક્રને સીધી રીતે કેવી રીતે વિક્ષેપિત કરે છે?",
    options: [
      {
        id: "A",
        textEn: "Drastically reduces canopy transpiration, lowering atmospheric humidity and inland rainfall",
        textGu: "છોડનું બાષ્પોત્સર્જન ઘટવાથી વાતાવરણનો ભેજ અને આંતરિક જમીન પરનો વરસાદ ભારે ઘટે છે"
      },
      {
        id: "B",
        textEn: "Causes ocean tides to permanently freeze into solid ice",
        textGu: "સમુદ્રની ભરતી-ઓટને કાયમ માટે બરફમાં થીજવી દે છે"
      },
      {
        id: "C",
        textEn: "Eliminates gravitational pull on rain clouds",
        textGu: "વાદળો પરથી ગુરુત્વાકર્ષણ બળ નાબૂદ કરી દે છે"
      },
      {
        id: "D",
        textEn: "Forces clouds to move backwards against planetary winds",
        textGu: "વાદળોને વિપરીત દિશામાં ઉડવા મજબૂર કરે છે"
      }
    ],
    correctOptionId: "A",
    solutionEn: "Dense rainforests return massive volumes of water to the atmosphere via transpiration (acting as 'flying rivers'). Deforestation suppresses this moisture source, triggering severe regional droughts and desertification.",
    solutionGu: "જંગલો બાષ્પોત્સર્જન દ્વારા પુષ્કળ ભેજ વાતાવરણમાં મોકલે છે. વૃક્ષો કપાવાથી આ ભેજ ઘટતાં વાદળો ઓછા બંધાય છે અને પ્રદેશમાં દુષ્કાળ સર્જાય છે.",
    breakdownHintsGu: [
      "પગલું ૧: વૃક્ષો વાતાવરણમાં ભેજ ઉમેરવામાં સૌથી મહત્વનો ભાગ ભજવે છે.",
      "પગલું ૨: વૃક્ષો કપાય તો હવામાં ભેજ ઘટી જશે.",
      "પગલું ૩: પરિણામે વરસાદનું પ્રમાણ ઘટી જશે અને વાતાવરણ સૂકું બનશે."
    ],
    keywords: [
      { en: "Deforestation", gu: "જંગલોનો નાશ" },
      { en: "Atmospheric Humidity", gu: "વાતાવરણીય ભેજ" },
      { en: "Canopy Transpiration", gu: "છોડનું બાષ્પોત્સર્જન" }
    ],
    signConceptKey: "plant"
  },
  {
    id: "hard-6",
    difficulty: "hard",
    parameter: "concept",
    parameterLabel: {
      en: "Concept (સમજણ - Adiabatic Lapse Rate)",
      gu: "સમજણ (એડિઆબેટિક શીતળા દર)"
    },
    questionEn: "Why does ascending air cool adiabatically, accelerating condensation at cloud base altitude?",
    questionGu: "ઊંચે ચડતી હવા એડિઆબેટિક રીતે શા માટે ઠંડી પડે છે, જેનાથી ક્લાઉડ બેઝ પર ઘનીભવન ઝડપી બને છે?",
    options: [
      {
        id: "A",
        textEn: "Lower barometric pressure at altitude allows air to expand, doing work and reducing molecular kinetic energy",
        textGu: "ઊંચાઈ પર ઓછું વાતાવરણીય દબાણ હોવાથી હવા વિસ્તરે છે, કાર્ય કરે છે અને તેનું તાપમાન ઘટે છે"
      },
      {
        id: "B",
        textEn: "Cold space vacuum sucks out heat through chemical fission",
        textGu: "અવકાશનું વેક્યૂમ રાસાયણિક પ્રક્રિયાથી ગરમી ખેંચી લે છે"
      },
      {
        id: "C",
        textEn: "Oxygen molecules transform into heavy helium",
        textGu: "ઓક્સિજન વાયુ ભારે હિલીયમમાં રૂપાંતરિત થાય છે"
      },
      {
        id: "D",
        textEn: "The moon emits negative thermal photons downwards",
        textGu: "ચંદ્ર ઋણ ઉષ્મા ફોટોન ફેંકે છે"
      }
    ],
    correctOptionId: "A",
    solutionEn: "As a warm air parcel rises, external atmospheric pressure decreases. The parcel expands; the energy required to expand comes from internal molecular kinetic energy, dropping its temperature to the dew point.",
    solutionGu: "હવા જ્યારે ઉપર જાય છે ત્યારે ઉપર દબાણ ઓછું હોવાથી હવા વિસ્તરે છે (Adiabatic Expansion). આ વિસ્તરણમાં આંતરિક ઊર્જા વપરાતાં હવાનું તાપમાન ઘટી જાય છે અને વરાળ ઠરીને વાદળ બને છે.",
    breakdownHintsGu: [
      "પગલું ૧: પર્વતો પર કે આકાશમાં દબાણ ઓછું હોય છે.",
      "પગલું ૨: ઓછાં દબાણમાં વાયુ વિસ્તરે છે અને વિસ્તરતી વખતે ઠંડો પડે છે.",
      "પગલું ૩: આ પ્રક્રિયાને 'એડિઆબેટિક શીતળા' (Adiabatic Cooling) કહે છે."
    ],
    keywords: [
      { en: "Adiabatic Cooling", gu: "એડિઆબેટિક શીતળા" },
      { en: "Barometric Pressure", gu: "વાતાવરણીય દબાણ" },
      { en: "Dew Point", gu: "ઝાકળ બિંદુ" }
    ],
    signConceptKey: "clouds"
  },
  {
    id: "hard-7",
    difficulty: "hard",
    parameter: "recall",
    parameterLabel: {
      en: "Recall (સ્મૃતિ - Condensation Nuclei)",
      gu: "સ્મૃતિ (ઘનીભવન કેન્દ્રો - CCN)"
    },
    questionEn: "Without Cloud Condensation Nuclei (CCN) such as aerosols, sea salts, or dust, at what relative humidity would pure water vapor condense?",
    questionGu: "ધૂળ, ક્ષાર અથવા એરોસોલ જેવા સંઘનન કેન્દ્રો (CCN) વગર શુદ્ધ જળવાષ્પ કેટલા ટકા સાપેક્ષ ભેજ (Relative Humidity) પર સંઘનિત થઈ શકે?",
    options: [
      {
        id: "A",
        textEn: "Super-saturation levels well exceeding 300% to 400%",
        textGu: "300% થી 400% કરતાં વધુ અતિ-સંતૃપ્ત (Super-saturation) સ્તર પર"
      },
      {
        id: "B",
        textEn: "At exactly 10% relative humidity",
        textGu: "બરાબર 10% સાપેક્ષ ભેજ પર"
      },
      {
        id: "C",
        textEn: "Water can never condense without human artificial chemicals",
        textGu: "માનવસર્જિત રસાયણો વગર પાણી ક્યારેય ઠરી ન શકે"
      },
      {
        id: "D",
        textEn: "At 0% humidity regardless of temperature",
        textGu: "કોઈપણ તાપમાને 0% ભેજ પર"
      }
    ],
    correctOptionId: "A",
    solutionEn: "Homogeneous nucleation (pure vapor condensing without seed particles) requires enormous supersaturation (>300-400%) due to surface tension curvature. CCN drastically lowers this threshold to near ~100% relative humidity.",
    solutionGu: "જો હવામાં ધૂળ કે ક્ષારના કણો ન હોય, તો શુદ્ધ વરાળને ઠરવા માટે 300-400% જેટલા પ્રચંડ અતિ-સંતૃપ્ત (Supersaturation) સ્તરની જરૂર પડે છે. આ કણો વાદળ બનવામાં ઉત્પ્રેરક બને છે.",
    breakdownHintsGu: [
      "પગલું ૧: વાદળ બનવા માટે વરાળને ચોંટવા માટે નાના રજકણો (CCN) ની જરૂર પડે છે.",
      "પગલું ૨: રજકણ વગર વરાળને ટીપું બનવું ખૂબ મુશ્કેલ બને છે.",
      "પગલું ૩: તેથી તેને 300-400% થી વધુ સુપર-સેચ્યુરેશનની જરૂર પડે છે."
    ],
    keywords: [
      { en: "Condensation Nuclei", gu: "સંઘનન કેન્દ્રો (CCN)" },
      { en: "Supersaturation", gu: "અતિ-સંતૃપ્તિ" },
      { en: "Aerosols", gu: "એરોસોલ રજકણો" }
    ],
    signConceptKey: "clouds"
  },
  {
    id: "hard-8",
    difficulty: "hard",
    parameter: "application",
    parameterLabel: {
      en: "Application (પ્રયોગ - Aquifer Recharge)",
      gu: "પ્રયોગ (ભૂગર્ભ જળ રિચાર્જ)"
    },
    questionEn: "How does deep percolation and groundwater recharge maintain continuous baseflow in rivers during dry, non-monsoon seasons?",
    questionGu: "ઊંડું ભૂગર્ભ જળ ગાળણ (Percolation) ચોમાસા વગરની સૂકી ઋતુઓમાં પણ નદીઓમાં સતત પ્રવાહ (Baseflow) કેવી રીતે જાળવી રાખે છે?",
    options: [
      {
        id: "A",
        textEn: "Infiltrated water moves slowly through porous rock strata, gradually seeping into riverbeds through hydrostatic pressure",
        textGu: "જમીનમાં ઉતરેલું પાણી છિદ્રાળુ ખડકોમાંથી ધીમે ધીમે હાઈડ્રોસ્ટેટિક દબાણથી નદીના તળિયે ઝરે છે"
      },
      {
        id: "B",
        textEn: "Underground magma pushes steam upward into tree roots",
        textGu: "ભૂગર્ભ મેગ્મા વરાળને વૃક્ષો તરફ ધકેલે છે"
      },
      {
        id: "C",
        textEn: "Riverbeds convert sand grains into liquid hydrogen peroxide",
        textGu: "નદીના તળિયે રહેલી રેતી હાઇડ્રોજન પેરોક્સાઇડમાં ફેરવાય છે"
      },
      {
        id: "D",
        textEn: "Rivers freeze completely under the ground",
        textGu: "નદીઓ જમીનની અંદર સંપૂર્ણ થીજી જાય છે"
      }
    ],
    correctOptionId: "A",
    solutionEn: "Precipitation percolating through soil recharges subterranean aquifers. Under hydrostatic hydraulic gradients, this groundwater slowly discharges as baseflow into streams and rivers, sustaining perennial flows between rains.",
    solutionGu: "ચોમાસામાં જમીનમાં ઉતરેલું પાણી ભૂગર્ભ જળભંડારો (Aquifers) માં સંગ્રહાય છે અને સૂકી ઋતુમાં ધીરે ધીરે ઝરણાં અને નદીઓમાં ઝરીને અવિરત પ્રવાહ જાળવે છે.",
    breakdownHintsGu: [
      "પગલું ૧: વરસાદનું પાણી જમીનમાં ઊંડે ઉતરીને ક્યાં જાય છે? ભૂગર્ભ જળમાં.",
      "પગલું ૨: ખડકોમાંથી આ પાણી ધીમે ધીમે નદીઓના તળિયામાં ઝરે છે.",
      "પગલું ૩: આને 'બેઇઝફ્લો' (Baseflow) અને હાઇડ્રોસ્ટેટિક દબાણ કહે છે."
    ],
    keywords: [
      { en: "Percolation", gu: "ભૂગર્ભ ગાળણ" },
      { en: "Baseflow", gu: "આધાર પ્રવાહ" },
      { en: "Aquifer Recharge", gu: "જળભંડાર રિચાર્જ" }
    ],
    signConceptKey: "water"
  },
  {
    id: "hard-9",
    difficulty: "hard",
    parameter: "language",
    parameterLabel: {
      en: "Language (શબ્દભંડોળ - ISL Syntax)",
      gu: "શબ્દભંડોળ (ISL સિન્ટેક્સ)"
    },
    questionEn: "In advanced ISL spatial syntax, how is the complete closed-loop cycle of Evaporation -> Condensation -> Precipitation correctly sequenced?",
    questionGu: "અદ્યતન ISL સ્થાનિક વ્યાકરણમાં, બાષ્પીભવન -> સંઘનન -> વર્ષણનું આખું ચક્ર કેવી રીતે ક્રમબદ્ધ દર્શાવાય છે?",
    options: [
      {
        id: "A",
        textEn: "Ascending spiral motion (steam) -> Overhead billowing cloud hold -> Downward fluttering finger release",
        textGu: "ઉપર જતી સર્પાકાર મુદ્રા (વરાળ) -> આકાશમાં વાદળ હોલ્ડ -> નીચે તરફ આંગળીઓનું વરસાદી લયબદ્ધ પ્રસરણ"
      },
      {
        id: "B",
        textEn: "Crossing arms over chest and keeping motionless for 1 minute",
        textGu: "છાતી પર હાથ વાળીને 1 મિનિટ સ્થિર ઊભા રહેવું"
      },
      {
        id: "C",
        textEn: "Only tapping the forehead three times without finger movement",
        textGu: "આંગળીઓના હલનચલન વગર માત્ર કપાળ પર ત્રણ વાર ટકોરા મારવા"
      },
      {
        id: "D",
        textEn: "Covering the mouth while walking backwards",
        textGu: "મોં ઢાંકીને પાછળ ચાલવું"
      }
    ],
    correctOptionId: "A",
    solutionEn: "ISL employs continuous spatial morphology: Oscillating upward spirals map vapor rising, cupped overhead bilaterals represent cloud aggregation, and downward rhythmic finger-flutter indicates precipitation falling back to surface level.",
    solutionGu: "ISL માં જળચક્ર દર્શાવવા માટે પ્રથમ હાથથી વરાળ ઉપર ચડતી (બાષ્પીભવન), પછી માથા ઉપર વાદળ બનતું (ઘનીભવન) અને છેલ્લે આંગળીઓ નીચે લાવી વરસાદ (વર્ષણ) દર્શાવવામાં આવે છે.",
    breakdownHintsGu: [
      "પગલું ૧: જળચક્રના ક્રમનું ધ્યાન રાખો: પહેલાં વરાળ ઉપર ચડે.",
      "પગલું ૨: પછી ઉપર વાદળ બને.",
      "પગલું ૩: છેલ્લે વરસાદ નીચે વરસે - હાથ આ જ ક્રમમાં ગતિ કરે છે."
    ],
    keywords: [
      { en: "Spatial Syntax", gu: "સ્થાનિક વ્યાકરણ" },
      { en: "Kinematic Sequence", gu: "ગતિશીલ ક્રમ" },
      { en: "ISL Morphology", gu: "સંકેત રૂપવિજ્ઞાન" }
    ],
    signConceptKey: "rain"
  },
  {
    id: "hard-10",
    difficulty: "hard",
    parameter: "concept",
    parameterLabel: {
      en: "Concept (સમજણ - Conservation of Mass)",
      gu: "સમજણ (દ્રવ્ય સંરક્ષણનો નિયમ)"
    },
    questionEn: "According to the global hydrological balance and Law of Conservation of Mass, does the total amount of water on Earth change over millions of years?",
    questionGu: "વૈશ્વિક જળ સંતુલન અને દ્રવ્ય સંરક્ષણના નિયમ મુજબ, શું લાખો વર્ષોમાં પૃથ્વી પરનું કુલ પાણીનું પ્રમાણ બદલાય છે?",
    options: [
      {
        id: "A",
        textEn: "No, Earth's water budget is essentially a closed thermodynamic system; total water mass remains constant while cycling through solid, liquid, and gas phases",
        textGu: "ના, પૃથ્વીનું જળ બજેટ બંધ પ્રણાલી છે; ઘન, પ્રવાહી અને વાયુમાં રૂપાંતરિત થવા છતાં પૃથ્વી પર કુલ પાણીનો જથ્થો અચળ રહે છે"
      },
      {
        id: "B",
        textEn: "Yes, half of all water leaks out through the ozone hole each year",
        textGu: "હા, દર વર્ષે અડધું પાણી ઓઝોન છિદ્રમાંથી અવકાશમાં લીક થઈ જાય છે"
      },
      {
        id: "C",
        textEn: "Yes, sunlight permanently creates new water molecules every morning",
        textGu: "હા, સૂર્યપ્રકાશ દરરોજ સવારે નવું પાણી બનાવે છે"
      },
      {
        id: "D",
        textEn: "Yes, all water will completely convert to stone within 10 years",
        textGu: "હા, 10 વર્ષમાં બધું પાણી પથ્થર બની જશે"
      }
    ],
    correctOptionId: "A",
    solutionEn: "Earth functions as a closed thermodynamic system regarding matter. Water molecules constantly transform between solid, liquid, and gaseous phases, but total global water volume has remained essentially constant (~1.386 billion km³) for billions of years.",
    solutionGu: "દ્રવ્ય સંરક્ષણ નિયમ મુજબ પૃથ્વી પર પાણીનો કુલ જથ્થો અચળ રહે છે. તે ફક્ત ઘન (બરફ), પ્રવાહી (પાણી) અને વાયુ (વરાળ) સ્વરૂપો વચ્ચે અવિરત ચક્રમાં ફરતું રહે છે.",
    breakdownHintsGu: [
      "પગલું ૧: શું પાણી ક્યારેય સંપૂર્ણપણે નાશ પામી શકે? ના, ઊર્જા અને દ્રવ્ય સંરક્ષિત રહે છે.",
      "પગલું ૨: પાણી ફક્ત તેનું સ્વરૂપ બદલે છે (બરફ, પાણી કે વરાળ).",
      "પગલું ૩: પૃથ્વી પરનું કુલ પાણી અચળ (Constant Closed System) રહે છે."
    ],
    keywords: [
      { en: "Conservation of Mass", gu: "દ્રવ્ય સંરક્ષણ" },
      { en: "Closed Water Budget", gu: "બંધ જળ પ્રણાલી" },
      { en: "Phase Equilibrium", gu: "અવસ્થા સંતુલન" }
    ],
    signConceptKey: "water"
  }
];
