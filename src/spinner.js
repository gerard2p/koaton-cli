import 'colors';

const os = require('os').platform();

const spinners = {
	'aix': '⣾⣽⣻⢿⡿⣟⣯⣷',
	'darwin': '◐◓◑◒',
	'freebsd': '▁▃▄▅▆▇█▇▆▅▄▃',
	'linux': '◐◓◑◒',
	'openbsd': '▁▃▄▅▆▇█▇▆▅▄▃',
	'sunos': '⣾⣽⣻⢿⡿⣟⣯⣷',
	'win32': '|/-\\'
};
const spinner = function (...args) {
	let [interval, text, extra, size] = args;
	extra = extra === undefined ? '' : extra;
	const that = this;
	const spin = spinners[os];
	const l = spin.length;
	let current = -1;
	that.text = text || '';
	that.extra = extra || '';
	that.size = size;
	return new Promise(function (resolve) {
		that.promise = resolve;
		that.id = setInterval(() => {
			if (process.stdout.isTTY) {
				process.stderr.clearLine();
				process.stderr.cursorTo(0);
			}
			current++;
			if (current >= l) {
				current = 0;
			}
			process.stderr.write(spin[current].green.bold + '\t' + that.text + '\t' + that.complent);
		}, interval);
	});
};

class Spin {
	get printleft () {
		return this.size - this.text.length - 8 - 10;
	}
	get complent () {
		if (this.extra.length > this.printleft) {
			return this.extra.substr(0, this.printleft - 2) + '..';
		}
		return this.extra;
	}
	constructor () {
		this.start = spinner.bind(this);
	}
	end (msg) {
		this.pipe({
			action: 'close',
			msg: msg
		});
	}
	update (msg) {
		this.pipe({
			action: 'extra',
			msg: msg
		});
	}
	pipe (msg) {
		if (msg !== undefined && msg !== null) {
			switch (msg.action) {
				case 'text':
					this.text = msg.msg;
					break;
				case 'extra':
					this.extra = msg.msg;
					break;
				case 'close':
					clearInterval(this.id);
					this.id = null;
					if (process.stdout.isTTY) {
						process.stderr.clearLine();
						process.stderr.cursorTo(0);
					}
					console.log(msg.msg);
					this.promise(true);
					break;
				// no default
			}
		}
	}
}
export default function () {
	return new Spin();
}
