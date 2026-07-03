import { Models } from "node-appwrite";

export interface Address {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  fullAddress: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export function mapAddress(doc: Models.Document): Address {
  return {
    id: doc.$id,
    userId: doc.user_id,
    label: doc.label,
    recipientName: doc.recipient_name,
    phone: doc.phone,
    fullAddress: doc.full_address,
    city: doc.city,
    province: doc.province,
    postalCode: doc.postal_code,
    isDefault: doc.is_default ?? false,
    createdAt: doc.$createdAt,
    updatedAt: doc.$updatedAt,
  };
}
