CREATE OR REPLACE FUNCTION fixtures() RETURNS void AS $$ 
DECLARE
-- players
  markku_id integer;
  pekka_id integer;
  sakari_id integer;
  timo_id integer;
  tiina_id integer;
  john_id integer;
  jane_id integer;
  spike_id integer;
  johnny_id integer;
  timmy_id integer;
-- cubes
  monoblue_id integer;
-- tournaments
  motticon_id integer;
  pikadrafti_id integer;
  draft_8_man_2_2024_id integer;
-- drafts
  motticon_draft_id integer;
  pikadrafti_draft_id integer;
-- pods
  pikadrafti_pod_id integer;
-- rounds
  pikadrafti_round3_id integer;
  pikadrafti_round1_id integer;

BEGIN
-- these truncations will cascade to every other table
TRUNCATE "user" CASCADE;
TRUNCATE tournament CASCADE;
TRUNCATE cube CASCADE;

INSERT INTO "user"("firstName", "lastName", email, password, rating, "isAdmin") 
  values('Markku', 'Rikola', 'markku.rikola@gmail.com', '$2b$10$dpIXU33MF9KIHhcpaUEwwOXd9tW5M6WcWLW8vCKpJT1AOVBSD5qq.', 1600, true) returning id into markku_id;
INSERT INTO "user"("firstName", "lastName", email, password, rating, "isAdmin") 
  values('Pekka', 'Pelaaja', 'pekka.pelaaja@outlook.com', '$2b$10$dpIXU33MF9KIHhcpaUEwwOXd9tW5M6WcWLW8vCKpJT1AOVBSD5qq.', 1600, false) returning id into pekka_id;
INSERT INTO "user"("firstName", "lastName", email, password, rating, "isAdmin") 
  values('Sakari', 'Staffer', 'sakari.staff@motticon.fi', '$2b$10$dpIXU33MF9KIHhcpaUEwwOXd9tW5M6WcWLW8vCKpJT1AOVBSD5qq.', 1600, false) returning id into sakari_id;
-- more players to fill 8-player draft
INSERT INTO "user"("firstName", "lastName", email, password, rating, "isAdmin") 
  values('Timo', 'Tuuttari', 'timo.tuuttari@outlook.com', '$2b$10$dpIXU33MF9KIHhcpaUEwwOXd9tW5M6WcWLW8vCKpJT1AOVBSD5qq.', 1600, false) returning id into timo_id;
INSERT INTO "user"("firstName", "lastName", email, password, rating, "isAdmin") 
  values('Tiina', 'Tuuttari', 'tiina.tuuttari@outlook.com', '$2b$10$dpIXU33MF9KIHhcpaUEwwOXd9tW5M6WcWLW8vCKpJT1AOVBSD5qq.', 1600, false) returning id into tiina_id;
INSERT INTO "user"("firstName", "lastName", email, password, rating, "isAdmin") 
  values('John', 'Doe', 'john.doe@outlook.com', '$2b$10$dpIXU33MF9KIHhcpaUEwwOXd9tW5M6WcWLW8vCKpJT1AOVBSD5qq.', 1600, false) returning id into john_id;
INSERT INTO "user"("firstName", "lastName", email, password, rating, "isAdmin") 
  values('Jane', 'Doe', 'jane.doe@outlook.com', '$2b$10$dpIXU33MF9KIHhcpaUEwwOXd9tW5M6WcWLW8vCKpJT1AOVBSD5qq.', 1600, false) returning id into jane_id;
INSERT INTO "user"("firstName", "lastName", email, password, rating, "isAdmin") 
  values('Timmy', 'Steaks', 'timmy.steaks@outlook.com', '$2b$10$dpIXU33MF9KIHhcpaUEwwOXd9tW5M6WcWLW8vCKpJT1AOVBSD5qq.', 1600, false) returning id into timmy_id;
INSERT INTO "user"("firstName", "lastName", email, password, rating, "isAdmin") 
  values('Spike', 'von Spike', 'spike.von.spike@outlook.com', '$2b$10$dpIXU33MF9KIHhcpaUEwwOXd9tW5M6WcWLW8vCKpJT1AOVBSD5qq.', 1600, false) returning id into spike_id;
