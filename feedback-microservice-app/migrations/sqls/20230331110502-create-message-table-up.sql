CREATE TABLE IF NOT EXISTS feedbackmktpl.messages(
    id              uuid                PRIMARY KEY,
    artifact_id     uuid,
    summary        varchar(100),
    description    varchar(300),
    status          int,
    created_at      timestamptz(0),
    modified_at     timestamptz(0),
    deleted_at      timestamptz(0),
    created_by      uuid,
    modified_by     uuid,
    deleted_by      uuid
);