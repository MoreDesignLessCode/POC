
ALTER TABLE feedbackmktpl.attachments ADD CONSTRAINT attachments_fk FOREIGN KEY (message_id) REFERENCES feedbackmktpl.messages(id);