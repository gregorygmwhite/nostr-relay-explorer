type Relay = {
    id: string;
    name: string | null;
    url: string;
    full_metadata: any;
    pubkey: string | null;
    contact: string | null;
    software: string | null;
    version: string | null;
    description: string | null;
    supported_nips: number[];
    payment_required: boolean;
    payments_url: string | null;
    admission_fees_sats: number | null;
    publication_fees_sats: number | null;
    limitations: any;
    tracked_since: string | null;
    posting_policy: string | null;
    last_metadata_update: string | null;
    last_update_success: boolean | null;
}

export default Relay;
