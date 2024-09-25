import { Schema } from "ronin/schema";

type Account = Schema.Record<{
  name: string;
  active: boolean;
  likes: number;
  verifiedAt: Date;
}>;

// It's *required* to also define the plural version of the schema
type Accounts = Schema.Records<Account>;

declare module "ronin" {
  interface Schemas {
    account: Account;
    accounts: Accounts;
  }
}
