export const categories = ["Villa", "Apartments", "Mansion", "Cottage"] as const;
export type Category = (typeof categories)[number];
export type Stay = { id: string; name: string; type: Category; location: string; description: string; price: number; rating: string; image: string; rooms: string; bathrooms: string; guests: number; size: number };

export const stays: Record<Category, Stay[]> = {
  Villa: [
    { id: "sora-pool-villa", name: "Sora Pool Villa", type: "Villa", location: "Ubud, Bali", description: "A sunlit private retreat made for slow mornings and restorative stays.", price: 140, rating: "4.9", image: "/accommodations/villa.webp", rooms: "1 king + 2", bathrooms: "3 ensuite", guests: 4, size: 140 },
    { id: "awan-garden-villa", name: "Awan Garden Villa", type: "Villa", location: "Canggu, Bali", description: "A quiet garden hideaway with warm timber details and a private pool.", price: 165, rating: "4.8", image: "/accommodations/cottage.webp", rooms: "2 king", bathrooms: "2 ensuite", guests: 4, size: 128 },
  ],
  Apartments: [
    { id: "lume-city-suite", name: "Lume City Suite", type: "Apartments", location: "Seminyak, Bali", description: "A calm, design-led city base within easy reach of dining and the coast.", price: 120, rating: "4.8", image: "/accommodations/apartment.webp", rooms: "1 king", bathrooms: "1 ensuite", guests: 2, size: 64 },
    { id: "nusa-loft", name: "Nusa Loft", type: "Apartments", location: "Sanur, Bali", description: "Airy open-plan living with thoughtful comforts for an effortless escape.", price: 135, rating: "4.7", image: "/accommodations/villa.webp", rooms: "1 king + 1", bathrooms: "2 baths", guests: 3, size: 82 },
  ],
  Mansion: [
    { id: "maison-aruna", name: "Maison Aruna", type: "Mansion", location: "Uluwatu, Bali", description: "Heritage character and generous rooms for memorable group getaways.", price: 310, rating: "4.9", image: "/accommodations/mansion.webp", rooms: "4 king", bathrooms: "5 ensuite", guests: 8, size: 360 },
    { id: "the-olive-house", name: "The Olive House", type: "Mansion", location: "Nusa Dua, Bali", description: "A gracious estate pairing classic details with modern island ease.", price: 360, rating: "5.0", image: "/accommodations/cottage.webp", rooms: "5 king", bathrooms: "5 ensuite", guests: 10, size: 420 },
  ],
  Cottage: [
    { id: "meadow-cottage", name: "Meadow Cottage", type: "Cottage", location: "Sidemen, Bali", description: "A tactile countryside stay surrounded by green hills and quiet trails.", price: 110, rating: "4.9", image: "/accommodations/cottage.webp", rooms: "1 king", bathrooms: "1 bath", guests: 2, size: 58 },
    { id: "riverstone-cabin", name: "Riverstone Cabin", type: "Cottage", location: "Munduk, Bali", description: "A cozy timber refuge with cool mountain air and forest views.", price: 125, rating: "4.8", image: "/accommodations/mansion.webp", rooms: "2 queen", bathrooms: "2 baths", guests: 4, size: 92 },
  ],
};

export function getStay(id?: string) {
  return Object.values(stays).flat().find((stay) => stay.id === id) ?? stays.Villa[0];
}
