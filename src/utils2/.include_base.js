import * as path from 'path';
import * as fs from 'fs';

export default function loadmodules(dir) {
	let mods = {};
	fs.readdirSync(dir)
		.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item))
		.filter(item => item !== "index.js")
		.filter(item => item !== "help.js")
		.forEach((file) => {
			let module = requireNoCache(path.join(__dirname, file));
			mods[path.basename(file).replace(".js", "")] = module.default ? module.default : module
		});
	mods[Symbol.iterator] = function() {
		let keys = Object.keys(this),
			index = -1;
		return {
			next: () => ({
				value: this[keys[++index]],
				done: !(index < keys.length)
			})
		};
	};
	mods.default=mods;
	return mods;
}
