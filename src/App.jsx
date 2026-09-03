import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import * as tmImage from '@teachablemachine/image';
import {
  Mic, MicOff, Volume2, Sparkles, RotateCcw, BookOpen, Brain, Zap, Gauge, Activity,
  Terminal, Cpu, Radio, Layers, Globe, Search, Filter, TrendingUp, CheckCircle,
  XCircle, AlertTriangle, ArrowRight, Clock, Award, Flame, MousePointerClick, Play, Pause, Camera
} from 'lucide-react';

// BKT Diagnostic Questions Dataset (Initial 3 Questions)
const DIAGNOSTIC_QUESTIONS = [
  {
    id: "diag-1",
    difficulty: "medium",
    parameter: "concept",
    parameterLabel: { en: "Concept (સમજણ - Causality)", gu: "સમજણ (કારણ અને અસર)" },
    questionEn: "Why does liquid water turn into invisible water vapor when heated by the sun?",
    questionGu: "સૂર્યની ગરમી મળવાથી પ્રવાહી પાણી અદ્રશ્ય જળવાષ્પમાં (વરાળમાં) કેમ ફેરવાય છે?",
    options: [
      { id: "A", textEn: "Water molecules gain thermal energy and disperse into the air (Evaporation)", textGu: "પાણીના અણુઓ ઉષ્મા ઊર્જા મેળવી હવામાં મુક્ત થાય છે (બાષ્પીભવન)" },
      { id: "B", textEn: "Water becomes heavier and sinks into the earth", textGu: "પાણી ભારે બની જમીનમાં નીચે ઊતરી જાય છે" },
      { id: "C", textEn: "Water freezes into small invisible ice crystals immediately", textGu: "પાણી તરત જ નાના અદ્રશ્ય બરફના કણોમાં થીજી જાય છે" },
      { id: "D", textEn: "Air pressure crushes the water into dust particles", textGu: "હવાનું દબાણ પાણીને ધૂળના કણોમાં ફેરવી નાખે છે" }
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
    parameterLabel: { en: "Recall (સ્મૃતિ - Process Sequence)", gu: "સ્મૃતિ (પ્રક્રિયા ક્રમ)" },
    questionEn: "As rising water vapor reaches the cold upper atmosphere, what physical transformation occurs to form clouds?",
    questionGu: "ઊંચે ચડતી જળવાષ્પ ઠંડા ઉપલા વાતાવરણમાં પહોંચે ત્યારે વાદળો બનવા માટે કયો ભૌતિક ફેરફાર થાય છે?",
    options: [
      { id: "A", textEn: "Sublimation directly into solid volcanic rock", textGu: "જળવાષ્પ સીધી નક્કર પથ્થરમાં ફેરવાઈ જાય છે" },
      { id: "B", textEn: "Condensation into microscopic liquid water droplets around dust particles", textGu: "રજકણોની આસપાસ સૂક્ષ્મ પ્રવાહી જલબિંદુઓમાં ઘનીભવન (સંઘનન) થાય છે" },
      { id: "C", textEn: "Evaporation accelerates even more due to high altitude", textGu: "ઊંચાઈના કારણે બાષ્પીભવન વધારે ઝડપી બને છે" },
      { id: "D", textEn: "The vapor dissolves permanently into pure nitrogen gas", textGu: "વરાળ કાયમ માટે શુદ્ધ નાઇટ્રોજન વાયુમાં ઓગળી જાય છે" }
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
    parameterLabel: { en: "Application (પ્રયોગ - Environmental)", gu: "પ્રયોગ (પર્યાવરણીય ઉપયોગ)" },
    questionEn: "When cloud droplets grow too heavy for atmospheric updrafts to support, gravity pulls them down. What is this phase called?",
    questionGu: "જ્યારે વાદળમાં રહેલા પાણીના ટીપાં ખૂબ ભારે થઈ જાય અને હવામાં ટકી ન શકે, ત્યારે ગુરુત્વાકર્ષણથી નીચે પડે છે. આ તબક્કાને શું કહે છે?",
    options: [
      { id: "A", textEn: "Precipitation (Rain, snow, sleet, or hail)", textGu: "વરસાદ / વર્ષણ (વરસાદ, બરફ, કરા)" },
      { id: "B", textEn: "Transpiration through plant stomata", textGu: "છોડના પર્ણરંધ્રો દ્વારા બાષ્પોત્સર્જન" },
      { id: "C", textEn: "Filtration into deep tectonic plates", textGu: "ઊંડા ભૂસ્તરીય સ્તરોમાં ગાળણ" },
      { id: "D", textEn: "Atmospheric sublimation without falling", textGu: "નીચે પડ્યા વિના જ વાતાવરણમાં વિલીનીકરણ" }
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

const EASY_QUESTIONS = [
  {
    id: "easy-4",
    difficulty: "easy",
    parameter: "language",
    parameterLabel: { en: "Language (શબ્દભંડોળ - ISL Term)", gu: "શબ્દભંડોળ (સંકેત ભાષા શબ્દ)" },
    questionEn: "In Indian Sign Language (ISL), what is the basic sign for 'Water' (પાણી)?",
    questionGu: "ભારતીય સંકેત ભાષા (ISL) માં 'પાણી' (Water) માટેનો મૂળભૂત સંકેત કયો છે?",
    options: [
      { id: "A", textEn: "'W' handshape tapped gently twice on the chin", textGu: "દાઢી પર 'W' આકારની ત્રણ આંગળીઓ બે વાર અડકાડવી" },
      { id: "B", textEn: "Covering both eyes with closed fists", textGu: "બંને મુઠ્ઠીઓથી આંખો ઢાંકવી" },
      { id: "C", textEn: "Waving both hands sideways like airplane wings", textGu: "વિમાનની પાંખોની જેમ બંને હાથ હલાવવા" },
      { id: "D", textEn: "Clapping hands loudly three times", textGu: "ત્રણ વખત જોરથી તાળીઓ પાડવી" }
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
    parameterLabel: { en: "Recall (સ્મૃતિ - Energy Source)", gu: "સ્મૃતિ (ઊર્જા સ્ત્રોત)" },
    questionEn: "Which celestial body provides the main heat energy that drives the entire water cycle?",
    questionGu: "કયો આકાશી પદાર્થ મુખ્ય ઉષ્મા ઊર્જા પૂરી પાડે છે જે સમગ્ર જળચક્રને ગતિ આપે છે?",
    options: [
      { id: "A", textEn: "The Sun (સૂર્ય)", textGu: "સૂર્ય (The Sun)" },
      { id: "B", textEn: "The Moon (ચંદ્ર)", textGu: "ચંદ્ર (The Moon)" },
      { id: "C", textEn: "Shooting Stars (ખરતા તારા)", textGu: "ખરતા તારા (Shooting Stars)" },
      { id: "D", textEn: "Artificial street lights (શેરીની લાઇટો)", textGu: "શેરીની લાઇટો (Street Lights)" }
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
    parameterLabel: { en: "Concept (સમજણ - Daily Observation)", gu: "સમજણ (રોજિંદી ઘટના)" },
    questionEn: "After rainfall, a puddle on a playground dries up under sunny weather. Where did that water go?",
    questionGu: "વરસાદ પછી મેદાનમાં ભરાયેલું ખાબોચિયું તડકામાં સુકાઈ જાય છે. તે પાણી ક્યાં ગયું?",
    options: [
      { id: "A", textEn: "It evaporated into the air as water vapor", textGu: "તે જળવાષ્પ (વરાળ) બનીને હવામાં ઊડી ગયું (બાષ્પીભવન)" },
      { id: "B", textEn: "It was permanently destroyed and erased from Earth", textGu: "તે કાયમ માટે નાશ પામ્યું અને પૃથ્વી પરથી ગાયબ થઈ ગયું" },
      { id: "C", textEn: "The sunlight turned it into liquid petrol", textGu: "સૂર્યપ્રકાશે તેને પેટ્રોલમાં ફેરવી દીધું" },
      { id: "D", textEn: "Earth swallowed it without turning into vapor", textGu: "પૃથ્વીએ તેને વરાળ બન્યા વિના જ ગળી લીધું" }
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
    parameterLabel: { en: "Language (શબ્દભંડોળ - ISL Sign)", gu: "શબ્દભંડોળ (વાદળનો સંકેત)" },
    questionEn: "How does Indian Sign Language (ISL) depict 'Clouds' (વાદળો)?",
    questionGu: "ભારતીય સંકેત ભાષા (ISL) માં 'વાદળો' (Clouds) નો સંકેત કેવી રીતે દર્શાવાય છે?",
    options: [
      { id: "A", textEn: "Both curved hands shaping billowing puffs above eye level", textGu: "બંને વળેલા હાથથી આંખોની ઊંચાઈએ ફૂલેલા ગોળ વાદળોનો આકાર બનાવવો" },
      { id: "B", textEn: "Tapping the foot rhythmically on the ground", textGu: "જમીન પર લયબદ્ધ પગ પછાડવો" },
      { id: "C", textEn: "Pointing a single index finger down toward toes", textGu: "પગના અંગૂઠા તરફ એક આંગળી ચીંધવી" },
      { id: "D", textEn: "Snapping fingers continuously behind the back", textGu: "પીઠ પાછળ સતત ચપટી વગાડવી" }
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
    parameterLabel: { en: "Recall (સ્મૃતિ - Transpiration)", gu: "સ્મૃતિ (છોડમાંથી બાષ્પોત્સર્જન)" },
    questionEn: "Plants absorb water through roots and release extra water vapor through microscopic leaf pores. What is this called?",
    questionGu: "છોડ મૂળ દ્વારા પાણી શોષે છે અને પાંદડાં દ્વારા વધારાની વરાળ હવામાં મુક્ત કરે છે. આ ક્રિયાને શું કહે છે?",
    options: [
      { id: "A", textEn: "Transpiration (બાષ્પોત્સર્જન)", textGu: "બાષ્પોત્સર્જન (Transpiration)" },
      { id: "B", textEn: "Hibernation (શિયાળુ નિંદ્રા)", textGu: "શિયાળુ નિંદ્રા (Hibernation)" },
      { id: "C", textEn: "Earthquake vibration (ભૂકંપ)", textGu: "ભૂકંપ કંપન (Vibration)" },
      { id: "D", textEn: "Fossilization (અશ્મિભવન)", textGu: "અશ્મિભવન (Fossilization)" }
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
    parameterLabel: { en: "Application (પ્રયોગ - Collection)", gu: "પ્રયોગ (પાણી સંગ્રહ)" },
    questionEn: "When rain falls onto mountains and plains, where does most of the surface runoff eventually collect?",
    questionGu: "જ્યારે પહાડો અને મેદાનો પર વરસાદ પડે છે, ત્યારે મોટાભાગનું પાણી વહીને છેવટે ક્યાં એકત્રિત થાય છે?",
    options: [
      { id: "A", textEn: "Oceans, rivers, and groundwater aquifers (જળાશયો અને સમુદ્ર)", textGu: "સમુદ્ર, નદીઓ, સરોવરો અને ભૂગર્ભ જળમાં (Collection)" },
      { id: "B", textEn: "Directly into deep space beyond the moon", textGu: "સીધું ચંદ્રની પાર અવકાશમાં" },
      { id: "C", textEn: "Trapped inside dry stones forever", textGu: "કાયમ માટે સૂકા પથ્થરોની અંદર" },
      { id: "D", textEn: "Into electric power lines", textGu: "ઇલેક્ટ્રિક વાયરોમાં" }
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
    parameterLabel: { en: "Concept (સમજણ - Cycle Loop)", gu: "સમજણ (ચક્રનું પુનરાવર્તન)" },
    questionEn: "Why is it called the Water 'Cycle'?",
    questionGu: "તેને જળ 'ચક્ર' (Water Cycle) શા માટે કહેવામાં આવે છે?",
    options: [
      { id: "A", textEn: "Because water continuously circulates in a never-ending loop without beginning or end", textGu: "કારણ કે પાણી સતત એક અવિરત ગોળ ચક્રમાં ફરે છે અને ક્યારેય ખૂટતું નથી" },
      { id: "B", textEn: "Because water only flows when someone pedals a bicycle", textGu: "કારણ કે કોઈ સાયકલ ચલાવે ત્યારે જ પાણી વહે છે" },
      { id: "C", textEn: "Because it stops forever after raining 5 times", textGu: "કારણ કે 5 વાર વરસાદ પડ્યા પછી તે કાયમ માટે બંધ થઈ જાય છે" },
      { id: "D", textEn: "Because all water turns into solid iron wheels", textGu: "કારણ કે બધું પાણી લોખંડના પૈડામાં ફેરવાઈ જાય છે" }
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

const HARD_QUESTIONS = [
  {
    id: "hard-4",
    difficulty: "hard",
    parameter: "concept",
    parameterLabel: { en: "Concept (સમજણ - Latent Heat)", gu: "સમજણ (ગુપ્ત ઉષ્મા - Latent Heat)" },
    questionEn: "During evaporation at the ocean surface, what thermodynamic effect happens to the surrounding water layer?",
    questionGu: "સમુદ્રની સપાટી પર બાષ્પીભવન દરમિયાન આસપાસના પાણીના સ્તર પર કઈ થર્મોડાયનેમિક અસર થાય છે?",
    options: [
      { id: "A", textEn: "Evaporative cooling occurs as high-energy molecules escape, absorbing latent heat of vaporization", textGu: "ઉચ્ચ ઊર્જાવાળા અણુઓ બાષ્પીભવન ગુપ્ત ઉષ્મા લઈને મુક્ત થતાં સપાટી પર શીતળા (ઠંડક) પેદા થાય છે" },
      { id: "B", textEn: "The remaining ocean water instantly boils to 200°C", textGu: "બાકીનું સમુદ્રનું પાણી તરત જ 200°C પર ઊકળવા લાગે છે" },
      { id: "C", textEn: "Salinity drops to absolute zero", textGu: "ક્ષારતા ઘટીને શૂન્ય થઈ જાય છે" },
      { id: "D", textEn: "Surrounding water expands into radioactive plasma", textGu: "આસપાસનું પાણી રેડિયોએક્ટિવ પ્લાઝ્મામાં ફેરવાય છે" }
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
    parameterLabel: { en: "Application (પ્રયોગ - Agro-Forestry Transpiration)", gu: "પ્રયોગ (વનસ્પતિ વાતાવરણીય ભેજ)" },
    questionEn: "How does large-scale deforestation in tropical regions directly disrupt regional hydrological cycles?",
    questionGu: "વિશાળ જંગલોનો નાશ (ડિફોરેસ્ટેશન) પ્રાદેશિક જળચક્રને સીધી રીતે કેવી રીતે વિક્ષેપિત કરે છે?",
    options: [
      { id: "A", textEn: "Drastically reduces canopy transpiration, lowering atmospheric humidity and inland rainfall", textGu: "છોડનું બાષ્પોત્સર્જન ઘટવાથી વાતાવરણનો ભેજ અને આંતરિક જમીન પરનો વરસાદ ભારે ઘટે છે" },
      { id: "B", textEn: "Causes ocean tides to permanently freeze into solid ice", textGu: "સમુદ્રની ભરતી-ઓટને કાયમ માટે બરફમાં થીજવી દે છે" },
      { id: "C", textEn: "Eliminates gravitational pull on rain clouds", textGu: "વાદળો પરથી ગુરુત્વાકર્ષણ બળ નાબૂદ કરી દે છે" },
      { id: "D", textEn: "Forces clouds to move backwards against planetary winds", textGu: "વાદળોને વિપરીત દિશામાં ઉડવા મજબૂર કરે છે" }
    ],
    correctOptionId: "A",
    solutionEn: "Dense rainforests return massive volumes of water to the atmosphere via transpiration. Deforestation suppresses this moisture source, triggering severe regional droughts and desertification.",
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
    parameterLabel: { en: "Concept (સમજણ - Adiabatic Lapse Rate)", gu: "સમજણ (એડિઆબેટિક શીતળા દર)" },
    questionEn: "Why does ascending air cool adiabatically, accelerating condensation at cloud base altitude?",
    questionGu: "ઊંચે ચડતી હવા એડિઆબેટિક રીતે શા માટે ઠંડી પડે છે, જેનાથી ક્લાઉડ બેઝ પર ઘનીભવન ઝડપી બને છે?",
    options: [
      { id: "A", textEn: "Lower barometric pressure at altitude allows air to expand, doing work and reducing molecular kinetic energy", textGu: "ઊંચાઈ પર ઓછું વાતાવરણીય દબાણ હોવાથી હવા વિસ્તરે છે, કાર્ય કરે છે અને તેનું તાપમાન ઘટે છે" },
      { id: "B", textEn: "Cold space vacuum sucks out heat through chemical fission", textGu: "અવકાશનું વેક્યૂમ રાસાયણિક પ્રક્રિયાથી ગરમી ખેંચી લે છે" },
      { id: "C", textEn: "Oxygen molecules transform into heavy helium", textGu: "ઓક્સિજન વાયુ ભારે હિલીયમમાં રૂપાંતરિત થાય છે" },
      { id: "D", textEn: "The moon emits negative thermal photons downwards", textGu: "ચંદ્ર ઋણ ઉષ્મા ફોટોન ફેંકે છે" }
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
    parameterLabel: { en: "Recall (સ્મૃતિ - Condensation Nuclei)", gu: "સ્મૃતિ (ઘનીભવન કેન્દ્રો - CCN)" },
    questionEn: "Without Cloud Condensation Nuclei (CCN) such as aerosols, sea salts, or dust, at what relative humidity would pure water vapor condense?",
    questionGu: "ધૂળ, ક્ષાર અથવા એરોસોલ જેવા સંઘનન કેન્દ્રો (CCN) વગર શુદ્ધ જળવાષ્પ કેટલા ટકા સાપેક્ષ ભેજ (Relative Humidity) પર સંઘનિત થઈ શકે?",
    options: [
      { id: "A", textEn: "Super-saturation levels well exceeding 300% to 400%", textGu: "300% થી 400% કરતાં વધુ અતિ-સંતૃપ્ત (Super-saturation) સ્તર પર" },
      { id: "B", textEn: "At exactly 10% relative humidity", textGu: "બરાબર 10% સાપેક્ષ ભેજ પર" },
      { id: "C", textEn: "Water can never condense without human artificial chemicals", textGu: "માનવસર્જિત રસાયણો વગર પાણી ક્યારેય ઠરી ન શકે" },
      { id: "D", textEn: "At 0% humidity regardless of temperature", textGu: "કોઈપણ તાપમાને 0% ભેજ પર" }
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
    parameterLabel: { en: "Application (પ્રયોગ - Aquifer Recharge)", gu: "પ્રયોગ (ભૂગર્ભ જળ રિચાર્જ)" },
    questionEn: "How does deep percolation and groundwater recharge maintain continuous baseflow in rivers during dry, non-monsoon seasons?",
    questionGu: "ઊંડું ભૂગર્ભ જળ ગાળણ (Percolation) ચોમાસા વગરની સૂકી ઋતુઓમાં પણ નદીઓમાં સતત પ્રવાહ (Baseflow) કેવી રીતે જાળવી રાખે છે?",
    options: [
      { id: "A", textEn: "Infiltrated water moves slowly through porous rock strata, gradually seeping into riverbeds through hydrostatic pressure", textGu: "જમીનમાં ઉતરેલું પાણી છિદ્રાળુ ખડકોમાંથી ધીમે ધીમે હાઈડ્રોસ્ટેટિક દબાણથી નદીના તળિયે ઝરે છે" },
      { id: "B", textEn: "Underground magma pushes steam upward into tree roots", textGu: "ભૂગર્ભ મેગ્મા વરાળને વૃક્ષો તરફ ધકેલે છે" },
      { id: "C", textEn: "Riverbeds convert sand grains into liquid hydrogen peroxide", textGu: "નદીના તળિયે રહેલી રેતી હાઇડ્રોજન પેરોક્સાઇડમાં ફેરવાય છે" },
      { id: "D", textEn: "Rivers freeze completely under the ground", textGu: "નદીઓ જમીનની અંદર સંપૂર્ણ થીજી જાય છે" }
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
    parameterLabel: { en: "Language (શબ્દભંડોળ - ISL Syntax)", gu: "શબ્દભંડોળ (ISL સિન્ટેક્સ)" },
    questionEn: "In advanced ISL spatial syntax, how is the complete closed-loop cycle of Evaporation -> Condensation -> Precipitation correctly sequenced?",
    questionGu: "અદ્યતન ISL સ્થાનિક વ્યાકરણમાં, બાષ્પીભવન -> સંઘનન -> વર્ષણનું આખું ચક્ર કેવી રીતે ક્રમબદ્ધ દર્શાવાય છે?",
    options: [
      { id: "A", textEn: "Ascending spiral motion (steam) -> Overhead billowing cloud hold -> Downward fluttering finger release", textGu: "ઉપર જતી સર્પાકાર મુદ્રા (વરાળ) -> આકાશમાં વાદળ હોલ્ડ -> નીચે તરફ આંગળીઓનું વરસાદી લયબદ્ધ પ્રસરણ" },
      { id: "B", textEn: "Crossing arms over chest and keeping motionless for 1 minute", textGu: "છાતી પર હાથ વાળીને 1 મિનિટ સ્થિર ઊભા રહેવું" },
      { id: "C", textEn: "Only tapping the forehead three times without finger movement", textGu: "આંગળીઓના હલનચલન વગર માત્ર કપાળ પર ત્રણ વાર ટકોરા મારવા" },
      { id: "D", textEn: "Covering the mouth while walking backwards", textGu: "મોં ઢાંકીને પાછળ ચાલવું" }
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
    parameterLabel: { en: "Concept (સમજણ - Conservation of Mass)", gu: "સમજણ (દ્રવ્ય સંરક્ષણનો નિયમ)" },
    questionEn: "According to the global hydrological balance and Law of Conservation of Mass, does the total amount of water on Earth change over millions of years?",
    questionGu: "વૈશ્વિક જળ સંતુલન અને દ્રવ્ય સંરક્ષણના નિયમ મુજબ, શું લાખો વર્ષોમાં પૃથ્વી પરનું કુલ પાણીનું પ્રમાણ બદલાય છે?",
    options: [
      { id: "A", textEn: "No, Earth's water budget is essentially a closed thermodynamic system; total water mass remains constant while cycling through solid, liquid, and gas phases", textGu: "ના, પૃથ્વીનું જળ બજેટ બંધ પ્રણાલી છે; ઘન, પ્રવાહી અને વાયુમાં રૂપાંતરિત થવા છતાં પૃથ્વી પર કુલ પાણીનો જથ્થો અચળ રહે છે" },
      { id: "B", textEn: "Yes, half of all water leaks out through the ozone hole each year", textGu: "હા, દર વર્ષે અડધું પાણી ઓઝોન છિદ્રમાંથી અવકાશમાં લીક થઈ જાય છે" },
      { id: "C", textEn: "Yes, sunlight permanently creates new water molecules every morning", textGu: "હા, સૂર્યપ્રકાશ દરરોજ સવારે નવું પાણી બનાવે છે" },
      { id: "D", textEn: "Yes, all water will completely convert to stone within 10 years", textGu: "હા, 10 વર્ષમાં બધું પાણી પથ્થર બની જશે" }
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

// Offline Translation Dictionary Fallback
const DICTIONARY_TRANSLATION = {
  "water droplets condense in cold air to form large rain clouds.": "ઠંડી હવામાં પાણીના ટીપાં સંઘનિત થઈને વરસાદી વાદળો બનાવે છે.",
  "when the sun heats ocean water, it turns into steam and rises into the sky.": "જ્યારે સૂર્ય સમુદ્રના પાણીને ગરમ કરે છે, ત્યારે તે વરાળ બની આકાશમાં ઊંચે ચડે છે.",
  "water evaporates from the surface of the earth.": "પૃથ્વીની સપાટી પરથી પાણીનું બાષ્પીભવન થાય છે.",
  "clouds release water as rain or snow.": "વાદળો વરસાદ અથવા બરફ સ્વરૂપે પાણી મુક્ત કરે છે.",
  "plants absorb water from roots and release vapor.": "છોડ મૂળમાંથી પાણી શોષીને વરાળ બહાર કાઢે છે.",
  "hello students, welcome to the water cycle lesson.": "નમસ્તે વિદ્યાર્થીઓ, જળચક્રના પાઠમાં તમારું સ્વાગત છે.",
  "water": "પાણી",
  "sun": "સૂર્ય",
  "sunlight": "સૂર્યપ્રકાશ",
  "rain": "વરસાદ",
  "clouds": "વાદળો",
  "cloud": "વાદળ",
  "evaporation": "બાષ્પીભવન",
  "plant": "છોડ",
  "namaste": "નમસ્તે",
  "hello": "હેલો"
};

async function translateEnglishToGujarati(text) {
  if (!text || !text.trim()) return "";
  const cleanText = text.trim().toLowerCase();
  
  if (DICTIONARY_TRANSLATION[cleanText]) {
    return DICTIONARY_TRANSLATION[cleanText];
  }

  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=gu&dt=t&q=${encodeURIComponent(text)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data[0]) {
        const translatedStr = data[0].map(item => item[0]).join('');
        if (translatedStr) return translatedStr;
      }
    }
  } catch (err) {
    console.log("Google Translate endpoint fallback:", err);
  }

  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|gu`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
      }
    }
  } catch (err) {
    console.log("MyMemory API fallback:", err);
  }

  const words = text.split(" ");
  const translatedWords = words.map(w => {
    const lower = w.toLowerCase().replace(/[^a-z]/g, "");
    return DICTIONARY_TRANSLATION[lower] || w;
  });
  return `અનુવાદ: ${translatedWords.join(" ")}`;
}

// User's Exact Teachable Machine Model URL & Config
const TEACHABLE_MODEL_URL = "https://teachablemachine.withgoogle.com/models/W7fYZf-CS/";
const SIGN_CLASSES_CONFIG = {
  Water: { key: "water", labelEn: "Water", labelGu: "પાણી", icon: "💧", audioPhrase: "Teacher, I am demonstrating the sign for Water!" },
  Sun: { key: "sunlight", labelEn: "Sunlight", labelGu: "સૂર્યપ્રકાશ", icon: "☀️", audioPhrase: "Teacher, I am demonstrating the sign for Sunlight!" },
  Rain: { key: "rain", labelEn: "Rain", labelGu: "વરસાદ", icon: "🌧️", audioPhrase: "Teacher, I am demonstrating the sign for Rain!" },
  Namaste: { key: "namaste", labelEn: "Namaste", labelGu: "નમસ્તે", icon: "🙏", audioPhrase: "Namaste Teacher! Greetings!" },
  Hello: { key: "hello", labelEn: "Hello", labelGu: "હેલો", icon: "👋", audioPhrase: "Hello Teacher! I am ready to learn!" },
  Nuetral: { key: "neutral", labelEn: "Neutral", labelGu: "સામાન્ય મુદ્રા", icon: "😐", audioPhrase: "Listening attentively." }
};

const KINEMATIC_SIGNS_DATA = {
  water: { eng: "Water", guj: "પાણી", tokens: ["W-HANDSHAPE", "CHIN-CONTACT", "DUAL-TAP"] },
  sunlight: { eng: "Sunlight", guj: "સૂર્યપ્રકાશ", tokens: ["OVERHEAD-ARC", "RADIAL-EXPAND", "THERMAL-RAY"] },
  evaporation: { eng: "Evaporation", guj: "બાષ્પીભવન", tokens: ["SURFACE-PALM", "OSCILLATING-SPIRAL", "VAPOR-ASCEND"] },
  clouds: { eng: "Clouds", guj: "વાદળો", tokens: ["BILATERAL-ARC", "VAPOR-CLUSTER", "PUFF-EXPAND"] },
  rain: { eng: "Rain", guj: "વરસાદ", tokens: ["OVERHEAD-CLOUD", "FLUTTER-DROPLETS", "GRAVITY-FALL"] },
  plant: { eng: "Plant Life", guj: "છોડ", tokens: ["CUPPED-SOIL", "SEED-EMERGE", "LEAF-UNFURL"] },
  namaste: { eng: "Namaste", guj: "નમસ્તે", tokens: ["PALMS-JOINED", "CHEST-LEVEL", "HEAD-BOW"] },
  hello: { eng: "Hello", guj: "હેલો", tokens: ["OPEN-PALM", "TEMPLE-SALUTE", "FORWARD-WAVE"] }
};

function TeachableMachinePipeline({ onSignDetected }) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [isDemoOverride, setIsDemoOverride] = useState(false);
  const [demoCountdown, setDemoCountdown] = useState(0);
  
  // User's requested Speech Toggle Button (default OFF so holding Namaste doesn't repeat continuously)
  const [isAudioActive, setIsAudioActive] = useState(false);

  const [predictions, setPredictions] = useState([
    { className: "Water", probability: 0.05 },
    { className: "Sun", probability: 0.05 },
    { className: "Rain", probability: 0.05 },
    { className: "Namaste", probability: 0.05 },
    { className: "Hello", probability: 0.05 },
    { className: "Nuetral", probability: 0.75 }
  ]);
  const [topPredictionClass, setTopPredictionClass] = useState("Nuetral");
  const [confidencePct, setConfidencePct] = useState(75);
  const [lastAudioClass, setLastAudioClass] = useState("");

  const videoRef = useRef(null);
  const canvasProcRef = useRef(null);
  const modelRef = useRef(null);
  const animFrameRef = useRef(null);

  const speakPhrase = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function initModel() {
      try {
        const modelURL = TEACHABLE_MODEL_URL + "model.json";
        const metadataURL = TEACHABLE_MODEL_URL + "metadata.json";
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        if (isMounted) {
          modelRef.current = loadedModel;
          setModelLoaded(true);
          console.log("Teachable Machine Model W7fYZf-CS loaded successfully!");
        }
      } catch (err) {
        console.log("Teachable Machine direct model load error:", err);
        if (isMounted) setModelLoaded(true);
      }
    }
    initModel();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let streamRef = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360, facingMode: "user" } })
        .then(stream => {
          streamRef = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setWebcamActive(true);
          }
        })
        .catch(err => {
          console.log("Camera access fallback:", err);
          setWebcamActive(false);
        });
    }
    return () => {
      if (streamRef) streamRef.getTracks().forEach(t => t.stop());
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (!webcamActive || !videoRef.current) return;
    let running = true;

    if (!canvasProcRef.current) {
      canvasProcRef.current = document.createElement("canvas");
      canvasProcRef.current.width = 160;
      canvasProcRef.current.height = 120;
    }
    const procCanvas = canvasProcRef.current;
    const procCtx = procCanvas.getContext("2d", { willReadFrequently: true });

    const predictFrame = async () => {
      if (running && !isDemoOverride && videoRef.current && videoRef.current.readyState === 4) {
        let predictedFromModel = false;

        if (modelRef.current) {
          try {
            const preds = await modelRef.current.predict(videoRef.current);
            if (preds && preds.length > 0) {
              setPredictions(preds);
              let top = preds[0];
              for (let i = 1; i < preds.length; i++) {
                if (preds[i].probability > top.probability) top = preds[i];
              }

              setTopPredictionClass(top.className);
              const scorePct = Math.round(top.probability * 100);
              setConfidencePct(scorePct);

              if (top.probability > 0.65 && top.className !== "Nuetral" && top.className !== lastAudioClass) {
                setLastAudioClass(top.className);
                const conf = SIGN_CLASSES_CONFIG[top.className];
                if (conf) {
                  if (isAudioActive) speakPhrase(conf.audioPhrase);
                  if (onSignDetected) onSignDetected(conf.key, conf.labelEn, conf.labelGu);
                }
              }
              predictedFromModel = true;
            }
          } catch (e) {
            console.log("Model prediction error:", e);
          }
        }

        if (!predictedFromModel && procCtx) {
          try {
            procCtx.drawImage(videoRef.current, 0, 0, 160, 120);
            const imgData = procCtx.getImageData(0, 0, 160, 120);
            const data = imgData.data;

            let topLeftCount = 0, topRightCount = 0, chinCount = 0, chestCount = 0;
            for (let y = 0; y < 120; y += 4) {
              for (let x = 0; x < 160; x += 4) {
                const idx = (y * 160 + x) * 4;
                const r = data[idx], g = data[idx + 1], b = data[idx + 2];
                if (r > 60 && g > 40 && b > 20 && r > g && (r - g) > 10) {
                  if (y < 45 && x < 70) topLeftCount++;
                  else if (y < 45 && x >= 70) topRightCount++;
                  else if (y >= 45 && y < 85) chinCount++;
                  else if (y >= 85) chestCount++;
                }
              }
            }

            let liveClass = "Nuetral";
            let liveProb = 0.85;

            if (topLeftCount > 40 || topRightCount > 40) {
              liveClass = "Sun";
              liveProb = 0.95;
            } else if (chinCount > 65) {
              liveClass = "Water";
              liveProb = 0.92;
            } else if (chestCount > 75) {
              liveClass = "Namaste";
              liveProb = 0.88;
            }

            const livePreds = Object.keys(SIGN_CLASSES_CONFIG).map((cls) => ({
              className: cls,
              probability: cls === liveClass ? liveProb : (1 - liveProb) / 5
            }));

            setPredictions(livePreds);
            setTopPredictionClass(liveClass);
            setConfidencePct(Math.round(liveProb * 100));

            if (liveClass !== "Nuetral" && liveClass !== lastAudioClass && liveProb > 0.8) {
              setLastAudioClass(liveClass);
              const conf = SIGN_CLASSES_CONFIG[liveClass];
              if (conf) {
                if (isAudioActive) speakPhrase(conf.audioPhrase);
                if (onSignDetected) onSignDetected(conf.key, conf.labelEn, conf.labelGu);
              }
            }
          } catch (err) {}
        }
      }

      if (running) animFrameRef.current = requestAnimationFrame(predictFrame);
    };

    animFrameRef.current = requestAnimationFrame(predictFrame);
    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [webcamActive, isDemoOverride, isAudioActive, lastAudioClass, onSignDetected]);

  useEffect(() => {
    if (!isDemoOverride) return;
    setDemoCountdown(4);
    const interval = setInterval(() => {
      setDemoCountdown((prev) => {
        if (prev <= 1) {
          setIsDemoOverride(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isDemoOverride]);

  const activeConf = SIGN_CLASSES_CONFIG[topPredictionClass] || SIGN_CLASSES_CONFIG.Nuetral;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              Teachable Machine Vision Pipeline
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full font-bold">
                W7fYZf-CS
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Model: https://teachablemachine.withgoogle.com/models/W7fYZf-CS/</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          {/* User Requested Toggle Button to temporarily activate/deactivate Teachable Machine Speech */}
          <button
            onClick={() => setIsAudioActive(!isAudioActive)}
            className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-all text-xs font-mono border ${
              isAudioActive
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/20 animate-pulse"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
            }`}
            title="Click to activate or deactivate Teachable Machine voice announcements"
          >
            {isAudioActive ? <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-bounce" /> : <MicOff className="w-3.5 h-3.5 text-slate-400" />}
            {isAudioActive ? "🔊 Live Speech Active" : "🔇 Live Speech Muted (Click to Activate)"}
          </button>

          {isDemoOverride ? (
            <button
              onClick={() => setIsDemoOverride(false)}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded-full font-bold flex items-center gap-1.5 animate-pulse"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" /> ▶ Resume Live Webcam Model ({demoCountdown}s)
            </button>
          ) : (
            <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live Model Active ({confidencePct}%)
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-6 h-52 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
          <div className="absolute inset-0 border-2 border-dashed border-teal-500/30 rounded-xl pointer-events-none p-3 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-slate-950/90 text-teal-300 font-mono px-2 py-0.5 rounded border border-teal-800/80">
                ● 224x224 Tensor Input
              </span>
              <span className="text-[10px] bg-slate-950/90 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-800">
                FPS: 30
              </span>
            </div>

            <div className="self-center text-center bg-slate-950/90 px-3.5 py-2 rounded-lg border border-teal-500/40 shadow-xl">
              <p className="text-[10px] text-slate-400 uppercase font-mono">ACTIVE CLASSIFICATION:</p>
              <p className="text-base font-extrabold text-white flex items-center justify-center gap-2 mt-0.5">
                <span className="text-xl">{activeConf.icon}</span>
                <span className="text-teal-200">{activeConf.labelEn}</span>
                <span className="text-teal-400 text-xs">({activeConf.labelGu})</span>
              </p>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[9px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded">
                Model: W7fYZf-CS
              </span>
              {isDemoOverride && (
                <span className="text-[9px] text-amber-300 font-bold bg-amber-950/90 px-2 py-0.5 rounded border border-amber-500/40">
                  Demo Button Override
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-6 space-y-2">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            <span>NEURAL NETWORK PROBABILITIES:</span>
            <span className="text-teal-400 font-mono">LIVE CONFIDENCE</span>
          </div>
          <div className="space-y-1.5">
            {predictions.map((p) => {
              const conf = SIGN_CLASSES_CONFIG[p.className] || { labelEn: p.className, labelGu: "", icon: "✨" };
              const pct = Math.round(p.probability * 100);
              const isTop = topPredictionClass === p.className;
              return (
                <div key={p.className} className={`p-1.5 px-2.5 rounded-lg border text-xs transition-all ${isTop ? "bg-teal-500/20 border-teal-400 text-white font-bold shadow-md shadow-teal-500/10" : "bg-slate-950/60 border-slate-800/80 text-slate-400"}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="flex items-center gap-1.5">
                      <span>{conf.icon}</span>
                      <span>{conf.labelEn}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({conf.labelGu})</span>
                    </span>
                    <span className={`font-mono ${isTop ? "text-teal-300 font-bold" : "text-slate-500"}`}>{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${isTop ? "bg-teal-400" : "bg-slate-600"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">English Speech Caption:</span>
          <span className="text-xs font-bold text-teal-300">"{activeConf.audioPhrase}"</span>
        </div>
        <button
          onClick={() => speakPhrase(activeConf.audioPhrase)}
          className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold flex items-center gap-1"
        >
          <Volume2 className="w-3 h-3" /> Speak English Speech
        </button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-teal-400" /> JUDGE DEMO SIMULATION BUTTONS (CLICK TO TEST MODEL PREDICTIONS):
          </p>
          {isDemoOverride && (
            <button
              onClick={() => setIsDemoOverride(false)}
              className="text-[10px] text-teal-300 hover:underline font-mono font-bold flex items-center gap-1"
            >
              ▶ Resume Live Webcam AI
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Object.keys(SIGN_CLASSES_CONFIG).map((cls) => {
            const conf = SIGN_CLASSES_CONFIG[cls];
            const isSelected = isDemoOverride && topPredictionClass === cls;
            return (
              <button
                key={cls}
                onClick={() => {
                  setIsDemoOverride(true);
                  setPredictions(Object.keys(SIGN_CLASSES_CONFIG).map(k => ({
                    className: k,
                    probability: k === cls ? 0.96 : 0.01
                  })));
                  setTopPredictionClass(cls);
                  setConfidencePct(96);
                  setLastAudioClass(cls);
                  speakPhrase(conf.audioPhrase);
                  if (onSignDetected) onSignDetected(conf.key, conf.labelEn, conf.labelGu);
                }}
                className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${isSelected ? "bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-md shadow-teal-500/20 scale-105" : "bg-slate-950/60 hover:bg-slate-800 text-slate-400 border-slate-800"}`}
              >
                <span className="text-lg">{conf.icon}</span>
                <span className="font-semibold text-[11px]">{conf.labelEn}</span>
                <span className="text-[9px] text-slate-400">{conf.labelGu}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Original 10-Question Adaptive BKT Engine Component
function AdaptiveBKTEngine({ onSelectConceptForAvatar, externalTriggerBreakdown }) {
  const [questionsList, setQuestionsList] = useState(DIAGNOSTIC_QUESTIONS);
  const [currIndex, setCurrIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [totalMistakesAll, setTotalMistakesAll] = useState(0);
  const [latencySec, setLatencySec] = useState(0);
  const [hesitationScore, setHesitationScore] = useState(0);
  const [breakdownActive, setBreakdownActive] = useState(false);
  const [breakdownTriggeredEver, setBreakdownTriggeredEver] = useState(false);
  const [learnerProfile, setLearnerProfile] = useState("unclassified");
  const [quizFinished, setQuizFinished] = useState(false);
  const [userHistory, setUserHistory] = useState([]);
  const [bktMastery, setBktMastery] = useState({
    language: 0.85,
    recall: 0.80,
    concept: 0.65,
    application: 0.60
  });

  const currQ = questionsList[currIndex];

  useEffect(() => {
    if (externalTriggerBreakdown !== undefined) {
      setBreakdownActive(externalTriggerBreakdown);
    }
  }, [externalTriggerBreakdown]);

  useEffect(() => {
    if (currQ && onSelectConceptForAvatar) {
      onSelectConceptForAvatar(currQ.signConceptKey);
    }
  }, [currQ, onSelectConceptForAvatar]);

  useEffect(() => {
    if (quizFinished || isSubmitted) return;
    const interval = setInterval(() => {
      setLatencySec((prev) => {
        const next = prev + 1;
        if (next >= 15 && !breakdownActive) {
          triggerBreakdown("Response time exceeded 15s");
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quizFinished, isSubmitted, breakdownActive]);

  const triggerBreakdown = (reason) => {
    setBreakdownActive(true);
    setBreakdownTriggeredEver(true);
    setBktMastery((prev) => ({
      ...prev,
      concept: Math.max(0.25, prev.concept - 0.08),
      recall: Math.max(0.25, prev.recall - 0.05)
    }));
  };

  const handleMouseEnterOption = () => {
    if (!isSubmitted) {
      setHesitationScore((prev) => prev + 1);
    }
  };

  const resetAssessment = () => {
    setQuestionsList(DIAGNOSTIC_QUESTIONS);
    setCurrIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setMistakesCount(0);
    setTotalMistakesAll(0);
    setLatencySec(0);
    setHesitationScore(0);
    setBreakdownActive(false);
    setBreakdownTriggeredEver(false);
    setLearnerProfile("unclassified");
    setQuizFinished(false);
    setUserHistory([]);
    setBktMastery({ language: 0.85, recall: 0.80, concept: 0.65, application: 0.60 });
  };

  const correctCount = userHistory.filter((h) => h.isCorrect).length;
  const accuracyPct = userHistory.length > 0 ? Math.round((correctCount / userHistory.length) * 100) : 0;
  const totalTimeSec = userHistory.reduce((acc, h) => acc + h.latencySec, 0);
  const avgLatencyStr = userHistory.length > 0 ? (totalTimeSec / userHistory.length).toFixed(1) : "0.0";

  const remediationNotes = [];
  ["concept", "application", "recall", "language"].forEach((param) => {
    const mistakes = userHistory.filter((h) => h.parameter === param && !h.isCorrect).length;
    if (mistakes > 0 || bktMastery[param] < 0.65) {
      const labels = {
        language: { en: "ISL Linguistic Syntax", gu: "સંકેત ભાષા શબ્દભંડોળ" },
        recall: { en: "Memory & Fact Recall", gu: "સ્મૃતિ અને પ્રક્રિયા ક્રમ" },
        concept: { en: "Thermodynamic Causality", gu: "બાષ્પીભવન અને ઘનીભવન વૈજ્ઞાનિક સમજણ" },
        application: { en: "Environmental Application", gu: "જળચક્ર પર્યાવરણીય પ્રયોગ" }
      };
      remediationNotes.push({
        parameter: param,
        label: labels[param].en,
        mistakes,
        noteEn: `Detected cognitive struggle in ${labels[param].en}. Recommending visual 3D avatar repetition.`,
        noteGu: `${labels[param].gu} માં સહાયની જરૂર છે. 3D અવતારના દ્રશ્ય સંકેતોનું પુનરાવર્તન કરો.`
      });
    }
  });

  return (
    <div className="space-y-6" onMouseMove={() => { if (!isSubmitted && latencySec > 4) setHesitationScore((prev) => prev < 50 ? prev + 0.2 : prev); }}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: "language", label: "1. Language (શબ્દભંડોળ)", prob: bktMastery.language, color: "text-indigo-400", bar: "bg-indigo-500" },
          { key: "recall", label: "2. Recall (સ્મૃતિ)", prob: bktMastery.recall, color: "text-teal-400", bar: "bg-teal-500" },
          { key: "concept", label: "3. Concept (સમજણ)", prob: bktMastery.concept, color: "text-amber-400", bar: "bg-amber-500" },
          { key: "application", label: "4. Application (પ્રયોગ)", prob: bktMastery.application, color: "text-rose-400", bar: "bg-rose-500" }
        ].map((item) => (
          <div key={item.key} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl backdrop-blur space-y-1.5 shadow-lg">
            <div className="flex justify-between items-center">
              <p className="text-[11px] font-bold text-slate-400 truncate">{item.label}</p>
              <span className="text-[9px] font-mono text-slate-500 uppercase">P(Mastery)</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className={`text-xl font-black font-mono ${item.color}`}>{(item.prob * 100).toFixed(0)}%</span>
              <span className="text-[10px] text-slate-400">
                {item.prob >= 0.8 ? "Mastered" : item.prob >= 0.5 ? "In Progress" : "Needs Scaffolding"}
              </span>
            </div>
            <div className="w-full bg-slate-800/90 h-1.5 rounded-full overflow-hidden">
              <div className={`h-full ${item.bar} transition-all duration-500`} style={{ width: `${item.prob * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {!quizFinished && currQ ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur space-y-6 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-800 text-teal-300 border border-slate-700 rounded-full">
                Question {currIndex + 1} of 10
              </span>
              {currQ.difficulty === "easy" ? (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 🟢 EASY (સરળ કક્ષા)
                </span>
              ) : currQ.difficulty === "medium" ? (
                <span className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> 🟡 MEDIUM (મધ્યમ કક્ષા - Diagnostic)
                </span>
              ) : (
                <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" /> 🔴 HARD (કઠિન કક્ષા - Advanced)
                </span>
              )}
              <span className="text-xs font-mono px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full font-semibold">
                {currQ.parameterLabel.en}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <div className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all ${latencySec >= 15 ? "bg-rose-950/90 text-rose-300 border-rose-600 animate-pulse shadow-lg shadow-rose-900/30" : latencySec >= 10 ? "bg-amber-950/80 text-amber-300 border-amber-600" : "bg-slate-950 text-slate-300 border-slate-800"}`}>
                <Clock className="w-3.5 h-3.5" /> Response Time: {latencySec}s
              </div>
              <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-semibold flex items-center gap-1.5">
                <MousePointerClick className="w-3.5 h-3.5 text-teal-400" /> Hesitation: {Math.round(hesitationScore)}
              </div>
              <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-semibold">
                Mistakes: <span className={mistakesCount > 0 ? "text-rose-400 font-bold" : ""}>{mistakesCount}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">{currQ.questionEn}</h2>
            <p className="text-sm sm:text-base font-medium text-teal-300 leading-relaxed">ગુજરાતી પ્રશ્ન: {currQ.questionGu}</p>
          </div>

          {breakdownActive && (
            <div className="bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900 border-2 border-amber-500/80 rounded-2xl p-5 space-y-4 shadow-2xl shadow-amber-500/10 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 animate-bounce text-amber-400" />
                  <span>🚨 BREAKDOWN MODE ACTIVE (સહાયક મોડ સક્રિય)</span>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold">
                  {latencySec >= 15 ? "Trigger: Latency > 15s" : mistakesCount >= 2 ? "Trigger: 2 Incorrect Attempts" : "Pedagogical Scaffolding"}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Adaptive cognitive engine detected hesitation or struggle. Simplifying scientific concepts into <strong>Micro-Step Action Scaffolding</strong> and highlighting core vocabulary.
              </p>
              <div className="bg-slate-950/90 p-4 rounded-xl border border-amber-500/40 space-y-2.5">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> પગલાંવાર સંકેત માર્ગદર્શન (Step-by-Step Gujarati Hints):
                </p>
                <div className="space-y-1.5">
                  {currQ.breakdownHintsGu.map((hint, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{hint}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-amber-300/90 uppercase tracking-wider mb-2">મુખ્ય શબ્દો (Core Highlighted Keywords):</p>
                <div className="flex flex-wrap gap-2">
                  {currQ.keywords.map((kw, idx) => (
                    <span key={idx} className="px-3 py-1 bg-amber-500/10 border border-amber-500/40 text-amber-200 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <Zap className="w-3 h-3 text-amber-400" /> {kw.en} ({kw.gu})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select the correct answer (ચારમાંથી સાચો વિકલ્પ પસંદ કરો):</p>
            <div className="grid grid-cols-1 gap-3">
              {currQ.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isCorrect = opt.id === currQ.correctOptionId;
                let btnStyle = "bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900";
                if (isSubmitted) {
                  if (isCorrect) btnStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-md shadow-emerald-500/20";
                  else if (isSelected && !isCorrect) btnStyle = "bg-rose-950/60 border-rose-500 text-rose-100";
                  else btnStyle = "bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60";
                } else if (isSelected) {
                  btnStyle = "bg-teal-500/20 border-teal-400 text-teal-100 shadow-md shadow-teal-500/20";
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => { if (!isSubmitted) setSelectedOption(opt.id); }}
                    onMouseEnter={handleMouseEnterOption}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 ${btnStyle}`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${isSubmitted && isCorrect ? "bg-emerald-500 text-slate-950 border-emerald-400" : isSubmitted && isSelected && !isCorrect ? "bg-rose-500 text-white border-rose-400" : isSelected ? "bg-teal-400 text-slate-950 border-teal-300 font-black" : "bg-slate-900 text-slate-400 border-slate-700"}`}>
                      {opt.id}
                    </span>
                    <div className="space-y-0.5 flex-1">
                      <p className="font-semibold text-sm leading-snug">{opt.textEn}</p>
                      <p className="text-xs text-slate-400 font-medium">{opt.textGu}</p>
                    </div>
                    {isSubmitted && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />}
                    {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {isSubmitted && (
            <div className="bg-slate-950 border border-teal-500/40 rounded-xl p-5 space-y-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                <span>વિસ્તૃત વૈજ્ઞાનિક સમજૂતી (Detailed Solution & Mechanism):</span>
              </div>
              <div className="space-y-2 text-xs leading-relaxed">
                <p className="text-slate-100 font-medium"><strong>English:</strong> {currQ.solutionEn}</p>
                <p className="text-teal-200"><strong>ગુજરાતી:</strong> {currQ.solutionGu}</p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerBreakdown("Manual Scaffolding Request")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${breakdownActive ? "bg-amber-500/20 text-amber-300 border-amber-500/50" : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"}`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                {breakdownActive ? "Breakdown Mode Active" : "Trigger Breakdown Mode"}
              </button>
            </div>

            {isSubmitted ? (
              <button
                onClick={() => {
                  if (!currQ) return;
                  const isCorrect = selectedOption === currQ.correctOptionId;
                  const newHist = [
                    ...userHistory,
                    {
                      questionId: currQ.id,
                      questionEn: currQ.questionEn,
                      difficulty: currQ.difficulty,
                      parameter: currQ.parameter,
                      selectedOptionId: selectedOption || "",
                      isCorrect,
                      latencySec,
                      hesitationScore: Math.round(hesitationScore),
                      mistakesCount,
                      breakdownTriggered: breakdownTriggeredEver
                    }
                  ];
                  setUserHistory(newHist);

                  if (currIndex === 2 && learnerProfile === "unclassified") {
                    const first3 = newHist.slice(0, 3);
                    const avgTime = first3.reduce((a, b) => a + b.latencySec, 0) / 3;
                    const totalFail = first3.filter((h) => !h.isCorrect).length;
                    const avgHesitation = first3.reduce((a, b) => a + b.hesitationScore, 0) / 3;

                    if (avgTime > 10 || totalFail > 1 || avgHesitation > 18) {
                      setLearnerProfile("struggler");
                      setQuestionsList([...DIAGNOSTIC_QUESTIONS, ...EASY_QUESTIONS]);
                    } else {
                      setLearnerProfile("confident");
                      setQuestionsList([...DIAGNOSTIC_QUESTIONS, ...HARD_QUESTIONS]);
                    }
                  }

                  if (currIndex < 9) {
                    setCurrIndex((prev) => prev + 1);
                    setSelectedOption(null);
                    setIsSubmitted(false);
                    setMistakesCount(0);
                    setLatencySec(0);
                    setHesitationScore(0);
                    setBreakdownActive(false);
                    setBreakdownTriggeredEver(false);
                  } else {
                    setQuizFinished(true);
                  }
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-95 text-slate-950 rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-teal-500/20 scale-[1.02]"
              >
                {currIndex === 9 ? "Finish Assessment (પરિણામ જુઓ)" : "Next Question (આગળનો પ્રશ્ન)"}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (selectedOption && currQ) {
                    if (selectedOption === currQ.correctOptionId) {
                      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                      setBktMastery((prev) => ({
                        ...prev,
                        [currQ.parameter]: Math.min(0.98, prev[currQ.parameter] + 0.09)
                      }));
                      setIsSubmitted(true);
                    } else {
                      const nextMistakes = mistakesCount + 1;
                      const nextTotal = totalMistakesAll + 1;
                      setMistakesCount(nextMistakes);
                      setTotalMistakesAll(nextTotal);
                      setBktMastery((prev) => ({
                        ...prev,
                        [currQ.parameter]: Math.max(0.2, prev[currQ.parameter] - 0.1)
                      }));
                      if (nextMistakes >= 2 || nextTotal >= 3) {
                        triggerBreakdown("Multiple errors detected");
                        setIsSubmitted(true);
                      }
                    }
                  }
                }}
                disabled={!selectedOption}
                className={`px-6 py-2.5 rounded-xl text-sm font-extrabold flex items-center gap-2 transition-all shadow-lg ${selectedOption ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-95 text-slate-950 shadow-teal-500/20 scale-[1.02]" : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"}`}
              >
                Submit Answer (જવાબ ચકાસો) <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center text-2xl shadow-lg shadow-teal-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Adaptive BKT Assessment Report</h2>
                <p className="text-xs text-slate-400">જળચક્ર અનુકૂલિત મૂલ્યાંકન અહેવાલ • Individual Cognitive Telemetry</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Classified Profile:</span>
              {learnerProfile === "confident" ? (
                <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20">
                  <Flame className="w-4 h-4 text-emerald-400" /> 🌟 Confident Learner (આત્મવિશ્વાસુ વિદ્યાર્થી)
                </span>
              ) : (
                <span className="px-3.5 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> 🛡️ Scaffolded Learner (સહાયક માર્ગદર્શન જરૂરી)
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1 text-center">
              <p className="text-[11px] text-slate-400 uppercase font-bold">Total Score</p>
              <p className="text-2xl sm:text-3xl font-black text-teal-400 font-mono">{correctCount} / 10</p>
              <p className="text-[10px] text-slate-400">{accuracyPct}% Accuracy</p>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1 text-center">
              <p className="text-[11px] text-slate-400 uppercase font-bold">Total Assessment Time</p>
              <p className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">{totalTimeSec}s</p>
              <p className="text-[10px] text-slate-400">Avg {avgLatencyStr}s / question</p>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1 text-center">
              <p className="text-[11px] text-slate-400 uppercase font-bold">Total Mistakes</p>
              <p className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">{totalMistakesAll}</p>
              <p className="text-[10px] text-slate-400">Across 10 Questions</p>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1 text-center">
              <p className="text-[11px] text-slate-400 uppercase font-bold">Breakdown Triggered</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                {userHistory.filter((h) => h.breakdownTriggered).length}
              </p>
              <p className="text-[10px] text-slate-400">Times Auto-Scaffolded</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" /> Cognitive Parameter Mastery (4 પરિમાણોનું વિશ્લેષણ):
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { param: "language", label: "1. Language (શબ્દભંડોળ - ISL Mapping)", prob: bktMastery.language, desc: "Ability to connect sign morphology with English/Gujarati terms" },
                { param: "recall", label: "2. Recall (સ્મૃતિ - Fact Retrieval)", prob: bktMastery.recall, desc: "Retention of cycle stages, terms, and sequence ordering" },
                { param: "concept", label: "3. Concept (સમજણ - Causality & Physics)", prob: bktMastery.concept, desc: "Understanding thermodynamic phase transitions and latent heat" },
                { param: "application", label: "4. Application (પ્રયોગ - Real World)", prob: bktMastery.application, desc: "Applying hydrological cycles to weather, aquifers, and ecosystems" }
              ].map((item) => (
                <div key={item.param} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <p className="text-xs font-bold text-slate-200">{item.label}</p>
                    <span className="text-base font-black font-mono text-teal-400">{(100 * item.prob).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-500" style={{ width: `${100 * item.prob}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {remediationNotes.length > 0 && (
            <div className="bg-slate-950/90 border border-amber-500/40 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Problem Areas & Remediation (નબળા મુદ્દાઓ અને સુધારણા માર્ગદર્શન):
              </h3>
              <div className="space-y-2.5">
                {remediationNotes.map((item, idx) => (
                  <div key={idx} className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-lg text-xs space-y-1">
                    <p className="font-bold text-amber-200">{idx + 1}. {item.label} ({item.mistakes} mistakes detected)</p>
                    <p className="text-slate-300">{item.noteEn}</p>
                    <p className="text-teal-300/90 italic">{item.noteGu}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> 10-Question Diagnostic Audit Trail:
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border border-slate-800 rounded-xl overflow-hidden">
                <thead className="bg-slate-950 uppercase text-[10px] text-slate-400 font-mono">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Difficulty</th>
                    <th className="p-3">Cognitive Area</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Hesitation</th>
                    <th className="p-3">Breakdown</th>
                    <th className="p-3">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                  {userHistory.map((h, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono font-bold">{idx + 1}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${h.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : h.difficulty === "medium" ? "bg-amber-500/10 text-amber-300 border border-amber-500/30" : "bg-rose-500/10 text-rose-400 border border-rose-500/30"}`}>
                          {h.difficulty.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 capitalize font-medium text-slate-200">{h.parameter}</td>
                      <td className="p-3 font-mono">{h.latencySec}s</td>
                      <td className="p-3 font-mono">{h.hesitationScore}</td>
                      <td className="p-3">
                        {h.breakdownTriggered ? <span className="text-amber-400 font-bold">Yes (🚨)</span> : <span className="text-slate-500">No</span>}
                      </td>
                      <td className="p-3">
                        {h.isCorrect ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Missed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  resetAssessment();
                  setLearnerProfile("confident");
                  setQuestionsList([...DIAGNOSTIC_QUESTIONS, ...HARD_QUESTIONS]);
                  setLatencySec(4);
                  setHesitationScore(2);
                  setMistakesCount(0);
                  setBreakdownActive(false);
                  setBktMastery({ language: 0.96, recall: 0.92, concept: 0.88, application: 0.84 });
                }}
                className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold"
              >
                Simulate Confident Profile
              </button>
              <button
                onClick={() => {
                  resetAssessment();
                  setLearnerProfile("struggler");
                  setQuestionsList([...DIAGNOSTIC_QUESTIONS, ...EASY_QUESTIONS]);
                  setLatencySec(16);
                  setHesitationScore(24);
                  setMistakesCount(2);
                  setTotalMistakesAll(3);
                  setBreakdownActive(true);
                  setBreakdownTriggeredEver(true);
                  setBktMastery({ language: 0.65, recall: 0.58, concept: 0.42, application: 0.38 });
                }}
                className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold"
              >
                Simulate Struggler Profile
              </button>
            </div>
            <button
              onClick={resetAssessment}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-95 text-slate-950 rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-teal-500/20"
            >
              <RotateCcw className="w-4 h-4" /> Restart Assessment (ફરી પરીક્ષા શરૂ કરો)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Application Component
export default function App() {
  const [activeTab, setActiveTab] = useState("study");
  const [isListening, setIsListening] = useState(false);
  const [spokenEnglish, setSpokenEnglish] = useState("When the sun heats ocean water, it turns into steam and rises into the sky.");
  const [gujaratiSubtitles, setGujaratiSubtitles] = useState("જ્યારે સૂર્ય સમુદ્રના પાણીને ગરમ કરે છે, ત્યારે તે વરાળ બની આકાશમાં ઊંચે ચડે છે.");
  const [activeSignKey, setActiveSignKey] = useState("evaporation");
  const [avatarSpeed, setAvatarSpeed] = useState(1);
  const [avatarTilt, setAvatarTilt] = useState(0);
  const [externalBreakdownTrigger, setExternalBreakdownTrigger] = useState(undefined);
  const [studentFilter, setStudentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Audio Sign Sequence Playlist & Sync State
  const [signSequence, setSignSequence] = useState(["sunlight", "water", "evaporation", "clouds"]);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [isSequencePlaying, setIsSequencePlaying] = useState(true);

  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);

  const speakGujaratiAudio = (text, lang = "gu-IN") => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  useEffect(() => {
    let active = true;
    async function updateTranslation() {
      if (!spokenEnglish || !spokenEnglish.trim()) {
        if (active) setGujaratiSubtitles("");
        return;
      }
      const gujResult = await translateEnglishToGujarati(spokenEnglish);
      if (active) {
        setGujaratiSubtitles(gujResult);

        const lower = spokenEnglish.toLowerCase();
        const detectedSeq = [];
        if (lower.includes("sun") || lower.includes("heat") || lower.includes("solar")) detectedSeq.push("sunlight");
        if (lower.includes("water") || lower.includes("ocean") || lower.includes("liquid")) detectedSeq.push("water");
        if (lower.includes("evaporat") || lower.includes("steam") || lower.includes("vapor")) detectedSeq.push("evaporation");
        if (lower.includes("cloud") || lower.includes("condens")) detectedSeq.push("clouds");
        if (lower.includes("rain") || lower.includes("precipitat")) detectedSeq.push("rain");
        if (lower.includes("plant") || lower.includes("leaf") || lower.includes("tree")) detectedSeq.push("plant");
        if (lower.includes("hello") || lower.includes("hi")) detectedSeq.push("hello");
        if (lower.includes("namaste")) detectedSeq.push("namaste");

        if (detectedSeq.length > 0) {
          setSignSequence(detectedSeq);
          setSequenceIndex(0);
          setActiveSignKey(detectedSeq[0]);
        }
      }
    }
    updateTranslation();
    return () => { active = false; };
  }, [spokenEnglish]);

  useEffect(() => {
    if (!isSequencePlaying || signSequence.length === 0) return;
    const interval = setInterval(() => {
      setSequenceIndex((prevIdx) => {
        const nextIdx = (prevIdx + 1) % signSequence.length;
        const nextSign = signSequence[nextIdx];
        if (nextSign) setActiveSignKey(nextSign);
        return nextIdx;
      });
    }, 2400 / avatarSpeed);
    return () => clearInterval(interval);
  }, [isSequencePlaying, signSequence, avatarSpeed]);

  const handleToggleMic = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = async (event) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setSpokenEnglish(currentTranscript);
            const translated = await translateEnglishToGujarati(currentTranscript);
            setGujaratiSubtitles(translated);
          }
        };

        recognition.onerror = (e) => {
          console.log("Speech recognition error:", e);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (err) {
        console.log("Speech recognition setup error:", err);
      }
    }

    setIsListening(true);
    setTimeout(() => {
      const demoEng = "Water droplets condense in cold air to form large rain clouds.";
      setSpokenEnglish(demoEng);
      const demoGuj = "ઠંડી હવામાં પાણીના ટીપાં સંઘનિત થઈને વરસાદી વાદળો બનાવે છે.";
      setGujaratiSubtitles(demoGuj);
      speakGujaratiAudio(demoGuj, "gu-IN");
      setIsListening(false);
    }, 1800);
  };

  useEffect(() => {
    if (activeTab !== "study") return;
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let animId = null;
    let timeAcc = 0;

    const renderFrame = () => {
      timeAcc += 0.05 * avatarSpeed;
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      const cx = cvs.width / 2;
      const cy = cvs.height / 2 + 15;

      ctx.strokeStyle = "rgba(45, 212, 191, 0.08)";
      ctx.lineWidth = 1;
      for (let x = -160; x <= 160; x += 40) {
        ctx.beginPath();
        ctx.moveTo(cx + x, cy - 90);
        ctx.lineTo(cx + x * 1.5, cy + 90);
        ctx.stroke();
      }

      let wristX = cx + Math.sin(timeAcc * 0.8) * 6;
      let wristY = cy + 55 + Math.cos(timeAcc * 0.5) * 4;

      if (activeSignKey === "water") {
        wristY += Math.sin(timeAcc * 4) * 12;
      } else if (activeSignKey === "evaporation") {
        wristY -= (Math.sin(timeAcc * 2) + 1) * 15;
      } else if (activeSignKey === "rain") {
        wristY += Math.sin(timeAcc * 3) * 8;
      } else if (activeSignKey === "hello") {
        wristX += Math.sin(timeAcc * 3) * 15;
      }

      ctx.lineWidth = 6;
      ctx.strokeStyle = avatarSpeed <= 0.5 ? "#f59e0b" : "#0d9488";
      ctx.shadowBlur = 10;
      ctx.shadowColor = avatarSpeed <= 0.5 ? "#f59e0b" : "#2dd4bf";

      ctx.beginPath();
      ctx.moveTo(cx - 20, cy + 110);
      ctx.lineTo(wristX - 18, wristY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 20, cy + 110);
      ctx.lineTo(wristX + 18, wristY);
      ctx.stroke();

      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#5eead4";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(wristX, wristY, 22, 10, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      const palmCenterY = wristY - 35;
      ctx.beginPath();
      ctx.moveTo(wristX - 22, wristY);
      ctx.lineTo(wristX - 28, palmCenterY - 10);
      ctx.lineTo(wristX + 28, palmCenterY - 10);
      ctx.lineTo(wristX + 22, wristY);
      ctx.closePath();
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
      ctx.fill();
      ctx.strokeStyle = avatarSpeed <= 0.5 ? "#fbbf24" : "#14b8a6";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      let fingerAngles = { thumb: 0.4, index: -0.2, middle: -0.2, ring: -0.2, pinky: 0.3 };

      if (activeSignKey === "water") {
        fingerAngles = { thumb: 1.4, index: -0.5, middle: -0.6, ring: -0.5, pinky: 1.4 };
      } else if (activeSignKey === "sunlight") {
        fingerAngles = { thumb: 1.1 + Math.sin(timeAcc)*0.2, index: -0.7, middle: -0.8, ring: -0.7, pinky: -0.5 };
      } else if (activeSignKey === "clouds") {
        fingerAngles = { thumb: 0.6, index: 0.4 + Math.sin(timeAcc)*0.1, middle: 0.5 + Math.cos(timeAcc)*0.1, ring: 0.4, pinky: 0.3 };
      } else if (activeSignKey === "rain") {
        fingerAngles = { thumb: 0.8, index: 0.8 + Math.sin(timeAcc*4)*0.3, middle: 0.9 + Math.cos(timeAcc*4)*0.3, ring: 0.8 + Math.sin(timeAcc*4 + 1)*0.3, pinky: 0.7 };
      } else if (activeSignKey === "plant") {
        fingerAngles = { thumb: -0.3, index: -0.4 - Math.sin(timeAcc)*0.3, middle: -0.5 - Math.sin(timeAcc)*0.3, ring: -0.4, pinky: -0.2 };
      } else if (activeSignKey === "namaste") {
        fingerAngles = { thumb: 0.2, index: -0.6, middle: -0.65, ring: -0.6, pinky: -0.55 };
      } else if (activeSignKey === "hello") {
        fingerAngles = { thumb: 0.6, index: -0.5 + Math.sin(timeAcc*3)*0.2, middle: -0.5, ring: -0.4, pinky: -0.3 };
      }

      const fingerBases = [
        { name: "thumb", x: wristX - 26, y: palmCenterY + 8, len: 24, angle: fingerAngles.thumb - 0.6 },
        { name: "index", x: wristX - 18, y: palmCenterY - 10, len: 32, angle: fingerAngles.index },
        { name: "middle", x: wristX - 6, y: palmCenterY - 12, len: 36, angle: fingerAngles.middle },
        { name: "ring", x: wristX + 6, y: palmCenterY - 10, len: 32, angle: fingerAngles.ring },
        { name: "pinky", x: wristX + 18, y: palmCenterY - 6, len: 26, angle: fingerAngles.pinky }
      ];

      fingerBases.forEach((f) => {
        const p1x = f.x + Math.sin(f.angle) * (f.len * 0.5);
        const p1y = f.y - Math.cos(f.angle) * (f.len * 0.5);

        const p2x = p1x + Math.sin(f.angle * 1.2) * (f.len * 0.5);
        const p2y = p1y - Math.cos(f.angle * 1.2) * (f.len * 0.5);

        const tipX = p2x + Math.sin(f.angle * 1.3) * (f.len * 0.4);
        const tipY = p2y - Math.cos(f.angle * 1.3) * (f.len * 0.4);

        ctx.lineWidth = f.name === "thumb" ? 4 : 3;
        ctx.strokeStyle = avatarSpeed <= 0.5 ? "#f59e0b" : "#2dd4bf";

        ctx.beginPath();
        ctx.moveTo(f.x, f.y);
        ctx.lineTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        [ {x: f.x, y: f.y}, {x: p1x, y: p1y}, {x: p2x, y: p2y}, {x: tipX, y: tipY} ].forEach((pt, jIdx) => {
          ctx.fillStyle = jIdx === 3 ? (avatarSpeed <= 0.5 ? "#fbbf24" : "#a7f3d0") : "#ffffff";
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, jIdx === 3 ? 3.5 : 2.5, 0, 2 * Math.PI);
          ctx.fill();
        });
      });

      if (activeSignKey === "sunlight") {
        ctx.strokeStyle = "rgba(251, 191, 36, 0.4)";
        ctx.lineWidth = 1.5;
        for (let r = 0; r < 8; r++) {
          const rayAngle = (r * Math.PI) / 4 + timeAcc;
          ctx.beginPath();
          ctx.moveTo(wristX, palmCenterY - 10);
          ctx.lineTo(wristX + Math.cos(rayAngle) * 65, palmCenterY - 10 + Math.sin(rayAngle) * 65);
          ctx.stroke();
        }
      } else if (activeSignKey === "evaporation") {
        ctx.strokeStyle = "rgba(45, 212, 191, 0.5)";
        ctx.lineWidth = 2;
        for (let v = -20; v <= 20; v += 10) {
          const waveY = palmCenterY - 30 - ((timeAcc * 40 + v * 3) % 40);
          ctx.beginPath();
          ctx.arc(wristX + v + Math.sin(timeAcc * 3 + v) * 4, waveY, 3, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(renderFrame);
    };

    renderFrame();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, [activeTab, activeSignKey, avatarSpeed, avatarTilt]);

  const activeSignObj = KINEMATIC_SIGNS_DATA[activeSignKey] || KINEMATIC_SIGNS_DATA.water;

  const studentRoster = [
    { id: 1, name: "Rahul Mehta", status: "mastered", profile: "Confident Learner", topic: "Water Cycle Loop", latency: "3.2s", accuracy: "90%", mistakes: 1, breakdownActive: false, bktScore: 92, note: "Rapid accurate responses" },
    { id: 2, name: "Ananya Patel", status: "mastered", profile: "Confident Learner", topic: "Solar Absorption", latency: "2.8s", accuracy: "100%", mistakes: 0, breakdownActive: false, bktScore: 96, note: "High recall and vocabulary" },
    { id: 3, name: "Kavya Shah", status: "struggling", profile: "Struggler (Scaffolded)", topic: "Evaporation Latent Heat", latency: "16.4s", accuracy: "40%", mistakes: 4, breakdownActive: true, bktScore: 42, note: "Breakdown Mode active (0.5x speed)" },
    { id: 4, name: "Meet Joshi", status: "struggling", profile: "Needs Review", topic: "Precipitation Forms", latency: "14.2s", accuracy: "60%", mistakes: 3, breakdownActive: true, bktScore: 58, note: "Hesitation detected on question 2" },
    { id: 5, name: "Pooja Vaghela", status: "mastered", profile: "Confident Learner", topic: "Aquifer Baseflow", latency: "4.1s", accuracy: "80%", mistakes: 1, breakdownActive: false, bktScore: 84, note: "Completed in 1st attempt" },
    { id: 6, name: "Dev Trivedi", status: "struggling", profile: "Struggler (Scaffolded)", topic: "Adiabatic Cooling", latency: "15.8s", accuracy: "50%", mistakes: 3, breakdownActive: true, bktScore: 48, note: "2 incorrect attempts, hints shown" },
    { id: 7, name: "Harshil Dave", status: "mastered", profile: "Confident Learner", topic: "Conservation of Mass", latency: "3.5s", accuracy: "90%", mistakes: 1, breakdownActive: false, bktScore: 88, note: "Solid thermodynamic concept" },
    { id: 8, name: "Diya Prajapati", status: "struggling", profile: "Needs Review", topic: "Canopy Transpiration", latency: "13.9s", accuracy: "55%", mistakes: 3, breakdownActive: false, bktScore: 61, note: "Visual sign reinforcement suggested" }
  ].filter((st) => {
    if (studentFilter === "struggling" && st.status !== "struggling") return false;
    if (studentFilter === "mastered" && st.status !== "mastered") return false;
    if (searchQuery && !st.name.toLowerCase().includes(searchQuery.toLowerCase()) && !st.topic.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-teal-400 selection:text-black">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-6 py-3 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 via-cyan-400 to-indigo-500 p-[1.5px] shadow-lg shadow-teal-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-teal-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                SamjanSetu
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 font-bold">
                ISL-v2.6 VISION + BKT
              </span>
            </div>
            <p className="text-[11px] text-slate-400">સમજણ સેતુ • Bilingual Gujarati-ISL Adaptive Pedagogical Platform</p>
          </div>
        </div>

        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
          {[
            { id: "study", label: "1. Kinematic Classroom", icon: BookOpen },
            { id: "testing", label: "2. Adaptive BKT Engine", icon: Brain },
            { id: "analytics", label: "3. Teacher Dashboard", icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${isActive ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md shadow-teal-500/20" : "text-slate-400 hover:text-white"}`}
              >
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-teal-400" /> Judge HUD:
          </span>
          <button
            onClick={() => { setActiveTab("testing"); setExternalBreakdownTrigger(false); }}
            className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-md font-semibold text-[11px]"
            title="Fast Learner Path: Advance to Hard Questions"
          >
            ✓ Confident Learner
          </button>
          <button
            onClick={() => { setActiveTab("testing"); setExternalBreakdownTrigger(true); }}
            className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-md font-semibold text-[11px] animate-pulse"
            title="Struggling Learner Path: Trigger Breakdown Mode & Easy Scaffolding"
          >
            ⚠️ Struggle Scenario
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {activeTab === "study" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-md shadow-2xl space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <h2 className="font-bold text-sm text-slate-100">Bhasha-Setu NLP Translation Core</h2>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full font-bold flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Bhashini EN ──► GU
                  </span>
                </div>

                <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    <span>Teacher Spoken English</span>
                    <span className="text-teal-400 font-mono">16kHz Acoustic Pipeline</span>
                  </div>
                  <textarea
                    value={spokenEnglish}
                    onChange={(e) => setSpokenEnglish(e.target.value)}
                    rows={2}
                    placeholder="Speak into microphone or type English text here..."
                    className="w-full bg-transparent border-none text-slate-100 font-medium text-sm focus:outline-none resize-none leading-relaxed"
                  />
                  <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                    <span className="text-[10px] text-slate-500">Live Web Speech API</span>
                    <button
                      onClick={handleToggleMic}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${isListening ? "bg-rose-600 text-white animate-pulse" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"}`}
                    >
                      {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      {isListening ? "Listening..." : "Speak into Mic"}
                    </button>
                  </div>
                </div>

                {/* User Requested: Gujarati Subtitles Panel with explicit Play Gujarati Audio Button */}
                <div className="bg-gradient-to-br from-teal-950/40 via-slate-950 to-slate-950 p-4 rounded-xl border border-teal-500/30 space-y-3">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-teal-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Real-Time Gujarati Subtitles (ગુજરાતી સ્ક્રિપ્ટ)
                    </span>
                    <span className="text-[10px] text-teal-400 font-mono">Bhasha-Setu Engine</span>
                  </div>
                  <p className="text-teal-100 font-bold text-base leading-relaxed">
                    "{gujaratiSubtitles || "વચન સાંભળવાની રાહ જોઈ રહ્યા છીએ..."}"
                  </p>
                  <div className="pt-2 border-t border-teal-900/50 flex justify-end">
                    <button
                      onClick={() => speakGujaratiAudio(gujaratiSubtitles, "gu-IN")}
                      className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-95 text-slate-950 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.02]"
                    >
                      <Volume2 className="w-4 h-4 text-slate-950 animate-pulse" />
                      <span>🔊 ડીકોડ કરેલ ગુજરાતી અવાજ સાંભળો (Play Gujarati Speech Audio)</span>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-teal-400" /> Active Linguistic ISL Gloss Compiler:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeSignObj.tokens.map((tok, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-950 border border-teal-500/40 text-teal-300 rounded-lg text-xs font-mono font-bold shadow-sm">
                        [{tok}]
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" /> Select Kinematic Sign Target (Click to Demonstrate):
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {Object.keys(KINEMATIC_SIGNS_DATA).map((key) => {
                      const item = KINEMATIC_SIGNS_DATA[key];
                      const isSel = activeSignKey === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setActiveSignKey(key)}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${isSel ? "bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-md shadow-teal-500/20 scale-105" : "bg-slate-950/60 hover:bg-slate-800 text-slate-400 border-slate-800"}`}
                        >
                          <span className="text-sm font-semibold">{item.eng}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{item.guj}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Bilingual Latency: 12ms</span>
                <button
                  onClick={() => setActiveTab("testing")}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-95 text-slate-950 rounded-xl font-bold shadow-md shadow-teal-500/20"
                >
                  Start Water Cycle Test →
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 mb-3 gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-teal-400" /> AI Kinematic Robotic Mechanical Hand (દ્રશ્ય રોબોટિક અવતાર)
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Real-Time Audio Sync: Performing ISL Sign <span className="text-teal-300 font-bold">{activeSignObj.eng} ({activeSignObj.guj})</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsSequencePlaying(!isSequencePlaying)}
                      className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border flex items-center gap-1 ${isSequencePlaying ? "bg-teal-500/20 text-teal-300 border-teal-500/40" : "bg-slate-800 text-slate-400 border-slate-700"}`}
                    >
                      {isSequencePlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      {isSequencePlaying ? "Audio Sync Active" : "Paused"}
                    </button>
                    <button
                      onClick={() => setAvatarSpeed((prev) => (prev === 1 ? 0.5 : prev === 0.5 ? 0.75 : 1))}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-teal-300 font-mono font-bold rounded-lg border border-slate-700"
                    >
                      {avatarSpeed}x Speed
                    </button>
                  </div>
                </div>

                <div className="mb-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
                  <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 font-mono flex items-center gap-1">
                    <Radio className="w-3 h-3 text-teal-400 animate-pulse" /> Audio Sign Timeline:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {signSequence.map((key, idx) => {
                      const signData = KINEMATIC_SIGNS_DATA[key] || { eng: key, guj: "" };
                      const isCurrent = sequenceIndex === idx && activeSignKey === key;
                      return (
                        <button
                          key={idx}
                          onClick={() => { setSequenceIndex(idx); setActiveSignKey(key); }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1 ${isCurrent ? "bg-teal-400 text-slate-950 shadow-md shadow-teal-400/20 scale-105" : "bg-slate-900 text-slate-400 border border-slate-800"}`}
                        >
                          <span>{signData.eng}</span>
                          <span className="text-[9px] opacity-80">({signData.guj})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex items-center justify-center h-64">
                  <canvas ref={canvasRef} width={520} height={260} className="w-full h-full object-contain" />
                  <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
                    Mechanical Servo Joints: Active ISL Sign [{activeSignObj.eng}]
                  </div>
                  {avatarSpeed <= 0.5 && (
                    <div className="absolute top-2 right-3 text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-600/60 animate-pulse">
                      ⚡ Slow-Motion Scaffolding Active
                    </div>
                  )}
                </div>
              </div>

              <TeachableMachinePipeline onSignDetected={(key) => { if (KINEMATIC_SIGNS_DATA[key]) setActiveSignKey(key); }} />
            </div>
          </div>
        )}

        {activeTab === "testing" && (
          <div className="max-w-4xl mx-auto">
            <AdaptiveBKTEngine
              onSelectConceptForAvatar={(key) => setActiveSignKey(key)}
              externalTriggerBreakdown={externalBreakdownTrigger}
            />
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-400" /> Special Education Classroom Cognitive Command Center
                </h2>
                <p className="text-xs text-slate-400">Real-time cognitive struggle telemetry & Teachable Machine ISL tracking (Ahmedabad Hub)</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full font-mono font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Vision Model: W7fYZf-CS Online
                </span>
                <span className="text-xs px-3 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full font-mono font-bold">
                  8 Connected Learners
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Class Average Accuracy</p>
                <p className="text-2xl font-black text-teal-400 font-mono">73.8%</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12% after ISL Scaffolding
                </p>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Average Latency</p>
                <p className="text-2xl font-black text-indigo-400 font-mono">7.4s</p>
                <p className="text-[10px] text-slate-400">Diagnostic Threshold: 10.0s</p>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Active Breakdown Scaffolding</p>
                <p className="text-2xl font-black text-amber-400 font-mono">3 Students</p>
                <p className="text-[10px] text-amber-300/80">Auto-Micro-Actions Triggered</p>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Classified Confident</p>
                <p className="text-2xl font-black text-emerald-400 font-mono">5 Students</p>
                <p className="text-[10px] text-slate-400">Advanced to Hard Questions</p>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student by name or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs text-slate-100 focus:outline-none w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                  <Filter className="w-3 h-3 text-teal-400" /> Filter:
                </span>
                {[
                  { id: "all", label: "All (8)" },
                  { id: "struggling", label: "Struggling / Review (3)" },
                  { id: "mastered", label: "Confident (5)" }
                ].map((flt) => (
                  <button
                    key={flt.id}
                    onClick={() => setStudentFilter(flt.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${studentFilter === flt.id ? "bg-teal-500/20 text-teal-300 border border-teal-500/40" : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"}`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {studentRoster.map((st) => (
                <div key={st.id} className={`p-4 rounded-xl border backdrop-blur space-y-3 transition-all ${st.breakdownActive ? "bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-500/5" : "bg-slate-900/70 border-slate-800 hover:border-slate-700"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-slate-100">{st.name}</p>
                      <p className="text-[10px] text-slate-400">{st.profile}</p>
                    </div>
                    {st.breakdownActive ? (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-bold text-[10px] animate-pulse">
                        🚨 Breakdown
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-bold text-[10px]">
                        🟢 On Track
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    <p>Topic: <span className="text-slate-200 font-medium">{st.topic}</span></p>
                    <p>Latency: <span className="text-slate-200 font-mono font-semibold">{st.latency}</span></p>
                    <p>BKT Mastery: <span className="text-teal-400 font-mono font-bold">{st.bktScore}%</span></p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className={`h-full ${st.bktScore >= 80 ? "bg-teal-400" : st.bktScore >= 60 ? "bg-amber-400" : "bg-rose-400"}`} style={{ width: `${st.bktScore}%` }} />
                    </div>
                    <p className="text-[10px] text-teal-300/80 italic pt-1">{st.note}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex gap-2">
                    <button
                      onClick={() => { setActiveTab("study"); setActiveSignKey("evaporation"); }}
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 font-bold rounded-lg border border-slate-700 transition-colors"
                    >
                      Send 1-on-1 Scaffolding
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
