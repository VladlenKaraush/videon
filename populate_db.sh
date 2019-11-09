mongo vidly --eval 'db.movies.drop()'
mongo vidly --eval 'db.genres.drop()'
mongoimport --db vidly --collection movies backend/db_init/movies.json
mongoimport --db vidly --collection genres backend/db_init/genres.json