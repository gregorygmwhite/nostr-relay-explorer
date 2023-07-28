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
    supported_nips: string | null;
    payment_required: boolean;
    payments_url: string | null;
    admission_fees_sats: number | null;
    publication_fees_sats: number | null;
    limitations: any;
}

export default Relay;
