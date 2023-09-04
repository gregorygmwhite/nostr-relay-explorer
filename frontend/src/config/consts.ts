/*
    * All the current Kinds according to the Nostr docs
    * https://github.com/nostr-protocol/nips
    *
    * If you update the list, please update the event type file as well
**/
export const NOSTR_KINDS_DISPLAY = {
    0: "Metadata (0)",
    1: "Short Text Note (1)",
    2: "Recommended Relay (2)",
    3: "Contacts (3)",
    4: "Encrypted Direct Message (4)",
    5: "Event Deletion (5)",
    6: "Repost (6)",
    7: "Reaction (7)",
    8: "Badge Award (8)",
    16: "Generic Repost (16)",
    40: "Channel Creation (40)",
    41: "Channel Metadata (41)",
    42: "Channel Message (42)",
    43: "Channel Hide Message (43)",
    44: "Channel Mute User (44)",
    1063: "File Metadata (1063)",
    1311: "Live Chat Message (1311)",
    1984: "Reporting (1984)",
    1985: "Label (1985)",
    9734: "Zap Request (9734)",
    9735: "Zap (9735)",
    10000: "Mute List (10000)",
    10001: "Pin List (10001)",
    10002: "Relay List Metadata (10002)",
    13194: "Wallet Info (13194)",
    22242: "Client Authentication (22242)",
    23194: "Wallet Request (23194)",
    23195: "Wallet Response (23195)",
    24133: "Nostr Connect (24133)",
    27235: "HTTP Auth (27235)",
    30000: "Categorized People List (30000)",
    30001: "Categorized Bookmark List (30001)",
    30008: "Profile Badges (30008)",
    30009: "Badge Definition (30009)",
    30017: "Create or update stall (30017)",
    30018: "Create or update product (30018)",
    30023: "Long form content (30023)",
    30078: "Application-specific Data (30078)",
    30311: "Live Event (30311)",
    31989: "Handler Recommendation (31989)",
    31990: "Handler Information (31990)",
}

type RelayNips = {
    [key: number]: string;
  };


export const RELAY_NIPS: RelayNips = {
    1: "Basics",
    2: "Contact list",
    4: "DMs",
    9: "Event deletion",
    11: "Relay metadata",
    12: "Generic tag queries",
    15: "Nostr marketplace",
    16: "Replaceable or ephemeral events",
    20: "Relays communicating success of client command",
    22: "Event created_at time limits",
    26: "Delegated event signing",
    28: "Public chat",
    33: "Parameterized replaceable events",
    40: "Expiring events",
    50: "Human readable search queries",
    52: "Calendar events",
    56: "Reporting",
    57: "Lightning zaps",
    99: "Classified listings",
}

export const SPECIAL_RELAY_NIPS = [
    9, // Event deletion
    15, // Nostr marketplace
    16, // Replaceable or ephemeral events
    20, // Relays communicating success of client command
    26, // Delegated event signing
    28, // Public chat
    33, // Parameterized replaceable events
    40, // Expiring events
    50, // Human readable search queries
    52, // Calendar events
    56, // Reporting
    57, // Lightning zaps
    99, // Classified listings
]

export const COMMON_FREE_RELAYS = [
    "wss://relay.primal.net",
    "wss://nos.lol",
    "wss://relay.nostr.band",
    "wss://relay.damus.io",
    // "wss://nostr.wine", // paid
    "wss://relayable.org",
    "wss://saltivka.org",
    "wss://nostr-pub.wellorder.net",
    // "wss://nostr.bitcoiner.social", // private
    "wss://soloco.nl",
]
