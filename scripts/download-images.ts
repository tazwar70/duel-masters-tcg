import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { cardsData } from '../lib/cards-data.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create directories if they don't exist
const createDirectories = () => {
  const sets = ['dm-01', 'dm-02', 'dm-03', 'dm-04'];
  sets.forEach(set => {
    const dir = path.join(__dirname, '..', 'public', 'images', 'cards', 'sets', set);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Download a single image
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath));
      } else {
        response.resume();
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
      }
    });
  });
};

// Main function to download all images
const downloadAllImages = async () => {
  createDirectories();
  
  for (const card of cardsData) {
    if (card.imageUrl) {
      const filename = `${card.id}.jpg`;
      const setDir = card.set;
      const filepath = path.join(__dirname, '..', 'public', 'images', 'cards', 'sets', setDir, filename);
      
      try {
        console.log(`Downloading ${card.name}...`);
        await downloadImage(card.imageUrl, filepath);
        console.log(`Downloaded ${card.name} successfully!`);
      } catch (error) {
        console.error(`Failed to download ${card.name}:`, error.message);
      }
    }
  }
};

downloadAllImages().catch(console.error); 