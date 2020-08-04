create table if not exists persistent_logins (
  username varchar(100) not null,
  series varchar(64) primary key,
  token varchar(64) not null,
  last_used timestamp not null
);

delete from  user_role;
delete from  roles;
delete from  users;


INSERT INTO roles (id, name) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_USER'),
(3, 'SALES_PERSON');

INSERT INTO users (`account_expired`, `account_locked`, `affiliate_company`, `email`, `password`, `name`, `id`) VALUES ('', '', 'softlogic', 'admin@gmail.com', '$2a$10$hKDVYxLefVHV/vtuPhWD3OigtRyOykRLDdUAp80Z1crSoS1lFqaFS', 'Admin', 1);
INSERT INTO users (`account_expired`, `account_locked`, `affiliate_company`, `email`, `password`, `name`, `id`) VALUES ('', '', 'softlogic', 'user@gmail.com', '$2a$10$ByIUiNaRfBKSV6urZoBBxe4UbJ/sS6u1ZaPORHF9AtNWAuVPVz1by', 'User', 2);

insert into user_role(user_id, role_id) values
(1,1),
(2,2);