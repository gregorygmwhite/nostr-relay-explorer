def normalize_to_sats(amount, denomination):
    assert isinstance(amount, float) or isinstance(amount, int)
    assert isinstance(denomination, str)

    lowered_denom = denomination.lower()

    if lowered_denom == "sat" or lowered_denom == "sats":
        return amount
    elif lowered_denom == "msat" or lowered_denom == "msats":
        return convert_msats_to_sats(amount)
    elif lowered_denom == "btc":
        return convert_btc_to_sats(amount)
    else:
        raise ValueError("Unknown denomination: {}".format(denomination))


def convert_msats_to_sats(msats):
    assert isinstance(msats, int)
    return msats / 1000

def convert_btc_to_sats(btc):
    assert isinstance(btc, float)
    return int(btc * 100000000)
