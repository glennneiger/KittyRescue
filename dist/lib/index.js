"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const R = require("ramda");
const levels = {
    "easy": 1,
    "medium": 2,
    "hard": 3
};
exports.guid = () => `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
exports.duplicateEl = R.curry((idGen, arr) => {
    return arr.reduce((acc, val) => [
        ...acc,
        Object.assign({}, val, { id: idGen() }),
        Object.assign({}, val, { id: idGen() })
    ], []);
});
exports.addTrapBasedOnLevelChosen = lvl => arr => {
    const chosenLvl = levels[lvl];
    let array = new Array(chosenLvl);
    let traps = chosenLvl > 1 ?
        array.fill({ src: require("../img/trap.png"), isTrap: true }) :
        !!chosenLvl ?
            [{ src: require("../img/trap.png"), isTrap: true }] : [];
    return arr.concat(traps);
};
exports.convertToObj = (arr) => {
    return arr.reduce((acc, val) => {
        acc[val.id] = val;
        return acc;
    }, {});
};
exports.shuffle = arr => {
    let m = arr.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
    }
    return arr;
};
exports.update = (index, newValue, arr) => R.update(index, Object.assign({}, arr[index], newValue))(arr);
exports.prepareGridData = (lvl, gridSize, arr) => arr
    .slice(0, gridSize - (levels[lvl] || 0))
    .reduce((acc, el) => {
    return [
        ...acc,
        { src: el }
    ];
}, []);
exports.formatTime = (timeInSeconds, ms = null) => {
    const _isLessThanTen = val => val < 10, _m = Math.floor(timeInSeconds / 60), _s = timeInSeconds % 60, _ms = ms === null ? null : ms >= 99
        ? "00"
        : _isLessThanTen(ms) ? "0" + ms : ms;
    if (ms === null)
        return !_s ? `${_m}:00` : `${_m}:${_s < 10 ? "0" + _s : _s}`;
    return !_s ? `${_isLessThanTen(_m) ? "0" + _m : _m}:00:${_ms}`
        : `${_isLessThanTen(_m) ? "0" + _m : _m}:${_isLessThanTen(_s) ? "0" + _s : _s}:${_ms}`;
};
exports.getPercentage = (valA, valB) => {
    return Math.floor((valA / valB) * 100);
};
exports.animateCounter = options => {
    const { fn, reducer, counter, firstAcc, secondAcc, frequency, reset = () => { }, onComplete = () => { } } = options, _pred = !!reducer && !!secondAcc ? reducer(firstAcc, secondAcc) : firstAcc;
    let _intervalId = null, _counter = 0;
    function _update() {
        if (_counter < _pred) {
            _counter++;
            fn(counter, _counter);
        }
        else {
            onComplete();
            reset(_counter) ? _counter = 0 : clearInterval(_intervalId);
        }
    }
    _intervalId = setInterval(_update, frequency || 10);
};
exports.debounce = (fn, threshold) => {
    var timeout;
    threshold = threshold || 100;
    return function debounced() {
        clearTimeout(timeout);
        var args = arguments;
        var _this = this;
        function delayed() {
            fn.apply(_this, args);
        }
        timeout = setTimeout(delayed, threshold);
    };
};
exports.capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);
exports.removeAt = (index, array) => array.slice(0, index).concat(array.slice(index + 1));
