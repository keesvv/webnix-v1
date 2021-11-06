import { User } from ".";
import { IO, readall, Seeker } from "../../lib/io";
import { btostr, strtob } from "../../lib/strconv";

export class UserManager {
  constructor(private store: IO & Seeker) {}

  serialize(user: User): byte[] {
    return strtob([user.username, user.password, user.name].join(":"));
  }

  deserialize(s: string): User {
    const [username, password, name] = s.split(":");

    return {
      username,
      password,
      name,
    };
  }

  private deserializeStore(store: byte[]): User[] {
    return btostr(store)
      .split("\n")
      .map((s) => this.deserialize(s));
  }

  async addUser(user: User): Promise<void> {
    await this.store.write([...this.serialize(user), 0x0a]);
  }

  async getUsers(): Promise<User[]> {
    this.store.seek(0);
    const store = await readall(this.store);
    return this.deserializeStore(store);
  }

  async findUser(username: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find((i) => i.username === username);
  }
}
