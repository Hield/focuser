from datetime import datetime, timezone


def get_timestamp() -> float:
    '''Get a UTC timestamp
    '''
    return datetime.now(timezone.utc).timestamp()
