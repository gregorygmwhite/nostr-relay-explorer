import {
    PublicKey,
 } from "./crypto";

 import {
    Timestamp,
 } from "./common";


/*
    * All the current Kinds according to the Nostr docs
    * https://github.com/nostr-protocol/nips
    *
    * If you update the list, please update the NOSTR_KINDS const as well
**/
export enum EventKind {
    Metadata= 0,
    ShortTextNote= 1,
    RecommendedRelay= 2,
    Contacts= 3,
    EncryptedDirectMessage= 4,
    EventDeletion= 5,
    Repost = 6,
    Reaction = 7,
    BadgeAward= 8,
    GenericRepost= 16,
    ChannelCreation= 40,
    ChannelMetadata= 41,
    ChannelMessage= 42,
    ChannelHideMessage= 43,
    ChannelMuteUser= 44,
    FileMetadata= 1063,
    LiveChatMessage= 1311,
    Reporting= 1984,
    Label= 1985,
    ZapRequest= 9734,
    Zap= 9735,
    MuteList= 10000,
    PinList= 10001,
    RelayListMetadata= 10002,
    WalletInfo= 13194,
    ClientAuthentication= 22242,
    WalletRequest= 23194,
    WalletResponse= 23195,
    NostrConnect= 24133,
    HTTPAuth= 27235,
    CategorizedPeopleList= 30000,
    CategorizedBookmarkList= 30001,
    ProfileBadges= 30008,
    BadgeDefinition= 30009,
    CreateOrUpdateStall= 30017,
    CreateOrUpdateProduct= 30018,
    Longformcontent= 30023,
    ApplicationSpecificData= 30078,
    LiveEvent= 30311,
    HandlerRecommendation= 31989,
    HandlerInformation= 31990,
}

export type Event = {
    id: string,
    pubkey: PublicKey,
    created_at: Timestamp,
    kind: EventKind,
    tags: string[][],
    content: string,
    sig: string,

    [key: string]: unknown,
}
