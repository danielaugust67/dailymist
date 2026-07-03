import { Client, Databases, ID, Query } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const {
  NEXT_PUBLIC_APPWRITE_ENDPOINT,
  NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID,
  NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID,
  APPWRITE_API_KEY,
} = process.env;

const requiredEnv = {
  NEXT_PUBLIC_APPWRITE_ENDPOINT,
  NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID,
  NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID,
  APPWRITE_API_KEY,
};

for (const [key, value] of Object.entries(requiredEnv)) {
  if (!value) {
    console.error(`Missing ${key} in .env.local`);
    process.exit(1);
  }
}

const client = new Client()
  .setEndpoint(NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

const categories = [
  { name: "Eau de Parfum", slug: "eau-de-parfum" },
  { name: "Perfume Oil", slug: "perfume-oil" },
  { name: "Eau de Toilette", slug: "eau-de-toilette" },
  { name: "Limited Release", slug: "limited-release" },
];

const productImages = {
  velvetCedar: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
  morningMist: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80",
  amberSilk: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=900&q=80",
  solsticeBloom: "https://images.unsplash.com/photo-1595425964071-2c1ec9c5c88d?auto=format&fit=crop&w=900&q=80",
  arcticIris: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=900&q=80",
  nightOud: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=900&q=80",
  nectarineBlush: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=900&q=80",
  mossAndRain: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=900&q=80",
};

const products = [
  {
    name: "Velvet Cedar",
    slug: "velvet-cedar",
    categorySlug: "eau-de-parfum",
    price: 185,
    stock: 42,
    volume_ml: 50,
    gender: "unisex",
    brand: "DailyMist",
    is_featured: true,
    description: "A warm cedar fragrance with soft resin, clear musk, and a smooth amber finish.",
    images: [productImages.velvetCedar],
  },
  {
    name: "Morning Mist",
    slug: "morning-mist",
    categorySlug: "eau-de-parfum",
    price: 210,
    stock: 36,
    volume_ml: 50,
    gender: "unisex",
    brand: "DailyMist",
    is_featured: true,
    description: "Green tea, bergamot, and white jasmine shaped into a clean morning scent.",
    images: [productImages.morningMist],
  },
  {
    name: "Amber Silk",
    slug: "amber-silk",
    categorySlug: "perfume-oil",
    price: 145,
    stock: 58,
    volume_ml: 15,
    gender: "unisex",
    brand: "DailyMist",
    is_featured: true,
    description: "A concentrated perfume oil with amber, tonka, and a polished silk-like drydown.",
    images: [productImages.amberSilk],
  },
  {
    name: "Solstice Bloom",
    slug: "solstice-bloom",
    categorySlug: "eau-de-toilette",
    price: 160,
    stock: 31,
    volume_ml: 75,
    gender: "female",
    brand: "DailyMist",
    is_featured: true,
    description: "A bright floral composition with citrus petals, neroli, and soft white woods.",
    images: [productImages.solsticeBloom],
  },
  {
    name: "Arctic Iris",
    slug: "arctic-iris",
    categorySlug: "eau-de-parfum",
    price: 230,
    stock: 24,
    volume_ml: 50,
    gender: "unisex",
    brand: "DailyMist",
    is_featured: false,
    description: "Iris, cool mineral notes, and clean musk with a crisp powdery trail.",
    images: [productImages.arcticIris],
  },
  {
    name: "Night Oud",
    slug: "night-oud",
    categorySlug: "limited-release",
    price: 275,
    stock: 18,
    volume_ml: 50,
    gender: "male",
    brand: "DailyMist",
    is_featured: false,
    description: "Dark oud, saffron, and smoked woods balanced by a quiet resin sweetness.",
    images: [productImages.nightOud],
  },
  {
    name: "Nectarine Blush",
    slug: "nectarine-blush",
    categorySlug: "eau-de-toilette",
    price: 190,
    stock: 27,
    volume_ml: 75,
    gender: "female",
    brand: "DailyMist",
    is_featured: false,
    description: "Nectarine, rosewater, and gentle musk for a luminous everyday floral.",
    images: [productImages.nectarineBlush],
  },
  {
    name: "Moss & Rain",
    slug: "moss-and-rain",
    categorySlug: "eau-de-parfum",
    price: 155,
    stock: 45,
    volume_ml: 50,
    gender: "unisex",
    brand: "DailyMist",
    is_featured: false,
    description: "Wet moss, rain-washed leaves, and cedarwood with a soft earthy finish.",
    images: [productImages.mossAndRain],
  },
];

async function findBySlug(collectionId, slug) {
  const response = await databases.listDocuments(NEXT_PUBLIC_APPWRITE_DATABASE_ID, collectionId, [
    Query.equal("slug", slug),
    Query.limit(1),
  ]);
  return response.documents[0] || null;
}

const categoryIds = new Map();

for (const category of categories) {
  const existing = await findBySlug(NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID, category.slug);
  if (existing) {
    categoryIds.set(category.slug, existing.$id);
    console.log(`Category exists: ${category.name}`);
    continue;
  }

  const created = await databases.createDocument(
    NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID,
    ID.unique(),
    {
      name: category.name,
      slug: category.slug,
      is_active: true,
    }
  );

  categoryIds.set(category.slug, created.$id);
  console.log(`Created category: ${category.name}`);
}

for (const product of products) {
  const existing = await findBySlug(NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID, product.slug);
  const payload = {
    name: product.name,
    slug: product.slug,
    description: product.description,
    brand: product.brand,
    price: product.price,
    stock: product.stock,
    volume_ml: product.volume_ml,
    gender: product.gender,
    category_id: categoryIds.get(product.categorySlug),
    images: product.images,
    is_featured: product.is_featured,
    is_active: true,
    rating_avg: 0,
    sold_count: 0,
  };

  if (existing) {
    await databases.updateDocument(
      NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID,
      existing.$id,
      payload
    );
    console.log(`Updated product: ${product.name}`);
    continue;
  }

  await databases.createDocument(
    NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID,
    ID.unique(),
    payload
  );
  console.log(`Created product: ${product.name}`);
}

console.log("Seed complete.");
