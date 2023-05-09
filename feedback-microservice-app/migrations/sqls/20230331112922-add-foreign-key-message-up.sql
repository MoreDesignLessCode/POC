
ALTER TABLE feedbackmktpl.messages ADD CONSTRAINT messages_fk FOREIGN KEY (artifact_id) REFERENCES feedbackmktpl.artifacts(id);

ALTER TABLE feedbackmktpl.messages ADD CONSTRAINT messages_fk1 FOREIGN KEY (status) REFERENCES feedbackmktpl.status_types(id);