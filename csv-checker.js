'use strict';

const fs = require('fs');
var Papa = require('papaparse');

var globalConfig = {
    delimiter: ",", // auto-detect
    newline: "", // auto-detect
    header: true,
    dynamicTyping: false,
    preview: 0,
    encoding: "",
    worker: false,
    comments: false,
    step: undefined,
    complete: function(results, file) {
        for (let error of results.errors) {
            console.error(`${error.row + 1}#${error.message}`);
        }
    },
    error: undefined,
    download: false,
    skipEmptyLines: true,
    chunk: undefined,
    fastMode: undefined,
    beforeFirstChunk: undefined,
    withCredentials: undefined
};

fs.readdir('./csv', function(err, files) {
    if (!err) {
        files = files.filter(function(value) {
            return value.endsWith('.csv');
        });

        if (files.length == 0) {
            console.log('No files to parse');
            process.exit(0);
        }

        for (let file of files) {
            console.log(`Parsing ${file}...`);

            fs.readFile("./csv/" + file, "utf-8", (err, data) => {
                if (err) throw err;
                Papa.parse(data, globalConfig);
                console.log(`Parsing ${file} complete`);
            });

        }

    } else
        throw err;
});
