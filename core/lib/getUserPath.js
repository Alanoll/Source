'use strict';

var path = require('path');
var fs = require('fs');
var isNodeModule = require('./isNodeModule');

module.exports = function(customGlobalopts, customPathToApp){
    var globalOpts = customGlobalopts || global.opts;
    var pathToApp = customPathToApp || global.pathToApp;
    var sourcePathFromParent = path.join(process.cwd(), 'node_modules/sourcejs');

    if (fs.existsSync(sourcePathFromParent)) {
        pathToApp = sourcePathFromParent;
    }

    var relativeUserPath = isNodeModule(pathToApp) ? '../..' : globalOpts.core.common.pathToUser;

    return path.join(pathToApp, relativeUserPath);
};