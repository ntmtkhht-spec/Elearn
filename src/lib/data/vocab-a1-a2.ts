import { VocabCard } from '@/lib/store'

export type PredefinedDeck = {
  name: string
  description: string
  level: string
  category: string
  icon: string
  cards: Omit<VocabCard, 'id' | 'deckId' | 'progress'>[]
}

export const EXTRA_DECKS_A1_A2: PredefinedDeck[] = [
  // A1
  {
    name: 'Colors & Shapes',
    description: 'Basic colors and geometric shapes',
    level: 'A1',
    category: 'Basics',
    icon: '🎨',
    cards: [
      { word: 'Red', translation: 'Rot', pronunciation: '/rɛd/', partOfSpeech: 'adjective', exampleSentence: 'The apple is red.', exampleTranslation: 'Der Apfel ist rot.', difficulty: 1, notes: null },
      { word: 'Blue', translation: 'Blau', pronunciation: '/bluː/', partOfSpeech: 'adjective', exampleSentence: 'The sky is blue.', exampleTranslation: 'Der Himmel ist blau.', difficulty: 1, notes: null },
      { word: 'Green', translation: 'Grün', pronunciation: '/ɡriːn/', partOfSpeech: 'adjective', exampleSentence: 'The grass is green.', exampleTranslation: 'Das Gras ist grün.', difficulty: 1, notes: null },
      { word: 'Yellow', translation: 'Gelb', pronunciation: '/ˈjɛloʊ/', partOfSpeech: 'adjective', exampleSentence: 'The sun is yellow.', exampleTranslation: 'Die Sonne ist gelb.', difficulty: 1, notes: null },
      { word: 'Circle', translation: 'Kreis', pronunciation: '/ˈsɜrkəl/', partOfSpeech: 'noun', exampleSentence: 'Draw a circle.', exampleTranslation: 'Zeichne einen Kreis.', difficulty: 1, notes: null },
      { word: 'Square', translation: 'Quadrat', pronunciation: '/skwɛər/', partOfSpeech: 'noun', exampleSentence: 'The box is a square.', exampleTranslation: 'Die Box ist ein Quadrat.', difficulty: 1, notes: null },
      { word: 'Triangle', translation: 'Dreieck', pronunciation: '/ˈtraɪæŋɡəl/', partOfSpeech: 'noun', exampleSentence: 'A pyramid has triangle sides.', exampleTranslation: 'Eine Pyramide hat dreieckige Seiten.', difficulty: 2, notes: null },
      { word: 'Black', translation: 'Schwarz', pronunciation: '/blæk/', partOfSpeech: 'adjective', exampleSentence: 'The cat is black.', exampleTranslation: 'Die Katze ist schwarz.', difficulty: 1, notes: null },
      { word: 'White', translation: 'Weiß', pronunciation: '/waɪt/', partOfSpeech: 'adjective', exampleSentence: 'Snow is white.', exampleTranslation: 'Schnee ist weiß.', difficulty: 1, notes: null },
      { word: 'Orange', translation: 'Orange', pronunciation: '/ˈɔrɪndʒ/', partOfSpeech: 'adjective', exampleSentence: 'I have an orange shirt.', exampleTranslation: 'Ich habe ein oranges Hemd.', difficulty: 1, notes: null },
    ]
  },
  {
    name: 'Family Members',
    description: 'Words to describe your family tree',
    level: 'A1',
    category: 'Daily',
    icon: '👨‍👩‍👧‍👦',
    cards: [
      { word: 'Mother', translation: 'Mutter', pronunciation: '/ˈmʌðər/', partOfSpeech: 'noun', exampleSentence: 'My mother is very kind.', exampleTranslation: 'Meine Mutter ist sehr nett.', difficulty: 1, notes: null },
      { word: 'Father', translation: 'Vater', pronunciation: '/ˈfɑːðər/', partOfSpeech: 'noun', exampleSentence: 'His father works in a bank.', exampleTranslation: 'Sein Vater arbeitet in einer Bank.', difficulty: 1, notes: null },
      { word: 'Brother', translation: 'Bruder', pronunciation: '/ˈbrʌðər/', partOfSpeech: 'noun', exampleSentence: 'I have one brother.', exampleTranslation: 'Ich habe einen Bruder.', difficulty: 1, notes: null },
      { word: 'Sister', translation: 'Schwester', pronunciation: '/ˈsɪstər/', partOfSpeech: 'noun', exampleSentence: 'Her sister is older.', exampleTranslation: 'Ihre Schwester ist älter.', difficulty: 1, notes: null },
      { word: 'Grandmother', translation: 'Großmutter', pronunciation: '/ˈɡrændˌmʌðər/', partOfSpeech: 'noun', exampleSentence: 'We visit my grandmother on Sundays.', exampleTranslation: 'Wir besuchen meine Großmutter sonntags.', difficulty: 1, notes: null },
      { word: 'Grandfather', translation: 'Großvater', pronunciation: '/ˈɡrændˌfɑːðər/', partOfSpeech: 'noun', exampleSentence: 'My grandfather likes gardening.', exampleTranslation: 'Mein Großvater mag Gartenarbeit.', difficulty: 1, notes: null },
      { word: 'Uncle', translation: 'Onkel', pronunciation: '/ˈʌŋkəl/', partOfSpeech: 'noun', exampleSentence: 'My uncle lives in London.', exampleTranslation: 'Mein Onkel lebt in London.', difficulty: 2, notes: null },
      { word: 'Aunt', translation: 'Tante', pronunciation: '/ænt/', partOfSpeech: 'noun', exampleSentence: 'My aunt makes great cakes.', exampleTranslation: 'Meine Tante macht tolle Kuchen.', difficulty: 2, notes: null },
      { word: 'Cousin', translation: 'Cousin / Cousine', pronunciation: '/ˈkʌzən/', partOfSpeech: 'noun', exampleSentence: 'My cousin is playing outside.', exampleTranslation: 'Mein Cousin spielt draußen.', difficulty: 2, notes: null },
      { word: 'Parents', translation: 'Eltern', pronunciation: '/ˈpɛərənts/', partOfSpeech: 'noun', exampleSentence: 'My parents are on holiday.', exampleTranslation: 'Meine Eltern sind im Urlaub.', difficulty: 1, notes: null },
    ]
  },
  {
    name: 'Numbers & Time',
    description: 'Counting and telling the time',
    level: 'A1',
    category: 'Basics',
    icon: '⌚',
    cards: [
      { word: 'One', translation: 'Eins', pronunciation: '/wʌn/', partOfSpeech: 'number', exampleSentence: 'I have one dog.', exampleTranslation: 'Ich habe einen Hund.', difficulty: 1, notes: null },
      { word: 'Two', translation: 'Zwei', pronunciation: '/tuː/', partOfSpeech: 'number', exampleSentence: 'She has two cats.', exampleTranslation: 'Sie hat zwei Katzen.', difficulty: 1, notes: null },
      { word: 'Three', translation: 'Drei', pronunciation: '/θriː/', partOfSpeech: 'number', exampleSentence: 'There are three apples left.', exampleTranslation: 'Es sind noch drei Äpfel übrig.', difficulty: 1, notes: null },
      { word: 'Time', translation: 'Zeit / Uhrzeit', pronunciation: '/taɪm/', partOfSpeech: 'noun', exampleSentence: 'What time is it?', exampleTranslation: 'Wie spät ist es?', difficulty: 1, notes: null },
      { word: 'Hour', translation: 'Stunde', pronunciation: '/aʊər/', partOfSpeech: 'noun', exampleSentence: 'The movie is one hour long.', exampleTranslation: 'Der Film dauert eine Stunde.', difficulty: 1, notes: null },
      { word: 'Minute', translation: 'Minute', pronunciation: '/ˈmɪnɪt/', partOfSpeech: 'noun', exampleSentence: 'Give me five minutes.', exampleTranslation: 'Gib mir fünf Minuten.', difficulty: 1, notes: null },
      { word: 'Morning', translation: 'Morgen', pronunciation: '/ˈmɔrnɪŋ/', partOfSpeech: 'noun', exampleSentence: 'Good morning!', exampleTranslation: 'Guten Morgen!', difficulty: 1, notes: null },
      { word: 'Afternoon', translation: 'Nachmittag', pronunciation: '/ˌæftərˈnuːn/', partOfSpeech: 'noun', exampleSentence: 'Let us meet in the afternoon.', exampleTranslation: 'Lass uns am Nachmittag treffen.', difficulty: 1, notes: null },
      { word: 'Evening', translation: 'Abend', pronunciation: '/ˈiːvnɪŋ/', partOfSpeech: 'noun', exampleSentence: 'I watch TV in the evening.', exampleTranslation: 'Ich schaue abends fern.', difficulty: 1, notes: null },
      { word: 'Night', translation: 'Nacht', pronunciation: '/naɪt/', partOfSpeech: 'noun', exampleSentence: 'Good night.', exampleTranslation: 'Gute Nacht.', difficulty: 1, notes: null },
    ]
  },
  {
    name: 'Animals',
    description: 'Common pets and wild animals',
    level: 'A1',
    category: 'Nature',
    icon: '🐶',
    cards: [
      { word: 'Dog', translation: 'Hund', pronunciation: '/dɔɡ/', partOfSpeech: 'noun', exampleSentence: 'The dog is barking.', exampleTranslation: 'Der Hund bellt.', difficulty: 1, notes: null },
      { word: 'Cat', translation: 'Katze', pronunciation: '/kæt/', partOfSpeech: 'noun', exampleSentence: 'The cat is sleeping.', exampleTranslation: 'Die Katze schläft.', difficulty: 1, notes: null },
      { word: 'Bird', translation: 'Vogel', pronunciation: '/bɜrd/', partOfSpeech: 'noun', exampleSentence: 'A bird is flying.', exampleTranslation: 'Ein Vogel fliegt.', difficulty: 1, notes: null },
      { word: 'Fish', translation: 'Fisch', pronunciation: '/fɪʃ/', partOfSpeech: 'noun', exampleSentence: 'The fish swims in the water.', exampleTranslation: 'Der Fisch schwimmt im Wasser.', difficulty: 1, notes: null },
      { word: 'Horse', translation: 'Pferd', pronunciation: '/hɔrs/', partOfSpeech: 'noun', exampleSentence: 'I like to ride a horse.', exampleTranslation: 'Ich reite gerne auf einem Pferd.', difficulty: 1, notes: null },
      { word: 'Cow', translation: 'Kuh', pronunciation: '/kaʊ/', partOfSpeech: 'noun', exampleSentence: 'The cow gives milk.', exampleTranslation: 'Die Kuh gibt Milch.', difficulty: 1, notes: null },
      { word: 'Pig', translation: 'Schwein', pronunciation: '/pɪɡ/', partOfSpeech: 'noun', exampleSentence: 'The pig is pink.', exampleTranslation: 'Das Schwein ist rosa.', difficulty: 1, notes: null },
      { word: 'Mouse', translation: 'Maus', pronunciation: '/maʊs/', partOfSpeech: 'noun', exampleSentence: 'The mouse is very small.', exampleTranslation: 'Die Maus ist sehr klein.', difficulty: 1, notes: null },
      { word: 'Elephant', translation: 'Elefant', pronunciation: '/ˈɛləfənt/', partOfSpeech: 'noun', exampleSentence: 'The elephant is a large animal.', exampleTranslation: 'Der Elefant ist ein großes Tier.', difficulty: 2, notes: null },
      { word: 'Lion', translation: 'Löwe', pronunciation: '/ˈlaɪən/', partOfSpeech: 'noun', exampleSentence: 'The lion is the king of the jungle.', exampleTranslation: 'Der Löwe ist der König des Dschungels.', difficulty: 1, notes: null },
    ]
  },
  {
    name: 'Clothing',
    description: 'Basic clothes and accessories',
    level: 'A1',
    category: 'Daily',
    icon: '👕',
    cards: [
      { word: 'Shirt', translation: 'Hemd / T-Shirt', pronunciation: '/ʃɜrt/', partOfSpeech: 'noun', exampleSentence: 'He wears a white shirt.', exampleTranslation: 'Er trägt ein weißes Hemd.', difficulty: 1, notes: null },
      { word: 'Pants', translation: 'Hose', pronunciation: '/pænts/', partOfSpeech: 'noun', exampleSentence: 'My pants are blue.', exampleTranslation: 'Meine Hose ist blau.', difficulty: 1, notes: null },
      { word: 'Dress', translation: 'Kleid', pronunciation: '/drɛs/', partOfSpeech: 'noun', exampleSentence: 'She bought a new dress.', exampleTranslation: 'Sie hat ein neues Kleid gekauft.', difficulty: 1, notes: null },
      { word: 'Shoes', translation: 'Schuhe', pronunciation: '/ʃuːz/', partOfSpeech: 'noun', exampleSentence: 'Take off your shoes.', exampleTranslation: 'Zieh deine Schuhe aus.', difficulty: 1, notes: null },
      { word: 'Hat', translation: 'Hut / Mütze', pronunciation: '/hæt/', partOfSpeech: 'noun', exampleSentence: 'Put on your hat.', exampleTranslation: 'Zieh deine Mütze auf.', difficulty: 1, notes: null },
      { word: 'Socks', translation: 'Socken', pronunciation: '/sɒks/', partOfSpeech: 'noun', exampleSentence: 'I need warm socks.', exampleTranslation: 'Ich brauche warme Socken.', difficulty: 1, notes: null },
      { word: 'Jacket', translation: 'Jacke', pronunciation: '/ˈdʒækɪt/', partOfSpeech: 'noun', exampleSentence: 'It is cold, take a jacket.', exampleTranslation: 'Es ist kalt, nimm eine Jacke.', difficulty: 1, notes: null },
      { word: 'Skirt', translation: 'Rock', pronunciation: '/skɜrt/', partOfSpeech: 'noun', exampleSentence: 'She wears a long skirt.', exampleTranslation: 'Sie trägt einen langen Rock.', difficulty: 1, notes: null },
      { word: 'Coat', translation: 'Mantel', pronunciation: '/koʊt/', partOfSpeech: 'noun', exampleSentence: 'My winter coat is very warm.', exampleTranslation: 'Mein Wintermantel ist sehr warm.', difficulty: 2, notes: null },
      { word: 'Glasses', translation: 'Brille', pronunciation: '/ˈɡlæsɪz/', partOfSpeech: 'noun', exampleSentence: 'I wear glasses to read.', exampleTranslation: 'Ich trage eine Brille zum Lesen.', difficulty: 2, notes: null },
    ]
  },

  // A2
  {
    name: 'Weather & Seasons',
    description: 'Talking about climate and weather conditions',
    level: 'A2',
    category: 'Nature',
    icon: '⛅',
    cards: [
      { word: 'Sunny', translation: 'Sonnig', pronunciation: '/ˈsʌni/', partOfSpeech: 'adjective', exampleSentence: 'It is a sunny day.', exampleTranslation: 'Es ist ein sonniger Tag.', difficulty: 2, notes: null },
      { word: 'Rain', translation: 'Regen', pronunciation: '/reɪn/', partOfSpeech: 'noun', exampleSentence: 'We need rain for the plants.', exampleTranslation: 'Wir brauchen Regen für die Pflanzen.', difficulty: 1, notes: null },
      { word: 'Cloudy', translation: 'Bewölkt', pronunciation: '/ˈklaʊdi/', partOfSpeech: 'adjective', exampleSentence: 'The sky is cloudy today.', exampleTranslation: 'Der Himmel ist heute bewölkt.', difficulty: 2, notes: null },
      { word: 'Windy', translation: 'Windig', pronunciation: '/ˈwɪndi/', partOfSpeech: 'adjective', exampleSentence: 'It is too windy to go sailing.', exampleTranslation: 'Es ist zu windig, um segeln zu gehen.', difficulty: 2, notes: null },
      { word: 'Snow', translation: 'Schnee', pronunciation: '/snoʊ/', partOfSpeech: 'noun', exampleSentence: 'Kids love playing in the snow.', exampleTranslation: 'Kinder spielen gerne im Schnee.', difficulty: 1, notes: null },
      { word: 'Storm', translation: 'Sturm', pronunciation: '/stɔrm/', partOfSpeech: 'noun', exampleSentence: 'A big storm is coming.', exampleTranslation: 'Ein großer Sturm zieht auf.', difficulty: 2, notes: null },
      { word: 'Spring', translation: 'Frühling', pronunciation: '/sprɪŋ/', partOfSpeech: 'noun', exampleSentence: 'Flowers bloom in spring.', exampleTranslation: 'Blumen blühen im Frühling.', difficulty: 2, notes: null },
      { word: 'Summer', translation: 'Sommer', pronunciation: '/ˈsʌmər/', partOfSpeech: 'noun', exampleSentence: 'We go to the beach in summer.', exampleTranslation: 'Wir gehen im Sommer an den Strand.', difficulty: 1, notes: null },
      { word: 'Autumn', translation: 'Herbst', pronunciation: '/ˈɔːtəm/', partOfSpeech: 'noun', exampleSentence: 'Leaves fall in autumn.', exampleTranslation: 'Blätter fallen im Herbst.', difficulty: 2, notes: null },
      { word: 'Winter', translation: 'Winter', pronunciation: '/ˈwɪntər/', partOfSpeech: 'noun', exampleSentence: 'Winter is the coldest season.', exampleTranslation: 'Der Winter ist die kälteste Jahreszeit.', difficulty: 1, notes: null },
    ]
  },
  {
    name: 'Hobbies & Free Time',
    description: 'Words to talk about your interests',
    level: 'A2',
    category: 'Daily',
    icon: '⚽',
    cards: [
      { word: 'Reading', translation: 'Lesen', pronunciation: '/ˈriːdɪŋ/', partOfSpeech: 'noun', exampleSentence: 'Reading is my favorite hobby.', exampleTranslation: 'Lesen ist mein Lieblingshobby.', difficulty: 2, notes: null },
      { word: 'Swimming', translation: 'Schwimmen', pronunciation: '/ˈswɪmɪŋ/', partOfSpeech: 'noun', exampleSentence: 'We go swimming every Sunday.', exampleTranslation: 'Wir gehen jeden Sonntag schwimmen.', difficulty: 2, notes: null },
      { word: 'Drawing', translation: 'Zeichnen', pronunciation: '/ˈdrɔːɪŋ/', partOfSpeech: 'noun', exampleSentence: 'She is very good at drawing.', exampleTranslation: 'Sie ist sehr gut im Zeichnen.', difficulty: 2, notes: null },
      { word: 'Cooking', translation: 'Kochen', pronunciation: '/ˈkʊkɪŋ/', partOfSpeech: 'noun', exampleSentence: 'I enjoy cooking for my friends.', exampleTranslation: 'Ich koche gerne für meine Freunde.', difficulty: 2, notes: null },
      { word: 'Traveling', translation: 'Reisen', pronunciation: '/ˈtrævəlɪŋ/', partOfSpeech: 'noun', exampleSentence: 'Traveling helps you learn about the world.', exampleTranslation: 'Reisen hilft dir, etwas über die Welt zu lernen.', difficulty: 2, notes: null },
      { word: 'Photography', translation: 'Fotografie', pronunciation: '/fəˈtɒɡrəfi/', partOfSpeech: 'noun', exampleSentence: 'He took up photography last year.', exampleTranslation: 'Er hat letztes Jahr mit Fotografie angefangen.', difficulty: 3, notes: null },
      { word: 'Gaming', translation: 'Zocken / Spielen', pronunciation: '/ˈɡeɪmɪŋ/', partOfSpeech: 'noun', exampleSentence: 'Gaming is popular among teenagers.', exampleTranslation: 'Zocken ist bei Teenagern beliebt.', difficulty: 2, notes: null },
      { word: 'Listening to music', translation: 'Musik hören', pronunciation: '/ˈlɪsənɪŋ tʊ ˈmjuːzɪk/', partOfSpeech: 'phrase', exampleSentence: 'I am listening to music right now.', exampleTranslation: 'Ich höre gerade Musik.', difficulty: 2, notes: null },
      { word: 'Dancing', translation: 'Tanzen', pronunciation: '/ˈdænsɪŋ/', partOfSpeech: 'noun', exampleSentence: 'They go dancing on weekends.', exampleTranslation: 'Sie gehen am Wochenende tanzen.', difficulty: 2, notes: null },
      { word: 'Gardening', translation: 'Gartenarbeit', pronunciation: '/ˈɡɑːrdənɪŋ/', partOfSpeech: 'noun', exampleSentence: 'Gardening is very relaxing.', exampleTranslation: 'Gartenarbeit ist sehr entspannend.', difficulty: 3, notes: null },
    ]
  },
  {
    name: 'Transportation',
    description: 'Different ways of getting around',
    level: 'A2',
    category: 'Travel',
    icon: '🚌',
    cards: [
      { word: 'Car', translation: 'Auto', pronunciation: '/kɑːr/', partOfSpeech: 'noun', exampleSentence: 'We drove there by car.', exampleTranslation: 'Wir sind mit dem Auto dorthin gefahren.', difficulty: 1, notes: null },
      { word: 'Bus', translation: 'Bus', pronunciation: '/bʌs/', partOfSpeech: 'noun', exampleSentence: 'I take the bus to school.', exampleTranslation: 'Ich fahre mit dem Bus zur Schule.', difficulty: 1, notes: null },
      { word: 'Train', translation: 'Zug', pronunciation: '/treɪn/', partOfSpeech: 'noun', exampleSentence: 'The train arrives at 5 PM.', exampleTranslation: 'Der Zug kommt um 17 Uhr an.', difficulty: 2, notes: null },
      { word: 'Bicycle', translation: 'Fahrrad', pronunciation: '/ˈbaɪsɪkəl/', partOfSpeech: 'noun', exampleSentence: 'He rides his bicycle everywhere.', exampleTranslation: 'Er fährt überall mit seinem Fahrrad hin.', difficulty: 2, notes: null },
      { word: 'Airplane', translation: 'Flugzeug', pronunciation: '/ˈɛərpleɪn/', partOfSpeech: 'noun', exampleSentence: 'The airplane takes off soon.', exampleTranslation: 'Das Flugzeug hebt bald ab.', difficulty: 2, notes: null },
      { word: 'Ticket', translation: 'Fahrkarte / Ticket', pronunciation: '/ˈtɪkɪt/', partOfSpeech: 'noun', exampleSentence: 'Please show your ticket.', exampleTranslation: 'Bitte zeigen Sie Ihre Fahrkarte.', difficulty: 2, notes: null },
      { word: 'Station', translation: 'Bahnhof / Station', pronunciation: '/ˈsteɪʃən/', partOfSpeech: 'noun', exampleSentence: 'Meet me at the station.', exampleTranslation: 'Triff mich am Bahnhof.', difficulty: 2, notes: null },
      { word: 'Airport', translation: 'Flughafen', pronunciation: '/ˈɛərpɔːrt/', partOfSpeech: 'noun', exampleSentence: 'We must be at the airport early.', exampleTranslation: 'Wir müssen früh am Flughafen sein.', difficulty: 2, notes: null },
      { word: 'Driver', translation: 'Fahrer', pronunciation: '/ˈdraɪvər/', partOfSpeech: 'noun', exampleSentence: 'The bus driver was very friendly.', exampleTranslation: 'Der Busfahrer war sehr freundlich.', difficulty: 2, notes: null },
      { word: 'Journey', translation: 'Reise / Fahrt', pronunciation: '/ˈdʒɜːrni/', partOfSpeech: 'noun', exampleSentence: 'Have a safe journey!', exampleTranslation: 'Gute Reise!', difficulty: 3, notes: null },
    ]
  },
  {
    name: 'Professions & Jobs',
    description: 'Common occupations and work terms',
    level: 'A2',
    category: 'Business',
    icon: '👨‍⚕️',
    cards: [
      { word: 'Teacher', translation: 'Lehrer/in', pronunciation: '/ˈtiːtʃər/', partOfSpeech: 'noun', exampleSentence: 'The teacher explained the lesson.', exampleTranslation: 'Der Lehrer hat die Lektion erklärt.', difficulty: 2, notes: null },
      { word: 'Doctor', translation: 'Arzt/Ärztin', pronunciation: '/ˈdɒktər/', partOfSpeech: 'noun', exampleSentence: 'The doctor examined the patient.', exampleTranslation: 'Der Arzt hat den Patienten untersucht.', difficulty: 2, notes: null },
      { word: 'Nurse', translation: 'Krankenpfleger/in', pronunciation: '/nɜːrs/', partOfSpeech: 'noun', exampleSentence: 'The nurse helped the doctor.', exampleTranslation: 'Die Krankenschwester half dem Arzt.', difficulty: 2, notes: null },
      { word: 'Police Officer', translation: 'Polizist/in', pronunciation: '/pəˈliːs ˈɒfɪsər/', partOfSpeech: 'noun', exampleSentence: 'The police officer directed the traffic.', exampleTranslation: 'Der Polizist regelte den Verkehr.', difficulty: 2, notes: null },
      { word: 'Chef', translation: 'Koch/Köchin', pronunciation: '/ʃɛf/', partOfSpeech: 'noun', exampleSentence: 'The chef cooked a delicious meal.', exampleTranslation: 'Der Koch hat ein leckeres Essen gekocht.', difficulty: 2, notes: null },
      { word: 'Engineer', translation: 'Ingenieur/in', pronunciation: '/ˌɛndʒɪˈnɪər/', partOfSpeech: 'noun', exampleSentence: 'She works as an engineer.', exampleTranslation: 'Sie arbeitet als Ingenieurin.', difficulty: 3, notes: null },
      { word: 'Artist', translation: 'Künstler/in', pronunciation: '/ˈɑːrtɪst/', partOfSpeech: 'noun', exampleSentence: 'The artist painted a portrait.', exampleTranslation: 'Der Künstler hat ein Porträt gemalt.', difficulty: 2, notes: null },
      { word: 'Farmer', translation: 'Bauer/Bäuerin', pronunciation: '/ˈfɑːrmər/', partOfSpeech: 'noun', exampleSentence: 'The farmer works in the field.', exampleTranslation: 'Der Bauer arbeitet auf dem Feld.', difficulty: 2, notes: null },
      { word: 'Pilot', translation: 'Pilot/in', pronunciation: '/ˈpaɪlət/', partOfSpeech: 'noun', exampleSentence: 'The pilot flies the airplane.', exampleTranslation: 'Der Pilot fliegt das Flugzeug.', difficulty: 2, notes: null },
      { word: 'Job', translation: 'Beruf / Arbeit', pronunciation: '/dʒɒb/', partOfSpeech: 'noun', exampleSentence: 'He is looking for a new job.', exampleTranslation: 'Er sucht nach einer neuen Arbeit.', difficulty: 1, notes: null },
    ]
  },
  {
    name: 'House & Furniture',
    description: 'Rooms and objects in a home',
    level: 'A2',
    category: 'Daily',
    icon: '🏠',
    cards: [
      { word: 'Bedroom', translation: 'Schlafzimmer', pronunciation: '/ˈbɛdruːm/', partOfSpeech: 'noun', exampleSentence: 'My bedroom is upstairs.', exampleTranslation: 'Mein Schlafzimmer ist oben.', difficulty: 2, notes: null },
      { word: 'Kitchen', translation: 'Küche', pronunciation: '/ˈkɪtʃɪn/', partOfSpeech: 'noun', exampleSentence: 'She is cooking in the kitchen.', exampleTranslation: 'Sie kocht in der Küche.', difficulty: 2, notes: null },
      { word: 'Bathroom', translation: 'Badezimmer', pronunciation: '/ˈbæθruːm/', partOfSpeech: 'noun', exampleSentence: 'The bathroom is on the right.', exampleTranslation: 'Das Badezimmer ist rechts.', difficulty: 2, notes: null },
      { word: 'Living Room', translation: 'Wohnzimmer', pronunciation: '/ˈlɪvɪŋ ruːm/', partOfSpeech: 'noun', exampleSentence: 'We watch TV in the living room.', exampleTranslation: 'Wir schauen im Wohnzimmer fern.', difficulty: 2, notes: null },
      { word: 'Bed', translation: 'Bett', pronunciation: '/bɛd/', partOfSpeech: 'noun', exampleSentence: 'This bed is very comfortable.', exampleTranslation: 'Dieses Bett ist sehr bequem.', difficulty: 1, notes: null },
      { word: 'Table', translation: 'Tisch', pronunciation: '/ˈteɪbəl/', partOfSpeech: 'noun', exampleSentence: 'Put the plates on the table.', exampleTranslation: 'Stell die Teller auf den Tisch.', difficulty: 1, notes: null },
      { word: 'Chair', translation: 'Stuhl', pronunciation: '/tʃɛər/', partOfSpeech: 'noun', exampleSentence: 'Please take a chair.', exampleTranslation: 'Bitte nimm dir einen Stuhl.', difficulty: 1, notes: null },
      { word: 'Sofa', translation: 'Sofa', pronunciation: '/ˈsoʊfə/', partOfSpeech: 'noun', exampleSentence: 'He is sleeping on the sofa.', exampleTranslation: 'Er schläft auf dem Sofa.', difficulty: 1, notes: null },
      { word: 'Window', translation: 'Fenster', pronunciation: '/ˈwɪndoʊ/', partOfSpeech: 'noun', exampleSentence: 'Open the window, please.', exampleTranslation: 'Öffne bitte das Fenster.', difficulty: 1, notes: null },
      { word: 'Door', translation: 'Tür', pronunciation: '/dɔːr/', partOfSpeech: 'noun', exampleSentence: 'Close the door behind you.', exampleTranslation: 'Schließ die Tür hinter dir.', difficulty: 1, notes: null },
    ]
  }
]
