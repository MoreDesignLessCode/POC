CREATE TABLE IF NOT EXISTS feedbackmktpl.participants(
    id              uuid                PRIMARY KEY,
    profile_id      uuid,
    artifact_id     uuid,
    added_by        uuid,
    status          int,
    created_at      timestamptz(0),
    modified_at     timestamptz(0),
    deleted_at      timestamptz(0),
    created_by      uuid,
    modified_by     uuid,
    deleted_by      uuid
);