mongo vidly --eval 'db.movies.drop()'
mongo vidly --eval 'db.genres.drop()'
mongoimport --db vidly --collection movies resources/db_init/movies.json
mongoimport --db vidly --collection genres resources/db_init/genres.json
cd backend
npm i
export PRIVATE_KEY=12345

cd ../frontend
npm i
cd ..