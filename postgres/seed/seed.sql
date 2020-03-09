BEGIN TRANSACTION;

INSERT INTO users(name, email, entries, joined_at) VALUES('Andronikus', 'andronikus@gmail.com', 10, '2020-03-08');

INSERT INTO login(hash, email) VALUES('$2a$10$4ZcJ3q9n1WhB9Gf1gzAqUeXeJOfGsUh1SgtAKy42LjIuZi/2/yKyu', 'andronikus@gmail.com');

COMMIT;