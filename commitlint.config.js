module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [
        2,
        'always',
        [
          'feat',    // new feature
          'fix',     // bug fix
          'docs',    // documentation
          'style',   // formatting, missing semicolons, etc
          'refactor',// code change that neither fixes a bug nor adds a feature
          'test',    // adding tests
          'chore',   // updating build tasks, package manager configs, etc
          'perf',    // performance improvements
          'ci'       // CI related changes
        ]
      ],
      'scope-case': [2, 'always', 'lower-case'],
      'subject-case': [2, 'always', 'lower-case'],
      'subject-min-length': [2, 'always', 10],
      'subject-full-stop': [2, 'never', '.'],
      'body-leading-blank': [2, 'always'],
      'body-max-line-length': [2, 'always', 100]
    }
  }