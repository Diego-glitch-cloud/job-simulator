CREATE TABLE IF NOT EXISTS bands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,      -- string: name
    genre VARCHAR(255) NOT NULL,      -- string: genre
    country VARCHAR(255) NOT NULL,      -- string: country
    year_formed INTEGER NOT NULL,           -- integer: year_formed
    rating NUMERIC(3,1) NOT NULL,      -- float: rating
    is_active BOOLEAN NOT NULL            -- boolean: is_active
);

-- Inserción de los registros
INSERT INTO bands (id, name, genre, country, year_formed, rating, is_active) VALUES
(1, 'Geese', 'Indie Rock', 'USA', 2016, 4.5, true),
(2, 'Metallica', 'Thrash Metal', 'USA', 1981, 4.9, true),
(3, 'Pink Floyd', 'Progressive Rock', 'UK', 1965, 5.0, false),
(4, 'The Strokes', 'Indie Rock', 'USA', 1998, 4.7, true),
(5, 'Alice in Chains', 'Grunge', 'USA', 1987, 4.6, false),
(6, 'The Smashing Pumpkins', 'Alternative Rock', 'USA', 1988, 4.8, true),
(7, 'Slowdive', 'Shoegaze', 'UK', 1989, 4.9, true),
(8, 'My Bloody Valentine', 'Shoegaze', 'Ireland', 1983, 4.8, false),
(9, 'Rush', 'Progressive Rock', 'Canada', 1968, 5.0, false),
(10, 'The Smiths', 'Indie Pop', 'UK', 1982, 4.9, false),
(11, 'Deftones', 'Alternative Metal', 'USA', 1988, 4.7, true),
(12, 'Radiohead', 'Alternative Rock', 'UK', 1985, 5.0, true),
(13, 'Black Sabbath', 'Heavy Metal', 'UK', 1968, 5.0, false),
(14, 'Soundgarden', 'Grunge', 'USA', 1984, 4.8, false),
(15, 'Tool', 'Progressive Metal', 'USA', 1990, 4.9, true),
(17, 'Avenged Sevenfold', 'Heavy Metal', 'USA', 1999, 4.4, true),
(18, 'American Football', 'Math Rock', 'USA', 1997, 4.6, true),
(19, 'Title Fight', 'Post-Hardcore', 'USA', 2003, 4.7, false),
(20, 'Candelabro', 'Art Rock', 'Unknown', 2021, 4.2, true),
(21, 'Black Country, New Road', 'Art Rock', 'UK', 2018, 4.8, true),
(22, 'Cocteau Twins', 'Dream Pop', 'UK', 1979, 4.9, false),
(23, 'Deafheaven', 'Blackgaze', 'USA', 2010, 4.5, true),
(24, 'The Cure', 'Post-Punk', 'UK', 1976, 5.0, true),
(25, 'Nirvana', 'Grunge', 'USA', 1987, 5.0, false);

-- Reseteamos el auto-incrementador para que los nuevos inserts empiecen en el 26
SELECT setval('bands_id_seq', (SELECT MAX(id) FROM bands));
