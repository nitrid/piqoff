/**
 * DevExtreme (esm/ui/collection/item.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../core/renderer";
import Class from "../../core/class";
import {
    each
} from "../../core/utils/iterator";
import {
    attachInstanceToElement,
    getInstanceByElement
} from "../../core/utils/public_component";
var INVISIBLE_STATE_CLASS = "dx-state-invisible";
var DISABLED_STATE_CLASS = "dx-state-disabled";
var ITEM_CONTENT_PLACEHOLDER_CLASS = "dx-item-content-placeholder";
var forcibleWatcher = function(watchMethod, fn, callback) {
    var filteredCallback = function(value) {
        if (oldValue !== value) {
            callback(value, oldValue);
            oldValue = value
        }
    };
    var oldValue;
    return {
        dispose: watchMethod(fn, filteredCallback),
        force: function() {
            filteredCallback(fn())
        }
    }
};
var CollectionItem = Class.inherit({
    ctor: function($element, options, rawData) {
        this._$element = $element;
        this._options = options;
        this._rawData = rawData;
        attachInstanceToElement($element, this, this._dispose);
        this._render()
    },
    _render: function() {
        var $placeholder = $("<div>").addClass(ITEM_CONTENT_PLACEHOLDER_CLASS);
        this._$element.append($placeholder);
        this._watchers = [];
        this._renderWatchers()
    },
    _renderWatchers: function() {
        this._startWatcher("disabled", this._renderDisabled.bind(this));
        this._startWatcher("visible", this._renderVisible.bind(this))
    },
    _startWatcher: function(field, render) {
        var rawData = this._rawData;
        var exprGetter = this._options.fieldGetter(field);
        var watcher = forcibleWatcher(this._options.watchMethod(), (function() {
            return exprGetter(rawData)
        }), function(value, oldValue) {
            this._dirty = true;
            render(value, oldValue)
        }.bind(this));
        this._watchers.push(watcher)
    },
    setDataField: function() {
        this._dirty = false;
        each(this._watchers, (function(_, watcher) {
            watcher.force()
        }));
        if (this._dirty) {
            return true
        }
    },
    _renderDisabled: function(value, oldValue) {
        this._$element.toggleClass(DISABLED_STATE_CLASS, !!value);
        this._updateOwnerFocus(value)
    },
    _updateOwnerFocus: function(isDisabled) {
        var ownerComponent = this._options.owner;
        if (ownerComponent && isDisabled) {
            ownerComponent._resetItemFocus(this._$element)
        }
    },
    _renderVisible: function(value, oldValue) {
        this._$element.toggleClass(INVISIBLE_STATE_CLASS, void 0 !== value && !value)
    },
    _dispose: function() {
        each(this._watchers, (function(_, watcher) {
            watcher.dispose()
        }))
    }
});
CollectionItem.getInstance = function($element) {
    return getInstanceByElement($element, this)
};
export default CollectionItem;
