CREATE TABLE IF NOT EXISTS feedbackmktpl.attachments(
    id              uuid                PRIMARY KEY,
    message_id     uuid,
    name        varchar(100),
    mimeType    varchar(50),
    path        varchar(100),
    created_at      timestamptz(0),
    modified_at     timestamptz(0),
    deleted_at      timestamptz(0),
    created_by      uuid,
    modified_by     uuid,
    deleted_by      uuid
);
