/**
 * DevExtreme (esm/core/element.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
var strategy = function(element) {
    return element && element.get(0)
};
export function getPublicElement(element) {
    return strategy(element)
}
export function setPublicElementWrapper(newStrategy) {
    strategy = newStrategy
}
