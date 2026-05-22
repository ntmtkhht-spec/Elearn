import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function generate() {
  const zai = await ZAI.create();

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const topicsPerLevel = {
    'A1': ['Daily Routine', 'My Family', 'Shopping for Food', 'My House', 'Weather', 'Colors and Numbers', 'My Pets', 'In the City', 'School', 'Hobbies'],
    'A2': ['Travel Plans', 'A Weekend Trip', 'At the Restaurant', 'A New Job', 'Health and Fitness', 'Technology in Daily Life', 'Celebrating Holidays', 'Transportation', 'My Hometown', 'Learning a Language'],
    'B1': ['Environmental Protection', 'Social Media Trends', 'The Benefits of Reading', 'Healthy Eating Habits', 'The Importance of Sleep', 'Planning a Career', 'Public Transport vs Cars', 'The History of My Country', 'Online Shopping', 'Cultural Differences'],
    'B2': ['The Impact of Artificial Intelligence', 'Sustainable Energy Solutions', 'Remote Work Advantages', 'The Psychology of Advertising', 'Space Exploration', 'Global Economic Trends', 'The Role of Arts in Education', 'Cybersecurity Basics', 'Modern Architecture', 'The Future of Healthcare'],
    'C1': ['Ethical Implications of Biotechnology', 'The Evolution of Democracy', 'Quantum Computing Concepts', 'Neurological Basis of Memory', 'Macroeconomic Policies', 'Post-modern Literature', 'The Physics of Black Holes', 'Linguistics and Cognitive Science', 'International Law', 'Climate Change Mitigation Strategies'],
    'C2': ['Epistemological Challenges in Modern Science', 'The Socioeconomic Impact of Demographic Shifts', 'Deconstructing Hegemonic Narratives', 'Advanced Cryptographic Protocols', 'The Intersections of Art and Philosophy', 'Paradigm Shifts in Theoretical Physics', 'Nuances of International Diplomacy', 'The Ethics of Autonomous Systems', 'Cognitive Dissonance in Political Discourse', 'Syntactic Structures in Computational Linguistics']
  };

  const results = [];

  for (const level of levels) {
    console.log(`Generating for level ${level}...`);
    for (const topic of topicsPerLevel[level]) {
      console.log(`  - Generating topic: ${topic}`);
      const systemPrompt = `You are an English reading comprehension exercise creator for German-speaking learners at ${level} level.
Create a reading exercise about "${topic}" with:
1. A title (string)
2. A 200-400 word English text about the topic, appropriate for ${level} level (string)
3. 4-5 comprehension questions with 4 options each (JSON array)
4. 5-8 vocabulary hints for difficult words in the text (JSON array)

Each question should have:
- id: unique string
- question: string
- options: array of 4 strings
- correctIndex: number (0-3)
- explanation: string

Each vocabulary hint should have:
- word: string (the English word)
- meaning: string (German explanation)

Return ONLY valid JSON in this format:
{
  "title": "...",
  "content": "...",
  "questions": [...],
  "vocabularyHints": [...]
}`;

      try {
        const completion = await zai.chat.completions.create({
          messages: [
            { role: 'assistant', content: systemPrompt },
            { role: 'user', content: `Create a reading exercise about "${topic}" for ${level} level.` }
          ],
          thinking: { type: 'disabled' },
        });

        const text = completion.choices[0]?.message?.content || '';
        
        let parsed = null;
        try {
          parsed = JSON.parse(text);
        } catch {
          const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (match) {
            parsed = JSON.parse(match[1].trim());
          }
        }

        if (parsed) {
          results.push({
            ...parsed,
            level,
            category: 'Generated'
          });
          console.log(`    -> Success`);
        } else {
          console.log(`    -> Failed to parse JSON`);
        }
      } catch (err) {
        console.error(`    -> Error:`, err.message);
      }
    }
  }

  fs.writeFileSync('src/app/api/seed-reading-data/data.json', JSON.stringify(results, null, 2));
  console.log(`Saved ${results.length} reading exercises.`);
}

generate();
