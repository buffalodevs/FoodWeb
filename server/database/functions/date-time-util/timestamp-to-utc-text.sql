SELECT dropFunction ('timestampToUtcText');

/**
 * Converts a PostgreSQL TIMESTAMP to a UTC format (JavaScript) time string.
 */
CREATE OR REPLACE FUNCTION timestampToUtcText
(
    _timestampToConvert TIMESTAMP
)
RETURNS TEXT
AS $$
BEGIN

    RETURN TO_CHAR(_timestampToConvert, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')::TEXT;

END;
$$ LANGUAGE plpgsql;