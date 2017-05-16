# Node Dev Base

Simple getting up and running with fast development in Node. Uses [nodemon](https://www.npmjs.com/package/nodemon) to restart process on file changes, [tape](https://www.npmjs.com/package/tape) for running tests, [dotenv](https://www.npmjs.com/package/dotenv) for all your .env needs, [dependency-sync](https://www.npmjs.com/package/dependency-sync) to require packages on the fly and [Yarn](https://yarnpkg.com) to run it all!

## Start
`yarn install && yarn start`

## Tests
Edit restart script in `nodemon.json` to run tests on file updates.
```json
{
  "events": {
    "restart": "yarn run missing && yarn test"
  }
}
```
