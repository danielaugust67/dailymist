import { Account, Client, Databases, Storage, Users } from "node-appwrite";
import { appwriteConfig } from "./config";
import { cookies } from "next/headers";

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.apiKey);

  return {
    databases: new Databases(client),
    storage: new Storage(client),
    users: new Users(client),
    account: new Account(client),
  };
}

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

  const cookieStore = await cookies();
  const session = cookieStore.get(`a_session_${appwriteConfig.projectId}`);

  if (session?.value) {
    client.setSession(session.value);
  }

  return {
    account: new Account(client),
    databases: new Databases(client),
  };
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch {
    return null;
  }
}
