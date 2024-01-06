-- these truncations will cascade to every other table
TRUNCATE "user" CASCADE;
TRUNCATE tournament CASCADE;
TRUNCATE cube CASCADE;

INSERT INTO "user"(id, "firstName", "lastName", email, password, "isAdmin") values(1, 'Markku', 'Rikola', 'markku.rikola@gmail.com', 'qwerty123', true);
INSERT INTO "user"(id, "firstName", "lastName", email, password, "isAdmin") values(2, 'Pekka', 'Pelaaja', 'pekka.pelaaja@outlook.com', 'qwerty123', false);
INSERT INTO "user"(id, "firstName", "lastName", email, password, "isAdmin") values(3, 'Sakari', 'Staffer', 'sakari.staff@motticon.fi', 'qwerty123', false);

INSERT INTO cube(title, description, url) values('Monoblue', 'Pelkkää sinistä', 'https://cubecobra.com/cube/list/0de5c855-ad9a-4ce1-8a8c-d8f846e96712');
INSERT INTO cube(title, description, url) values('Vintage cube', 'Powerit löytyy', 'https://cubecobra.com/cube/list/r47');
INSERT INTO cube(title, description, url) values('Allun faksicube', 'Faksit on parhaita', 'https://cubecobra.com/cube/list/et9');
INSERT INTO cube(title, description, url) values('The B-Team', 'Second rate heroes', 'https://cubecobra.com/cube/list/thebteam');
INSERT INTO cube(title, description, url) values('Universes Beyond', 'Like Garfield intended', 'https://cubecobra.com/cube/list/SoNotUniversesBeyondCube');
INSERT INTO cube(title, description, url) values('Oops, All Creatures', 'It´s creatures all the way down', 'https://cubecobra.com/cube/list/1o7yb');

INSERT INTO tournament(id, name, description, "startDate", "endDate") values(1, 'MottiCon 2023', 'Servin Mökki 4.-5.5.2024', '2024-05-04', '2024-05-05');
INSERT INTO tournament(id, name, description, "startDate", "endDate") values(2, 'Pikadrafti', 'Tänään', now(), now());

INSERT INTO tournament_staff_members("tournamentId", "userId") values(1, 3);

INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(1, 2, false, false);
