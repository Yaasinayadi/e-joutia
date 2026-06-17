export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  distance: number;
  imageUrl: string;
}

export const mockData: Product[] = [
  {
    id: "1",
    title: "iPhone 13 Pro 128 Go",
    description: "Téléphone en excellent état, aucune rayure. Batterie à 90%.",
    price: 6500,
    category: "Électronique",
    condition: "Comme neuf",
    distance: 1.2,
    imageUrl: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "2",
    title: "Veste en cuir véritable",
    description: "Veste noire pour homme, taille L. Très peu portée.",
    price: 450,
    category: "Mode",
    condition: "Comme neuf",
    distance: 3.5,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "3",
    title: "Canapé 3 places en tissu",
    description: "Canapé gris très confortable. Quelques légères taches mais bon état général.",
    price: 1200,
    category: "Maison",
    condition: "Bon état",
    distance: 5.8,
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "4",
    title: "Vélo VTT Rockrider",
    description: "Vélo idéal pour les balades en forêt. Freins à disque, suspension avant.",
    price: 850,
    category: "Véhicules",
    condition: "Correct",
    distance: 8.4,
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "5",
    title: "PlayStation 5 avec 2 manettes",
    description: "Console PS5 édition standard. Fournie avec deux manettes DualSense et 3 jeux.",
    price: 4800,
    category: "Électronique",
    condition: "Neuf",
    distance: 2.1,
    imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "6",
    title: "Machine à café expresso",
    description: "Machine à café de marque avec buse vapeur pour cappuccino.",
    price: 350,
    category: "Maison",
    condition: "Comme neuf",
    distance: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1520218508822-998633d99765?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "7",
    title: "Appareil photo reflex",
    description: "Appareil photo pour débutant avec objectif 18-55mm inclus.",
    price: 2200,
    category: "Électronique",
    condition: "Bon état",
    distance: 6.7,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "8",
    title: "Table en bois massif",
    description: "Table à manger robuste pour 6 personnes.",
    price: 1500,
    category: "Maison",
    condition: "Correct",
    distance: 10.5,
    imageUrl: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "9",
    title: "Montre connectée sport",
    description: "Montre avec suivi GPS et capteur cardio. Autonomie de 5 jours.",
    price: 750,
    category: "Électronique",
    condition: "Neuf",
    distance: 0.8,
    imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "10",
    title: "Guitare acoustique",
    description: "Guitare idéale pour débuter. Cordes neuves.",
    price: 600,
    category: "Autres",
    condition: "Comme neuf",
    distance: 3.0,
    imageUrl: "https://images.unsplash.com/photo-1550227298-1b2ea1850dd0?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "11",
    title: "Tapis berbère",
    description: "Tapis fait main, dimensions 2x3m. Motifs géométriques.",
    price: 900,
    category: "Maison",
    condition: "Bon état",
    distance: 7.2,
    imageUrl: "https://images.unsplash.com/photo-1534889156217-d643df14f14a?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "12",
    title: "Trotinette électrique",
    description: "Trotinette pliable, vitesse max 25km/h. Autonomie 20km.",
    price: 1800,
    category: "Véhicules",
    condition: "Correct",
    distance: 2.5,
    imageUrl: "https://images.unsplash.com/photo-1593847847101-b26402ec9d71?auto=format&fit=crop&w=500&q=60"
  }
];
