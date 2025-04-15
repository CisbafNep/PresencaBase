CREATE SEQUENCE IF NOT EXISTS user_entity_seq START WITH 1 INCREMENT BY 50;

CREATE TABLE user_entity
(
    id              BIGINT  NOT NULL,
    name            VARCHAR(255),
    role            VARCHAR(255),
    faults          INTEGER NOT NULL,
    presences       INTEGER NOT NULL,
    faults_final    INTEGER NOT NULL,
    presences_final INTEGER NOT NULL,
    base_name       VARCHAR(255),
    CONSTRAINT pk_userentity PRIMARY KEY (id)
);

ALTER TABLE user_entity
    ADD CONSTRAINT uc_userentity_name UNIQUE (name);