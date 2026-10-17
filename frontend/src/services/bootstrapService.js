import { demoUsers, DEMO_PASSWORD } from "../data/demo";
import { KEYS } from "../utils/constants";
import { hashPassword } from "../utils/password";
import { writeStorage } from "../utils/storage";
let initializing;
export function initializeDemo() {
  if (!initializing) initializing = (async () => {
    if (!localStorage.getItem(KEYS.users)) {
      const users = await Promise.all(demoUsers.map(async user => ({ ...user, credential: await hashPassword(DEMO_PASSWORD), createdAt: new Date().toISOString() })));
      if (!localStorage.getItem(KEYS.users)) writeStorage(KEYS.users, users);
    }
  })().catch(error => { initializing = undefined; throw error; });
  return initializing;
}
