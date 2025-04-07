// This is a simplified dataset of Duel Masters cards from sets DM-01 to DM-04
// In a real application, you would have a complete database with all card information

import DuelMastersCards from '../public/DuelMastersCards.json';

interface Printing {
  set: string;
  id: string;
  rarity: string;
  illustrator: string;
  flavor?: string;
}

// Process the cards data to match our application's needs
export const cards = DuelMastersCards.cards.map(card => {
  const printing = card.printings[0] as Printing; // Get the first printing for now
  const setId = printing.set.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  
  return {
    id: `${setId}-${printing.id.split('/')[0]}`,
    name: card.name,
    type: card.type,
    civilizations: card.civilizations,
    cost: card.cost,
    power: card.power ? parseInt(card.power.replace('+', '')) : undefined,
    text: card.text,
    set: setId,
    imageUrl: `/images/cards/sets/${setId}/${setId}-${printing.id.split('/')[0]}.jpg`,
    subtypes: card.subtypes,
    supertypes: card.supertypes,
    rarity: printing.rarity,
    illustrator: printing.illustrator,
    flavor: printing.flavor
  };
});

// Export the raw data for components that need it
export const cardsData = DuelMastersCards.cards;

// Export the processed cards as default
export default cards;