INSERT INTO "user"("firstName", "lastName", email, password, rating, "isAdmin") 
  values('Johnny', 'McJohnny', 'johnny.mcjohnny@outlook.com', '$2b$10$dpIXU33MF9KIHhcpaUEwwOXd9tW5M6WcWLW8vCKpJT1AOVBSD5qq.', 1600, false) returning id into johnny_id;

INSERT INTO cube(title, description, url, owner, "imageUrl") values('Monoblue', 'Pelkkää sinistä', 'https://cubecobra.com/cube/list/0de5c855-ad9a-4ce1-8a8c-d8f846e96712', 'Sakari Castrén', 'https://cards.scryfall.io/art_crop/front/9/0/9079c93e-3da8-442a-89d2-609a3eac83b0.jpg') RETURNING id INTO monoblue_id;
INSERT INTO cube(title, description, url, "imageUrl") values('Vintage cube', 'Powerit löytyy', 'https://cubecobra.com/cube/list/r47', 'https://cards.scryfall.io/art_crop/front/b/0/b0faa7f2-b547-42c4-a810-839da50dadfe.jpg');
INSERT INTO cube(title, description, url, "imageUrl") values('Allun faksicube', 'Faksit on parhaita', 'https://cubecobra.com/cube/list/et9','https://cards.scryfall.io/art_crop/front/2/d/2d2c323f-eecd-4560-a128-ab513d231552.jpg');
INSERT INTO cube(title, description, url, "imageUrl") values('The B-Team', 'Second rate heroes', 'https://cubecobra.com/cube/list/thebteam', 'https://cards.scryfall.io/art_crop/front/2/f/2f09e451-0246-45a2-8bfd-07d3c65ddfe6.jpg');
INSERT INTO cube(title, description, url, "imageUrl") values('Universes Beyond', 'Like Garfield intended', 'https://cubecobra.com/cube/list/SoNotUniversesBeyondCube', 'https://cards.scryfall.io/art_crop/front/c/4/c40b25d7-73c9-4f30-a707-5afb08185a8d.jpg');
INSERT INTO cube(title, description, url) values('Oops, All Creatures', 'It''s creatures all the way down', 'https://cubecobra.com/cube/list/1o7yb');

INSERT INTO tournament(name, description, "startDate", "endDate") values('MottiCon 2023', 'Servin Mökki 4.-5.5.2024', '2024-05-04', '2024-05-05') RETURNING id INTO motticon_id;
INSERT INTO tournament(name, description, "startDate", "endDate") values('Pikadrafti', 'Tänään', date_trunc('day', now()), date_trunc('day', now()) + time '23:59:59.999999') RETURNING id INTO pikadrafti_id;
INSERT INTO tournament(name, description, "startDate", "endDate") values('Muinainen Turnaus', 'Antiikkia', '2015-02-07', '2015-04-07');
INSERT INTO tournament(name, description, "startDate", "endDate") values('8-man draft 2/2024', 'Ke draft', '2024-02-02', '2024-02-02') RETURNING id INTO draft_8_man_2_2024_id;
INSERT INTO tournament(name, description, "startDate", "endDate") values('8-man draft 3/2024', 'Ke draft', '2024-03-03', '2024-03-03');
INSERT INTO tournament(name, description, "startDate", "endDate") values('8-man draft 4/2024', 'Ke draft', '2024-04-04', '2024-04-04');

INSERT INTO tournament_cubes("tournamentId", "cubeId") select motticon_id, id from cube;
INSERT INTO tournament_cubes("tournamentId", "cubeId") values(pikadrafti_id, monoblue_id);

INSERT INTO tournament_staff_members("tournamentId", "userId") values(motticon_id, sakari_id);
INSERT INTO tournament_staff_members("tournamentId", "userId") values(pikadrafti_id, sakari_id);

INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(motticon_id, pekka_id, false, false);
-- add 8 players to pikadrafti (ongoing tournament)
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(pikadrafti_id, pekka_id, false, false);
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(pikadrafti_id, markku_id, false, false);
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(pikadrafti_id, timo_id, false, false);
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(pikadrafti_id, tiina_id, false, false);
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(pikadrafti_id, john_id, false, false);
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(pikadrafti_id, jane_id, false, false);
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(pikadrafti_id, spike_id, false, false);
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(pikadrafti_id, timmy_id, false, false);
-- add 8 players to "8-man draft 2/2024" (future tournament)
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(draft_8_man_2_2024_id, pekka_id, false, false);
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(draft_8_man_2_2024_id, markku_id, false, false);
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(draft_8_man_2_2024_id, timo_id, false, false);
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(draft_8_man_2_2024_id, tiina_id, false, false);
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(draft_8_man_2_2024_id, john_id, false, false);
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(draft_8_man_2_2024_id, jane_id, false, false);
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(draft_8_man_2_2024_id, spike_id, false, false);
INSERT INTO enrollment("tournamentId", "playerId", paid, dropped) values(draft_8_man_2_2024_id, timmy_id, false, false);

INSERT INTO draft("tournamentId", "draftNumber") values(motticon_id, 1) RETURNING id into motticon_draft_id;
INSERT INTO draft("tournamentId", "draftNumber") values(draft_8_man_2_2024_id, 1);

INSERT INTO draft("tournamentId", "draftNumber") values(pikadrafti_id, 1) RETURNING id into pikadrafti_draft_id;
INSERT INTO draft_pod("draftId", "cubeId", "podNumber") values(pikadrafti_draft_id, monoblue_id, 1) RETURNING id into pikadrafti_pod_id;

INSERT INTO draft_pod_seat("podId", "playerId", seat) values(pikadrafti_pod_id, pekka_id, 1);
INSERT INTO draft_pod_seat("podId", "playerId", seat) values(pikadrafti_pod_id, markku_id, 2);
INSERT INTO draft_pod_seat("podId", "playerId", seat) values(pikadrafti_pod_id, timo_id, 3);
INSERT INTO draft_pod_seat("podId", "playerId", seat) values(pikadrafti_pod_id, tiina_id, 4);
INSERT INTO draft_pod_seat("podId", "playerId", seat) values(pikadrafti_pod_id, john_id, 5);
INSERT INTO draft_pod_seat("podId", "playerId", seat) values(pikadrafti_pod_id, jane_id, 6);
INSERT INTO draft_pod_seat("podId", "playerId", seat) values(pikadrafti_pod_id, spike_id, 7);
INSERT INTO draft_pod_seat("podId", "playerId", seat) values(pikadrafti_pod_id, timmy_id, 8);

INSERT INTO round("tournamentId", "roundNumber", "status", "startTime") values(pikadrafti_id, 1, 'started', now()) RETURNING id INTO pikadrafti_round1_id;
INSERT INTO round("tournamentId", "roundNumber") values(pikadrafti_id, 2);
INSERT INTO round("tournamentId", "roundNumber") values(pikadrafti_id, 3);

-- 4 dummy matches round 1
INSERT INTO match("roundId", "tableNumber", "player1Id", "player2Id", "player1GamesWon", "player2GamesWon", "matchType") 
  values(pikadrafti_round1_id, 1, pekka_id, john_id, 0, 0, '1v5');
INSERT INTO match("roundId", "tableNumber", "player1Id", "player2Id", "player1GamesWon", "player2GamesWon", "matchType") 
  values(pikadrafti_round1_id, 2, timo_id, spike_id, 0, 0, '3v7');
INSERT INTO match("roundId", "tableNumber", "player1Id", "player2Id", "player1GamesWon", "player2GamesWon", "matchType") 
  values(pikadrafti_round1_id, 3, markku_id, jane_id, 0, 0, '2v6');
INSERT INTO match("roundId", "tableNumber", "player1Id", "player2Id", "player1GamesWon", "player2GamesWon", "matchType") 
  values(pikadrafti_round1_id, 4, tiina_id, timmy_id, 0, 0, '4v8');
return;
END $$ LANGUAGE plpgsql;

select fixtures();
