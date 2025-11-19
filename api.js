var path = require('path');
const fs = require('fs');

const filesDirectory = './images/'

function checkPathExists(str) {
    var fn = filesDirectory + str;
    return fs.exists(fn, (err) => {
        //fs callback
    });
}
function saveImageToPath(f, fn) {
    //var ext = f.extension;
    var ext = ".png";
    var fn = filesDirectory + fn;

    if (checkPathExists(fn)) {
        console.info("File already exists!");
        return false;
    }

    try {
        fs.writeFile(fn, f, 'utf8', (err) => {
            //writeFile callback;
            console.info("Write file: "+err)
        })
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = {checkPathExists, saveImageToPath}