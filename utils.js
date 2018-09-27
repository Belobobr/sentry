const packageInfo = require('./package.json');

module.exports = {
    getRelease: function() {
        return `${packageInfo.name}@${packageInfo.version}`;
    }
}
