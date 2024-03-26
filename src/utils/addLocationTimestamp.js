const { cloneDeep } = require('lodash');

exports.addLocationTimestamp = function (data) {
    const _data = cloneDeep(data);
    if (_data?.liveLocation) {
        _data.liveLocation.timestamp = Date.now();
    }

    return _data;
};
