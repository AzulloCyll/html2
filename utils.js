exports.getHashFromFileNames = function(fileName) {
	const regex = /\.+[a-zA-Z0-9_.-]+\.*$/gm;
	const str = fileName.substr(0, fileName.lastIndexOf("."));
	let m = null;
	let hashName = "";

	while ((m = regex.exec(str)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		if (m.index === regex.lastIndex) {
			regex.lastIndex++;
		}

		// The result can be accessed through the `m`-variable.
		m.find(match => {
			console.log(`Found hash in file name: ${match}`);
			hashName = match;
		});
	}

	return hashName;
};
