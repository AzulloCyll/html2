//https://medium.com/hceverything/parcel-js-moving-static-resources-to-a-separate-folder-aef63a038cbd
const fs = require("fs");
const path = require("path");
const replace = require("replace-in-file");
const escapeRegExp = require("lodash.escaperegexp");
const getHashFromFileNames = require("./utils.js").getHashFromFileNames;
const { starterkitSettings } = require("./package.json");

const SETTINGS_PATHS = starterkitSettings.productionBuild.paths;

// the directory in which you're outputting your build
const baseDir = "public";

// Generating dirs based on settings in package.json ('starterkitSettings.productionBuild.paths)
for (const settingsPath in SETTINGS_PATHS) {
	if (SETTINGS_PATHS.hasOwnProperty(settingsPath)) {
		const element = SETTINGS_PATHS[settingsPath];
		const listDirs = element.baseDir.split("/");

		let dirNames = "";
		for (let index = 0; index < listDirs.length; index++) {
			const dirName = listDirs[index];
			dirNames += `/${dirName}`;

			if (!fs.existsSync(path.join(__dirname, baseDir, dirNames))) {
				fs.mkdirSync(path.join(__dirname, baseDir, dirNames));
			}
		}
	}
}

// the name for the directory where your static files will be moved to
const staticDir = {
	base: SETTINGS_PATHS["static"],
	fullPath: SETTINGS_PATHS["static"].baseDir
};
// the directory where your built css files (css and css.map) will be moved to
const assetsDirCss = {
	base: SETTINGS_PATHS["styles"],
	fullPath: SETTINGS_PATHS["styles"].baseDir
};
// the directory where your built js files (js and js.map) will be moved to
const assetsDirJs = {
	base: SETTINGS_PATHS["js"],
	fullPath: SETTINGS_PATHS["js"].baseDir
};

// Loop through the baseDir directory
fs.readdir(`./${baseDir}`, (err, files) => {
	// store all files in custom arrays by type
	let html = [];
	let js = [];
	let css = [];
	let mapsCss = [];
	let mapsJs = [];
	let staticAssets = [];

	files.forEach(file => {
		// first HTML files
		if (file.match(/.+\.(html)$/)) {
			html.push(file);
		} else if (file.match(/.+\.(js)$/)) {
			// then JavaScripts
			js.push(file);
		} else if (file.match(/(styles)\.+[a-zA-Z0-9_.-]+\.(map)$/)) {
			// then CSS map
			mapsCss.push(file);
		} else if (file.match(/(js)\.+[a-zA-Z0-9_.-]+\.(map)$/)) {
			// then JS map
			mapsJs.push(file);
		} else if (file.match(/.+\.(css)$/)) {
			// then sourcemaps
			css.push(file);
		} else if (file.match(/.+\..+$/)) {
			// all other files, exclude current directory and directory one level up
			staticAssets.push(file);
		}
	});
	// check what went where
	console.log("html:", html);
	console.log("css:", css);
	console.log("js:", js);
	console.log("staticAssets:", staticAssets);

	// create an array for all compiled assets
	let assetsCss = css.concat(mapsCss);
	let assetsJs = js.concat(mapsJs);

	// replace all other resources in html
	html.forEach(file => {
		staticAssets.forEach(name => {
			const hashFromFileName = getHashFromFileNames(name);
			const newName = name.replace(hashFromFileName, "");

			let options = {
				files: path.join("public", file),
				from: new RegExp(escapeRegExp(name), "g"),
				to: staticDir.fullPath + "/" + newName
			};

			try {
				let changedFiles = replace.sync(options);
				console.log(
					"Modified files of HTML in context static files:",
					changedFiles,
					"file: ",
					name
				);
			} catch (error) {
				console.error("Error occurred in HTML:", error);
			}
		});
		assetsCss.forEach(name => {
			const hashFromFileName = getHashFromFileNames(name);
			const newName = name.replace(hashFromFileName, "");

			let options = {
				files: path.join("public", file),
				from: new RegExp(escapeRegExp(name), "g"),
				to: assetsDirCss.fullPath + "/" + newName
			};
			try {
				let changedFiles = replace.sync(options);
				console.log(
					"Modified files of HTML in context CSS files:",
					changedFiles,
					"file: ",
					name
				);
			} catch (error) {
				console.error("Error occurred in HTML:", error);
			}
		});
		assetsJs.forEach(name => {
			const hashFromFileName = getHashFromFileNames(name);
			const newName = name.replace(hashFromFileName, "");

			let options = {
				files: path.join("public", file),
				from: new RegExp(escapeRegExp(name), "g"),
				to: assetsDirJs.fullPath + "/" + newName
			};
			try {
				let changedFiles = replace.sync(options);
				console.log(
					"Modified files of HTML in context JS files:",
					changedFiles,
					"file: ",
					name
				);
			} catch (error) {
				console.error("Error occurred in HTML:", error);
			}
		});
	});

	// replace map links in js
	js.forEach(file => {
		mapsJs.forEach(name => {
			const hashFromFileName = getHashFromFileNames(name);
			const newName = name.replace(hashFromFileName, "");

			let options = {
				files: path.join("public", file),
				from: name,
				to:
					getLevelNestingFromPath(assetsDirJs.fullPath) +
					staticDir.fullPath +
					"/" +
					newName
			};
			try {
				let changedFiles = replace.sync(options);
				console.log(
					"Modified files of JS in context links of JS map:",
					changedFiles,
					"file: ",
					name
				);
			} catch (error) {
				console.error("Error occurred in JS:", error);
			}
		});
	});

	// replace links in css
	css.forEach(file => {
		staticAssets.forEach(name => {
			const hashFromFileName = getHashFromFileNames(name);
			const newName = name.replace(hashFromFileName, "");

			let options = {
				files: path.join("public", file),
				from: new RegExp(escapeRegExp(name), "g"),
				to:
					getLevelNestingFromPath(assetsDirCss.fullPath) +
					staticDir.fullPath +
					"/" +
					newName
			};
			try {
				let changedFiles = replace.sync(options);
				console.log(
					"Modified files of CSS in context static files (ex. images) in CSS:",
					changedFiles,
					"file: ",
					name
				);
			} catch (error) {
				console.error("Error occurred in CSS:", error);
			}
		});
	});

	// move css and maps
	assetsCss.forEach(name => {
		fs.rename(
			path.join(__dirname, "public", name),
			path.join(__dirname, "public", assetsDirCss.fullPath, name),
			function(err) {
				if (err) throw err;
				console.log(`Successfully moved ${name}`);
			}
		);
	});
	// move js and maps
	assetsJs.forEach(name => {
		fs.rename(
			path.join(__dirname, "public", name),
			path.join(__dirname, "public", assetsDirJs.fullPath, name),
			function(err) {
				if (err) throw err;
				console.log(`Successfully moved ${name}`);
			}
		);
	});
	// move staticAssets
	staticAssets.forEach(name => {
		fs.rename(
			path.join(__dirname, "public", name),
			path.join(__dirname, "public", staticDir.fullPath, name),
			function(err) {
				if (err) throw err;
				console.log(`Successfully moved ${name}`);
			}
		);
	});
});

function getLevelNestingFromPath(_path) {
	const numberNestedDirs = _path.split("/").length;
	return "../".repeat(numberNestedDirs);
}
