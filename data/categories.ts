export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

export const categories: Category[] = [
  {
    id: "CAT001",
    name: "Gemstones",
    slug: "gemstones",
    description:
      "Natural gemstones selected with traditional wisdom.",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1000&q=85"
  },

  {
    id: "CAT002",
    name: "Crystals",
    slug: "crystals",
    description:
      "Crystals for intention, mindfulness & everyday energy practices.",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85"
  },

  {
    id: "CAT003",
    name: "Rudraksha",
    slug: "rudraksha",
    description:
      "Sacred Rudraksha rooted in traditional Indian practices.",
    image:
      "https://images.unsplash.com/photo-1609602582698-7e5b2e6e8f68?auto=format&fit=crop&w=1000&q=85"
  },

  {
    id: "CAT004",
    name: "Puja Essentials",
    slug: "puja",
    description:
      "Traditional essentials for your spiritual practices.",
    image:
      "https://images.unsplash.com/photo-1604608672516-f1b9d5c2b8c6?auto=format&fit=crop&w=1000&q=85"
  },

  {
    id: "CAT005",
    name: "Crystal Jewellery",
    slug: "crystal-jewellery",
    description:
      "Elegant crystal jewellery crafted for everyday wear and spiritual intention.",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1000&q=85"
  }
];
