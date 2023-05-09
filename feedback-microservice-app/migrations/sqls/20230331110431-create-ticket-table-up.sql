
CREATE TABLE IF NOT EXISTS feedbackmktpl.ticket(
    id              uuid                PRIMARY KEY,
    created_at      timestamptz(0),
    modified_at     timestamptz(0),
    deleted_at      timestamptz(0),
    created_by      uuid,
    modified_by     uuid,
    deleted_by      uuid
);