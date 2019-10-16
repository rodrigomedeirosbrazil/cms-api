Welcome to my project!
It's for learn GraphQL, ReactJS, Docker and Heroku.

Just git clone, rename .env_example to .env, and config vars, yarn install, yarn start.

To create docker image, and deploy to heroku, use commands above inside path:
```
heroku login
heroku container:login
docker build -t registry.heroku.com/<nameOfappInHeroku>/web .
docker push registry.heroku.com/<nameOfappInHeroku>/web:latest
heroku container:release web -a <nameOfappInHeroku>
```
