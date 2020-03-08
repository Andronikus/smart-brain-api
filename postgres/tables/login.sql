BEGIN TRANSACTION;

CREATE TABLE login (
	id          serial NOT NULL,
	hash        varchar(100) NOT NULL,
	email       text NOT NULL,
	CONSTRAINT login_email_key UNIQUE (email),
	CONSTRAINT login_pkey PRIMARY KEY (id)
);

COMMIT;