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
  vintage_id integer;
  artifacts_id integer;
  b_team_id integer;
  beyond_id integer;
  creatures_id integer;
  one_id integer;
  two_id integer;
  three_id integer;
  four_id integer;
  five_id integer;
  six_id integer;
  seven_id integer;
-- tournaments
  motticon_id integer;
-- drafts
  motticon_draft_id integer;

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
INSERT INTO cube(title, description, url, "imageUrl") values('Vintage cube', 'Powerit löytyy', 'https://cubecobra.com/cube/list/r47', 'https://cards.scryfall.io/art_crop/front/b/0/b0faa7f2-b547-42c4-a810-839da50dadfe.jpg') RETURNING id INTO vintage_id;
INSERT INTO cube(title, description, url, "imageUrl") values('Allun faksicube', 'Faksit on parhaita', 'https://cubecobra.com/cube/list/et9','https://cards.scryfall.io/art_crop/front/2/d/2d2c323f-eecd-4560-a128-ab513d231552.jpg') RETURNING id INTO artifacts_id;
INSERT INTO cube(title, description, url, "imageUrl") values('The B-Team', 'Second rate heroes', 'https://cubecobra.com/cube/list/thebteam', 'https://cards.scryfall.io/art_crop/front/2/f/2f09e451-0246-45a2-8bfd-07d3c65ddfe6.jpg') RETURNING id INTO b_team_id;
INSERT INTO cube(title, description, url, "imageUrl") values('Universes Beyond', 'Like Garfield intended', 'https://cubecobra.com/cube/list/SoNotUniversesBeyondCube', 'https://cards.scryfall.io/art_crop/front/c/4/c40b25d7-73c9-4f30-a707-5afb08185a8d.jpg') RETURNING id INTO beyond_id;
INSERT INTO cube(title, description, url) values('Oops, All Creatures', 'It''s creatures all the way down', 'https://cubecobra.com/cube/list/1o7yb') RETURNING id INTO creatures_id;
INSERT INTO cube(title, description, url) values('1', 'desc_1', 'https://cubecobra.com/cube/list/0de5c855-ad9a-4ce1-8a8c-d8f846e96712') RETURNING id INTO one_id;
INSERT INTO cube(title, description, url) values('2', 'desc_2', 'https://cubecobra.com/cube/list/r47') RETURNING id INTO two_id;
INSERT INTO cube(title, description, url) values('3', 'desc_3', 'https://cubecobra.com/cube/list/et9') RETURNING id INTO three_id;
INSERT INTO cube(title, description, url) values('4', 'desc_4', 'https://cubecobra.com/cube/list/thebteam') RETURNING id INTO four_id;
INSERT INTO cube(title, description, url) values('5', 'desc_5', 'https://cubecobra.com/cube/list/SoNotUniversesBeyondCube') RETURNING id INTO five_id;
INSERT INTO cube(title, description, url) values('6', 'desc_6', 'https://cubecobra.com/cube/list/1o7yb') RETURNING id INTO six_id;
INSERT INTO cube(title, description, url) values('7', 'desc_7', 'https://cubecobra.com/cube/list/1o7yb') RETURNING id INTO seven_id;
INSERT INTO cube(title, description, url) values('8', 'desc_8', 'https://cubecobra.com/cube/list/0de5c855-ad9a-4ce1-8a8c-d8f846e96712');
INSERT INTO cube(title, description, url) values('9', 'desc_9', 'https://cubecobra.com/cube/list/r47');
INSERT INTO cube(title, description, url) values('10', 'desc_10', 'https://cubecobra.com/cube/list/et9');
INSERT INTO cube(title, description, url) values('11', 'desc_11', 'https://cubecobra.com/cube/list/thebteam');
INSERT INTO cube(title, description, url) values('12', 'desc_12', 'https://cubecobra.com/cube/list/SoNotUniversesBeyondCube');
INSERT INTO cube(title, description, url) values('13', 'desc_13', 'https://cubecobra.com/cube/list/1o7yb');
INSERT INTO cube(title, description, url) values('14', 'desc_14', 'https://cubecobra.com/cube/list/1o7yb');
INSERT INTO cube(title, description, url) values('15', 'desc_15', 'https://cubecobra.com/cube/list/1o7yb');

INSERT INTO tournament(name, description, "startDate", "endDate") values('MottiCon 2023', 'Servin Mökki 4.-5.5.2024', '2024-05-04', '2024-05-05') RETURNING id INTO motticon_id;

INSERT INTO tournament_cubes("tournamentId", "cubeId") select motticon_id, id from cube;

INSERT INTO tournament_staff_members("tournamentId", "userId") values(motticon_id, sakari_id);

INSERT INTO draft("tournamentId", "draftNumber") values(motticon_id, 1) RETURNING id into motticon_draft_id;

return;
END $$ LANGUAGE plpgsql;

select fixtures();
