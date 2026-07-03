import { Client, Databases, Storage, ID, IndexType } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const {
  NEXT_PUBLIC_APPWRITE_ENDPOINT,
  NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  APPWRITE_API_KEY
} = process.env;

if (!NEXT_PUBLIC_APPWRITE_ENDPOINT || !NEXT_PUBLIC_APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
  console.error("❌ Error: Missing required environment variables in .env.local.");
  console.error("Please fill NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, and APPWRITE_API_KEY.");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const dbId = NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'dailymist_db';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('🚀 Starting Appwrite Initialization...');

  // 1. Create Database if not exists
  try {
    await databases.get(dbId);
    console.log(`✅ Database ${dbId} already exists. Cleaning up old collections...`);
    
    // Delete existing collections to avoid duplicates on re-run
    const collections = await databases.listCollections(dbId);
    for (const col of collections.collections) {
      console.log(`🗑️  Deleting existing collection: ${col.name}...`);
      await databases.deleteCollection(dbId, col.$id);
    }
  } catch (err) {
    if (err.code === 404) {
      console.log(`⏳ Creating database ${dbId}...`);
      await databases.create(dbId, 'DailyMist Database');
      console.log(`✅ Database ${dbId} created.`);
    } else {
      console.log(`✅ Database ${dbId} accessed.`);
    }
  }

  // Helper to create collection and attributes
  async function createCollection(name, attributesConfig, indexesConfig = []) {
    const colId = ID.unique();
    console.log(`\n⏳ Creating Collection: ${name} ...`);
    const col = await databases.createCollection(dbId, colId, name);
    
    console.log(`   Creating attributes for ${name}...`);
    for (const attr of attributesConfig) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(dbId, colId, attr.key, attr.size, attr.required, attr.default, attr.array);
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(dbId, colId, attr.key, attr.required, attr.min, attr.max, attr.default, attr.array);
        } else if (attr.type === 'float') {
          await databases.createFloatAttribute(dbId, colId, attr.key, attr.required, attr.min, attr.max, attr.default, attr.array);
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(dbId, colId, attr.key, attr.required, attr.default, attr.array);
        } else if (attr.type === 'datetime') {
          await databases.createDatetimeAttribute(dbId, colId, attr.key, attr.required, attr.default, attr.array);
        } else if (attr.type === 'enum') {
          await databases.createEnumAttribute(dbId, colId, attr.key, attr.elements, attr.required, attr.default, attr.array);
        }
      } catch (err) {
        console.error(`   ❌ Failed to create attribute ${attr.key}:`, err.message);
      }
    }

    console.log(`   Waiting 3 seconds for attributes to be ready...`);
    await sleep(3000); // Important! Attributes take time to become available before creating indexes

    if (indexesConfig.length > 0) {
      console.log(`   Creating indexes for ${name}...`);
      for (const idx of indexesConfig) {
        try {
          await databases.createIndex(dbId, colId, idx.key, idx.type, idx.attributes);
        } catch (err) {
          console.error(`   ❌ Failed to create index ${idx.key}:`, err.message);
        }
      }
    }

    console.log(`✅ Collection ${name} setup complete! ID: ${colId}`);
    return colId;
  }

  // Collections Definitions
  const productsId = await createCollection('products', [
    { type: 'string', key: 'name', size: 255, required: true },
    { type: 'string', key: 'slug', size: 255, required: true },
    { type: 'string', key: 'description', size: 5000, required: false },
    { type: 'string', key: 'brand', size: 100, required: false },
    { type: 'integer', key: 'price', required: true },
    { type: 'integer', key: 'discount_price', required: false },
    { type: 'integer', key: 'stock', required: true },
    { type: 'integer', key: 'volume_ml', required: false },
    { type: 'enum', key: 'gender', elements: ['male', 'female', 'unisex'], required: false },
    { type: 'string', key: 'category_id', size: 255, required: false },
    { type: 'string', key: 'images', size: 255, required: false, array: true },
    { type: 'boolean', key: 'is_featured', required: false, default: false },
    { type: 'boolean', key: 'is_active', required: false, default: true },
    { type: 'float', key: 'rating_avg', required: false, default: 0 },
    { type: 'integer', key: 'sold_count', required: false, default: 0 },
  ], [
    { key: 'idx_slug', type: IndexType.Unique, attributes: ['slug'] },
    { key: 'idx_category', type: IndexType.Key, attributes: ['category_id'] },
    { key: 'idx_active', type: IndexType.Key, attributes: ['is_active'] },
    { key: 'idx_name_fulltext', type: IndexType.Fulltext, attributes: ['name'] }
  ]);

  const categoriesId = await createCollection('categories', [
    { type: 'string', key: 'name', size: 255, required: true },
    { type: 'string', key: 'slug', size: 255, required: true },
    { type: 'string', key: 'image', size: 255, required: false },
    { type: 'boolean', key: 'is_active', required: false, default: true },
  ], [
    { key: 'idx_slug', type: IndexType.Unique, attributes: ['slug'] }
  ]);

  const ordersId = await createCollection('orders', [
    { type: 'string', key: 'user_id', size: 255, required: true },
    { type: 'string', key: 'order_number', size: 255, required: true },
    { type: 'string', key: 'items', size: 3000, required: true }, // Reduced from 10000 to fit MariaDB row limits
    { type: 'integer', key: 'subtotal', required: true },
    { type: 'integer', key: 'shipping_fee', required: true },
    { type: 'integer', key: 'total', required: true },
    { type: 'string', key: 'status', size: 50, required: true },
    { type: 'string', key: 'payment_status', size: 50, required: true },
    { type: 'string', key: 'payment_method', size: 50, required: false },
    { type: 'string', key: 'shipping_address', size: 1000, required: true }, // Reduced from 5000
    { type: 'string', key: 'tracking_number', size: 255, required: false },
    { type: 'datetime', key: 'paid_at', required: false },
    { type: 'string', key: 'payment_reference', size: 255, required: false },
  ], [
    { key: 'idx_user_id', type: IndexType.Key, attributes: ['user_id'] },
    { key: 'idx_order_number', type: IndexType.Unique, attributes: ['order_number'] }
  ]);

  const reviewsId = await createCollection('reviews', [
    { type: 'string', key: 'product_id', size: 255, required: true },
    { type: 'string', key: 'user_id', size: 255, required: true },
    { type: 'string', key: 'user_name', size: 255, required: true },
    { type: 'integer', key: 'rating', required: true, min: 1, max: 5 },
    { type: 'string', key: 'comment', size: 5000, required: false },
    { type: 'datetime', key: 'created_at', required: true },
  ], [
    { key: 'idx_product_id', type: IndexType.Key, attributes: ['product_id'] }
  ]);

  const addressesId = await createCollection('addresses', [
    { type: 'string', key: 'user_id', size: 255, required: true },
    { type: 'string', key: 'label', size: 255, required: false },
    { type: 'string', key: 'recipient_name', size: 255, required: true },
    { type: 'string', key: 'phone', size: 50, required: true },
    { type: 'string', key: 'full_address', size: 1000, required: true },
    { type: 'string', key: 'city', size: 255, required: true },
    { type: 'string', key: 'province', size: 255, required: true },
    { type: 'string', key: 'postal_code', size: 20, required: true },
    { type: 'boolean', key: 'is_default', required: false, default: false },
  ], [
    { key: 'idx_user_id', type: IndexType.Key, attributes: ['user_id'] }
  ]);

  // Storage Buckets
  let productImagesBucketId = ID.unique();
  let bannersBucketId = ID.unique();
  try {
    console.log(`\n⏳ Creating Bucket: product-images...`);
    const prodBucket = await storage.createBucket(productImagesBucketId, 'Product Images', [], false, true, undefined, ['jpg', 'png', 'webp', 'jpeg']);
    productImagesBucketId = prodBucket.$id;
    console.log(`✅ Bucket product-images created! ID: ${productImagesBucketId}`);
  } catch(e) { console.error('Failed to create product images bucket:', e.message); }

  try {
    console.log(`⏳ Creating Bucket: banners...`);
    const banBucket = await storage.createBucket(bannersBucketId, 'Banners', [], false, true, undefined, ['jpg', 'png', 'webp', 'jpeg']);
    bannersBucketId = banBucket.$id;
    console.log(`✅ Bucket banners created! ID: ${bannersBucketId}`);
  } catch(e) { console.error('Failed to create banners bucket:', e.message); }

  console.log(`\n🎉 All Done! Here are your Environment Variables. Copy these into your .env.local:\n`);
  console.log(`NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID=${productsId}`);
  console.log(`NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID=${categoriesId}`);
  console.log(`NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID=${ordersId}`);
  console.log(`NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID=${reviewsId}`);
  console.log(`NEXT_PUBLIC_APPWRITE_ADDRESSES_COLLECTION_ID=${addressesId}`);
  console.log(`NEXT_PUBLIC_APPWRITE_PRODUCT_IMAGES_BUCKET_ID=${productImagesBucketId}`);
  console.log(`NEXT_PUBLIC_APPWRITE_BANNERS_BUCKET_ID=${bannersBucketId}`);
  console.log(`\n(Don't forget to restart your Next.js server after updating .env.local)`);
}

main().catch(err => {
  console.error("Fatal Error:", err);
});
