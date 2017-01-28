# Swagger Changelog

[![npm version](https://badge.fury.io/js/swagger-changelog.svg)](https://badge.fury.io/js/swagger-changelog)

Generate a changelog between two versions of a swagger spec

# Install
`npm install -g swagger-changelog`

# Usage
`swagger-changelog [options] <path/to/spec1> <path/to/spec2>`

## Options
```
-h, --help          output usage information
-V, --version       output the version number
-e, --endpoint <n>  Endpoint Threshold, 0-1.0 (Default 0.85, higher means closer)
-p, --param <n>     Param Threshold, 0-1.0 (Default 0.75, higher means closer)
```

## Distance Thresholds
The Endpoint and Param thresholds are the minimum value for the Damerau - Levenshtein comparison ratio. It scores from 0-1 how similar the two words are.

## Example
```
$ swagger-changelog src/tests/specs/petstore.1.json src/tests/specs/petstore.1.1.json
Changes: /pet (put) - Method added
Renamed: Path '/pet/findByStatus' renamed to '/pet/findByStatii'
Renamed: Path '/pet/findByTags' renamed to '/pet/findByTag'
Renamed: /pet/{petId} (get) - Param 'petId' renamed to 'petIdz'
```

# API Usage
```
const changelog = require(swagger-changelog).changelog;

changelog('path/to/spec1', 'path/to/spec2', config)
  .then((log) => {
    console.log(log.paragraph);
  });
```

# Credits

`swagger-changelog` is a [Swimlane](https://swimlane.com) open-source project; we believe in giving back to the open-source community by sharing some of the projects we build for our application. Swimlane is an automated cyber security operations and incident response platform that enables cyber security teams to leverage threat intelligence, speed up incident response and automate security operations.
