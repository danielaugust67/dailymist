import { createAdminClient } from "../appwrite/server";
import { appwriteConfig } from "../appwrite/config";
import { Query, Permission, Role } from "node-appwrite";
import { mapAddress, Address } from "../mappers/address.mapper";

const DB_ID = appwriteConfig.databaseId;
const ADDRESS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_ADDRESSES_COLLECTION_ID!;

export async function getUserAddresses(userId: string): Promise<Address[]> {
  const { databases } = await createAdminClient();
  const response = await databases.listDocuments(DB_ID, ADDRESS_COLLECTION, [
    Query.equal("user_id", userId),
    Query.orderDesc("$createdAt"),
  ]);
  return response.documents.map(mapAddress);
}

export async function getAddressById(id: string, userId: string): Promise<Address | null> {
  try {
    const { databases } = await createAdminClient();
    const document = await databases.getDocument(DB_ID, ADDRESS_COLLECTION, id);
    if (document.user_id !== userId) return null; // Security check
    return mapAddress(document);
  } catch (error) {
    return null;
  }
}

export async function createAddress(userId: string, data: Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">): Promise<Address> {
  const { databases } = await createAdminClient();
  
  // If this is the first address or explicitly set as default, we might need to handle resetting other defaults
  if (data.isDefault) {
    await unsetOtherDefaultAddresses(userId);
  }

  const document = await databases.createDocument(
    DB_ID,
    ADDRESS_COLLECTION,
    "unique()",
    {
      user_id: userId,
      label: data.label,
      recipient_name: data.recipientName,
      phone: data.phone,
      full_address: data.fullAddress,
      city: data.city,
      province: data.province,
      postal_code: data.postalCode,
      is_default: data.isDefault,
    },
    [
      Permission.read(Role.user(userId)),
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
      Permission.read(Role.team("admins")),
      Permission.update(Role.team("admins")),
      Permission.delete(Role.team("admins")),
    ]
  );
  return mapAddress(document);
}

export async function updateAddress(id: string, userId: string, data: Partial<Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<Address | null> {
  const { databases } = await createAdminClient();
  
  // Check ownership
  const existing = await getAddressById(id, userId);
  if (!existing) throw new Error("Unauthorized or not found");

  if (data.isDefault) {
    await unsetOtherDefaultAddresses(userId);
  }

  const payload: any = {};
  if (data.label !== undefined) payload.label = data.label;
  if (data.recipientName !== undefined) payload.recipient_name = data.recipientName;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.fullAddress !== undefined) payload.full_address = data.fullAddress;
  if (data.city !== undefined) payload.city = data.city;
  if (data.province !== undefined) payload.province = data.province;
  if (data.postalCode !== undefined) payload.postal_code = data.postalCode;
  if (data.isDefault !== undefined) payload.is_default = data.isDefault;

  const document = await databases.updateDocument(DB_ID, ADDRESS_COLLECTION, id, payload);
  return mapAddress(document);
}

export async function deleteAddress(id: string, userId: string): Promise<void> {
  const { databases } = await createAdminClient();
  // Check ownership
  const existing = await getAddressById(id, userId);
  if (!existing) throw new Error("Unauthorized or not found");

  await databases.deleteDocument(DB_ID, ADDRESS_COLLECTION, id);
}

export async function unsetOtherDefaultAddresses(userId: string): Promise<void> {
  const { databases } = await createAdminClient();
  const currentDefaults = await databases.listDocuments(DB_ID, ADDRESS_COLLECTION, [
    Query.equal("user_id", userId),
    Query.equal("is_default", true),
  ]);

  for (const doc of currentDefaults.documents) {
    await databases.updateDocument(DB_ID, ADDRESS_COLLECTION, doc.$id, {
      is_default: false,
    });
  }
}
