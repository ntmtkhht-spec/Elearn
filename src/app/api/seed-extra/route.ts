import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const DECKS = [
  // A1
  {
    name: 'Numbers & Colors', description: 'Basic numbers and colors', level: 'A1', category: 'Basics', icon: '🎨',
    cards: [
      { word: 'Red', translation: 'Rot', pronunciation: '/rɛd/', partOfSpeech: 'adj', exampleSentence: 'The car is red.', exampleTranslation: 'Das Auto ist rot.', difficulty: 1 },
      { word: 'Blue', translation: 'Blau', pronunciation: '/bluː/', partOfSpeech: 'adj', exampleSentence: 'The sky is blue.', exampleTranslation: 'Der Himmel ist blau.', difficulty: 1 },
      { word: 'Green', translation: 'Grün', pronunciation: '/ɡriːn/', partOfSpeech: 'adj', exampleSentence: 'The grass is green.', exampleTranslation: 'Das Gras ist grün.', difficulty: 1 },
      { word: 'Yellow', translation: 'Gelb', pronunciation: '/ˈjɛloʊ/', partOfSpeech: 'adj', exampleSentence: 'The sun is yellow.', exampleTranslation: 'Die Sonne ist gelb.', difficulty: 1 },
      { word: 'One', translation: 'Eins', pronunciation: '/wʌn/', partOfSpeech: 'noun', exampleSentence: 'I have one apple.', exampleTranslation: 'Ich habe einen Apfel.', difficulty: 1 },
      { word: 'Two', translation: 'Zwei', pronunciation: '/tuː/', partOfSpeech: 'noun', exampleSentence: 'There are two birds.', exampleTranslation: 'Da sind zwei Vögel.', difficulty: 1 },
      { word: 'Three', translation: 'Drei', pronunciation: '/θriː/', partOfSpeech: 'noun', exampleSentence: 'He has three sisters.', exampleTranslation: 'Er hat drei Schwestern.', difficulty: 1 },
      { word: 'Ten', translation: 'Zehn', pronunciation: '/tɛn/', partOfSpeech: 'noun', exampleSentence: 'Count to ten.', exampleTranslation: 'Zähle bis zehn.', difficulty: 1 },
      { word: 'Hundred', translation: 'Hundert', pronunciation: '/ˈhʌndrəd/', partOfSpeech: 'noun', exampleSentence: 'A hundred days.', exampleTranslation: 'Hundert Tage.', difficulty: 1 },
      { word: 'Black', translation: 'Schwarz', pronunciation: '/blæk/', partOfSpeech: 'adj', exampleSentence: 'A black cat.', exampleTranslation: 'Eine schwarze Katze.', difficulty: 1 },
    ]
  },
  {
    name: 'Family Members', description: 'Vocabulary for family and relatives', level: 'A1', category: 'Daily', icon: '👨‍👩‍👧',
    cards: [
      { word: 'Mother', translation: 'Mutter', pronunciation: '/ˈmʌðər/', partOfSpeech: 'noun', exampleSentence: 'My mother is kind.', exampleTranslation: 'Meine Mutter ist nett.', difficulty: 1 },
      { word: 'Father', translation: 'Vater', pronunciation: '/ˈfɑːðər/', partOfSpeech: 'noun', exampleSentence: 'His father is tall.', exampleTranslation: 'Sein Vater ist groß.', difficulty: 1 },
      { word: 'Sister', translation: 'Schwester', pronunciation: '/ˈsɪstər/', partOfSpeech: 'noun', exampleSentence: 'I have a sister.', exampleTranslation: 'Ich habe eine Schwester.', difficulty: 1 },
      { word: 'Brother', translation: 'Bruder', pronunciation: '/ˈbrʌðər/', partOfSpeech: 'noun', exampleSentence: 'My brother plays soccer.', exampleTranslation: 'Mein Bruder spielt Fußball.', difficulty: 1 },
      { word: 'Grandmother', translation: 'Großmutter', pronunciation: '/ˈɡrændˌmʌðər/', partOfSpeech: 'noun', exampleSentence: 'She is my grandmother.', exampleTranslation: 'Sie ist meine Großmutter.', difficulty: 1 },
      { word: 'Grandfather', translation: 'Großvater', pronunciation: '/ˈɡrændˌfɑːðər/', partOfSpeech: 'noun', exampleSentence: 'He is my grandfather.', exampleTranslation: 'Er ist mein Großvater.', difficulty: 1 },
      { word: 'Aunt', translation: 'Tante', pronunciation: '/ænt/', partOfSpeech: 'noun', exampleSentence: 'My aunt lives here.', exampleTranslation: 'Meine Tante lebt hier.', difficulty: 1 },
      { word: 'Uncle', translation: 'Onkel', pronunciation: '/ˈʌŋkəl/', partOfSpeech: 'noun', exampleSentence: 'His uncle is a doctor.', exampleTranslation: 'Sein Onkel ist Arzt.', difficulty: 1 },
      { word: 'Cousin', translation: 'Cousin/Cousine', pronunciation: '/ˈkʌzən/', partOfSpeech: 'noun', exampleSentence: 'We are cousins.', exampleTranslation: 'Wir sind Cousins.', difficulty: 1 },
      { word: 'Parents', translation: 'Eltern', pronunciation: '/ˈpɛrənts/', partOfSpeech: 'noun', exampleSentence: 'My parents are at home.', exampleTranslation: 'Meine Eltern sind zu Hause.', difficulty: 1 },
    ]
  },
  {
    name: 'Body Parts', description: 'Names of parts of the human body', level: 'A1', category: 'Basics', icon: '👤',
    cards: [
      { word: 'Head', translation: 'Kopf', pronunciation: '/hɛd/', partOfSpeech: 'noun', exampleSentence: 'My head hurts.', exampleTranslation: 'Mein Kopf tut weh.', difficulty: 1 },
      { word: 'Eye', translation: 'Auge', pronunciation: '/aɪ/', partOfSpeech: 'noun', exampleSentence: 'She has blue eyes.', exampleTranslation: 'Sie hat blaue Augen.', difficulty: 1 },
      { word: 'Ear', translation: 'Ohr', pronunciation: '/ɪr/', partOfSpeech: 'noun', exampleSentence: 'I hear with my ears.', exampleTranslation: 'Ich höre mit meinen Ohren.', difficulty: 1 },
      { word: 'Nose', translation: 'Nase', pronunciation: '/noʊz/', partOfSpeech: 'noun', exampleSentence: 'He has a small nose.', exampleTranslation: 'Er hat eine kleine Nase.', difficulty: 1 },
      { word: 'Mouth', translation: 'Mund', pronunciation: '/maʊθ/', partOfSpeech: 'noun', exampleSentence: 'Open your mouth.', exampleTranslation: 'Öffne deinen Mund.', difficulty: 1 },
      { word: 'Hand', translation: 'Hand', pronunciation: '/hænd/', partOfSpeech: 'noun', exampleSentence: 'Wash your hands.', exampleTranslation: 'Wasche deine Hände.', difficulty: 1 },
      { word: 'Arm', translation: 'Arm', pronunciation: '/ɑːrm/', partOfSpeech: 'noun', exampleSentence: 'My arm is long.', exampleTranslation: 'Mein Arm ist lang.', difficulty: 1 },
      { word: 'Leg', translation: 'Bein', pronunciation: '/lɛɡ/', partOfSpeech: 'noun', exampleSentence: 'I have two legs.', exampleTranslation: 'Ich habe zwei Beine.', difficulty: 1 },
      { word: 'Foot', translation: 'Fuß', pronunciation: '/fʊt/', partOfSpeech: 'noun', exampleSentence: 'My right foot hurts.', exampleTranslation: 'Mein rechter Fuß tut weh.', difficulty: 1 },
      { word: 'Hair', translation: 'Haar', pronunciation: '/hɛr/', partOfSpeech: 'noun', exampleSentence: 'Her hair is brown.', exampleTranslation: 'Ihr Haar ist braun.', difficulty: 1 },
    ]
  },
  {
    name: 'Days & Months', description: 'Days of the week and months of the year', level: 'A1', category: 'Daily', icon: '📅',
    cards: [
      { word: 'Monday', translation: 'Montag', pronunciation: '/ˈmʌndeɪ/', partOfSpeech: 'noun', exampleSentence: 'I work on Monday.', exampleTranslation: 'Ich arbeite am Montag.', difficulty: 1 },
      { word: 'Friday', translation: 'Freitag', pronunciation: '/ˈfraɪdeɪ/', partOfSpeech: 'noun', exampleSentence: 'Friday is my favorite day.', exampleTranslation: 'Freitag ist mein Lieblingstag.', difficulty: 1 },
      { word: 'Sunday', translation: 'Sonntag', pronunciation: '/ˈsʌndeɪ/', partOfSpeech: 'noun', exampleSentence: 'We rest on Sunday.', exampleTranslation: 'Wir ruhen uns am Sonntag aus.', difficulty: 1 },
      { word: 'January', translation: 'Januar', pronunciation: '/ˈdʒænjuˌɛri/', partOfSpeech: 'noun', exampleSentence: 'January is cold.', exampleTranslation: 'Der Januar ist kalt.', difficulty: 1 },
      { word: 'July', translation: 'Juli', pronunciation: '/dʒʊˈlaɪ/', partOfSpeech: 'noun', exampleSentence: 'We go on holiday in July.', exampleTranslation: 'Wir machen im Juli Urlaub.', difficulty: 1 },
      { word: 'December', translation: 'Dezember', pronunciation: '/dɪˈsɛmbər/', partOfSpeech: 'noun', exampleSentence: 'Christmas is in December.', exampleTranslation: 'Weihnachten ist im Dezember.', difficulty: 1 },
      { word: 'Week', translation: 'Woche', pronunciation: '/wiːk/', partOfSpeech: 'noun', exampleSentence: 'See you next week.', exampleTranslation: 'Bis nächste Woche.', difficulty: 1 },
      { word: 'Month', translation: 'Monat', pronunciation: '/mʌnθ/', partOfSpeech: 'noun', exampleSentence: 'This month is busy.', exampleTranslation: 'Dieser Monat ist stressig.', difficulty: 1 },
      { word: 'Year', translation: 'Jahr', pronunciation: '/jɪr/', partOfSpeech: 'noun', exampleSentence: 'Happy New Year!', exampleTranslation: 'Frohes neues Jahr!', difficulty: 1 },
      { word: 'Today', translation: 'Heute', pronunciation: '/təˈdeɪ/', partOfSpeech: 'adv', exampleSentence: 'Today is a good day.', exampleTranslation: 'Heute ist ein guter Tag.', difficulty: 1 },
    ]
  },
  {
    name: 'House & Furniture', description: 'Things around the house', level: 'A1', category: 'Daily', icon: '🏠',
    cards: [
      { word: 'House', translation: 'Haus', pronunciation: '/haʊs/', partOfSpeech: 'noun', exampleSentence: 'I live in a house.', exampleTranslation: 'Ich lebe in einem Haus.', difficulty: 1 },
      { word: 'Room', translation: 'Zimmer', pronunciation: '/ruːm/', partOfSpeech: 'noun', exampleSentence: 'This is my room.', exampleTranslation: 'Das ist mein Zimmer.', difficulty: 1 },
      { word: 'Bed', translation: 'Bett', pronunciation: '/bɛd/', partOfSpeech: 'noun', exampleSentence: 'I sleep in a bed.', exampleTranslation: 'Ich schlafe in einem Bett.', difficulty: 1 },
      { word: 'Table', translation: 'Tisch', pronunciation: '/ˈteɪbəl/', partOfSpeech: 'noun', exampleSentence: 'The book is on the table.', exampleTranslation: 'Das Buch liegt auf dem Tisch.', difficulty: 1 },
      { word: 'Chair', translation: 'Stuhl', pronunciation: '/tʃɛr/', partOfSpeech: 'noun', exampleSentence: 'Sit on the chair.', exampleTranslation: 'Setz dich auf den Stuhl.', difficulty: 1 },
      { word: 'Window', translation: 'Fenster', pronunciation: '/ˈwɪndoʊ/', partOfSpeech: 'noun', exampleSentence: 'Open the window.', exampleTranslation: 'Öffne das Fenster.', difficulty: 1 },
      { word: 'Door', translation: 'Tür', pronunciation: '/dɔr/', partOfSpeech: 'noun', exampleSentence: 'Close the door.', exampleTranslation: 'Schließe die Tür.', difficulty: 1 },
      { word: 'Kitchen', translation: 'Küche', pronunciation: '/ˈkɪtʃən/', partOfSpeech: 'noun', exampleSentence: 'She is in the kitchen.', exampleTranslation: 'Sie ist in der Küche.', difficulty: 1 },
      { word: 'Bathroom', translation: 'Badezimmer', pronunciation: '/ˈbæθruːm/', partOfSpeech: 'noun', exampleSentence: 'Where is the bathroom?', exampleTranslation: 'Wo ist das Badezimmer?', difficulty: 1 },
      { word: 'Sofa', translation: 'Sofa', pronunciation: '/ˈsoʊfə/', partOfSpeech: 'noun', exampleSentence: 'The sofa is comfortable.', exampleTranslation: 'Das Sofa ist bequem.', difficulty: 1 },
    ]
  },

  // A2
  {
    name: 'Weather & Seasons', description: 'Talking about the weather', level: 'A2', category: 'Daily', icon: '⛅',
    cards: [
      { word: 'Sunny', translation: 'Sonnig', pronunciation: '/ˈsʌni/', partOfSpeech: 'adj', exampleSentence: 'It is a sunny day.', exampleTranslation: 'Es ist ein sonniger Tag.', difficulty: 1 },
      { word: 'Rain', translation: 'Regen', pronunciation: '/reɪn/', partOfSpeech: 'noun', exampleSentence: 'The rain is heavy.', exampleTranslation: 'Der Regen ist stark.', difficulty: 1 },
      { word: 'Snow', translation: 'Schnee', pronunciation: '/snoʊ/', partOfSpeech: 'noun', exampleSentence: 'I like playing in the snow.', exampleTranslation: 'Ich spiele gerne im Schnee.', difficulty: 1 },
      { word: 'Cloudy', translation: 'Bewölkt', pronunciation: '/ˈklaʊdi/', partOfSpeech: 'adj', exampleSentence: 'The sky is cloudy.', exampleTranslation: 'Der Himmel ist bewölkt.', difficulty: 1 },
      { word: 'Wind', translation: 'Wind', pronunciation: '/wɪnd/', partOfSpeech: 'noun', exampleSentence: 'The wind is cold.', exampleTranslation: 'Der Wind ist kalt.', difficulty: 1 },
      { word: 'Summer', translation: 'Sommer', pronunciation: '/ˈsʌmər/', partOfSpeech: 'noun', exampleSentence: 'Summer is hot.', exampleTranslation: 'Der Sommer ist heiß.', difficulty: 1 },
      { word: 'Winter', translation: 'Winter', pronunciation: '/ˈwɪntər/', partOfSpeech: 'noun', exampleSentence: 'It snows in winter.', exampleTranslation: 'Im Winter schneit es.', difficulty: 1 },
      { word: 'Spring', translation: 'Frühling', pronunciation: '/sprɪŋ/', partOfSpeech: 'noun', exampleSentence: 'Flowers bloom in spring.', exampleTranslation: 'Blumen blühen im Frühling.', difficulty: 1 },
      { word: 'Autumn', translation: 'Herbst', pronunciation: '/ˈɔːtəm/', partOfSpeech: 'noun', exampleSentence: 'Leaves fall in autumn.', exampleTranslation: 'Blätter fallen im Herbst.', difficulty: 1 },
      { word: 'Temperature', translation: 'Temperatur', pronunciation: '/ˈtɛmprətʃər/', partOfSpeech: 'noun', exampleSentence: 'The temperature is rising.', exampleTranslation: 'Die Temperatur steigt.', difficulty: 2 },
    ]
  },
  {
    name: 'Clothes & Fashion', description: 'Items of clothing', level: 'A2', category: 'Daily', icon: '👕',
    cards: [
      { word: 'Shirt', translation: 'Hemd/Shirt', pronunciation: '/ʃɜːrt/', partOfSpeech: 'noun', exampleSentence: 'I bought a new shirt.', exampleTranslation: 'Ich habe ein neues Hemd gekauft.', difficulty: 1 },
      { word: 'Trousers', translation: 'Hose', pronunciation: '/ˈtraʊzərz/', partOfSpeech: 'noun', exampleSentence: 'These trousers are too long.', exampleTranslation: 'Diese Hose ist zu lang.', difficulty: 2 },
      { word: 'Shoes', translation: 'Schuhe', pronunciation: '/ʃuːz/', partOfSpeech: 'noun', exampleSentence: 'Take off your shoes.', exampleTranslation: 'Zieh deine Schuhe aus.', difficulty: 1 },
      { word: 'Jacket', translation: 'Jacke', pronunciation: '/ˈdʒækɪt/', partOfSpeech: 'noun', exampleSentence: 'Put on your jacket.', exampleTranslation: 'Zieh deine Jacke an.', difficulty: 1 },
      { word: 'Dress', translation: 'Kleid', pronunciation: '/drɛs/', partOfSpeech: 'noun', exampleSentence: 'She wore a beautiful dress.', exampleTranslation: 'Sie trug ein schönes Kleid.', difficulty: 1 },
      { word: 'Hat', translation: 'Hut/Mütze', pronunciation: '/hæt/', partOfSpeech: 'noun', exampleSentence: 'Don\'t forget your hat.', exampleTranslation: 'Vergiss deine Mütze nicht.', difficulty: 1 },
      { word: 'Socks', translation: 'Socken', pronunciation: '/sɒks/', partOfSpeech: 'noun', exampleSentence: 'I need warm socks.', exampleTranslation: 'Ich brauche warme Socken.', difficulty: 1 },
      { word: 'Wear', translation: 'Tragen (Kleidung)', pronunciation: '/wɛr/', partOfSpeech: 'verb', exampleSentence: 'What will you wear?', exampleTranslation: 'Was wirst du tragen?', difficulty: 1 },
      { word: 'Size', translation: 'Größe', pronunciation: '/saɪz/', partOfSpeech: 'noun', exampleSentence: 'What size are you?', exampleTranslation: 'Welche Größe hast du?', difficulty: 1 },
      { word: 'Try on', translation: 'Anprobieren', pronunciation: '/traɪ ɒn/', partOfSpeech: 'verb', exampleSentence: 'Can I try this on?', exampleTranslation: 'Kann ich das anprobieren?', difficulty: 2 },
    ]
  },
  {
    name: 'Hobbies & Free Time', description: 'Talking about activities', level: 'A2', category: 'Daily', icon: '⚽',
    cards: [
      { word: 'Read', translation: 'Lesen', pronunciation: '/riːd/', partOfSpeech: 'verb', exampleSentence: 'I like to read books.', exampleTranslation: 'Ich lese gerne Bücher.', difficulty: 1 },
      { word: 'Play', translation: 'Spielen', pronunciation: '/pleɪ/', partOfSpeech: 'verb', exampleSentence: 'They play tennis.', exampleTranslation: 'Sie spielen Tennis.', difficulty: 1 },
      { word: 'Music', translation: 'Musik', pronunciation: '/ˈmjuːzɪk/', partOfSpeech: 'noun', exampleSentence: 'Listening to music is relaxing.', exampleTranslation: 'Musik hören ist entspannend.', difficulty: 1 },
      { word: 'Movie', translation: 'Film', pronunciation: '/ˈmuːvi/', partOfSpeech: 'noun', exampleSentence: 'Let\'s watch a movie.', exampleTranslation: 'Lass uns einen Film schauen.', difficulty: 1 },
      { word: 'Swim', translation: 'Schwimmen', pronunciation: '/swɪm/', partOfSpeech: 'verb', exampleSentence: 'I swim every morning.', exampleTranslation: 'Ich schwimme jeden Morgen.', difficulty: 1 },
      { word: 'Cook', translation: 'Kochen', pronunciation: '/kʊk/', partOfSpeech: 'verb', exampleSentence: 'He loves to cook.', exampleTranslation: 'Er liebt es zu kochen.', difficulty: 1 },
      { word: 'Dance', translation: 'Tanzen', pronunciation: '/dæns/', partOfSpeech: 'verb', exampleSentence: 'We danced all night.', exampleTranslation: 'Wir haben die ganze Nacht getanzt.', difficulty: 1 },
      { word: 'Paint', translation: 'Malen', pronunciation: '/peɪnt/', partOfSpeech: 'verb', exampleSentence: 'She paints beautifully.', exampleTranslation: 'Sie malt wunderschön.', difficulty: 1 },
      { word: 'Travel', translation: 'Reisen', pronunciation: '/ˈtrævəl/', partOfSpeech: 'verb', exampleSentence: 'They travel often.', exampleTranslation: 'Sie reisen oft.', difficulty: 1 },
      { word: 'Garden', translation: 'Garten / Gärtnern', pronunciation: '/ˈɡɑːrdən/', partOfSpeech: 'noun/verb', exampleSentence: 'I work in the garden.', exampleTranslation: 'Ich arbeite im Garten.', difficulty: 1 },
    ]
  },
  {
    name: 'Directions & Places', description: 'Finding your way around town', level: 'A2', category: 'Travel', icon: '🗺️',
    cards: [
      { word: 'Left', translation: 'Links', pronunciation: '/lɛft/', partOfSpeech: 'adv', exampleSentence: 'Turn left here.', exampleTranslation: 'Biegen Sie hier links ab.', difficulty: 1 },
      { word: 'Right', translation: 'Rechts', pronunciation: '/raɪt/', partOfSpeech: 'adv', exampleSentence: 'The bank is on the right.', exampleTranslation: 'Die Bank ist auf der rechten Seite.', difficulty: 1 },
      { word: 'Straight', translation: 'Geradeaus', pronunciation: '/streɪt/', partOfSpeech: 'adv', exampleSentence: 'Go straight on.', exampleTranslation: 'Gehen Sie geradeaus weiter.', difficulty: 2 },
      { word: 'Street', translation: 'Straße', pronunciation: '/striːt/', partOfSpeech: 'noun', exampleSentence: 'Cross the street.', exampleTranslation: 'Überquere die Straße.', difficulty: 1 },
      { word: 'Station', translation: 'Bahnhof', pronunciation: '/ˈsteɪʃən/', partOfSpeech: 'noun', exampleSentence: 'Where is the train station?', exampleTranslation: 'Wo ist der Bahnhof?', difficulty: 1 },
      { word: 'Hospital', translation: 'Krankenhaus', pronunciation: '/ˈhɒspɪtl/', partOfSpeech: 'noun', exampleSentence: 'She works at the hospital.', exampleTranslation: 'Sie arbeitet im Krankenhaus.', difficulty: 1 },
      { word: 'Supermarket', translation: 'Supermarkt', pronunciation: '/ˈsuːpərmɑːrkɪt/', partOfSpeech: 'noun', exampleSentence: 'I need to go to the supermarket.', exampleTranslation: 'Ich muss zum Supermarkt.', difficulty: 2 },
      { word: 'Near', translation: 'In der Nähe', pronunciation: '/nɪr/', partOfSpeech: 'prep', exampleSentence: 'Is there a cafe near here?', exampleTranslation: 'Gibt es hier in der Nähe ein Café?', difficulty: 1 },
      { word: 'Far', translation: 'Weit', pronunciation: '/fɑːr/', partOfSpeech: 'adj', exampleSentence: 'The airport is far away.', exampleTranslation: 'Der Flughafen ist weit weg.', difficulty: 1 },
      { word: 'Map', translation: 'Karte', pronunciation: '/mæp/', partOfSpeech: 'noun', exampleSentence: 'Can you show me on the map?', exampleTranslation: 'Können Sie mir das auf der Karte zeigen?', difficulty: 1 },
    ]
  },
  {
    name: 'Jobs & Professions', description: 'Talking about work', level: 'A2', category: 'Business', icon: '👨‍💼',
    cards: [
      { word: 'Teacher', translation: 'Lehrer/in', pronunciation: '/ˈtiːtʃər/', partOfSpeech: 'noun', exampleSentence: 'She is a good teacher.', exampleTranslation: 'Sie ist eine gute Lehrerin.', difficulty: 1 },
      { word: 'Doctor', translation: 'Arzt/Ärztin', pronunciation: '/ˈdɒktər/', partOfSpeech: 'noun', exampleSentence: 'The doctor will see you now.', exampleTranslation: 'Der Arzt wird Sie jetzt sehen.', difficulty: 1 },
      { word: 'Office', translation: 'Büro', pronunciation: '/ˈɒfɪs/', partOfSpeech: 'noun', exampleSentence: 'I work in an office.', exampleTranslation: 'Ich arbeite in einem Büro.', difficulty: 1 },
      { word: 'Boss', translation: 'Chef/in', pronunciation: '/bɒs/', partOfSpeech: 'noun', exampleSentence: 'My boss is very friendly.', exampleTranslation: 'Mein Chef ist sehr freundlich.', difficulty: 1 },
      { word: 'Job', translation: 'Arbeit/Beruf', pronunciation: '/dʒɒb/', partOfSpeech: 'noun', exampleSentence: 'I am looking for a new job.', exampleTranslation: 'Ich suche nach einer neuen Arbeit.', difficulty: 1 },
      { word: 'Engineer', translation: 'Ingenieur/in', pronunciation: '/ˌɛndʒɪˈnɪr/', partOfSpeech: 'noun', exampleSentence: 'He is an engineer.', exampleTranslation: 'Er ist Ingenieur.', difficulty: 2 },
      { word: 'Student', translation: 'Student/in / Schüler/in', pronunciation: '/ˈstjuːdənt/', partOfSpeech: 'noun', exampleSentence: 'She is a university student.', exampleTranslation: 'Sie ist Universitätsstudentin.', difficulty: 1 },
      { word: 'Colleague', translation: 'Kollege/Kollegin', pronunciation: '/ˈkɒliːɡ/', partOfSpeech: 'noun', exampleSentence: 'I had lunch with a colleague.', exampleTranslation: 'Ich habe mit einem Kollegen zu Mittag gegessen.', difficulty: 2 },
      { word: 'Salary', translation: 'Gehalt', pronunciation: '/ˈsæləri/', partOfSpeech: 'noun', exampleSentence: 'The salary is good.', exampleTranslation: 'Das Gehalt ist gut.', difficulty: 2 },
      { word: 'Company', translation: 'Unternehmen', pronunciation: '/ˈkʌmpəni/', partOfSpeech: 'noun', exampleSentence: 'It is a large company.', exampleTranslation: 'Es ist ein großes Unternehmen.', difficulty: 1 },
    ]
  },

  // B1
  {
    name: 'Travel & Transport', description: 'Vocabulary for getting around', level: 'B1', category: 'Travel', icon: '✈️',
    cards: [
      { word: 'Flight', translation: 'Flug', pronunciation: '/flaɪt/', partOfSpeech: 'noun', exampleSentence: 'My flight is delayed.', exampleTranslation: 'Mein Flug hat Verspätung.', difficulty: 2 },
      { word: 'Accommodation', translation: 'Unterkunft', pronunciation: '/əˌkɒməˈdeɪʃən/', partOfSpeech: 'noun', exampleSentence: 'Have you booked the accommodation?', exampleTranslation: 'Hast du die Unterkunft gebucht?', difficulty: 3 },
      { word: 'Luggage', translation: 'Gepäck', pronunciation: '/ˈlʌɡɪdʒ/', partOfSpeech: 'noun', exampleSentence: 'Where is my luggage?', exampleTranslation: 'Wo ist mein Gepäck?', difficulty: 2 },
      { word: 'Platform', translation: 'Bahnsteig', pronunciation: '/ˈplætfɔːrm/', partOfSpeech: 'noun', exampleSentence: 'The train departs from platform 3.', exampleTranslation: 'Der Zug fährt von Bahnsteig 3 ab.', difficulty: 2 },
      { word: 'Passenger', translation: 'Passagier', pronunciation: '/ˈpæsɪndʒər/', partOfSpeech: 'noun', exampleSentence: 'All passengers must board now.', exampleTranslation: 'Alle Passagiere müssen jetzt einsteigen.', difficulty: 2 },
      { word: 'Destination', translation: 'Reiseziel', pronunciation: '/ˌdɛstɪˈneɪʃən/', partOfSpeech: 'noun', exampleSentence: 'Our destination is Rome.', exampleTranslation: 'Unser Reiseziel ist Rom.', difficulty: 2 },
      { word: 'Ticket', translation: 'Fahrkarte/Ticket', pronunciation: '/ˈtɪkɪt/', partOfSpeech: 'noun', exampleSentence: 'Please show your ticket.', exampleTranslation: 'Bitte zeigen Sie Ihr Ticket.', difficulty: 1 },
      { word: 'Departure', translation: 'Abflug/Abfahrt', pronunciation: '/dɪˈpɑːrtʃər/', partOfSpeech: 'noun', exampleSentence: 'Departure is at 8 AM.', exampleTranslation: 'Abflug ist um 8 Uhr morgens.', difficulty: 2 },
      { word: 'Arrival', translation: 'Ankunft', pronunciation: '/əˈraɪvəl/', partOfSpeech: 'noun', exampleSentence: 'Arrival time is unknown.', exampleTranslation: 'Die Ankunftszeit ist unbekannt.', difficulty: 2 },
      { word: 'Book', translation: 'Buchen', pronunciation: '/bʊk/', partOfSpeech: 'verb', exampleSentence: 'I need to book a room.', exampleTranslation: 'Ich muss ein Zimmer buchen.', difficulty: 1 },
    ]
  },
  {
    name: 'Health & Illness', description: 'Going to the doctor', level: 'B1', category: 'Health', icon: '💊',
    cards: [
      { word: 'Headache', translation: 'Kopfschmerzen', pronunciation: '/ˈhɛdeɪk/', partOfSpeech: 'noun', exampleSentence: 'I have a terrible headache.', exampleTranslation: 'Ich habe furchtbare Kopfschmerzen.', difficulty: 2 },
      { word: 'Prescription', translation: 'Rezept', pronunciation: '/prɪˈskrɪpʃən/', partOfSpeech: 'noun', exampleSentence: 'The doctor gave me a prescription.', exampleTranslation: 'Der Arzt hat mir ein Rezept gegeben.', difficulty: 3 },
      { word: 'Symptom', translation: 'Symptom', pronunciation: '/ˈsɪmptəm/', partOfSpeech: 'noun', exampleSentence: 'What are your symptoms?', exampleTranslation: 'Was sind Ihre Symptome?', difficulty: 2 },
      { word: 'Fever', translation: 'Fieber', pronunciation: '/ˈfiːvər/', partOfSpeech: 'noun', exampleSentence: 'He has a high fever.', exampleTranslation: 'Er hat hohes Fieber.', difficulty: 2 },
      { word: 'Medicine', translation: 'Medizin/Medikament', pronunciation: '/ˈmɛdɪsɪn/', partOfSpeech: 'noun', exampleSentence: 'Take this medicine twice a day.', exampleTranslation: 'Nehmen Sie dieses Medikament zweimal täglich ein.', difficulty: 2 },
      { word: 'Pain', translation: 'Schmerz', pronunciation: '/peɪn/', partOfSpeech: 'noun', exampleSentence: 'I feel a sharp pain in my back.', exampleTranslation: 'Ich spüre einen stechenden Schmerz im Rücken.', difficulty: 1 },
      { word: 'Cough', translation: 'Husten', pronunciation: '/kɒf/', partOfSpeech: 'noun/verb', exampleSentence: 'She has a bad cough.', exampleTranslation: 'Sie hat schlimmen Husten.', difficulty: 2 },
      { word: 'Recover', translation: 'Sich erholen/genesen', pronunciation: '/rɪˈkʌvər/', partOfSpeech: 'verb', exampleSentence: 'It will take a week to recover.', exampleTranslation: 'Es wird eine Woche dauern, sich zu erholen.', difficulty: 2 },
      { word: 'Appointment', translation: 'Termin', pronunciation: '/əˈpɔɪntmənt/', partOfSpeech: 'noun', exampleSentence: 'I have an appointment at the clinic.', exampleTranslation: 'Ich habe einen Termin in der Klinik.', difficulty: 2 },
      { word: 'Pharmacy', translation: 'Apotheke', pronunciation: '/ˈfɑːrməsi/', partOfSpeech: 'noun', exampleSentence: 'Buy this at the pharmacy.', exampleTranslation: 'Kaufen Sie das in der Apotheke.', difficulty: 2 },
    ]
  },
  {
    name: 'Education & School', description: 'Learning vocabulary', level: 'B1', category: 'Academic', icon: '🏫',
    cards: [
      { word: 'Subject', translation: 'Schulfach', pronunciation: '/ˈsʌbdʒɪkt/', partOfSpeech: 'noun', exampleSentence: 'Math is my favorite subject.', exampleTranslation: 'Mathe ist mein Lieblingsfach.', difficulty: 1 },
      { word: 'Exam', translation: 'Prüfung', pronunciation: '/ɪɡˈzæm/', partOfSpeech: 'noun', exampleSentence: 'I have a history exam tomorrow.', exampleTranslation: 'Ich habe morgen eine Geschichtsprüfung.', difficulty: 1 },
      { word: 'Assignment', translation: 'Aufgabe', pronunciation: '/əˈsaɪnmənt/', partOfSpeech: 'noun', exampleSentence: 'Hand in your assignment by Friday.', exampleTranslation: 'Reichen Sie Ihre Aufgabe bis Freitag ein.', difficulty: 2 },
      { word: 'Knowledge', translation: 'Wissen', pronunciation: '/ˈnɒlɪdʒ/', partOfSpeech: 'noun', exampleSentence: 'Knowledge is power.', exampleTranslation: 'Wissen ist Macht.', difficulty: 2 },
      { word: 'Degree', translation: 'Abschluss', pronunciation: '/dɪˈɡriː/', partOfSpeech: 'noun', exampleSentence: 'She has a degree in biology.', exampleTranslation: 'Sie hat einen Abschluss in Biologie.', difficulty: 2 },
      { word: 'Lecture', translation: 'Vorlesung', pronunciation: '/ˈlɛktʃər/', partOfSpeech: 'noun', exampleSentence: 'The lecture was very boring.', exampleTranslation: 'Die Vorlesung war sehr langweilig.', difficulty: 2 },
      { word: 'Term', translation: 'Semester/Trimester', pronunciation: '/tɜːrm/', partOfSpeech: 'noun', exampleSentence: 'The autumn term starts soon.', exampleTranslation: 'Das Herbstsemester beginnt bald.', difficulty: 2 },
      { word: 'Research', translation: 'Forschung / recherchieren', pronunciation: '/rɪˈsɜːrtʃ/', partOfSpeech: 'noun/verb', exampleSentence: 'They are doing research on climate change.', exampleTranslation: 'Sie forschen zum Klimawandel.', difficulty: 2 },
      { word: 'Improve', translation: 'Verbessern', pronunciation: '/ɪmˈpruːv/', partOfSpeech: 'verb', exampleSentence: 'I want to improve my English.', exampleTranslation: 'Ich möchte mein Englisch verbessern.', difficulty: 1 },
      { word: 'Grade', translation: 'Note', pronunciation: '/ɡreɪd/', partOfSpeech: 'noun', exampleSentence: 'He got a good grade.', exampleTranslation: 'Er hat eine gute Note bekommen.', difficulty: 1 },
    ]
  },
  {
    name: 'Environment & Nature', description: 'Vocabulary about the planet', level: 'B1', category: 'Environment', icon: '🌍',
    cards: [
      { word: 'Pollution', translation: 'Umweltverschmutzung', pronunciation: '/pəˈluːʃən/', partOfSpeech: 'noun', exampleSentence: 'Air pollution is a major problem.', exampleTranslation: 'Luftverschmutzung ist ein großes Problem.', difficulty: 2 },
      { word: 'Environment', translation: 'Umwelt', pronunciation: '/ɪnˈvaɪrənmənt/', partOfSpeech: 'noun', exampleSentence: 'We must protect the environment.', exampleTranslation: 'Wir müssen die Umwelt schützen.', difficulty: 2 },
      { word: 'Climate', translation: 'Klima', pronunciation: '/ˈklaɪmət/', partOfSpeech: 'noun', exampleSentence: 'The climate is changing rapidly.', exampleTranslation: 'Das Klima ändert sich schnell.', difficulty: 2 },
      { word: 'Recycle', translation: 'Wiederverwerten', pronunciation: '/ˌriːˈsaɪkəl/', partOfSpeech: 'verb', exampleSentence: 'Always recycle paper and plastic.', exampleTranslation: 'Recycle immer Papier und Plastik.', difficulty: 2 },
      { word: 'Wildlife', translation: 'Tierwelt', pronunciation: '/ˈwaɪldlaɪf/', partOfSpeech: 'noun', exampleSentence: 'The forest is full of wildlife.', exampleTranslation: 'Der Wald ist voller Tierwelt.', difficulty: 2 },
      { word: 'Species', translation: 'Art / Spezies', pronunciation: '/ˈspiːʃiːz/', partOfSpeech: 'noun', exampleSentence: 'Many species are in danger.', exampleTranslation: 'Viele Arten sind in Gefahr.', difficulty: 3 },
      { word: 'Waste', translation: 'Abfall/Müll', pronunciation: '/weɪst/', partOfSpeech: 'noun', exampleSentence: 'Don\'t throw waste in the river.', exampleTranslation: 'Wirf keinen Müll in den Fluss.', difficulty: 2 },
      { word: 'Protect', translation: 'Schützen', pronunciation: '/prəˈtɛkt/', partOfSpeech: 'verb', exampleSentence: 'Protect our oceans.', exampleTranslation: 'Schützt unsere Ozeane.', difficulty: 1 },
      { word: 'Global warming', translation: 'Erderwärmung', pronunciation: '/ˈɡloʊbəl ˈwɔːrmɪŋ/', partOfSpeech: 'noun', exampleSentence: 'Global warming causes ice to melt.', exampleTranslation: 'Erderwärmung lässt Eis schmelzen.', difficulty: 2 },
      { word: 'Renewable', translation: 'Erneuerbar', pronunciation: '/rɪˈnjuːəbəl/', partOfSpeech: 'adj', exampleSentence: 'We need renewable energy.', exampleTranslation: 'Wir brauchen erneuerbare Energie.', difficulty: 3 },
    ]
  },
  {
    name: 'Media & Entertainment', description: 'TV, internet, and news', level: 'B1', category: 'Media', icon: '📺',
    cards: [
      { word: 'Broadcast', translation: 'Senden / Übertragung', pronunciation: '/ˈbrɔːdkæst/', partOfSpeech: 'verb/noun', exampleSentence: 'The match will be broadcast live.', exampleTranslation: 'Das Spiel wird live übertragen.', difficulty: 3 },
      { word: 'Audience', translation: 'Publikum', pronunciation: '/ˈɔːdiəns/', partOfSpeech: 'noun', exampleSentence: 'The audience clapped loudly.', exampleTranslation: 'Das Publikum klatschte laut.', difficulty: 2 },
      { word: 'Channel', translation: 'Sender/Kanal', pronunciation: '/ˈtʃænəl/', partOfSpeech: 'noun', exampleSentence: 'Switch to another channel.', exampleTranslation: 'Schalte auf einen anderen Sender.', difficulty: 1 },
      { word: 'Headline', translation: 'Schlagzeile', pronunciation: '/ˈhɛdlaɪn/', partOfSpeech: 'noun', exampleSentence: 'Did you read the headline today?', exampleTranslation: 'Hast du heute die Schlagzeile gelesen?', difficulty: 2 },
      { word: 'Review', translation: 'Bewertung / Kritik', pronunciation: '/rɪˈvjuː/', partOfSpeech: 'noun', exampleSentence: 'The movie got good reviews.', exampleTranslation: 'Der Film bekam gute Kritiken.', difficulty: 2 },
      { word: 'Episode', translation: 'Folge', pronunciation: '/ˈɛpɪsoʊd/', partOfSpeech: 'noun', exampleSentence: 'I watched the last episode.', exampleTranslation: 'Ich habe die letzte Folge gesehen.', difficulty: 2 },
      { word: 'Article', translation: 'Artikel', pronunciation: '/ˈɑːrtɪkəl/', partOfSpeech: 'noun', exampleSentence: 'She wrote an article about it.', exampleTranslation: 'Sie schrieb einen Artikel darüber.', difficulty: 1 },
      { word: 'Journalist', translation: 'Journalist/in', pronunciation: '/ˈdʒɜːrnəlɪst/', partOfSpeech: 'noun', exampleSentence: 'The journalist interviewed the mayor.', exampleTranslation: 'Der Journalist interviewte den Bürgermeister.', difficulty: 2 },
      { word: 'Advertisement', translation: 'Werbung', pronunciation: '/ədˈvɜːrtɪsmənt/', partOfSpeech: 'noun', exampleSentence: 'That advertisement is very funny.', exampleTranslation: 'Diese Werbung ist sehr lustig.', difficulty: 3 },
      { word: 'Subscribe', translation: 'Abonnieren', pronunciation: '/səbˈskraɪb/', partOfSpeech: 'verb', exampleSentence: 'Don\'t forget to subscribe.', exampleTranslation: 'Vergiss nicht zu abonnieren.', difficulty: 2 },
    ]
  },

  // B2
  {
    name: 'Technology & Internet', description: 'Advanced tech vocabulary', level: 'B2', category: 'Technology', icon: '💻',
    cards: [
      { word: 'Algorithm', translation: 'Algorithmus', pronunciation: '/ˈælɡərɪðəm/', partOfSpeech: 'noun', exampleSentence: 'The algorithm recommends videos.', exampleTranslation: 'Der Algorithmus empfiehlt Videos.', difficulty: 3 },
      { word: 'Cybersecurity', translation: 'Cybersicherheit', pronunciation: '/ˌsaɪbərsɪˈkjʊərɪti/', partOfSpeech: 'noun', exampleSentence: 'Cybersecurity is a growing field.', exampleTranslation: 'Cybersicherheit ist ein wachsendes Feld.', difficulty: 4 },
      { word: 'Bandwidth', translation: 'Bandbreite', pronunciation: '/ˈbændwɪdθ/', partOfSpeech: 'noun', exampleSentence: 'We don\'t have the bandwidth for this.', exampleTranslation: 'Wir haben nicht die Bandbreite dafür.', difficulty: 3 },
      { word: 'Encrypt', translation: 'Verschlüsseln', pronunciation: '/ɪnˈkrɪpt/', partOfSpeech: 'verb', exampleSentence: 'All messages are encrypted.', exampleTranslation: 'Alle Nachrichten sind verschlüsselt.', difficulty: 3 },
      { word: 'Database', translation: 'Datenbank', pronunciation: '/ˈdeɪtəbeɪs/', partOfSpeech: 'noun', exampleSentence: 'The information is stored in a database.', exampleTranslation: 'Die Informationen sind in einer Datenbank gespeichert.', difficulty: 2 },
      { word: 'Outdated', translation: 'Veraltet', pronunciation: '/ˌaʊtˈdeɪtɪd/', partOfSpeech: 'adj', exampleSentence: 'This software is outdated.', exampleTranslation: 'Diese Software ist veraltet.', difficulty: 3 },
      { word: 'Innovative', translation: 'Innovativ', pronunciation: '/ˈɪnəveɪtɪv/', partOfSpeech: 'adj', exampleSentence: 'It is a highly innovative product.', exampleTranslation: 'Es ist ein hochinnovatives Produkt.', difficulty: 3 },
      { word: 'Malware', translation: 'Schadsoftware', pronunciation: '/ˈmælwɛər/', partOfSpeech: 'noun', exampleSentence: 'The computer was infected with malware.', exampleTranslation: 'Der Computer war mit Schadsoftware infiziert.', difficulty: 3 },
      { word: 'Glitch', translation: 'Störung / Fehler', pronunciation: '/ɡlɪtʃ/', partOfSpeech: 'noun', exampleSentence: 'A minor glitch caused the delay.', exampleTranslation: 'Eine kleine Störung verursachte die Verzögerung.', difficulty: 3 },
      { word: 'Virtual', translation: 'Virtuell', pronunciation: '/ˈvɜːrtʃuəl/', partOfSpeech: 'adj', exampleSentence: 'They held a virtual meeting.', exampleTranslation: 'Sie hielten ein virtuelles Meeting ab.', difficulty: 2 },
    ]
  },
  {
    name: 'Society & Politics', description: 'Vocabulary for discussing society', level: 'B2', category: 'Society', icon: '⚖️',
    cards: [
      { word: 'Democracy', translation: 'Demokratie', pronunciation: '/dɪˈmɒkrəsi/', partOfSpeech: 'noun', exampleSentence: 'Democracy relies on free elections.', exampleTranslation: 'Demokratie beruht auf freien Wahlen.', difficulty: 3 },
      { word: 'Candidate', translation: 'Kandidat/in', pronunciation: '/ˈkændɪdət/', partOfSpeech: 'noun', exampleSentence: 'Who is the best candidate?', exampleTranslation: 'Wer ist der beste Kandidat?', difficulty: 2 },
      { word: 'Citizen', translation: 'Bürger/in', pronunciation: '/ˈsɪtɪzən/', partOfSpeech: 'noun', exampleSentence: 'Every citizen has the right to vote.', exampleTranslation: 'Jeder Bürger hat das Recht zu wählen.', difficulty: 2 },
      { word: 'Policy', translation: 'Richtlinie / Politik', pronunciation: '/ˈpɒlɪsi/', partOfSpeech: 'noun', exampleSentence: 'The government introduced a new policy.', exampleTranslation: 'Die Regierung führte eine neue Richtlinie ein.', difficulty: 3 },
      { word: 'Campaign', translation: 'Kampagne', pronunciation: '/kæmˈpeɪn/', partOfSpeech: 'noun', exampleSentence: 'The election campaign has started.', exampleTranslation: 'Der Wahlkampf hat begonnen.', difficulty: 3 },
      { word: 'Poverty', translation: 'Armut', pronunciation: '/ˈpɒvərti/', partOfSpeech: 'noun', exampleSentence: 'They aim to reduce child poverty.', exampleTranslation: 'Sie wollen Kinderarmut reduzieren.', difficulty: 3 },
      { word: 'Equality', translation: 'Gleichheit', pronunciation: '/ɪˈkwɒlɪti/', partOfSpeech: 'noun', exampleSentence: 'We fight for gender equality.', exampleTranslation: 'Wir kämpfen für die Gleichstellung der Geschlechter.', difficulty: 3 },
      { word: 'Majority', translation: 'Mehrheit', pronunciation: '/məˈdʒɒrɪti/', partOfSpeech: 'noun', exampleSentence: 'The vast majority agreed with him.', exampleTranslation: 'Die große Mehrheit stimmte ihm zu.', difficulty: 3 },
      { word: 'Debate', translation: 'Debatte', pronunciation: '/dɪˈbeɪt/', partOfSpeech: 'noun/verb', exampleSentence: 'There was a heated debate.', exampleTranslation: 'Es gab eine hitzige Debatte.', difficulty: 2 },
      { word: 'Legislation', translation: 'Gesetzgebung', pronunciation: '/ˌlɛdʒɪsˈleɪʃən/', partOfSpeech: 'noun', exampleSentence: 'The new legislation will affect everyone.', exampleTranslation: 'Die neue Gesetzgebung wird jeden betreffen.', difficulty: 4 },
    ]
  },
  {
    name: 'Economy & Finance', description: 'Talking about money and business', level: 'B2', category: 'Business', icon: '📈',
    cards: [
      { word: 'Investment', translation: 'Investition', pronunciation: '/ɪnˈvɛstmənt/', partOfSpeech: 'noun', exampleSentence: 'Buying a house is a good investment.', exampleTranslation: 'Ein Haus zu kaufen ist eine gute Investition.', difficulty: 3 },
      { word: 'Currency', translation: 'Währung', pronunciation: '/ˈkʌrənsi/', partOfSpeech: 'noun', exampleSentence: 'The local currency is the Euro.', exampleTranslation: 'Die lokale Währung ist der Euro.', difficulty: 3 },
      { word: 'Interest rate', translation: 'Zinssatz', pronunciation: '/ˈɪntrɪst reɪt/', partOfSpeech: 'noun', exampleSentence: 'Interest rates have gone up.', exampleTranslation: 'Die Zinssätze sind gestiegen.', difficulty: 3 },
      { word: 'Revenue', translation: 'Einnahmen / Umsatz', pronunciation: '/ˈrɛvənjuː/', partOfSpeech: 'noun', exampleSentence: 'Company revenue increased this year.', exampleTranslation: 'Der Unternehmensumsatz stieg in diesem Jahr.', difficulty: 4 },
      { word: 'Bankruptcy', translation: 'Bankrott', pronunciation: '/ˈbæŋkrʌptsi/', partOfSpeech: 'noun', exampleSentence: 'The firm is facing bankruptcy.', exampleTranslation: 'Die Firma steht vor dem Bankrott.', difficulty: 4 },
      { word: 'Inflation', translation: 'Inflation', pronunciation: '/ɪnˈfleɪʃən/', partOfSpeech: 'noun', exampleSentence: 'Inflation reduces purchasing power.', exampleTranslation: 'Inflation verringert die Kaufkraft.', difficulty: 3 },
      { word: 'Shareholder', translation: 'Aktionär', pronunciation: '/ˈʃɛərˌhoʊldər/', partOfSpeech: 'noun', exampleSentence: 'The shareholders demand a profit.', exampleTranslation: 'Die Aktionäre fordern einen Gewinn.', difficulty: 4 },
      { word: 'Budget', translation: 'Budget / Haushaltsplan', pronunciation: '/ˈbʌdʒɪt/', partOfSpeech: 'noun', exampleSentence: 'We have a limited budget.', exampleTranslation: 'Wir haben ein begrenztes Budget.', difficulty: 2 },
      { word: 'Mortgage', translation: 'Hypothek', pronunciation: '/ˈmɔːrɡɪdʒ/', partOfSpeech: 'noun', exampleSentence: 'They took out a mortgage to buy the house.', exampleTranslation: 'Sie nahmen eine Hypothek auf, um das Haus zu kaufen.', difficulty: 4 },
      { word: 'Profit', translation: 'Gewinn', pronunciation: '/ˈprɒfɪt/', partOfSpeech: 'noun', exampleSentence: 'They made a huge profit.', exampleTranslation: 'Sie haben einen riesigen Gewinn gemacht.', difficulty: 2 },
    ]
  },
  {
    name: 'Crime & Law', description: 'Legal and criminal vocabulary', level: 'B2', category: 'Society', icon: '👮',
    cards: [
      { word: 'Evidence', translation: 'Beweis(e)', pronunciation: '/ˈɛvɪdəns/', partOfSpeech: 'noun', exampleSentence: 'There is not enough evidence.', exampleTranslation: 'Es gibt nicht genügend Beweise.', difficulty: 3 },
      { word: 'Guilty', translation: 'Schuldig', pronunciation: '/ˈɡɪlti/', partOfSpeech: 'adj', exampleSentence: 'The jury found him guilty.', exampleTranslation: 'Die Geschworenen befanden ihn für schuldig.', difficulty: 3 },
      { word: 'Innocent', translation: 'Unschuldig', pronunciation: '/ˈɪnəsənt/', partOfSpeech: 'adj', exampleSentence: 'She proved she was innocent.', exampleTranslation: 'Sie bewies, dass sie unschuldig war.', difficulty: 3 },
      { word: 'Witness', translation: 'Zeuge / Zeugin', pronunciation: '/ˈwɪtnəs/', partOfSpeech: 'noun', exampleSentence: 'There was only one witness to the crime.', exampleTranslation: 'Es gab nur einen Zeugen des Verbrechens.', difficulty: 3 },
      { word: 'Sentence', translation: 'Urteil / Strafe', pronunciation: '/ˈsɛntəns/', partOfSpeech: 'noun', exampleSentence: 'He received a life sentence.', exampleTranslation: 'Er erhielt eine lebenslange Haftstrafe.', difficulty: 3 },
      { word: 'Arrest', translation: 'Verhaften', pronunciation: '/əˈrɛst/', partOfSpeech: 'verb', exampleSentence: 'The police arrested the suspect.', exampleTranslation: 'Die Polizei verhaftete den Verdächtigen.', difficulty: 2 },
      { word: 'Suspect', translation: 'Verdächtige(r)', pronunciation: '/ˈsʌspɛkt/', partOfSpeech: 'noun', exampleSentence: 'The suspect was released.', exampleTranslation: 'Der Verdächtige wurde freigelassen.', difficulty: 3 },
      { word: 'Judge', translation: 'Richter/in', pronunciation: '/dʒʌdʒ/', partOfSpeech: 'noun', exampleSentence: 'The judge entered the courtroom.', exampleTranslation: 'Der Richter betrat den Gerichtssaal.', difficulty: 2 },
      { word: 'Jury', translation: 'Geschworene', pronunciation: '/ˈdʒʊəri/', partOfSpeech: 'noun', exampleSentence: 'The jury is still deliberating.', exampleTranslation: 'Die Geschworenen beraten noch.', difficulty: 3 },
      { word: 'Lawyer', translation: 'Anwalt/Anwältin', pronunciation: '/ˈlɔːjər/', partOfSpeech: 'noun', exampleSentence: 'You should call your lawyer.', exampleTranslation: 'Du solltest deinen Anwalt anrufen.', difficulty: 2 },
    ]
  },
  {
    name: 'Relationships & Emotions', description: 'Expressing feelings and bonds', level: 'B2', category: 'Daily', icon: '❤️',
    cards: [
      { word: 'Anxious', translation: 'Ängstlich / besorgt', pronunciation: '/ˈæŋkʃəs/', partOfSpeech: 'adj', exampleSentence: 'I feel anxious about the test.', exampleTranslation: 'Ich bin besorgt wegen des Tests.', difficulty: 3 },
      { word: 'Empathy', translation: 'Empathie / Mitgefühl', pronunciation: '/ˈɛmpəθi/', partOfSpeech: 'noun', exampleSentence: 'Empathy is important in a relationship.', exampleTranslation: 'Empathie ist in einer Beziehung wichtig.', difficulty: 3 },
      { word: 'Jealousy', translation: 'Eifersucht', pronunciation: '/ˈdʒɛləsi/', partOfSpeech: 'noun', exampleSentence: 'Jealousy can destroy trust.', exampleTranslation: 'Eifersucht kann Vertrauen zerstören.', difficulty: 3 },
      { word: 'Acquaintance', translation: 'Bekannte(r)', pronunciation: '/əˈkweɪntəns/', partOfSpeech: 'noun', exampleSentence: 'He is just an acquaintance.', exampleTranslation: 'Er ist nur ein Bekannter.', difficulty: 4 },
      { word: 'Affection', translation: 'Zuneigung', pronunciation: '/əˈfɛkʃən/', partOfSpeech: 'noun', exampleSentence: 'She showed deep affection for him.', exampleTranslation: 'Sie zeigte tiefe Zuneigung zu ihm.', difficulty: 3 },
      { word: 'Conflict', translation: 'Konflikt', pronunciation: '/ˈkɒnflɪkt/', partOfSpeech: 'noun', exampleSentence: 'They tried to resolve their conflict.', exampleTranslation: 'Sie versuchten, ihren Konflikt zu lösen.', difficulty: 2 },
      { word: 'Devoted', translation: 'Hingebungsvoll', pronunciation: '/dɪˈvoʊtɪd/', partOfSpeech: 'adj', exampleSentence: 'He is a devoted father.', exampleTranslation: 'Er ist ein hingebungsvoller Vater.', difficulty: 4 },
      { word: 'Overwhelmed', translation: 'Überwältigt / überfordert', pronunciation: '/ˌoʊvərˈwɛlmd/', partOfSpeech: 'adj', exampleSentence: 'I am completely overwhelmed by work.', exampleTranslation: 'Ich bin von der Arbeit völlig überfordert.', difficulty: 4 },
      { word: 'Grateful', translation: 'Dankbar', pronunciation: '/ˈɡreɪtfəl/', partOfSpeech: 'adj', exampleSentence: 'I am grateful for your help.', exampleTranslation: 'Ich bin dankbar für deine Hilfe.', difficulty: 3 },
      { word: 'Resentment', translation: 'Groll / Missgunst', pronunciation: '/rɪˈzɛntmənt/', partOfSpeech: 'noun', exampleSentence: 'He harbored deep resentment.', exampleTranslation: 'Er hegte tiefen Groll.', difficulty: 5 },
    ]
  },

  // C1
  {
    name: 'Science & Research', description: 'Advanced academic vocabulary', level: 'C1', category: 'Academic', icon: '🔬',
    cards: [
      { word: 'Hypothesis', translation: 'Hypothese', pronunciation: '/haɪˈpɒθɪsɪs/', partOfSpeech: 'noun', exampleSentence: 'They tested their hypothesis extensively.', exampleTranslation: 'Sie haben ihre Hypothese ausführlich getestet.', difficulty: 4 },
      { word: 'Empirical', translation: 'Empirisch', pronunciation: '/ɪmˈpɪrɪkəl/', partOfSpeech: 'adj', exampleSentence: 'The paper provides empirical evidence.', exampleTranslation: 'Die Arbeit liefert empirische Beweise.', difficulty: 4 },
      { word: 'Correlate', translation: 'Korrelieren', pronunciation: '/ˈkɒrəleɪt/', partOfSpeech: 'verb', exampleSentence: 'Poverty often correlates with poor health.', exampleTranslation: 'Armut korreliert oft mit schlechter Gesundheit.', difficulty: 4 },
      { word: 'Qualitative', translation: 'Qualitativ', pronunciation: '/ˈkwɒlɪtətɪv/', partOfSpeech: 'adj', exampleSentence: 'They conducted qualitative research.', exampleTranslation: 'Sie führten qualitative Forschung durch.', difficulty: 4 },
      { word: 'Peer-reviewed', translation: 'Zusatzgeprüft (von Fachkollegen)', pronunciation: '/ˈpɪər rɪˈvjuːd/', partOfSpeech: 'adj', exampleSentence: 'It was published in a peer-reviewed journal.', exampleTranslation: 'Es wurde in einer peer-reviewten Fachzeitschrift veröffentlicht.', difficulty: 4 },
      { word: 'Methodology', translation: 'Methodik', pronunciation: '/ˌmɛθəˈdɒlədʒi/', partOfSpeech: 'noun', exampleSentence: 'The methodology is fundamentally flawed.', exampleTranslation: 'Die Methodik ist grundlegend fehlerhaft.', difficulty: 4 },
      { word: 'Valid', translation: 'Gültig', pronunciation: '/ˈvælɪd/', partOfSpeech: 'adj', exampleSentence: 'Is this argument logically valid?', exampleTranslation: 'Ist dieses Argument logisch gültig?', difficulty: 3 },
      { word: 'Variable', translation: 'Variable', pronunciation: '/ˈvɛəriəbəl/', partOfSpeech: 'noun', exampleSentence: 'We must isolate the independent variable.', exampleTranslation: 'Wir müssen die unabhängige Variable isolieren.', difficulty: 4 },
      { word: 'Paradigm', translation: 'Paradigma', pronunciation: '/ˈpærədaɪm/', partOfSpeech: 'noun', exampleSentence: 'There was a major paradigm shift in physics.', exampleTranslation: 'Es gab einen großen Paradigmenwechsel in der Physik.', difficulty: 5 },
      { word: 'Synthesize', translation: 'Zusammenfassen / synthetisieren', pronunciation: '/ˈsɪnθəsaɪz/', partOfSpeech: 'verb', exampleSentence: 'The report synthesizes data from multiple studies.', exampleTranslation: 'Der Bericht fasst Daten aus mehreren Studien zusammen.', difficulty: 5 },
    ]
  },
  {
    name: 'Art & Literature', description: 'Vocabulary for culture and arts', level: 'C1', category: 'Culture', icon: '🎭',
    cards: [
      { word: 'Aesthetic', translation: 'Ästhetisch / Ästhetik', pronunciation: '/ɛsˈθɛtɪk/', partOfSpeech: 'adj/noun', exampleSentence: 'The film has a very distinct aesthetic.', exampleTranslation: 'Der Film hat eine sehr ausgeprägte Ästhetik.', difficulty: 4 },
      { word: 'Protagonist', translation: 'Protagonist / Hauptfigur', pronunciation: '/prəˈtæɡənɪst/', partOfSpeech: 'noun', exampleSentence: 'The protagonist is a flawed hero.', exampleTranslation: 'Der Protagonist ist ein fehlerhafter Held.', difficulty: 4 },
      { word: 'Masterpiece', translation: 'Meisterwerk', pronunciation: '/ˈmɑːstərpiːs/', partOfSpeech: 'noun', exampleSentence: 'It is considered his greatest masterpiece.', exampleTranslation: 'Es gilt als sein größtes Meisterwerk.', difficulty: 3 },
      { word: 'Metaphor', translation: 'Metapher', pronunciation: '/ˈmɛtəfər/', partOfSpeech: 'noun', exampleSentence: 'The poem is an extended metaphor.', exampleTranslation: 'Das Gedicht ist eine erweiterte Metapher.', difficulty: 4 },
      { word: 'Avant-garde', translation: 'Avantgardistisch', pronunciation: '/ˌævɒ̃ˈɡɑːrd/', partOfSpeech: 'adj', exampleSentence: 'The play is highly avant-garde.', exampleTranslation: 'Das Stück ist stark avantgardistisch.', difficulty: 5 },
      { word: 'Narrative', translation: 'Erzählung', pronunciation: '/ˈnærətɪv/', partOfSpeech: 'noun', exampleSentence: 'The narrative shifts between past and present.', exampleTranslation: 'Die Erzählung wechselt zwischen Vergangenheit und Gegenwart.', difficulty: 4 },
      { word: 'Evoke', translation: 'Hervorrufen', pronunciation: '/ɪˈvoʊk/', partOfSpeech: 'verb', exampleSentence: 'The painting evokes a sense of melancholy.', exampleTranslation: 'Das Gemälde ruft ein Gefühl von Melancholie hervor.', difficulty: 5 },
      { word: 'Genre', translation: 'Genre', pronunciation: '/ˈʒɒnrə/', partOfSpeech: 'noun', exampleSentence: 'It blends elements of the sci-fi genre.', exampleTranslation: 'Es mischt Elemente des Sci-Fi-Genres.', difficulty: 3 },
      { word: 'Abstract', translation: 'Abstrakt', pronunciation: '/ˈæbstrækt/', partOfSpeech: 'adj', exampleSentence: 'She creates abstract sculptures.', exampleTranslation: 'Sie erschafft abstrakte Skulpturen.', difficulty: 3 },
      { word: 'Nuance', translation: 'Nuance / Feinheit', pronunciation: '/ˈnjuːɑːns/', partOfSpeech: 'noun', exampleSentence: 'He missed the subtle nuances of the poem.', exampleTranslation: 'Er hat die subtilen Nuancen des Gedichts übersehen.', difficulty: 5 },
    ]
  },
  {
    name: 'Global Issues & Globalization', description: 'Vocabulary on global scale', level: 'C1', category: 'Society', icon: '🌐',
    cards: [
      { word: 'Sustainability', translation: 'Nachhaltigkeit', pronunciation: '/səˌsteɪnəˈbɪlɪti/', partOfSpeech: 'noun', exampleSentence: 'Sustainability is crucial for the future.', exampleTranslation: 'Nachhaltigkeit ist entscheidend für die Zukunft.', difficulty: 4 },
      { word: 'Migration', translation: 'Migration', pronunciation: '/maɪˈɡreɪʃən/', partOfSpeech: 'noun', exampleSentence: 'Climate change accelerates global migration.', exampleTranslation: 'Der Klimawandel beschleunigt die globale Migration.', difficulty: 3 },
      { word: 'Interconnected', translation: 'Miteinander verbunden', pronunciation: '/ˌɪntərkəˈnɛktɪd/', partOfSpeech: 'adj', exampleSentence: 'We live in an interconnected world.', exampleTranslation: 'Wir leben in einer vernetzten Welt.', difficulty: 4 },
      { word: 'Disparity', translation: 'Ungleichheit', pronunciation: '/dɪˈspærɪti/', partOfSpeech: 'noun', exampleSentence: 'There is a growing economic disparity.', exampleTranslation: 'Es gibt eine wachsende wirtschaftliche Ungleichheit.', difficulty: 5 },
      { word: 'Exploitation', translation: 'Ausbeutung', pronunciation: '/ˌɛksplɔɪˈteɪʃən/', partOfSpeech: 'noun', exampleSentence: 'The exploitation of natural resources must stop.', exampleTranslation: 'Die Ausbeutung natürlicher Ressourcen muss aufhören.', difficulty: 4 },
      { word: 'Sanctions', translation: 'Sanktionen', pronunciation: '/ˈsæŋkʃənz/', partOfSpeech: 'noun', exampleSentence: 'The UN imposed strict sanctions.', exampleTranslation: 'Die UNO verhängte strenge Sanktionen.', difficulty: 4 },
      { word: 'Sovereignty', translation: 'Souveränität', pronunciation: '/ˈsɒvrɪnti/', partOfSpeech: 'noun', exampleSentence: 'They claim their national sovereignty is threatened.', exampleTranslation: 'Sie behaupten, ihre nationale Souveränität sei bedroht.', difficulty: 5 },
      { word: 'Mitigate', translation: 'Mildern / abschwächen', pronunciation: '/ˈmɪtɪɡeɪt/', partOfSpeech: 'verb', exampleSentence: 'We must mitigate the impact of the crisis.', exampleTranslation: 'Wir müssen die Auswirkungen der Krise mildern.', difficulty: 5 },
      { word: 'Outsource', translation: 'Auslagern', pronunciation: '/ˈaʊtsɔːrs/', partOfSpeech: 'verb', exampleSentence: 'Many companies outsource their production.', exampleTranslation: 'Viele Unternehmen lagern ihre Produktion aus.', difficulty: 4 },
      { word: 'Homogeneous', translation: 'Homogen / gleichartig', pronunciation: '/ˌhoʊməˈdʒiːniəs/', partOfSpeech: 'adj', exampleSentence: 'The global market is becoming increasingly homogeneous.', exampleTranslation: 'Der globale Markt wird zunehmend homogener.', difficulty: 5 },
    ]
  },
  {
    name: 'Psychology & Mind', description: 'Words to describe the human mind', level: 'C1', category: 'Science', icon: '🧠',
    cards: [
      { word: 'Cognitive', translation: 'Kognitiv', pronunciation: '/ˈkɒɡnɪtɪv/', partOfSpeech: 'adj', exampleSentence: 'Cognitive behavioral therapy is very effective.', exampleTranslation: 'Kognitive Verhaltenstherapie ist sehr effektiv.', difficulty: 4 },
      { word: 'Subconscious', translation: 'Unterbewusstsein', pronunciation: '/sʌbˈkɒnʃəs/', partOfSpeech: 'noun/adj', exampleSentence: 'Our fears stem from the subconscious.', exampleTranslation: 'Unsere Ängste stammen aus dem Unterbewusstsein.', difficulty: 4 },
      { word: 'Introvert', translation: 'Introvertierte(r)', pronunciation: '/ˈɪntrəvɜːrt/', partOfSpeech: 'noun', exampleSentence: 'As an introvert, he dislikes large crowds.', exampleTranslation: 'Als Introvertierter mag er keine großen Menschenmengen.', difficulty: 4 },
      { word: 'Trauma', translation: 'Trauma', pronunciation: '/ˈtrɔːmə/', partOfSpeech: 'noun', exampleSentence: 'Childhood trauma can have lasting effects.', exampleTranslation: 'Kindheitstraumata können bleibende Auswirkungen haben.', difficulty: 4 },
      { word: 'Resilience', translation: 'Resilienz', pronunciation: '/rɪˈzɪliəns/', partOfSpeech: 'noun', exampleSentence: 'She showed remarkable resilience during the crisis.', exampleTranslation: 'Sie zeigte bemerkenswerte Resilienz während der Krise.', difficulty: 4 },
      { word: 'Narcissism', translation: 'Narzissmus', pronunciation: '/ˈnɑːrsɪsɪzəm/', partOfSpeech: 'noun', exampleSentence: 'His extreme narcissism alienated his friends.', exampleTranslation: 'Sein extremer Narzissmus entfremdete ihn von seinen Freunden.', difficulty: 5 },
      { word: 'Conditioning', translation: 'Konditionierung', pronunciation: '/kənˈdɪʃənɪŋ/', partOfSpeech: 'noun', exampleSentence: 'Social conditioning plays a major role.', exampleTranslation: 'Soziale Konditionierung spielt eine große Rolle.', difficulty: 4 },
      { word: 'Rationalize', translation: 'Rationalisieren', pronunciation: '/ˈræʃənəlaɪz/', partOfSpeech: 'verb', exampleSentence: 'He tried to rationalize his bad behavior.', exampleTranslation: 'Er versuchte, sein schlechtes Verhalten zu rationalisieren.', difficulty: 5 },
      { word: 'Empathy', translation: 'Empathie', pronunciation: '/ˈɛmpəθi/', partOfSpeech: 'noun', exampleSentence: 'Psychopaths lack empathy.', exampleTranslation: 'Psychopathen mangelt es an Empathie.', difficulty: 3 },
      { word: 'Mindfulness', translation: 'Achtsamkeit', pronunciation: '/ˈmaɪndfʊlnəs/', partOfSpeech: 'noun', exampleSentence: 'Mindfulness reduces stress.', exampleTranslation: 'Achtsamkeit reduziert Stress.', difficulty: 4 },
    ]
  },
  {
    name: 'Corporate Management', description: 'Advanced business terms', level: 'C1', category: 'Business', icon: '🏢',
    cards: [
      { word: 'Merger', translation: 'Fusion', pronunciation: '/ˈmɜːrdʒər/', partOfSpeech: 'noun', exampleSentence: 'The merger will create a monopoly.', exampleTranslation: 'Die Fusion wird ein Monopol schaffen.', difficulty: 4 },
      { word: 'Acquisition', translation: 'Übernahme', pronunciation: '/ˌækwɪˈzɪʃən/', partOfSpeech: 'noun', exampleSentence: 'The acquisition was finalized yesterday.', exampleTranslation: 'Die Übernahme wurde gestern abgeschlossen.', difficulty: 4 },
      { word: 'Stakeholder', translation: 'Interessengruppe', pronunciation: '/ˈsteɪkˌhoʊldər/', partOfSpeech: 'noun', exampleSentence: 'All stakeholders must agree to the plan.', exampleTranslation: 'Alle Interessengruppen müssen dem Plan zustimmen.', difficulty: 4 },
      { word: 'Liability', translation: 'Haftung / Verbindlichkeit', pronunciation: '/ˌlaɪəˈbɪlɪti/', partOfSpeech: 'noun', exampleSentence: 'The company has significant liabilities.', exampleTranslation: 'Das Unternehmen hat erhebliche Verbindlichkeiten.', difficulty: 5 },
      { word: 'Incentive', translation: 'Anreiz', pronunciation: '/ɪnˈsɛntɪv/', partOfSpeech: 'noun', exampleSentence: 'Tax incentives encourage investment.', exampleTranslation: 'Steuerliche Anreize fördern Investitionen.', difficulty: 4 },
      { word: 'Delegation', translation: 'Delegation / Übertragung', pronunciation: '/ˌdɛlɪˈɡeɪʃən/', partOfSpeech: 'noun', exampleSentence: 'Effective delegation is key to leadership.', exampleTranslation: 'Effektive Delegation ist der Schlüssel zur Führung.', difficulty: 4 },
      { word: 'Restructure', translation: 'Umstrukturieren', pronunciation: '/riːˈstrʌktʃər/', partOfSpeech: 'verb', exampleSentence: 'They are planning to restructure the department.', exampleTranslation: 'Sie planen, die Abteilung umzustrukturieren.', difficulty: 4 },
      { word: 'Monopoly', translation: 'Monopol', pronunciation: '/məˈnɒpəli/', partOfSpeech: 'noun', exampleSentence: 'The company holds a monopoly in the sector.', exampleTranslation: 'Das Unternehmen hält ein Monopol in diesem Sektor.', difficulty: 4 },
      { word: 'Overhead', translation: 'Laufende Betriebskosten', pronunciation: '/ˈoʊvərhɛd/', partOfSpeech: 'noun', exampleSentence: 'We need to cut overhead costs.', exampleTranslation: 'Wir müssen die laufenden Betriebskosten senken.', difficulty: 5 },
      { word: 'Synergy', translation: 'Synergie', pronunciation: '/ˈsɪnərdʒi/', partOfSpeech: 'noun', exampleSentence: 'The teams will work together to create synergy.', exampleTranslation: 'Die Teams werden zusammenarbeiten, um Synergien zu schaffen.', difficulty: 5 },
    ]
  },

  // C2
  {
    name: 'Philosophy & Ethics', description: 'Abstract and ethical discourse', level: 'C2', category: 'Academic', icon: '🤔',
    cards: [
      { word: 'Epistemology', translation: 'Erkenntnistheorie', pronunciation: '/ɪˌpɪstəˈmɒlədʒi/', partOfSpeech: 'noun', exampleSentence: 'Epistemology explores the nature of knowledge.', exampleTranslation: 'Die Erkenntnistheorie untersucht die Natur des Wissens.', difficulty: 5 },
      { word: 'Utilitarianism', translation: 'Utilitarismus', pronunciation: '/juːˌtɪlɪˈtɛəriənɪzəm/', partOfSpeech: 'noun', exampleSentence: 'Utilitarianism seeks the greatest good for the greatest number.', exampleTranslation: 'Der Utilitarismus strebt das größte Wohl für die größte Anzahl an.', difficulty: 5 },
      { word: 'Existentialism', translation: 'Existenzialismus', pronunciation: '/ˌɛɡzɪˈstɛnʃəlɪzəm/', partOfSpeech: 'noun', exampleSentence: 'Existentialism emphasizes individual freedom and choice.', exampleTranslation: 'Der Existenzialismus betont individuelle Freiheit und Wahl.', difficulty: 5 },
      { word: 'Axiom', translation: 'Axiom', pronunciation: '/ˈæksiəm/', partOfSpeech: 'noun', exampleSentence: 'It is a fundamental axiom of the theory.', exampleTranslation: 'Es ist ein grundlegendes Axiom der Theorie.', difficulty: 5 },
      { word: 'Dichotomy', translation: 'Dichotomie / Zweiteilung', pronunciation: '/daɪˈkɒtəmi/', partOfSpeech: 'noun', exampleSentence: 'The strict dichotomy between good and evil is overly simplistic.', exampleTranslation: 'Die strenge Zweiteilung zwischen Gut und Böse ist zu vereinfacht.', difficulty: 5 },
      { word: 'Ontology', translation: 'Ontologie (Seinslehre)', pronunciation: '/ɒnˈtɒlədʒi/', partOfSpeech: 'noun', exampleSentence: 'Ontology is the branch of metaphysics dealing with the nature of being.', exampleTranslation: 'Ontology ist der Zweig der Metaphysik, der sich mit der Natur des Seins befasst.', difficulty: 5 },
      { word: 'Fallacy', translation: 'Trugschluss', pronunciation: '/ˈfæləsi/', partOfSpeech: 'noun', exampleSentence: 'His argument is based on a logical fallacy.', exampleTranslation: 'Sein Argument basiert auf einem logischen Trugschluss.', difficulty: 5 },
      { word: 'Subjective', translation: 'Subjektiv', pronunciation: '/səbˈdʒɛktɪv/', partOfSpeech: 'adj', exampleSentence: 'Morality is inherently subjective to some degree.', exampleTranslation: 'Moral ist bis zu einem gewissen Grad von Natur aus subjektiv.', difficulty: 4 },
      { word: 'Altruism', translation: 'Altruismus', pronunciation: '/ˈæltruɪzəm/', partOfSpeech: 'noun', exampleSentence: 'True altruism involves selfless concern for others.', exampleTranslation: 'Wahrer Altruismus beinhaltet selbstlose Fürsorge für andere.', difficulty: 5 },
      { word: 'Determinism', translation: 'Determinismus', pronunciation: '/dɪˈtɜːrmɪnɪzəm/', partOfSpeech: 'noun', exampleSentence: 'Determinism argues that all events are determined by preceding causes.', exampleTranslation: 'Determinismus argumentiert, dass alle Ereignisse durch vorhergehende Ursachen bestimmt sind.', difficulty: 5 },
    ]
  },
  {
    name: 'Advanced Idioms', description: 'Native-level idiomatic expressions', level: 'C2', category: 'Idioms', icon: '💬',
    cards: [
      { word: 'To bite the bullet', translation: 'In den sauren Apfel beißen', pronunciation: '/baɪt ðə ˈbʊlɪt/', partOfSpeech: 'idiom', exampleSentence: 'I have to bite the bullet and tell the truth.', exampleTranslation: 'Ich muss in den sauren Apfel beißen und die Wahrheit sagen.', difficulty: 5 },
      { word: 'Once in a blue moon', translation: 'Alle Jubeljahre (sehr selten)', pronunciation: '/wʌns ɪn ə bluː muːn/', partOfSpeech: 'idiom', exampleSentence: 'They visit us once in a blue moon.', exampleTranslation: 'Sie besuchen uns alle Jubeljahre.', difficulty: 4 },
      { word: 'Under the weather', translation: 'Angeschlagen / krank', pronunciation: '/ˈʌndər ðə ˈwɛðər/', partOfSpeech: 'idiom', exampleSentence: 'I\'m feeling a bit under the weather today.', exampleTranslation: 'Ich fühle mich heute etwas angeschlagen.', difficulty: 4 },
      { word: 'To cost an arm and a leg', translation: 'Ein Vermögen kosten', pronunciation: '/kɒst ən ɑːrm ənd ə lɛɡ/', partOfSpeech: 'idiom', exampleSentence: 'That car must have cost an arm and a leg.', exampleTranslation: 'Das Auto muss ein Vermögen gekostet haben.', difficulty: 4 },
      { word: 'Spill the beans', translation: 'Auspacken / ein Geheimnis verraten', pronunciation: '/spɪl ðə biːnz/', partOfSpeech: 'idiom', exampleSentence: 'Come on, spill the beans!', exampleTranslation: 'Komm schon, pack aus!', difficulty: 4 },
      { word: 'To jump on the bandwagon', translation: 'Auf den Zug aufspringen (Trend mitmachen)', pronunciation: '/dʒʌmp ɒn ðə ˈbændˌwæɡən/', partOfSpeech: 'idiom', exampleSentence: 'Many companies are jumping on the green bandwagon.', exampleTranslation: 'Viele Unternehmen springen auf den grünen Zug auf.', difficulty: 5 },
      { word: 'To cut corners', translation: 'An allen Ecken und Enden sparen (Pfusch)', pronunciation: '/kʌt ˈkɔːrnərz/', partOfSpeech: 'idiom', exampleSentence: 'The builders cut corners to save money.', exampleTranslation: 'Die Bauarbeiter haben gepfuscht, um Geld zu sparen.', difficulty: 5 },
      { word: 'A blessing in disguise', translation: 'Glück im Unglück', pronunciation: '/ə ˈblɛsɪŋ ɪn dɪsˈɡaɪz/', partOfSpeech: 'idiom', exampleSentence: 'Losing that job was a blessing in disguise.', exampleTranslation: 'Diesen Job zu verlieren, war ein Glück im Unglück.', difficulty: 5 },
      { word: 'To sit on the fence', translation: 'Sich nicht entscheiden können / neutral bleiben', pronunciation: '/sɪt ɒn ðə fɛns/', partOfSpeech: 'idiom', exampleSentence: 'You can\'t sit on the fence any longer.', exampleTranslation: 'Du kannst nicht noch länger neutral bleiben.', difficulty: 5 },
      { word: 'To play devil\'s advocate', translation: 'Des Teufels Advokat spielen (Gegenposition einnehmen)', pronunciation: '/pleɪ ˈdɛvəlz ˈædvəkət/', partOfSpeech: 'idiom', exampleSentence: 'Let me play devil\'s advocate for a moment.', exampleTranslation: 'Lass mich mal kurz des Teufels Advokat spielen.', difficulty: 5 },
    ]
  },
  {
    name: 'Academic Discourse', description: 'Rhetoric and academic discussion', level: 'C2', category: 'Academic', icon: '🏛️',
    cards: [
      { word: 'Ubiquitous', translation: 'Allgegenwärtig', pronunciation: '/juːˈbɪkwɪtəs/', partOfSpeech: 'adj', exampleSentence: 'Smartphones have become ubiquitous.', exampleTranslation: 'Smartphones sind allgegenwärtig geworden.', difficulty: 5 },
      { word: 'Elucidate', translation: 'Erläutern / erhellen', pronunciation: '/ɪˈluːsɪdeɪt/', partOfSpeech: 'verb', exampleSentence: 'He was asked to elucidate his theory.', exampleTranslation: 'Er wurde gebeten, seine Theorie zu erläutern.', difficulty: 5 },
      { word: 'Conundrum', translation: 'Rätsel / schwierige Frage', pronunciation: '/kəˈnʌndrəm/', partOfSpeech: 'noun', exampleSentence: 'It presents a moral conundrum.', exampleTranslation: 'Es stellt ein moralisches Rätsel dar.', difficulty: 5 },
      { word: 'Paradoxical', translation: 'Paradox', pronunciation: '/ˌpærəˈdɒksɪkəl/', partOfSpeech: 'adj', exampleSentence: 'It seems paradoxical, but it is true.', exampleTranslation: 'Es scheint paradox, aber es ist wahr.', difficulty: 5 },
      { word: 'Corroborate', translation: 'Bestätigen / untermauern', pronunciation: '/kəˈrɒbəreɪt/', partOfSpeech: 'verb', exampleSentence: 'The evidence corroborates her testimony.', exampleTranslation: 'Die Beweise untermauern ihre Aussage.', difficulty: 5 },
      { word: 'Extrapolate', translation: 'Extrapolieren (hoch- / ableiten)', pronunciation: '/ɪkˈstræpəleɪt/', partOfSpeech: 'verb', exampleSentence: 'We can extrapolate from these results.', exampleTranslation: 'Wir können aus diesen Ergebnissen extrapolieren.', difficulty: 5 },
      { word: 'Salient', translation: 'Herausstechend / wichtigst', pronunciation: '/ˈseɪliənt/', partOfSpeech: 'adj', exampleSentence: 'She summarized the most salient points.', exampleTranslation: 'Sie fasste die wichtigsten Punkte zusammen.', difficulty: 5 },
      { word: 'Juxtapose', translation: 'Gegenüberstellen', pronunciation: '/ˌdʒʌkstəˈpoʊz/', partOfSpeech: 'verb', exampleSentence: 'The exhibition juxtaposes modern and ancient art.', exampleTranslation: 'Die Ausstellung stellt moderne und antike Kunst gegenüber.', difficulty: 5 },
      { word: 'Pragmatism', translation: 'Pragmatismus', pronunciation: '/ˈpræɡmətɪzəm/', partOfSpeech: 'noun', exampleSentence: 'He approaches problems with fierce pragmatism.', exampleTranslation: 'Er geht Probleme mit einem strengen Pragmatismus an.', difficulty: 5 },
      { word: 'Pernicious', translation: 'Verderblich / schädlich', pronunciation: '/pərˈnɪʃəs/', partOfSpeech: 'adj', exampleSentence: 'The pernicious effects of corruption are widespread.', exampleTranslation: 'Die schädlichen Auswirkungen der Korruption sind weit verbreitet.', difficulty: 5 },
    ]
  },
  {
    name: 'Nuances of Speech', description: 'Advanced verbs and descriptions', level: 'C2', category: 'Academic', icon: '🗣️',
    cards: [
      { word: 'Mutter', translation: 'Murmeln', pronunciation: '/ˈmʌtər/', partOfSpeech: 'verb', exampleSentence: 'He muttered under his breath.', exampleTranslation: 'Er murmelte vor sich hin.', difficulty: 4 },
      { word: 'Exaggerate', translation: 'Übertreiben', pronunciation: '/ɪɡˈzædʒəreɪt/', partOfSpeech: 'verb', exampleSentence: 'I am not exaggerating when I say it was terrible.', exampleTranslation: 'Ich übertreibe nicht, wenn ich sage, es war schrecklich.', difficulty: 4 },
      { word: 'Articulate', translation: 'Artikulieren / redegewandt', pronunciation: '/ɑːrˈtɪkjʊlət/', partOfSpeech: 'adj', exampleSentence: 'She is an extremely articulate speaker.', exampleTranslation: 'Sie ist eine äußerst redegewandte Rednerin.', difficulty: 4 },
      { word: 'Equivocate', translation: 'Zweideutig reden / ausweichen', pronunciation: '/ɪˈkwɪvəkeɪt/', partOfSpeech: 'verb', exampleSentence: 'The politician continued to equivocate when asked.', exampleTranslation: 'Der Politiker wich weiterhin aus, als er gefragt wurde.', difficulty: 5 },
      { word: 'Candid', translation: 'Aufrichtig / offen', pronunciation: '/ˈkændɪd/', partOfSpeech: 'adj', exampleSentence: 'To be candid, I didn\'t like the movie.', exampleTranslation: 'Um aufrichtig zu sein, mir gefiel der Film nicht.', difficulty: 4 },
      { word: 'Verbose', translation: 'Wortreich / weitschweifig', pronunciation: '/vɜːrˈboʊs/', partOfSpeech: 'adj', exampleSentence: 'His explanation was far too verbose.', exampleTranslation: 'Seine Erklärung war viel zu weitschweifig.', difficulty: 5 },
      { word: 'Concise', translation: 'Prägnant', pronunciation: '/kənˈsaɪs/', partOfSpeech: 'adj', exampleSentence: 'Please provide a concise summary.', exampleTranslation: 'Bitte stellen Sie eine prägnante Zusammenfassung zur Verfügung.', difficulty: 4 },
      { word: 'Eloquent', translation: 'Eloquent / redegewandt', pronunciation: '/ˈɛləkwənt/', partOfSpeech: 'adj', exampleSentence: 'It was an eloquent speech.', exampleTranslation: 'Es war eine eloquente Rede.', difficulty: 4 },
      { word: 'Rambling', translation: 'Faserig / weitschweifig', pronunciation: '/ˈræmblɪŋ/', partOfSpeech: 'adj', exampleSentence: 'It was a long and rambling letter.', exampleTranslation: 'Es war ein langer und weitschweifiger Brief.', difficulty: 4 },
      { word: 'Insinuate', translation: 'Andeuten / insinuieren', pronunciation: '/ɪnˈsɪnjueɪt/', partOfSpeech: 'verb', exampleSentence: 'Are you insinuating that I lied?', exampleTranslation: 'Deuten Sie an, dass ich gelogen habe?', difficulty: 5 },
    ]
  },
  {
    name: 'Diplomatic & Formal Language', description: 'Vocabulary for formal negotiations', level: 'C2', category: 'Business', icon: '🤝',
    cards: [
      { word: 'Concession', translation: 'Zugeständnis', pronunciation: '/kənˈsɛʃən/', partOfSpeech: 'noun', exampleSentence: 'Both sides had to make concessions.', exampleTranslation: 'Beide Seiten mussten Zugeständnisse machen.', difficulty: 4 },
      { word: 'Consensus', translation: 'Konsens', pronunciation: '/kənˈsɛnsəs/', partOfSpeech: 'noun', exampleSentence: 'They failed to reach a consensus.', exampleTranslation: 'Sie schafften es nicht, einen Konsens zu erzielen.', difficulty: 4 },
      { word: 'Ramification', translation: 'Auswirkung / Konsequenz', pronunciation: '/ˌræmɪfɪˈkeɪʃən/', partOfSpeech: 'noun', exampleSentence: 'Consider the legal ramifications of your actions.', exampleTranslation: 'Bedenken Sie die rechtlichen Auswirkungen Ihrer Handlungen.', difficulty: 5 },
      { word: 'Unprecedented', translation: 'Beispiellos', pronunciation: '/ʌnˈprɛsɪdɛntɪd/', partOfSpeech: 'adj', exampleSentence: 'This situation is completely unprecedented.', exampleTranslation: 'Diese Situation ist völlig beispiellos.', difficulty: 4 },
      { word: 'To endeavor', translation: 'Sich bemühen / bestrebt sein', pronunciation: '/ɪnˈdɛvər/', partOfSpeech: 'verb', exampleSentence: 'We shall endeavor to resolve the issue.', exampleTranslation: 'Wir werden uns bemühen, das Problem zu lösen.', difficulty: 4 },
      { word: 'Aforementioned', translation: 'Obengenannt / zuvor erwähnt', pronunciation: '/əˈfɔːrˌmɛnʃənd/', partOfSpeech: 'adj', exampleSentence: 'The aforementioned conditions apply.', exampleTranslation: 'Es gelten die obengenannten Bedingungen.', difficulty: 5 },
      { word: 'To stipulate', translation: 'Festlegen / vorschreiben', pronunciation: '/ˈstɪpjʊleɪt/', partOfSpeech: 'verb', exampleSentence: 'The contract stipulates that you pay within 30 days.', exampleTranslation: 'Der Vertrag schreibt vor, dass Sie innerhalb von 30 Tagen zahlen.', difficulty: 5 },
      { word: 'To ratify', translation: 'Ratifizieren / in Kraft setzen', pronunciation: '/ˈrætɪfaɪ/', partOfSpeech: 'verb', exampleSentence: 'The treaty was ratified by all member states.', exampleTranslation: 'Der Vertrag wurde von allen Mitgliedsstaaten ratifiziert.', difficulty: 5 },
      { word: 'To undermine', translation: 'Untergraben', pronunciation: '/ˌʌndərˈmaɪn/', partOfSpeech: 'verb', exampleSentence: 'This behavior undermines our authority.', exampleTranslation: 'Dieses Verhalten untergräbt unsere Autorität.', difficulty: 4 },
      { word: 'Amicable', translation: 'Gütlich / freundschaftlich', pronunciation: '/ˈæmɪkəbəl/', partOfSpeech: 'adj', exampleSentence: 'They reached an amicable settlement.', exampleTranslation: 'Sie erzielten eine gütliche Einigung.', difficulty: 5 },
    ]
  }
]

export async function GET() {
  try {
    let createdCount = 0
    for (const deck of DECKS) {
      // Check if deck already exists
      const existing = await db.vocabDeck.findFirst({ where: { name: deck.name, level: deck.level } })
      if (existing) {
        continue
      }

      const createdDeck = await db.vocabDeck.create({
        data: {
          name: deck.name,
          description: deck.description,
          level: deck.level,
          category: deck.category,
          icon: deck.icon,
        }
      })

      await db.vocabCard.createMany({
        data: deck.cards.map(c => ({
          deckId: createdDeck.id,
          word: c.word,
          translation: c.translation,
          pronunciation: c.pronunciation,
          partOfSpeech: c.partOfSpeech,
          exampleSentence: c.exampleSentence,
          exampleTranslation: c.exampleTranslation,
          difficulty: c.difficulty
        }))
      })
      createdCount++
    }
    
    return NextResponse.json({ success: true, createdDecks: createdCount })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
