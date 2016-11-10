// require all modules ending in "_test" from the
// current directory and all subdirectories
var testsContext = require.context(".", true, /-test$/);
testsContext.keys().forEach(function(path) {
    try {
        testsContext(path);
    } catch(err) {
        console.error('[ERROR] WITH SPEC FILE: ', path);
        console.error(err);
    }
});