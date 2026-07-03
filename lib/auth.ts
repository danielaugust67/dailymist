import { cookies } from "next/headers";
import { createSessionClient } from "./appwrite/server";

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}
