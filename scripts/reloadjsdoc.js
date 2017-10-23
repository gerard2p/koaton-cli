const chokidar = require('chokidar');
const livereload = require('gulp-livereload');
const fs = require('fs');
const glob = require('glob');

function test (...args) {
	let script = '<script src="http://localhost:62627/livereload.js?snipver=1"></script>\n</body>';
	glob.sync('doc/**/*.html').forEach((file) => {
		let index = fs.readFileSync(file, 'utf-8').replace('</body>', script);
		fs.writeFileSync(file, index, 'utf-8');
	});
	livereload.reload();
}
var sourcewatcher = chokidar.watch(['doc/scripts/linenumber.js'], {
	persistent: true,
	ignoreInitial: true,
	alwaysStat: false,
	awaitWriteFinish: {
		stabilityThreshold: 200,
		pollInterval: 90
	}
});
sourcewatcher.on('add', test).on('change', test);
livereload.listen({
	port: 62627,
	quiet: true
});
test();
