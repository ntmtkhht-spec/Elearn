export const readingA1A2 = [
  // A1
  {
    title: 'My Daily Routine',
    content: 'My name is Tom. I get up at 7 o\'clock every morning. I eat breakfast at 7:30. I usually have bread, butter, and coffee. Then I go to work by bus. I work in an office from 9 to 5. At 1 o\'clock, I have lunch with my colleagues. After work, I go to the supermarket and buy food. In the evening, I cook dinner and watch TV. I go to bed at 10:30.',
    level: 'A1',
    category: 'Daily Life',
    questions: JSON.stringify([
      { id: 'q1', question: 'What time does Tom get up?', options: ['7:00', '7:30', '9:00', '10:30'], correctIndex: 0, explanation: 'The text says: "I get up at 7 o\'clock every morning."' },
      { id: 'q2', question: 'How does he go to work?', options: ['By car', 'By bus', 'By train', 'On foot'], correctIndex: 1, explanation: 'The text says: "I go to work by bus."' },
      { id: 'q3', question: 'What does he do after work?', options: ['He watches TV', 'He goes to the supermarket', 'He cooks dinner', 'He goes to bed'], correctIndex: 1, explanation: 'The text says: "After work, I go to the supermarket and buy food."' },
      { id: 'q4', question: 'Where does Tom work?', options: ['In a supermarket', 'In a restaurant', 'In an office', 'At home'], correctIndex: 2, explanation: 'The text says: "I work in an office."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'usually', meaning: 'normalerweise' },
      { word: 'colleagues', meaning: 'Kollegen' },
      { word: 'supermarket', meaning: 'Supermarkt' }
    ])
  },
  {
    title: 'My Family',
    content: 'I have a small family. There are four people in my family: my father, my mother, my sister, and me. My father is a teacher. He teaches math at a school. My mother is a doctor. She works in a hospital. My sister is a student. She is 15 years old. She likes music and sports. We live in a house with a garden. On weekends, we often go to the park together.',
    level: 'A1',
    category: 'Family',
    questions: JSON.stringify([
      { id: 'q1', question: 'How many people are in the family?', options: ['Three', 'Four', 'Five', 'Six'], correctIndex: 1, explanation: 'The text says: "There are four people in my family."' },
      { id: 'q2', question: 'What is the father\'s job?', options: ['Doctor', 'Student', 'Teacher', 'Farmer'], correctIndex: 2, explanation: 'The text says: "My father is a teacher."' },
      { id: 'q3', question: 'Where does the mother work?', options: ['In a school', 'In a hospital', 'In an office', 'In a shop'], correctIndex: 1, explanation: 'The text says: "She works in a hospital."' },
      { id: 'q4', question: 'What does the sister like?', options: ['Math and science', 'Music and sports', 'Reading and writing', 'Movies and games'], correctIndex: 1, explanation: 'The text says: "She likes music and sports."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'teaches', meaning: 'unterrichtet' },
      { word: 'hospital', meaning: 'Krankenhaus' },
      { word: 'weekends', meaning: 'Wochenenden' }
    ])
  },
  {
    title: 'Shopping for Food',
    content: 'Today is Saturday. Sarah goes to the supermarket. She needs food for the weekend. She buys apples, bananas, and oranges. She also buys milk, eggs, and bread. She wants to make a cake, so she buys sugar and flour. At the checkout, she pays with her credit card. The food costs 45 dollars. She puts the food in two big bags and walks home.',
    level: 'A1',
    category: 'Shopping',
    questions: JSON.stringify([
      { id: 'q1', question: 'What day is it?', options: ['Friday', 'Saturday', 'Sunday', 'Monday'], correctIndex: 1, explanation: 'The text says: "Today is Saturday."' },
      { id: 'q2', question: 'Why does she buy sugar and flour?', options: ['To make bread', 'To make a cake', 'To make breakfast', 'To make a pizza'], correctIndex: 1, explanation: 'The text says: "She wants to make a cake, so she buys sugar and flour."' },
      { id: 'q3', question: 'How does she pay?', options: ['With cash', 'With a credit card', 'With her phone', 'She doesn\'t pay'], correctIndex: 1, explanation: 'The text says: "At the checkout, she pays with her credit card."' },
      { id: 'q4', question: 'How much does the food cost?', options: ['35 dollars', '40 dollars', '45 dollars', '50 dollars'], correctIndex: 2, explanation: 'The text says: "The food costs 45 dollars."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'flour', meaning: 'Mehl' },
      { word: 'checkout', meaning: 'Kasse' },
      { word: 'pays', meaning: 'bezahlt' }
    ])
  },
  {
    title: 'My House',
    content: 'I live in a beautiful house. It is not very big, but it is comfortable. There are two bedrooms, a living room, a kitchen, and a bathroom. In the living room, there is a sofa, a TV, and a big window. I like to read books on the sofa. In the kitchen, there is a table with four chairs. We eat our meals there. The bathroom is small and has a shower. I love my house.',
    level: 'A1',
    category: 'Home',
    questions: JSON.stringify([
      { id: 'q1', question: 'How many bedrooms are there?', options: ['One', 'Two', 'Three', 'Four'], correctIndex: 1, explanation: 'The text says: "There are two bedrooms."' },
      { id: 'q2', question: 'What does the person do on the sofa?', options: ['Watch TV', 'Sleep', 'Read books', 'Eat meals'], correctIndex: 2, explanation: 'The text says: "I like to read books on the sofa."' },
      { id: 'q3', question: 'Where do they eat their meals?', options: ['In the living room', 'In the kitchen', 'In the bedroom', 'In the garden'], correctIndex: 1, explanation: 'The text says: "In the kitchen... We eat our meals there."' },
      { id: 'q4', question: 'What is in the bathroom?', options: ['A bath', 'A shower', 'A big window', 'A TV'], correctIndex: 1, explanation: 'The text says: "The bathroom is small and has a shower."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'comfortable', meaning: 'bequem / gemütlich' },
      { word: 'meals', meaning: 'Mahlzeiten' },
      { word: 'shower', meaning: 'Dusche' }
    ])
  },
  {
    title: 'The Weather Today',
    content: 'It is a sunny day in London. The sky is blue and there are no clouds. It is hot today, about 25 degrees. Many people are in the park. They are walking, running, and playing games. Some people are sitting on the grass and reading. I am wearing a t-shirt, shorts, and sunglasses. I have a bottle of water because I am thirsty. I love sunny weather.',
    level: 'A1',
    category: 'Weather',
    questions: JSON.stringify([
      { id: 'q1', question: 'What is the weather like?', options: ['Raining', 'Snowing', 'Sunny', 'Cloudy'], correctIndex: 2, explanation: 'The text says: "It is a sunny day in London."' },
      { id: 'q2', question: 'What temperature is it?', options: ['15 degrees', '20 degrees', '25 degrees', '30 degrees'], correctIndex: 2, explanation: 'The text says: "It is hot today, about 25 degrees."' },
      { id: 'q3', question: 'What are people doing in the park?', options: ['Sleeping', 'Swimming', 'Walking and playing games', 'Working'], correctIndex: 2, explanation: 'The text says: "They are walking, running, and playing games."' },
      { id: 'q4', question: 'Why does the person have water?', options: ['Because it is cheap', 'Because they are thirsty', 'Because they are hungry', 'Because they want to wash'], correctIndex: 1, explanation: 'The text says: "I have a bottle of water because I am thirsty."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'clouds', meaning: 'Wolken' },
      { word: 'sunglasses', meaning: 'Sonnenbrille' },
      { word: 'thirsty', meaning: 'durstig' }
    ])
  },
  {
    title: 'My Pet Dog',
    content: 'I have a pet dog. His name is Max. He is a golden retriever. Max is three years old. He has brown fur and big brown eyes. Max is very friendly and playful. He loves to catch balls. Every afternoon, I take Max to the park. He runs fast and plays with other dogs. When we go home, Max is tired. He sleeps on his bed in the living room. Max is my best friend.',
    level: 'A1',
    category: 'Animals',
    questions: JSON.stringify([
      { id: 'q1', question: 'What kind of animal is Max?', options: ['A cat', 'A bird', 'A fish', 'A dog'], correctIndex: 3, explanation: 'The text says: "I have a pet dog. His name is Max."' },
      { id: 'q2', question: 'How old is Max?', options: ['One year old', 'Two years old', 'Three years old', 'Four years old'], correctIndex: 2, explanation: 'The text says: "Max is three years old."' },
      { id: 'q3', question: 'What does Max love to do?', options: ['Sleep all day', 'Catch balls', 'Eat shoes', 'Watch TV'], correctIndex: 1, explanation: 'The text says: "He loves to catch balls."' },
      { id: 'q4', question: 'Where does Max sleep?', options: ['In the bedroom', 'In the kitchen', 'In the living room', 'In the garden'], correctIndex: 2, explanation: 'The text says: "He sleeps on his bed in the living room."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'fur', meaning: 'Fell' },
      { word: 'playful', meaning: 'verspielt' },
      { word: 'tired', meaning: 'müde' }
    ])
  },
  {
    title: 'A Visit to the City',
    content: 'Tomorrow, I am going to the city. I am taking the train at 9 a.m. First, I will visit the museum. I want to see the old paintings. After the museum, I will go to a big restaurant for lunch. I want to eat pizza. In the afternoon, I will go shopping. I need to buy a new jacket and some shoes. Finally, I will meet my friend for coffee. We will talk and relax.',
    level: 'A1',
    category: 'Travel',
    questions: JSON.stringify([
      { id: 'q1', question: 'How is the person travelling to the city?', options: ['By car', 'By bus', 'By train', 'By plane'], correctIndex: 2, explanation: 'The text says: "I am taking the train..."' },
      { id: 'q2', question: 'What will they do first?', options: ['Go shopping', 'Meet a friend', 'Eat pizza', 'Visit the museum'], correctIndex: 3, explanation: 'The text says: "First, I will visit the museum."' },
      { id: 'q3', question: 'What do they want to buy?', options: ['A hat and gloves', 'A jacket and shoes', 'A bag and a shirt', 'Food and drinks'], correctIndex: 1, explanation: 'The text says: "I need to buy a new jacket and some shoes."' },
      { id: 'q4', question: 'What will they do with their friend?', options: ['Watch a movie', 'Drink coffee and talk', 'Go for a walk', 'Play a game'], correctIndex: 1, explanation: 'The text says: "I will meet my friend for coffee. We will talk and relax."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'paintings', meaning: 'Gemälde' },
      { word: 'jacket', meaning: 'Jacke' },
      { word: 'relax', meaning: 'entspannen' }
    ])
  },
  {
    title: 'My English Class',
    content: 'I study English every Tuesday and Thursday evening. My class starts at 6 p.m. and ends at 8 p.m. There are fifteen students in my class. Our teacher is Mrs. Smith. She is very nice and helpful. In class, we read texts, write sentences, and speak English with our partners. We also listen to audio recordings. I like learning English. Sometimes the grammar is difficult, but I try my best.',
    level: 'A1',
    category: 'Education',
    questions: JSON.stringify([
      { id: 'q1', question: 'When is the English class?', options: ['Monday and Wednesday', 'Tuesday and Thursday', 'Friday and Saturday', 'Every day'], correctIndex: 1, explanation: 'The text says: "I study English every Tuesday and Thursday evening."' },
      { id: 'q2', question: 'How long is the class?', options: ['One hour', 'Two hours', 'Three hours', 'Four hours'], correctIndex: 1, explanation: 'It starts at 6 p.m. and ends at 8 p.m., which is two hours.' },
      { id: 'q3', question: 'How many students are in the class?', options: ['Ten', 'Twelve', 'Fifteen', 'Twenty'], correctIndex: 2, explanation: 'The text says: "There are fifteen students in my class."' },
      { id: 'q4', question: 'What does the student find difficult?', options: ['Speaking', 'Reading', 'Writing', 'Grammar'], correctIndex: 3, explanation: 'The text says: "Sometimes the grammar is difficult..."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'evening', meaning: 'Abend' },
      { word: 'helpful', meaning: 'hilfsbereit' },
      { word: 'difficult', meaning: 'schwierig' }
    ])
  },
  {
    title: 'My Favorite Hobby',
    content: 'My favorite hobby is photography. I love taking pictures. I have a digital camera and I always carry it with me. I take pictures of nature, animals, and people. On Sundays, I often go to the forest or the beach to find beautiful scenes. When I get home, I look at the photos on my computer. I edit them to make them look better. I share my best photos with my friends on the internet.',
    level: 'A1',
    category: 'Hobbies',
    questions: JSON.stringify([
      { id: 'q1', question: 'What is the person\'s hobby?', options: ['Painting', 'Photography', 'Reading', 'Cooking'], correctIndex: 1, explanation: 'The text says: "My favorite hobby is photography."' },
      { id: 'q2', question: 'What do they carry with them?', options: ['A book', 'A phone', 'A digital camera', 'A bag'], correctIndex: 2, explanation: 'The text says: "I have a digital camera and I always carry it with me."' },
      { id: 'q3', question: 'Where do they go on Sundays?', options: ['To the city center', 'To the forest or beach', 'To the museum', 'To the park'], correctIndex: 1, explanation: 'The text says: "On Sundays, I often go to the forest or the beach..."' },
      { id: 'q4', question: 'What do they do on the computer?', options: ['Play games', 'Watch videos', 'Look at and edit photos', 'Write emails'], correctIndex: 2, explanation: 'The text says: "I look at the photos on my computer. I edit them..."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'photography', meaning: 'Fotografie' },
      { word: 'carry', meaning: 'tragen / mitnehmen' },
      { word: 'scenes', meaning: 'Szenen / Motive' },
      { word: 'edit', meaning: 'bearbeiten' }
    ])
  },
  {
    title: 'A Healthy Breakfast',
    content: 'Breakfast is the most important meal of the day. A healthy breakfast gives you energy. I always eat a healthy breakfast. I have a bowl of oatmeal with milk. I add fresh fruits like berries and a banana. I also drink a glass of orange juice. Sometimes, I eat a boiled egg. I don\'t eat a lot of sugar in the morning. This breakfast helps me to stay focused and active until lunch.',
    level: 'A1',
    category: 'Health',
    questions: JSON.stringify([
      { id: 'q1', question: 'Why is breakfast important?', options: ['It makes you sleep', 'It gives you energy', 'It is cheap', 'It is fast'], correctIndex: 1, explanation: 'The text says: "A healthy breakfast gives you energy."' },
      { id: 'q2', question: 'What does the person add to their oatmeal?', options: ['Chocolate', 'Sugar', 'Fresh fruits', 'Honey'], correctIndex: 2, explanation: 'The text says: "I add fresh fruits like berries and a banana."' },
      { id: 'q3', question: 'What do they drink?', options: ['Coffee', 'Tea', 'Water', 'Orange juice'], correctIndex: 3, explanation: 'The text says: "I also drink a glass of orange juice."' },
      { id: 'q4', question: 'What does the person avoid in the morning?', options: ['Eggs', 'Milk', 'A lot of sugar', 'Fruits'], correctIndex: 2, explanation: 'The text says: "I don\'t eat a lot of sugar in the morning."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'oatmeal', meaning: 'Haferbrei' },
      { word: 'berries', meaning: 'Beeren' },
      { word: 'focused', meaning: 'konzentriert' },
      { word: 'avoid', meaning: 'vermeiden' }
    ])
  },

  // A2
  {
    title: 'Planning a Trip to Paris',
    content: 'Next month, Lisa and Mark are traveling to Paris. They are very excited because it is their first time in France. They booked a small hotel near the Eiffel Tower. They plan to stay for five days. Mark bought a guidebook to learn about the best places to visit. They want to see the Louvre Museum and take a boat ride on the Seine river. Lisa is learning some basic French phrases, like "hello" and "thank you", to communicate with local people. They are also looking forward to eating croissants and French cheese.',
    level: 'A2',
    category: 'Travel',
    questions: JSON.stringify([
      { id: 'q1', question: 'Where is their hotel located?', options: ['Near the Louvre', 'Near the Eiffel Tower', 'Outside the city', 'Near the airport'], correctIndex: 1, explanation: 'The text says: "They booked a small hotel near the Eiffel Tower."' },
      { id: 'q2', question: 'How long are they staying in Paris?', options: ['Three days', 'Five days', 'One week', 'Two weeks'], correctIndex: 1, explanation: 'The text says: "They plan to stay for five days."' },
      { id: 'q3', question: 'Why did Mark buy a guidebook?', options: ['To learn French', 'To find a hotel', 'To learn about places to visit', 'To read on the plane'], correctIndex: 2, explanation: 'The text says: "Mark bought a guidebook to learn about the best places to visit."' },
      { id: 'q4', question: 'What is Lisa doing to prepare for the trip?', options: ['Buying clothes', 'Learning French phrases', 'Cooking French food', 'Watching movies'], correctIndex: 1, explanation: 'The text says: "Lisa is learning some basic French phrases..."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'excited', meaning: 'aufgeregt / begeistert' },
      { word: 'guidebook', meaning: 'Reiseführer (Buch)' },
      { word: 'communicate', meaning: 'kommunizieren / verständigen' },
      { word: 'looking forward to', meaning: 'sich freuen auf' }
    ])
  },
  {
    title: 'A Bad Day at Work',
    content: 'Yesterday was a terrible day for David. First, his alarm clock didn\'t ring, so he woke up late. He had to run to the bus stop, but he missed the bus. When he finally arrived at the office, he was 45 minutes late. His boss was not happy. Then, David\'s computer crashed and he lost an important report. He had to write it all over again. During his lunch break, he spilled coffee on his new white shirt. He was so relieved when it was 5 o\'clock and he could finally go home.',
    level: 'A2',
    category: 'Work',
    questions: JSON.stringify([
      { id: 'q1', question: 'Why did David wake up late?', options: ['He was tired', 'His alarm clock didn\'t ring', 'He forgot to set the alarm', 'He was sick'], correctIndex: 1, explanation: 'The text says: "his alarm clock didn\'t ring, so he woke up late."' },
      { id: 'q2', question: 'How late was David for work?', options: ['15 minutes', '30 minutes', '45 minutes', '1 hour'], correctIndex: 2, explanation: 'The text says: "he was 45 minutes late."' },
      { id: 'q3', question: 'What happened to his computer?', options: ['It was stolen', 'It crashed', 'It was too slow', 'It caught fire'], correctIndex: 1, explanation: 'The text says: "David\'s computer crashed..."' },
      { id: 'q4', question: 'What happened during his lunch break?', options: ['He lost his wallet', 'He met a friend', 'He ate too much', 'He spilled coffee on his shirt'], correctIndex: 3, explanation: 'The text says: "he spilled coffee on his new white shirt."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'terrible', meaning: 'schrecklich' },
      { word: 'crashed', meaning: 'abgestürzt (Computer)' },
      { word: 'spilled', meaning: 'verschüttet' },
      { word: 'relieved', meaning: 'erleichtert' }
    ])
  },
  {
    title: 'The New Smartphone',
    content: 'Emma bought a new smartphone last week. Her old phone was very slow and the battery only lasted for a few hours. The new phone has a large, bright screen and takes amazing photos. It also has a lot of storage space for her apps and music. It took her a few days to get used to the new operating system, but now she finds it very easy to use. The only problem is that it was quite expensive. However, Emma uses it every day for work and communication, so she thinks it was a good investment.',
    level: 'A2',
    category: 'Technology',
    questions: JSON.stringify([
      { id: 'q1', question: 'What was wrong with Emma\'s old phone?', options: ['It was broken', 'It was slow and had bad battery life', 'It was too small', 'It couldn\'t take photos'], correctIndex: 1, explanation: 'The text says: "Her old phone was very slow and the battery only lasted for a few hours."' },
      { id: 'q2', question: 'What is a feature of the new phone?', options: ['It is cheap', 'It takes amazing photos', 'It is small', 'It has a long battery life'], correctIndex: 1, explanation: 'The text says: "The new phone has a large, bright screen and takes amazing photos."' },
      { id: 'q3', question: 'What was difficult for Emma at first?', options: ['Paying for it', 'Taking photos', 'Getting used to the operating system', 'Installing apps'], correctIndex: 2, explanation: 'The text says: "It took her a few days to get used to the new operating system..."' },
      { id: 'q4', question: 'Does Emma think it was a good idea to buy it?', options: ['No, it was too expensive', 'Yes, because she uses it every day', 'No, she prefers her old phone', 'The text doesn\'t say'], correctIndex: 1, explanation: 'The text says: "she thinks it was a good investment."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'battery', meaning: 'Akku / Batterie' },
      { word: 'storage space', meaning: 'Speicherplatz' },
      { word: 'get used to', meaning: 'sich gewöhnen an' },
      { word: 'investment', meaning: 'Investition / Anlage' }
    ])
  },
  {
    title: 'A Healthy Lifestyle',
    content: 'Many people want to live a healthy lifestyle. This means doing several things to keep your body and mind in good condition. First, it is important to eat a balanced diet. You should eat plenty of vegetables, fruits, and whole grains, and avoid too much fast food and sugar. Second, regular exercise is crucial. You don\'t need to go to the gym every day; even walking or cycling for 30 minutes can make a difference. Finally, getting enough sleep is often forgotten. Most adults need between 7 and 8 hours of sleep each night to function properly.',
    level: 'A2',
    category: 'Health',
    questions: JSON.stringify([
      { id: 'q1', question: 'What does a balanced diet include?', options: ['Fast food and sugar', 'Vegetables, fruits, and whole grains', 'Only meat', 'Only water'], correctIndex: 1, explanation: 'The text says: "You should eat plenty of vegetables, fruits, and whole grains..."' },
      { id: 'q2', question: 'How much exercise is suggested as a minimum?', options: ['Going to the gym every day', 'Running for an hour', 'Walking or cycling for 30 minutes', 'Lifting weights'], correctIndex: 2, explanation: 'The text says: "even walking or cycling for 30 minutes can make a difference."' },
      { id: 'q3', question: 'What is often forgotten for a healthy lifestyle?', options: ['Eating', 'Exercising', 'Getting enough sleep', 'Drinking water'], correctIndex: 2, explanation: 'The text says: "getting enough sleep is often forgotten."' },
      { id: 'q4', question: 'How much sleep do most adults need?', options: ['5 to 6 hours', '7 to 8 hours', '9 to 10 hours', 'More than 10 hours'], correctIndex: 1, explanation: 'The text says: "Most adults need between 7 and 8 hours of sleep each night..."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'balanced diet', meaning: 'ausgewogene Ernährung' },
      { word: 'whole grains', meaning: 'Vollkornprodukte' },
      { word: 'crucial', meaning: 'entscheidend / sehr wichtig' },
      { word: 'function properly', meaning: 'richtig funktionieren' }
    ])
  },
  {
    title: 'The Lost Wallet',
    content: 'While walking through the park, Robert saw a brown leather wallet on the path. He picked it up and opened it. Inside, there was 50 dollars in cash, some credit cards, and a driving license. Robert checked the driving license to see the owner\'s name. It belonged to a man named John Smith. There was also a business card with a phone number. Robert called the number and told John that he had found his wallet. John was very happy and relieved. They met at a café near the park, and John bought Robert a coffee to say thank you.',
    level: 'A2',
    category: 'Daily Life',
    questions: JSON.stringify([
      { id: 'q1', question: 'Where did Robert find the wallet?', options: ['In a café', 'On the street', 'In the park', 'On a bus'], correctIndex: 2, explanation: 'The text says: "While walking through the park, Robert saw a brown leather wallet..."' },
      { id: 'q2', question: 'What did Robert use to find the owner\'s name?', options: ['The credit cards', 'The driving license', 'A letter', 'The cash'], correctIndex: 1, explanation: 'The text says: "Robert checked the driving license to see the owner\'s name."' },
      { id: 'q3', question: 'How did Robert contact John?', options: ['He sent an email', 'He went to his house', 'He called a phone number on a business card', 'He gave it to the police'], correctIndex: 2, explanation: 'The text says: "There was also a business card with a phone number. Robert called the number..."' },
      { id: 'q4', question: 'How did John say thank you?', options: ['He gave Robert 50 dollars', 'He bought Robert a coffee', 'He gave him a gift', 'He cooked him dinner'], correctIndex: 1, explanation: 'The text says: "John bought Robert a coffee to say thank you."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'wallet', meaning: 'Brieftasche / Geldbeutel' },
      { word: 'leather', meaning: 'Leder' },
      { word: 'driving license', meaning: 'Führerschein' },
      { word: 'relieved', meaning: 'erleichtert' }
    ])
  },
  {
    title: 'A New Restaurant in Town',
    content: 'A new Italian restaurant opened in our town last week. It is called "Bella Italia". Yesterday evening, my friends and I decided to try it. The restaurant was very busy, but the waiters were friendly and fast. The menu had many options: pizza, pasta, salads, and seafood. I ordered a vegetarian pizza and my friend ordered spaghetti. The food was delicious and the portions were large. We also shared a tiramisu for dessert. The prices were reasonable, not too expensive. We had a great time and we will definitely go back.',
    level: 'A2',
    category: 'Food',
    questions: JSON.stringify([
      { id: 'q1', question: 'What type of food does the new restaurant serve?', options: ['Chinese', 'Mexican', 'Italian', 'Indian'], correctIndex: 2, explanation: 'The text says: "A new Italian restaurant opened..."' },
      { id: 'q2', question: 'What did the narrator order?', options: ['Spaghetti', 'A vegetarian pizza', 'A salad', 'Seafood'], correctIndex: 1, explanation: 'The text says: "I ordered a vegetarian pizza..."' },
      { id: 'q3', question: 'How was the food?', options: ['Spicy and small portions', 'Delicious and large portions', 'Cold and expensive', 'Terrible'], correctIndex: 1, explanation: 'The text says: "The food was delicious and the portions were large."' },
      { id: 'q4', question: 'What did they think about the prices?', options: ['They were very cheap', 'They were reasonable', 'They were too expensive', 'The text doesn\'t say'], correctIndex: 1, explanation: 'The text says: "The prices were reasonable, not too expensive."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'busy', meaning: 'beschäftigt / viel los' },
      { word: 'options', meaning: 'Möglichkeiten / Auswahl' },
      { word: 'portions', meaning: 'Portionen' },
      { word: 'reasonable', meaning: 'angemessen / vernünftig' }
    ])
  },
  {
    title: 'Learning to Play the Guitar',
    content: 'Simon always wanted to learn a musical instrument. Last month, he bought an acoustic guitar online. When it arrived, he was very excited. He decided to teach himself using internet videos instead of paying for a teacher. At first, it was very difficult. His fingers hurt, and the chords sounded terrible. But he practiced for 30 minutes every day. After a few weeks, his fingers got stronger and he learned how to play three simple songs. He knows he still has a lot to learn, but he is proud of his progress.',
    level: 'A2',
    category: 'Hobbies',
    questions: JSON.stringify([
      { id: 'q1', question: 'Where did Simon get his guitar?', options: ['From a music shop', 'From a friend', 'He bought it online', 'It was a gift'], correctIndex: 2, explanation: 'The text says: "he bought an acoustic guitar online."' },
      { id: 'q2', question: 'How is Simon learning to play?', options: ['With a private teacher', 'At a music school', 'From a book', 'Using internet videos'], correctIndex: 3, explanation: 'The text says: "He decided to teach himself using internet videos..."' },
      { id: 'q3', question: 'What problem did he have at the beginning?', options: ['The guitar was broken', 'His fingers hurt', 'He didn\'t have time', 'The videos were boring'], correctIndex: 1, explanation: 'The text says: "His fingers hurt, and the chords sounded terrible."' },
      { id: 'q4', question: 'How often does Simon practice?', options: ['Once a week', 'Every weekend', 'For 30 minutes every day', 'For two hours every day'], correctIndex: 2, explanation: 'The text says: "But he practiced for 30 minutes every day."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'acoustic', meaning: 'akustisch (ohne Strom)' },
      { word: 'instead of', meaning: 'anstatt' },
      { word: 'chords', meaning: 'Akkorde (in der Musik)' },
      { word: 'progress', meaning: 'Fortschritt' }
    ])
  },
  {
    title: 'The Weather Forecast',
    content: 'Before planning her weekend, Maria always checks the weather forecast. She wants to go hiking in the mountains this Saturday. The forecast says that Saturday morning will be cloudy but dry. In the afternoon, the sun will come out and it will be quite warm, around 20 degrees Celsius. However, on Sunday, the weather will change completely. Strong winds and heavy rain are expected. Because of this, Maria decides to do her hike on Saturday and stay indoors on Sunday to watch movies and relax.',
    level: 'A2',
    category: 'Weather',
    questions: JSON.stringify([
      { id: 'q1', question: 'Why does Maria check the weather forecast?', options: ['She is a pilot', 'She wants to go hiking', 'She wants to go to the beach', 'She is a farmer'], correctIndex: 1, explanation: 'The text says: "She wants to go hiking in the mountains this Saturday."' },
      { id: 'q2', question: 'What will the weather be like on Saturday afternoon?', options: ['Rainy and cold', 'Snowy', 'Sunny and warm', 'Cloudy and windy'], correctIndex: 2, explanation: 'The text says: "In the afternoon, the sun will come out and it will be quite warm..."' },
      { id: 'q3', question: 'What is expected on Sunday?', options: ['Snow', 'Strong winds and heavy rain', 'A thunderstorm', 'Hot weather'], correctIndex: 1, explanation: 'The text says: "Strong winds and heavy rain are expected."' },
      { id: 'q4', question: 'What will Maria do on Sunday?', options: ['Go hiking anyway', 'Visit a museum', 'Go shopping', 'Stay indoors and watch movies'], correctIndex: 3, explanation: 'The text says: "stay indoors on Sunday to watch movies and relax."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'forecast', meaning: 'Vorhersage' },
      { word: 'hiking', meaning: 'Wandern' },
      { word: 'expected', meaning: 'erwartet' },
      { word: 'indoors', meaning: 'drinnen (im Haus)' }
    ])
  },
  {
    title: 'Moving to a New Apartment',
    content: 'Anna is moving to a new apartment next week. She is very busy packing her things into cardboard boxes. Her new apartment is on the third floor of a modern building. It is smaller than her old place, but it is closer to the city center and her office. She will save a lot of time traveling to work. She is throwing away old clothes and things she doesn\'t need anymore. Her friends are coming on Saturday to help her move the heavy furniture, like her bed and sofa.',
    level: 'A2',
    category: 'Home',
    questions: JSON.stringify([
      { id: 'q1', question: 'When is Anna moving?', options: ['Today', 'Tomorrow', 'Next week', 'Next month'], correctIndex: 2, explanation: 'The text says: "Anna is moving to a new apartment next week."' },
      { id: 'q2', question: 'What is an advantage of her new apartment?', options: ['It is much bigger', 'It has a garden', 'It is cheaper', 'It is closer to her office'], correctIndex: 3, explanation: 'The text says: "it is closer to the city center and her office."' },
      { id: 'q3', question: 'What is she doing with things she doesn\'t need?', options: ['Selling them', 'Throwing them away', 'Giving them to friends', 'Keeping them in boxes'], correctIndex: 1, explanation: 'The text says: "She is throwing away old clothes and things she doesn\'t need anymore."' },
      { id: 'q4', question: 'Who is helping her move the heavy furniture?', options: ['Her family', 'Her colleagues', 'Professional movers', 'Her friends'], correctIndex: 3, explanation: 'The text says: "Her friends are coming on Saturday to help her..."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'packing', meaning: 'einpacken' },
      { word: 'cardboard boxes', meaning: 'Pappkartons' },
      { word: 'throwing away', meaning: 'wegwerfen' },
      { word: 'furniture', meaning: 'Möbel' }
    ])
  },
  {
    title: 'Public Transportation',
    content: 'In many big cities, public transportation is the best way to get around. Taking the bus, tram, or subway has several benefits. First, it is usually cheaper than driving a car, especially when you consider the cost of parking and petrol. Second, it is better for the environment because it reduces air pollution and traffic jams. Many people use the time on the train to read a book, listen to a podcast, or relax. However, public transport can sometimes be crowded during rush hour, and delays can happen.',
    level: 'A2',
    category: 'Transport',
    questions: JSON.stringify([
      { id: 'q1', question: 'According to the text, why is public transport cheaper?', options: ['Tickets are free', 'You save money on parking and petrol', 'Cars are expensive to buy', 'Trains use less electricity'], correctIndex: 1, explanation: 'The text says: "it is usually cheaper than driving a car, especially when you consider the cost of parking and petrol."' },
      { id: 'q2', question: 'Why is it better for the environment?', options: ['It uses renewable energy', 'It reduces air pollution and traffic jams', 'It produces no noise', 'It protects animals'], correctIndex: 1, explanation: 'The text says: "it reduces air pollution and traffic jams."' },
      { id: 'q3', question: 'What do people often do on the train?', options: ['Eat their breakfast', 'Talk loudly on the phone', 'Read or listen to a podcast', 'Do exercise'], correctIndex: 2, explanation: 'The text says: "Many people use the time on the train to read a book, listen to a podcast..."' },
      { id: 'q4', question: 'What is a negative aspect mentioned in the text?', options: ['It is dangerous', 'It can be crowded and delayed', 'The seats are uncomfortable', 'It stops too early at night'], correctIndex: 1, explanation: 'The text says: "public transport can sometimes be crowded during rush hour, and delays can happen."' }
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'public transportation', meaning: 'öffentliche Verkehrsmittel' },
      { word: 'petrol', meaning: 'Benzin' },
      { word: 'pollution', meaning: 'Verschmutzung' },
      { word: 'rush hour', meaning: 'Hauptverkehrszeit / Stoßzeit' }
    ])
  }
];
