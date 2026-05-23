import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT_DIR = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(ROOT_DIR, 'src', 'content')
const VOCAB_DIR = path.join(CONTENT_DIR, 'vocab')
const READING_DIR = path.join(CONTENT_DIR, 'reading')
const OUTPUT_FILE = path.join(ROOT_DIR, 'src', 'lib', 'data', 'generated-content.json')

function readJsonFilesFromDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return []
  }
  
  const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.json'))
  const data = []
  
  for (const file of files) {
    try {
      const filePath = path.join(dirPath, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(content)
      
      // Support arrays or single objects per file
      if (Array.isArray(parsed)) {
        data.push(...parsed)
      } else {
        data.push(parsed)
      }
    } catch (err) {
      console.error(`Failed to parse ${file}:`, err)
    }
  }
  
  return data
}

function aggregateContent() {
  console.log('Aggregating file-based content...')
  
  // Ensure output directory exists
  const outDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  const vocabDecks = readJsonFilesFromDir(VOCAB_DIR)
  const readingExercises = readJsonFilesFromDir(READING_DIR)

  const outputData = {
    vocabDecks,
    readingExercises,
    updatedAt: new Date().toISOString(),
    version: '1.0.0'
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2))
  
  console.log(`✅ Aggregated ${vocabDecks.length} vocab decks and ${readingExercises.length} reading exercises.`)
  console.log(`Saved to ${OUTPUT_FILE}`)
}

aggregateContent()
