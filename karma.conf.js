"use strict";
module.exports = function(config) {
    config.set({
        frameworks: ['jasmine', 'karma-typescript'],
        files: [
            { pattern: './src/**/*.ts' },
            { pattern: './test/**/*.ts' }
        ],

        preprocessors: {
            '**/*.ts': ['karma-typescript']
        },

        reporters: ['progress', 'karma-typescript'],

        karmaTypescriptConfig: {
            tsconfig: './tsconfig.json'
        },

        logLevel: config.LOG_DEBUG,

        browsers: ['Chrome']
    });
};
