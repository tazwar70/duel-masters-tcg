import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Card data with image URLs
const cards = [
  {
    id: "dm01-1",
    name: "Hanusa, Radiance Elemental",
    set: "dm-01",
    imageUrl: "https://static.wikia.nocookie.net/duelmasters/images/1/1d/Hanusa%2C_Radiance_Elemental.jpg/revision/latest"
  },
  {
    id: "dm01-2",
    name: "Urth, Purifying Elemental",
    set: "dm-01",
    imageUrl: "https://static.wikia.nocookie.net/duelmasters/images/1/1d/Urth%2C_Purifying_Elemental.jpg/revision/latest"
  },
  {
    id: "dm01-3",
    name: "Szubs Kin, Twilight Guardian",
    set: "dm-01",
    imageUrl: "https://static.wikia.nocookie.net/duelmasters/images/1/1d/Szubs_Kin%2C_Twilight_Guardian.jpg/revision/latest"
  },
  {
    id: "dm01-4",
    name: "Dia Nork, Moonlight Guardian",
    set: "dm-01",
    imageUrl: "https://static.wikia.nocookie.net/duelmasters/images/4/4d/Dia_Nork%2C_Moonlight_Guardian.jpg/revision/latest"
  }
];

// Create directories if they don't exist
const createDirectories = () => {
  const sets = ['dm-01', 'dm-02', 'dm-03', 'dm-04'];
  sets.forEach(set => {
    const dir = path.join(__dirname, '..', 'public', 'images', 'cards', 'sets', set);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Download a single image
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    console.log(`Attempting to download from: ${url}`);
    https.get(url, options, (response) => {
      console.log(`Response status code: ${response.statusCode}`);
      
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`File saved to: ${filepath}`);
          resolve(filepath);
        });

        fileStream.on('error', (err) => {
          fs.unlink(filepath, () => reject(err));
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        console.log(`Following redirect to: ${response.headers.location}`);
        downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      } else {
        response.resume();
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
};

// Main function to download all images
const downloadAllImages = async () => {
  console.log('Starting image download process...');
  createDirectories();
  
  for (const card of cards) {
    if (card.imageUrl) {
      const filename = `${card.id}.jpg`;
      const setDir = card.set;
      const filepath = path.join(__dirname, '..', 'public', 'images', 'cards', 'sets', setDir, filename);
      
      try {
        console.log(`\nProcessing ${card.name}...`);
        await downloadImage(card.imageUrl, filepath);
        console.log(`Successfully downloaded ${card.name}`);
      } catch (error) {
        console.error(`Failed to download ${card.name}:`, error.message);
      }
    }
  }
  
  console.log('\nDownload process completed!');
};

downloadAllImages().catch(console.error); 