/**
 * Created by dmitrylapynov on 09/08/14.
 *
 * Sourcejs spec parser, using phantomjs
 */

var
    path = require('path'),
    fs = require('fs'),
    phantom = require('phantomjs'),
    unflatten = require('flat').unflatten,
    childProcess = require('child_process'),
    pages_tree = require('../../user/data/pages_tree.json'),
    pagesParser = require('./pagesParser'),
    exec = childProcess.exec,

    ph_path = phantom.path,
    url = 'http://127.0.0.1:8080',
    html = {},
    unflatten_html,
    specs
    ;

var params = {
    obj: pages_tree,
    filter: ['mob'],
    flag: 'specFile'
};

specs = pagesParser(params);
var specLength = 10,// specs.length
    doneCounter = 0;

specs.length = 10; // debug only

specs.map(function (elem, n) {
    console.log('Starts...' + n, elem);

    function callback() {
        console.log('-- All specs were processed.')
    }

    childProcess.exec(ph_path + " ph_modules/index.js " + elem, function (error, stdout, stderr) {
        handler(error, stdout, stderr, elem, n, callback);
    });
});


function handler(error, stdout, stderr, spec, n, callback) {
    if (error) console.log('Exec error: \f'+ error);

//console.log('--- spec', spec);
    var path = spec && spec.split('/');
    var file = path.join('-');


    fs.writeFile('log/output-'+ file +'.txt', stdout);
    if (path == 'mob/base') return;
    html[spec] = JSON.parse(stdout);

console.log((doneCounter/specLength*100).toFixed(2),'%...Done', spec);

    doneCounter++;
    if (doneCounter == specLength) {
        fs.writeFile('html.json', JSON.stringify(html));
        console.log('-- All specs were written.');
//        console.log(html);
        debugger;
        unflatten_html =  unflatten(html, { delimiter: '/', safe: true });
        console.log('-- All specs were saved.');

        // After all specs were both written in file and saved in memory.
        callback();
    }
}

console.log('-- file ends.');