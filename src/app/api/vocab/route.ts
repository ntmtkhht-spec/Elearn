import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'

type StarterCard = { word: string; translation: string; pronunciation: string; partOfSpeech: string; exampleSentence: string; exampleTranslation: string; difficulty: number }
type StarterDeck = { name: string; description: string; level: string; category: string; icon: string; cards: StarterCard[] }

const STARTER_DECKS: StarterDeck[] = [
  {
    name: 'First Words', description: 'Essential beginner words for everyday communication', level: 'A1', category: 'Basics', icon: '🌱',
    cards: [
      { word: 'Water', translation: 'Wasser', pronunciation: '/ˈwɔːtər/', partOfSpeech: 'noun', exampleSentence: 'Can I have some water, please?', exampleTranslation: 'Kann ich etwas Wasser haben, bitte?', difficulty: 1 },
      { word: 'Food', translation: 'Essen / Nahrung', pronunciation: '/fuːd/', partOfSpeech: 'noun', exampleSentence: 'The food here is delicious.', exampleTranslation: 'Das Essen hier ist köstlich.', difficulty: 1 },
      { word: 'House', translation: 'Haus', pronunciation: '/haʊs/', partOfSpeech: 'noun', exampleSentence: 'My house has three rooms.', exampleTranslation: 'Mein Haus hat drei Zimmer.', difficulty: 1 },
      { word: 'Car', translation: 'Auto', pronunciation: '/kɑːr/', partOfSpeech: 'noun', exampleSentence: 'I drive my car to work.', exampleTranslation: 'Ich fahre mit meinem Auto zur Arbeit.', difficulty: 1 },
      { word: 'Big', translation: 'Groß', pronunciation: '/bɪɡ/', partOfSpeech: 'adjective', exampleSentence: 'That is a very big dog.', exampleTranslation: 'Das ist ein sehr großer Hund.', difficulty: 1 },
      { word: 'Small', translation: 'Klein', pronunciation: '/smɔːl/', partOfSpeech: 'adjective', exampleSentence: 'She lives in a small apartment.', exampleTranslation: 'Sie lebt in einer kleinen Wohnung.', difficulty: 1 },
      { word: 'Go', translation: 'Gehen / Fahren', pronunciation: '/ɡoʊ/', partOfSpeech: 'verb', exampleSentence: 'Let\'s go to the park.', exampleTranslation: 'Gehen wir in den Park.', difficulty: 1 },
      { word: 'Eat', translation: 'Essen', pronunciation: '/iːt/', partOfSpeech: 'verb', exampleSentence: 'I eat breakfast every morning.', exampleTranslation: 'Ich esse jeden Morgen Frühstück.', difficulty: 1 },
      { word: 'Good', translation: 'Gut', pronunciation: '/ɡʊd/', partOfSpeech: 'adjective', exampleSentence: 'This is a good idea.', exampleTranslation: 'Das ist eine gute Idee.', difficulty: 1 },
      { word: 'Day', translation: 'Tag', pronunciation: '/deɪ/', partOfSpeech: 'noun', exampleSentence: 'Have a nice day!', exampleTranslation: 'Schönen Tag noch!', difficulty: 1 },
      { word: 'Time', translation: 'Zeit', pronunciation: '/taɪm/', partOfSpeech: 'noun', exampleSentence: 'What time is it?', exampleTranslation: 'Wie viel Uhr ist es?', difficulty: 1 },
      { word: 'Work', translation: 'Arbeit / arbeiten', pronunciation: '/wɜːrk/', partOfSpeech: 'noun/verb', exampleSentence: 'I work in an office.', exampleTranslation: 'Ich arbeite in einem Büro.', difficulty: 1 },
    ],
  },
  {
    name: 'Greetings & Introductions', description: 'Learn to greet, introduce yourself, and say goodbye', level: 'A1', category: 'Daily', icon: '👋',
    cards: [
      { word: 'Hello', translation: 'Hallo', pronunciation: '/həˈloʊ/', partOfSpeech: 'interjection', exampleSentence: 'Hello, my name is Anna.', exampleTranslation: 'Hallo, mein Name ist Anna.', difficulty: 1 },
      { word: 'Goodbye', translation: 'Auf Wiedersehen', pronunciation: '/ɡʊdˈbaɪ/', partOfSpeech: 'interjection', exampleSentence: 'Goodbye, see you tomorrow!', exampleTranslation: 'Auf Wiedersehen, bis morgen!', difficulty: 1 },
      { word: 'Nice to meet you', translation: 'Schön, Sie kennenzulernen', pronunciation: '/naɪs tuː miːt juː/', partOfSpeech: 'phrase', exampleSentence: 'Nice to meet you, I\'m Tom.', exampleTranslation: 'Schön, Sie kennenzulernen, ich bin Tom.', difficulty: 1 },
      { word: 'How are you?', translation: 'Wie geht es Ihnen?', pronunciation: '/haʊ ɑːr juː/', partOfSpeech: 'phrase', exampleSentence: 'How are you today?', exampleTranslation: 'Wie geht es Ihnen heute?', difficulty: 1 },
      { word: 'My name is', translation: 'Mein Name ist', pronunciation: '/maɪ neɪm ɪz/', partOfSpeech: 'phrase', exampleSentence: 'My name is Maria. What\'s yours?', exampleTranslation: 'Mein Name ist Maria. Wie heißen Sie?', difficulty: 1 },
      { word: 'Please', translation: 'Bitte', pronunciation: '/pliːz/', partOfSpeech: 'adverb', exampleSentence: 'Could you help me, please?', exampleTranslation: 'Könnten Sie mir helfen, bitte?', difficulty: 1 },
      { word: 'Thank you', translation: 'Danke', pronunciation: '/θæŋk juː/', partOfSpeech: 'phrase', exampleSentence: 'Thank you for your help.', exampleTranslation: 'Danke für Ihre Hilfe.', difficulty: 1 },
      { word: 'Sorry', translation: 'Entschuldigung', pronunciation: '/ˈsɒri/', partOfSpeech: 'interjection', exampleSentence: 'Sorry, I didn\'t understand that.', exampleTranslation: 'Entschuldigung, ich habe das nicht verstanden.', difficulty: 1 },
      { word: 'Good morning', translation: 'Guten Morgen', pronunciation: '/ɡʊd ˈmɔːrnɪŋ/', partOfSpeech: 'phrase', exampleSentence: 'Good morning! Did you sleep well?', exampleTranslation: 'Guten Morgen! Haben Sie gut geschlafen?', difficulty: 1 },
      { word: 'Good night', translation: 'Gute Nacht', pronunciation: '/ɡʊd naɪt/', partOfSpeech: 'phrase', exampleSentence: 'Good night, sleep well!', exampleTranslation: 'Gute Nacht, schlaf gut!', difficulty: 1 },
    ],
  },
  {
    name: 'Daily Routines', description: 'Words and phrases for talking about your day', level: 'A2', category: 'Daily', icon: '🌞',
    cards: [
      { word: 'Wake up', translation: 'Aufwachen', pronunciation: '/weɪk ʌp/', partOfSpeech: 'phrasal verb', exampleSentence: 'I wake up at seven every morning.', exampleTranslation: 'Ich wache jeden Morgen um sieben auf.', difficulty: 1 },
      { word: 'Breakfast', translation: 'Frühstück', pronunciation: '/ˈbrekfəst/', partOfSpeech: 'noun', exampleSentence: 'I have breakfast before work.', exampleTranslation: 'Ich frühstücke vor der Arbeit.', difficulty: 1 },
      { word: 'Commute', translation: 'Pendeln / Arbeitsweg', pronunciation: '/kəˈmjuːt/', partOfSpeech: 'verb/noun', exampleSentence: 'My commute takes 30 minutes.', exampleTranslation: 'Mein Arbeitsweg dauert 30 Minuten.', difficulty: 2 },
      { word: 'Lunch break', translation: 'Mittagspause', pronunciation: '/lʌntʃ breɪk/', partOfSpeech: 'noun', exampleSentence: 'We have an hour for lunch break.', exampleTranslation: 'Wir haben eine Stunde Mittagspause.', difficulty: 1 },
      { word: 'Finish work', translation: 'Feierabend machen', pronunciation: '/ˈfɪnɪʃ wɜːrk/', partOfSpeech: 'phrase', exampleSentence: 'I usually finish work at six.', exampleTranslation: 'Ich mache normalerweise um sechs Feierabend.', difficulty: 1 },
      { word: 'Cook dinner', translation: 'Abendessen kochen', pronunciation: '/kʊk ˈdɪnər/', partOfSpeech: 'phrase', exampleSentence: 'I cook dinner for my family.', exampleTranslation: 'Ich koche das Abendessen für meine Familie.', difficulty: 1 },
      { word: 'Go to bed', translation: 'Ins Bett gehen', pronunciation: '/ɡoʊ tuː bed/', partOfSpeech: 'phrase', exampleSentence: 'I go to bed at ten o\'clock.', exampleTranslation: 'Ich gehe um zehn Uhr ins Bett.', difficulty: 1 },
      { word: 'Get dressed', translation: 'Sich anziehen', pronunciation: '/ɡet drest/', partOfSpeech: 'phrase', exampleSentence: 'I get dressed after showering.', exampleTranslation: 'Ich ziehe mich nach dem Duschen an.', difficulty: 1 },
      { word: 'Exercise', translation: 'Sport machen / Übung', pronunciation: '/ˈeksərsaɪz/', partOfSpeech: 'verb/noun', exampleSentence: 'I exercise three times a week.', exampleTranslation: 'Ich mache dreimal pro Woche Sport.', difficulty: 2 },
      { word: 'Relax', translation: 'Entspannen', pronunciation: '/rɪˈlæks/', partOfSpeech: 'verb', exampleSentence: 'I relax by reading books in the evening.', exampleTranslation: 'Ich entspanne mich abends beim Lesen.', difficulty: 1 },
    ],
  },
  {
    name: 'Shopping & Food', description: 'Vocabulary for restaurants, shops, and groceries', level: 'A2', category: 'Food', icon: '🛒',
    cards: [
      { word: 'Receipt', translation: 'Kassenbon / Quittung', pronunciation: '/rɪˈsiːt/', partOfSpeech: 'noun', exampleSentence: 'Can I have the receipt, please?', exampleTranslation: 'Kann ich den Kassenbon haben, bitte?', difficulty: 2 },
      { word: 'Discount', translation: 'Rabatt', pronunciation: '/ˈdɪskaʊnt/', partOfSpeech: 'noun', exampleSentence: 'There is a 20% discount on all shoes.', exampleTranslation: 'Es gibt 20% Rabatt auf alle Schuhe.', difficulty: 2 },
      { word: 'Menu', translation: 'Speisekarte', pronunciation: '/ˈmenjuː/', partOfSpeech: 'noun', exampleSentence: 'Can I see the menu, please?', exampleTranslation: 'Kann ich die Speisekarte sehen, bitte?', difficulty: 1 },
      { word: 'Order', translation: 'Bestellen / Bestellung', pronunciation: '/ˈɔːrdər/', partOfSpeech: 'verb/noun', exampleSentence: 'I would like to order the pasta.', exampleTranslation: 'Ich würde gerne die Pasta bestellen.', difficulty: 1 },
      { word: 'Bill', translation: 'Rechnung', pronunciation: '/bɪl/', partOfSpeech: 'noun', exampleSentence: 'Could we have the bill, please?', exampleTranslation: 'Könnten wir die Rechnung haben, bitte?', difficulty: 1 },
      { word: 'Aisle', translation: 'Gang / Reihe', pronunciation: '/aɪl/', partOfSpeech: 'noun', exampleSentence: 'The bread is in aisle three.', exampleTranslation: 'Das Brot ist im dritten Gang.', difficulty: 2 },
      { word: 'Checkout', translation: 'Kasse', pronunciation: '/ˈtʃekaʊt/', partOfSpeech: 'noun', exampleSentence: 'Please go to checkout number five.', exampleTranslation: 'Bitte gehen Sie zur Kasse Nummer fünf.', difficulty: 1 },
      { word: 'Fresh', translation: 'Frisch', pronunciation: '/freʃ/', partOfSpeech: 'adjective', exampleSentence: 'I only buy fresh vegetables.', exampleTranslation: 'Ich kaufe nur frisches Gemüse.', difficulty: 1 },
      { word: 'Ingredient', translation: 'Zutat', pronunciation: '/ɪnˈɡriːdiənt/', partOfSpeech: 'noun', exampleSentence: 'What ingredients do you need for this recipe?', exampleTranslation: 'Welche Zutaten brauchst du für dieses Rezept?', difficulty: 2 },
      { word: 'Tip', translation: 'Trinkgeld', pronunciation: '/tɪp/', partOfSpeech: 'noun', exampleSentence: 'We left a 10% tip for the waiter.', exampleTranslation: 'Wir haben dem Kellner 10% Trinkgeld gegeben.', difficulty: 1 },
    ],
  },
  {
    name: 'Travel & Tourism', description: 'Words and phrases for traveling abroad', level: 'B1', category: 'Travel', icon: '✈️',
    cards: [
      { word: 'Itinerary', translation: 'Reiseplan / Reiseroute', pronunciation: '/aɪˈtɪnəreri/', partOfSpeech: 'noun', exampleSentence: 'Let me check our itinerary for the trip.', exampleTranslation: 'Lass mich unseren Reiseplan für die Reise überprüfen.', difficulty: 3 },
      { word: 'Passport', translation: 'Reisepass', pronunciation: '/ˈpæspɔːrt/', partOfSpeech: 'noun', exampleSentence: 'Don\'t forget to bring your passport.', exampleTranslation: 'Vergiss nicht, deinen Reisepass mitzubringen.', difficulty: 1 },
      { word: 'Boarding pass', translation: 'Boardingkarte', pronunciation: '/ˈbɔːrdɪŋ pæs/', partOfSpeech: 'noun', exampleSentence: 'Please have your boarding pass ready.', exampleTranslation: 'Bitte halten Sie Ihre Boardingkarte bereit.', difficulty: 2 },
      { word: 'Check in', translation: 'Einchecken', pronunciation: '/tʃek ɪn/', partOfSpeech: 'phrasal verb', exampleSentence: 'We need to check in two hours before the flight.', exampleTranslation: 'Wir müssen zwei Stunden vor dem Flug einchecken.', difficulty: 1 },
      { word: 'Customs', translation: 'Zoll', pronunciation: '/ˈkʌstəmz/', partOfSpeech: 'noun', exampleSentence: 'We had to wait at customs for an hour.', exampleTranslation: 'Wir mussten eine Stunde beim Zoll warten.', difficulty: 2 },
      { word: 'Accommodation', translation: 'Unterkunft', pronunciation: '/əˌkɒməˈdeɪʃən/', partOfSpeech: 'noun', exampleSentence: 'We booked our accommodation in advance.', exampleTranslation: 'Wir haben unsere Unterkunft im Voraus gebucht.', difficulty: 3 },
      { word: 'Sightseeing', translation: 'Sightseeing / Besichtigungen', pronunciation: '/ˈsaɪtsiːɪŋ/', partOfSpeech: 'noun', exampleSentence: 'We spent the day sightseeing in Rome.', exampleTranslation: 'Wir verbrachten den Tag mit Sightseeing in Rom.', difficulty: 2 },
      { word: 'Currency exchange', translation: 'Geldwechsel', pronunciation: '/ˈkʌrənsi ɪksˈtʃeɪndʒ/', partOfSpeech: 'noun', exampleSentence: 'Where is the nearest currency exchange?', exampleTranslation: 'Wo ist der nächste Geldwechsel?', difficulty: 2 },
      { word: 'Delay', translation: 'Verspätung', pronunciation: '/dɪˈleɪ/', partOfSpeech: 'noun/verb', exampleSentence: 'The flight had a two-hour delay.', exampleTranslation: 'Der Flug hatte eine zweistündige Verspätung.', difficulty: 2 },
      { word: 'Local', translation: 'Einheimisch / Einheimischer', pronunciation: '/ˈloʊkəl/', partOfSpeech: 'adjective/noun', exampleSentence: 'Ask a local for restaurant recommendations.', exampleTranslation: 'Frag einen Einheimischen nach Restaurantempfehlungen.', difficulty: 1 },
    ],
  },
  {
    name: 'Business English', description: 'Essential vocabulary for professional environments', level: 'B2', category: 'Business', icon: '💼',
    cards: [
      { word: 'Deadline', translation: 'Frist / Abgabetermin', pronunciation: '/ˈdedlaɪn/', partOfSpeech: 'noun', exampleSentence: 'The deadline for this project is Friday.', exampleTranslation: 'Die Frist für dieses Projekt ist Freitag.', difficulty: 2 },
      { word: 'Meeting agenda', translation: 'Tagesordnung', pronunciation: '/ˈmiːtɪŋ əˈdʒendə/', partOfSpeech: 'noun', exampleSentence: 'Please review the meeting agenda before tomorrow.', exampleTranslation: 'Bitte überprüfen Sie die Tagesordnung vor morgen.', difficulty: 2 },
      { word: 'Negotiate', translation: 'Verhandeln', pronunciation: '/nɪˈɡoʊʃieɪt/', partOfSpeech: 'verb', exampleSentence: 'We need to negotiate better terms with the supplier.', exampleTranslation: 'Wir müssen bessere Konditionen mit dem Lieferanten verhandeln.', difficulty: 3 },
      { word: 'Stakeholder', translation: 'Interessenvertreter / Beteiligter', pronunciation: '/ˈsteɪkhoʊldər/', partOfSpeech: 'noun', exampleSentence: 'All stakeholders must approve the new strategy.', exampleTranslation: 'Alle Beteiligten müssen der neuen Strategie zustimmen.', difficulty: 2 },
      { word: 'Revenue', translation: 'Umsatz / Einnahmen', pronunciation: '/ˈrevənjuː/', partOfSpeech: 'noun', exampleSentence: 'Our revenue increased by 15% this quarter.', exampleTranslation: 'Unser Umsatz stieg in diesem Quartal um 15%.', difficulty: 3 },
      { word: 'Follow up', translation: 'Nachfassen / Nachverfolgen', pronunciation: '/ˈfɒloʊ ʌp/', partOfSpeech: 'phrasal verb', exampleSentence: 'I will follow up with the client next week.', exampleTranslation: 'Ich werde nächste Woche beim Kunden nachfassen.', difficulty: 2 },
      { word: 'Proposal', translation: 'Angebot / Vorschlag', pronunciation: '/prəˈpoʊzəl/', partOfSpeech: 'noun', exampleSentence: 'Please send the proposal by end of day.', exampleTranslation: 'Bitte senden Sie das Angebot bis Ende des Tages.', difficulty: 2 },
      { word: 'Quarterly', translation: 'Vierteljährlich', pronunciation: '/ˈkwɔːrtərli/', partOfSpeech: 'adjective/adverb', exampleSentence: 'We have quarterly reviews with all departments.', exampleTranslation: 'Wir haben vierteljährliche Überprüfungen mit allen Abteilungen.', difficulty: 3 },
      { word: 'Budget', translation: 'Budget / Haushalt', pronunciation: '/ˈbʌdʒɪt/', partOfSpeech: 'noun', exampleSentence: 'We need to stay within our budget.', exampleTranslation: 'Wir müssen im Rahmen unseres Budgets bleiben.', difficulty: 2 },
      { word: 'Leverage', translation: 'Nutzen / Hebelwirkung', pronunciation: '/ˈlevərɪdʒ/', partOfSpeech: 'verb/noun', exampleSentence: 'We can leverage our brand reputation to enter new markets.', exampleTranslation: 'Wir können unseren Markenruf nutzen, um neue Märkte zu erschließen.', difficulty: 3 },
    ],
  },
  {
    name: 'Idioms & Phrasals', description: 'Common idiomatic expressions and phrasal verbs', level: 'C1', category: 'Idioms', icon: '🧠',
    cards: [
      { word: 'Hit the nail on the head', translation: 'Den Nagel auf den Kopf treffen', pronunciation: '/hɪt ðə neɪl ɒn ðə hed/', partOfSpeech: 'idiom', exampleSentence: 'You hit the nail on the head — that\'s exactly the problem.', exampleTranslation: 'Du hast den Nagel auf den Kopf getroffen — das ist genau das Problem.', difficulty: 3 },
      { word: 'Bite the bullet', translation: 'In den sauren Apfel beißen', pronunciation: '/baɪt ðə ˈbʊlɪt/', partOfSpeech: 'idiom', exampleSentence: 'Just bite the bullet and go to the dentist.', exampleTranslation: 'Beiß einfach in den sauren Apfel und geh zum Zahnarzt.', difficulty: 3 },
      { word: 'Break down', translation: 'Zusammenbrechen / Aufschlüsseln', pronunciation: '/breɪk daʊn/', partOfSpeech: 'phrasal verb', exampleSentence: 'The car broke down on the motorway.', exampleTranslation: 'Das Auto ist auf der Autobahn liegengeblieben.', difficulty: 2 },
      { word: 'Spill the beans', translation: 'Etwas ausplaudern', pronunciation: '/spɪl ðə biːnz/', partOfSpeech: 'idiom', exampleSentence: 'Don\'t spill the beans about the surprise party.', exampleTranslation: 'Plaudere nichts über die Überraschungsparty aus.', difficulty: 3 },
      { word: 'Give up', translation: 'Aufgeben', pronunciation: '/ɡɪv ʌp/', partOfSpeech: 'phrasal verb', exampleSentence: 'Never give up on your dreams.', exampleTranslation: 'Gib niemals deine Träume auf.', difficulty: 1 },
      { word: 'Under the weather', translation: 'Sich nicht gut fühlen', pronunciation: '/ˈʌndər ðə ˈweðər/', partOfSpeech: 'idiom', exampleSentence: 'I\'m feeling a bit under the weather today.', exampleTranslation: 'Ich fühle mich heute nicht ganz wohl.', difficulty: 3 },
      { word: 'Look into', translation: 'Untersuchen / Nachforschen', pronunciation: '/lʊk ˈɪntuː/', partOfSpeech: 'phrasal verb', exampleSentence: 'The police will look into the matter.', exampleTranslation: 'Die Polizei wird die Angelegenheit untersuchen.', difficulty: 2 },
      { word: 'Cost an arm and a leg', translation: 'Ein Vermögen kosten', pronunciation: '/kɒst ən ɑːrm ænd ə leɡ/', partOfSpeech: 'idiom', exampleSentence: 'That handbag costs an arm and a leg.', exampleTranslation: 'Diese Handtasche kostet ein Vermögen.', difficulty: 3 },
      { word: 'Run out of', translation: 'Ausgehen / Aufbrauchen', pronunciation: '/rʌn aʊt ɒv/', partOfSpeech: 'phrasal verb', exampleSentence: 'We ran out of coffee this morning.', exampleTranslation: 'Uns ist heute Morgen der Kaffee ausgegangen.', difficulty: 2 },
      { word: 'Once in a blue moon', translation: 'Alle Jubeljahre / Sehr selten', pronunciation: '/wʌns ɪn ə bluː muːn/', partOfSpeech: 'idiom', exampleSentence: 'He visits his family once in a blue moon.', exampleTranslation: 'Er besucht seine Familie alle Jubeljahre.', difficulty: 3 },
    ],
  },
  {
    name: 'Academic English', description: 'Formal vocabulary for academic writing and presentations', level: 'C1', category: 'Academic', icon: '🎓',
    cards: [
      { word: 'Hypothesis', translation: 'Hypothese', pronunciation: '/haɪˈpɒθɪsɪs/', partOfSpeech: 'noun', exampleSentence: 'The researcher formulated a clear hypothesis.', exampleTranslation: 'Der Forscher formulierte eine klare Hypothese.', difficulty: 3 },
      { word: 'Methodology', translation: 'Methodik / Vorgehensweise', pronunciation: '/ˌmeθəˈdɒlədʒi/', partOfSpeech: 'noun', exampleSentence: 'The paper describes the research methodology in detail.', exampleTranslation: 'Die Arbeit beschreibt die Forschungsmethodik im Detail.', difficulty: 3 },
      { word: 'Argue', translation: 'Argumentieren / Darlegen', pronunciation: '/ˈɑːrɡjuː/', partOfSpeech: 'verb', exampleSentence: 'The author argues that climate change is accelerating.', exampleTranslation: 'Der Autor argumentiert, dass der Klimawandel sich beschleunigt.', difficulty: 2 },
      { word: 'Evidence', translation: 'Beweis / Belege', pronunciation: '/ˈevɪdəns/', partOfSpeech: 'noun', exampleSentence: 'There is strong evidence to support this theory.', exampleTranslation: 'Es gibt starke Belege, die diese Theorie stützen.', difficulty: 2 },
      { word: 'Critique', translation: 'Kritik / Kritisieren', pronunciation: '/krɪˈtiːk/', partOfSpeech: 'noun/verb', exampleSentence: 'The essay critiques the existing literature.', exampleTranslation: 'Der Aufsatz kritisiert die bestehende Literatur.', difficulty: 3 },
      { word: 'Significant', translation: 'Bedeutsam / Signifikant', pronunciation: '/sɪɡˈnɪfɪkənt/', partOfSpeech: 'adjective', exampleSentence: 'The results show a significant improvement.', exampleTranslation: 'Die Ergebnisse zeigen eine signifikante Verbesserung.', difficulty: 2 },
      { word: 'Furthermore', translation: 'Darüber hinaus / Außerdem', pronunciation: '/ˈfɜːrðərmɔːr/', partOfSpeech: 'adverb', exampleSentence: 'Furthermore, the study reveals unexpected patterns.', exampleTranslation: 'Darüber hinaus zeigt die Studie unerwartete Muster.', difficulty: 2 },
      { word: 'Implication', translation: 'Implikation / Folgerung', pronunciation: '/ˌɪmplɪˈkeɪʃən/', partOfSpeech: 'noun', exampleSentence: 'What are the implications of these findings?', exampleTranslation: 'Was sind die Implikationen dieser Erkenntnisse?', difficulty: 3 },
      { word: 'Acknowledge', translation: 'Anerkennen / Einräumen', pronunciation: '/əkˈnɒlɪdʒ/', partOfSpeech: 'verb', exampleSentence: 'We must acknowledge the limitations of this study.', exampleTranslation: 'Wir müssen die Einschränkungen dieser Studie anerkennen.', difficulty: 3 },
      { word: 'Conclude', translation: 'Schlussfolgern / Abschließen', pronunciation: '/kənˈkluːd/', partOfSpeech: 'verb', exampleSentence: 'The researchers concluded that the treatment was effective.', exampleTranslation: 'Die Forscher kamen zu dem Schluss, dass die Behandlung wirksam war.', difficulty: 2 },
    ],
  },
]

