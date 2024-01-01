-- these two truncations will cascade to every other table
TRUNCATE "user" CASCADE;
TRUNCATE tournament CASCADE;

INSERT INTO "user"(id, "firstName", "lastName", email, password, "isAdmin") values(1, 'Markku', 'Rikola', 'markku.rikola@gmail.com', 'qwerty123', true);
INSERT INTO "user"(id, "firstName", "lastName", email, password, "isAdmin") values(2, 'Pekka', 'Pelaaja', 'pekka.pelaaja@outlook.com', 'qwerty123', false);
INSERT INTO "user"(id, "firstName", "lastName", email, password, "isAdmin") values(3, 'Sakari', 'Staffer', 'sakari.staff@motticon.fi', 'qwerty123', false);

INSERT INTO cube(title, description, url) values('Monoblue', 'Pelkkää sinistä', '');
INSERT INTO cube(title, description, url) values('Vintage cube', 'Powerit löytyy', '');
INSERT INTO cube(title, description, url) values('Allun faksicube', 'Faksit on parhaita', '');

INSERT INTO tournament(id, name, description) values(1, 'MottiCon 2023', 'Servin Mökki 4.-5.5.2024');

INSERT INTO tournament_staff_members("tournamentId", "userId") values(1, 3);

INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(1, 2, false, false);
