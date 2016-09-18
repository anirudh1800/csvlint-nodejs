'use strict';

var fs = require('fs');
var papa = require('papaparse');
var detectCharacterEncoding = require('detect-character-encoding');
var ProgressBar = require('progress');
var chalk = require('chalk');

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
            console.error(chalk.red(`Row:${error.row + 1}#${error.message}`));
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
            console.log(chalk.red('No files to parse'));
            process.exit(0);
        }

        var bar = new ProgressBar(chalk.green('Parsing [:bar] :percent\n'), {
            total: files.length,
            width: 20
        });

        var timer = setInterval(function() {
            for (let file of files) {
                console.log(chalk.blue(`Parsing ${file}`));

                var fileBuffer = fs.readFileSync("./csv/" + file);
                var charsetMatch = detectCharacterEncoding(fileBuffer);

                if (charsetMatch.encoding !== "UTF-8") {
                    console.error(chalk.red(`${file} is not in UTF-8`));
                    process.exit(0);
                }

                papa.parse(fileBuffer.toString(), globalConfig);
                console.log(chalk.blue(`Parsing ${file} complete`));

                bar.tick();

                if (bar.complete) {
                    clearInterval(timer);
                }
            }
        }, 100);

    } else
        throw err;
});
