import { Relay as DataRelay } from "@prisma/client";

export type Relay = Omit<DataRelay, 'registered_at'> & { registered_at: string };
