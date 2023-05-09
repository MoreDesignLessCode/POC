CREATE TABLE IF NOT EXISTS feedbackmktpl.artifacts(
    id              uuid                PRIMARY KEY,
    ref_value     varchar(64),
    ref_type          varchar(64),
    tag_id          text[],
    created_at      timestamptz(0),
    modified_at     timestamptz(0),
    deleted_at      timestamptz(0),
    created_by      uuid,
    modified_by     uuid,
    deleted_by      uuid
);	