/**
 * DevExtreme (esm/renovation/utils/combine_classes.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
export function combineClasses(classesMap) {
    return Object.keys(classesMap).filter(p => classesMap[p]).join(" ")
}
