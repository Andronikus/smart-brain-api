BEGIN TRANSACTION;

CREATE TABLE users (
	id serial NOT NULL,
	"name" varchar(100) NOT NULL,
	email text NOT NULL,
	entries int8 NULL DEFAULT 0,
	joined_at timestamp NOT NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

COMMIT;