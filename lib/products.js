import { images } from '@/lib/images';

// Static, non-translatable product data. All display text (title, hook,
// description, specs, dimensions, price, category label) lives in the
// next-intl messages under catalog.products.<id> and is merged at render
// time via resolveProduct().
export const CATALOG_PRODUCTS = [
  // Living Room
  { id: 'classic-sofa', category: 'living', bgColor: '#b0030e', image: images.classicSofa },
  { id: 'blue-sofa-pair', category: 'living', bgColor: '#7b0d17', image: images.blueSofaPair },
  { id: 'modular-sofa', category: 'living', bgColor: '#96111f', image: images.modularSofa },
  { id: 'glass-showcase', category: 'living', bgColor: '#8a101a', image: images.glassShowcase },
  { id: 'shoe-cabinet', category: 'living', bgColor: '#901c26', image: images.shoeCabinet },

  // Bedroom
  { id: 'emerald-bed', category: 'bedroom', bgColor: '#69000b', image: images.emeraldBed },
  { id: 'teal-bed', category: 'bedroom', bgColor: '#870e19', image: images.tealBed },
  { id: 'navy-bed', category: 'bedroom', bgColor: '#7e0211', image: images.navyBed },
  { id: 'white-bed', category: 'bedroom', bgColor: '#8d0713', image: images.whiteBed },

  // Dining Room
  { id: 'marble-dining', category: 'dining', bgColor: '#800f15', image: images.marbleDining },
  { id: 'carved-dining', category: 'dining', bgColor: '#7e0f19', image: images.diningTable },
  { id: 'cream-dining', category: 'dining', bgColor: '#760813', image: images.creamDining },
  { id: 'gold-chair', category: 'dining', bgColor: '#7a0714', image: images.goldChair },

  // Office & Chairs
  { id: 'executive-chair-brown', category: 'office', bgColor: '#6b0c11', image: images.executiveChair },
  { id: 'executive-chair-black', category: 'office', bgColor: '#801218', image: images.blackLeatherChair },
  { id: 'mesh-chair', category: 'office', bgColor: '#7a0d1a', image: images.meshChair },
  { id: 'black-padded-chair', category: 'office', bgColor: '#76070f', image: images.blackPaddedChair },
];

// Category filters; display labels come from catalog.categories.<key>.
export const CATEGORIES = [
  { key: 'all' },
  { key: 'living' },
  { key: 'bedroom' },
  { key: 'dining' },
  { key: 'office' },
];

// Merge the static product core with the localized text for the current
// locale. Returns full product objects (title, price, hook, description,
// specs[], dimensions, dailyMath, categoryLabel) ready for the grid,
// modal, and RoomPreview — all keyed off catalog.products.<id>.
//
// Order matters: text is spread first, then core, so the lowercase filter
// `category` key survives (the localized text carries a redundant display
// `category`, which must not clobber the key used for filtering).
export function resolveProducts(t) {
  return CATALOG_PRODUCTS.map((core) => {
    const text = t.raw(`products.${core.id}`);
    const categoryLabel = t(`categories.${core.category}`);
    return {
      ...text,
      ...core,
      categoryLabel,
    };
  });
}
