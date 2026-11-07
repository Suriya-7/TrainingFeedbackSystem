-- ============================================================================
--  TRAINERS table  (send this file to the DB team)
--
--  Holds the people HR has made trainers. A trainer is still an ordinary
--  employee (no separate login). Rows are NEVER deleted: "remove trainer"
--  sets IS_ACTIVE = 0, so the app only needs SELECT / INSERT / UPDATE rights.
--
--  ID is filled by the app (MAX + 1), same as the other tables, so no
--  sequence or trigger is needed. Match the VARCHAR2 size of EMPLOYEE_NO to
--  the one used in TRAININGS / TRAINING_FEEDBACK if it differs.
-- ============================================================================
CREATE TABLE trainers (
  trainer_id      NUMBER          NOT NULL,
  employee_no     VARCHAR2(50)    NOT NULL,
  added_by_plant  VARCHAR2(20),
  is_active       NUMBER(1)       DEFAULT 1 NOT NULL,
  created_at      TIMESTAMP       DEFAULT SYSTIMESTAMP,
  updated_at      TIMESTAMP       DEFAULT SYSTIMESTAMP,
  CONSTRAINT pk_trainers PRIMARY KEY (trainer_id),
  CONSTRAINT uq_trainers_emp UNIQUE (employee_no)
);

-- Grant the same access the app user already has on the other tables:
-- GRANT SELECT, INSERT, UPDATE ON trainers TO <app_user>;