async function seedStarterDecks(userId: string) {
  const { db } = await import('@/lib/db')

  // Check if user has any decks WITH cards — if so, skip seeding
  const decksWithCards = await db.vocabDeck.count({
    where: { userId, cards: { some: {} } },
  })
  if (decksWithCards > 0) return

  // Delete empty decks (from old seed without cards) and recreate with cards
  await db.vocabDeck.deleteMany({ where: { userId } })

  for (const { cards, ...deck } of STARTER_DECKS) {
    await db.vocabDeck.create({
      data: {
        ...deck,
        userId,
        cards: {
          create: cards.map(card => ({ ...card })),
        },
      },
    })
  }
}

export async function GET() {
  const userId = await getUserId()

  try {
    const { db } = await import('@/lib/db')

    if (userId) {
      await seedStarterDecks(userId)
    }

    const decks = await db.vocabDeck.findMany({
      where: userId ? {
        OR: [
          { userId },
          { userId: null }
        ]
      } : { userId: null },
      include: {
        _count: { select: { cards: true } },
        cards: {
          select: {
            progress: {
              where: userId ? { userId } : undefined,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const decksWithProgress = decks.map(({ cards, ...deck }) => {
      let newCards = 0
      let learningCards = 0
      let reviewCards = 0
      
      const now = new Date()

      for (const card of cards) {
        if (!card.progress || card.progress.length === 0) {
          newCards++
        } else {
          const p = card.progress[0]
          if (p.status === 'learning' || p.status === 'relearning') {
            learningCards++
          } else if (p.status === 'review' && new Date(p.nextReviewAt) <= now) {
            reviewCards++
          } else if (p.status === 'new') {
            newCards++
          }
        }
      }

      return {
        ...deck,
        newCards,
        learningCards,
        reviewCards,
        masteredCards: cards.filter(c => c.progress.length > 0 && c.progress[0].status === 'mastered').length,
      }
    })

    return NextResponse.json(decksWithProgress)
  } catch {
    return NextResponse.json([])
  }
}

