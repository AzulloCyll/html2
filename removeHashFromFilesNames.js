const fs = require("fs");
const path = require("path");

const getHashFromFileNames = require("./utils.js").getHashFromFileNames;

const listDir = (dir, fileList = []) => {
	let files = fs.readdirSync(dir);

	files.forEach(file => {
		if (fs.statSync(path.join(dir, file)).isDirectory()) {
			fileList = listDir(path.join(dir, file), fileList);
		} else {
			const hashFromFileName = getHashFromFileNames(file);
			if (hashFromFileName) {
				const newName = file.replace(hashFromFileName, "");

				let src = path.join(dir, file);
				let newSrc = path.join(dir, newName);
				fileList.push({
					oldSrc: src,
					newSrc: newSrc
				});
			}
		}
	});

	return fileList;
};

let foundFiles = listDir("./public");
foundFiles.forEach(f => {
	fs.renameSync(f.oldSrc, f.newSrc);
});
