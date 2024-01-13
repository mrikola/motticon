CREATE OR REPLACE FUNCTION fixtures() RETURNS void AS $$ 
DECLARE
-- players
  markku_id integer;
  pekka_id integer;
  sakari_id integer;
-- cubes
  monoblue_id integer;
-- tournaments
  motticon_id integer;
  pikadrafti_id integer;
-- rounds
  pikadrafti_round3_id integer;

BEGIN
-- these truncations will cascade to every other table
TRUNCATE "user" CASCADE;
TRUNCATE tournament CASCADE;
TRUNCATE cube CASCADE;

INSERT INTO "user"("firstName", "lastName", email, password, "isAdmin") 
  values('Markku', 'Rikola', 'markku.rikola@gmail.com', '$2b$10$dpIXU33MF9KIHhcpaUEwwOXd9tW5M6WcWLW8vCKpJT1AOVBSD5qq.', true) returning id into markku_id;
INSERT INTO "user"("firstName", "lastName", email, password, "isAdmin") 
  values('Pekka', 'Pelaaja', 'pekka.pelaaja@outlook.com', '$2b$10$dpIXU33MF9KIHhcpaUEwwOXd9tW5M6WcWLW8vCKpJT1AOVBSD5qq.', false) returning id into pekka_id;
INSERT INTO "user"("firstName", "lastName", email, password, "isAdmin") 
  values('Sakari', 'Staffer', 'sakari.staff@motticon.fi', '$2b$10$dpIXU33MF9KIHhcpaUEwwOXd9tW5M6WcWLW8vCKpJT1AOVBSD5qq.', false) returning id into sakari_id;

INSERT INTO cube(title, description, url) values('Monoblue', 'Pelkkää sinistä', 'https://cubecobra.com/cube/list/0de5c855-ad9a-4ce1-8a8c-d8f846e96712') RETURNING id INTO monoblue_id;
INSERT INTO cube(title, description, url) values('Vintage cube', 'Powerit löytyy', 'https://cubecobra.com/cube/list/r47');
INSERT INTO cube(title, description, url) values('Allun faksicube', 'Faksit on parhaita', 'https://cubecobra.com/cube/list/et9');
INSERT INTO cube(title, description, url) values('The B-Team', 'Second rate heroes', 'https://cubecobra.com/cube/list/thebteam');
INSERT INTO cube(title, description, url) values('Universes Beyond', 'Like Garfield intended', 'https://cubecobra.com/cube/list/SoNotUniversesBeyondCube');
INSERT INTO cube(title, description, url) values('Oops, All Creatures', 'It''s creatures all the way down', 'https://cubecobra.com/cube/list/1o7yb');

INSERT INTO tournament(name, description, "startDate", "endDate") values('MottiCon 2023', 'Servin Mökki 4.-5.5.2024', '2024-05-04', '2024-05-05') RETURNING id INTO motticon_id;
INSERT INTO tournament(name, description, "startDate", "endDate") values('Pikadrafti', 'Tänään', date_trunc('day', now()), date_trunc('day', now()) + time '23:59:59.999999') RETURNING id INTO pikadrafti_id;
INSERT INTO tournament(name, description, "startDate", "endDate") values('Muinainen Turnaus', 'Antiikkia', '2015-02-07', '2015-04-07');
INSERT INTO tournament(name, description, "startDate", "endDate") values('8-man draft 2/2024', 'Ke draft', '2024-02-02', '2024-02-02');
INSERT INTO tournament(name, description, "startDate", "endDate") values('8-man draft 3/2024', 'Ke draft', '2024-03-03', '2024-03-03');
INSERT INTO tournament(name, description, "startDate", "endDate") values('8-man draft 4/2024', 'Ke draft', '2024-04-04', '2024-04-04');

INSERT INTO tournament_cubes("tournamentId", "cubeId") select motticon_id, id from cube;
INSERT INTO tournament_cubes("tournamentId", "cubeId") values(pikadrafti_id, monoblue_id);

INSERT INTO tournament_staff_members("tournamentId", "userId") values(motticon_id, sakari_id);
INSERT INTO tournament_staff_members("tournamentId", "userId") values(pikadrafti_id, sakari_id);

INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(motticon_id, pekka_id, false, false);
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(pikadrafti_id, pekka_id, false, false);
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(pikadrafti_id, markku_id, false, false);

-- pikadrafti has two 2 round drafts, we create rounds 1-3
INSERT INTO draft("tournamentId", "draftNumber", "rounds") values(pikadrafti_id, 1, 2);
INSERT INTO draft("tournamentId", "draftNumber", "rounds") values(pikadrafti_id, 2, 2);
INSERT INTO round("tournamentId", "roundNumber", "startTime") values(pikadrafti_id, 1, now());
INSERT INTO round("tournamentId", "roundNumber", "startTime") values(pikadrafti_id, 2, now());
INSERT INTO round("tournamentId", "roundNumber", "startTime") values(pikadrafti_id, 3, now()) RETURNING id INTO pikadrafti_round3_id;

-- also create a match in round 3
INSERT INTO match("roundId", "tableNumber", "player1Id", "player2Id", "player1GamesWon", "player2GamesWon") 
  values(pikadrafti_round3_id, 1, pekka_id, sakari_id, 0, 0);
return;
END $$ LANGUAGE plpgsql;

select fixtures();