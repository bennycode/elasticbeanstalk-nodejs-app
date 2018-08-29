#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const pkg = require('../package');
const {join} = require('path');
const JSZip = require('jszip');
const zip = new JSZip();

const distFolder = 'dist';
const distZipFile = `${pkg.name}.zip`;
const ignoreList = ['.DS_Store'];

const walkSync = (dir, fileList = []) =>
  fs.readdirSync(dir).reduce((fileListAccumulator, file) => {
    const isDirectory = fs.statSync(join(dir, file)).isDirectory();
    return isDirectory ? walkSync(join(dir, file), fileListAccumulator) : fileListAccumulator.concat(join(dir, file));
  }, fileList);

function removeBackSlashesAsPathSeparators(files) {
  return files.map(file => file.replace(new RegExp(`\\${path.sep}`, 'g'), '/'));
}

let files = walkSync('src/', ['package.json']);
files = removeBackSlashesAsPathSeparators(files);

const zipOptions = {createFolders: true};

files.filter(file => ignoreList.some(ignore => !file.includes(ignore))).forEach(file => {
  console.log(`Including file "${file}" in ZIP archive...`);
  zip.file(file, fs.readFileSync(file), zipOptions);
});

fs.ensureDirSync(distFolder);

zip.generateAsync({type: 'nodebuffer'}).then(content => fs.writeFileSync(`${distFolder}/${distZipFile}`, content));
