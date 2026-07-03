const sdk = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new sdk.Client();
client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

async function run() {
    try {
        console.log("Creating wishlist collection...");
        const collection = await databases.createCollection(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            sdk.ID.unique(),
            "wishlist",
            [
              sdk.Permission.read(sdk.Role.users()),
              sdk.Permission.create(sdk.Role.users())
            ]
        );
        console.log("Collection Created! ID:", collection.$id);

        console.log("Creating user_id string attribute...");
        await databases.createStringAttribute(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID, collection.$id, "user_id", 255, true);
        
        console.log("Creating product_id string attribute...");
        await databases.createStringAttribute(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID, collection.$id, "product_id", 255, true);

        console.log("\nSuccess! Add this to your .env.local:");
        console.log(`NEXT_PUBLIC_APPWRITE_WISHLIST_COLLECTION_ID=${collection.$id}`);
    } catch (e) {
        console.error(e);
    }
}
run();
