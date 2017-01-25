# Swagger Changelog
Generate a changelog between two versions of a swagger spec

# Install
`npm install -g swagger-changelog`

# Usage
`swagger-changelog <path/to/spec1> <path/to/spec2>`

# API Usage
```
const changelog = require(swagger-changelog).changelog;

changelog('path/to/spec1', 'path/to/spec2')
  .then((log) => {
    console.log(log.paragraph);
  });
```

# Credits

`swagger-changelog` is a [Swimlane](https://swimlane.com) open-source project; we believe in giving back to the open-source community by sharing some of the projects we build for our application. Swimlane is an automated cyber security operations and incident response platform that enables cyber security teams to leverage threat intelligence, speed up incident response and automate security operations.
