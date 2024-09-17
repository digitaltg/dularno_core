
const esModules = [].join('|');

/** @type {import('jest').Config} */
const config = {
    verbose: true,
    testTimeout: 50000,
    transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
};

module.exports = config;

//i am the gouverneur
