/**
 * The eight directions and the centre as popular Vastu guidance describes
 * them. `guardian` is the traditional Dikpala (directional deity);
 * `element` is given only where Vastu texts and practitioners broadly agree
 * (the four corners and the centre). `uses` are common recommendations, not
 * rules — practitioners differ.
 */
export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' | 'C';

export type DirectionInfo = {
  key: Direction;
  name: string;
  sanskrit: string;
  guardian: string;
  element?: string;
  uses: string;
};

export const DIRECTIONS: DirectionInfo[] = [
  { key: 'N', name: 'North', sanskrit: 'Uttara', guardian: 'Kubera', uses: 'Entrance, living room, open space' },
  { key: 'NE', name: 'North-east', sanskrit: 'Ishanya', guardian: 'Ishana', element: 'Water', uses: 'Pooja room, open and light, water source' },
  { key: 'E', name: 'East', sanskrit: 'Purva', guardian: 'Indra', uses: 'Entrance, windows, living or study' },
  { key: 'SE', name: 'South-east', sanskrit: 'Agneya', guardian: 'Agni', element: 'Fire', uses: 'Kitchen, electrical equipment' },
  { key: 'S', name: 'South', sanskrit: 'Dakshina', guardian: 'Yama', uses: 'Bedrooms, heavier storage' },
  { key: 'SW', name: 'South-west', sanskrit: 'Nairutya', guardian: 'Nirriti', element: 'Earth', uses: 'Master bedroom, heavy furniture' },
  { key: 'W', name: 'West', sanskrit: 'Paschima', guardian: 'Varuna', uses: 'Dining, children’s room, study' },
  { key: 'NW', name: 'North-west', sanskrit: 'Vayavya', guardian: 'Vayu', element: 'Air', uses: 'Guest room, storage, bathrooms' },
  { key: 'C', name: 'Centre', sanskrit: 'Brahmasthan', guardian: 'Brahma', element: 'Space', uses: 'Kept open and uncluttered' },
];
