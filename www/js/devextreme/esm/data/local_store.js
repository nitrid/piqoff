/**
 * DevExtreme (esm/data/local_store.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import eventsEngine from "../events/core/events_engine";
import domAdapter from "../core/dom_adapter";
import {
    getWindow
} from "../core/utils/window";
var window = getWindow();
import Class from "../core/class";
var abstract = Class.abstract;
import {
    errors
} from "./errors";
import ArrayStore from "./array_store";
var LocalStoreBackend = Class.inherit({
    ctor: function(store, storeOptions) {
        this._store = store;
        this._dirty = !!storeOptions.data;
        this.save();
        var immediate = this._immediate = storeOptions.immediate;
        var flushInterval = Math.max(100, storeOptions.flushInterval || 1e4);
        if (!immediate) {
            var saveProxy = this.save.bind(this);
            setInterval(saveProxy, flushInterval);
            eventsEngine.on(window, "beforeunload", saveProxy);
            if (window.cordova) {
                domAdapter.listen(domAdapter.getDocument(), "pause", saveProxy, false)
            }
        }
    },
    notifyChanged: function() {
        this._dirty = true;
        if (this._immediate) {
            this.save()
        }
    },
    load: function() {
        this._store._array = this._loadImpl();
        this._dirty = false
    },
    save: function() {
        if (!this._dirty) {
            return
        }
        this._saveImpl(this._store._array);
        this._dirty = false
    },
    _loadImpl: abstract,
    _saveImpl: abstract
});
var DomLocalStoreBackend = LocalStoreBackend.inherit({
    ctor: function(store, storeOptions) {
        var name = storeOptions.name;
        if (!name) {
            throw errors.Error("E4013")
        }
        this._key = "dx-data-localStore-" + name;
        this.callBase(store, storeOptions)
    },
    _loadImpl: function() {
        var raw = window.localStorage.getItem(this._key);
        if (raw) {
            return JSON.parse(raw)
        }
        return []
    },
    _saveImpl: function(array) {
        if (!array.length) {
            window.localStorage.removeItem(this._key)
        } else {
            window.localStorage.setItem(this._key, JSON.stringify(array))
        }
    }
});
var localStoreBackends = {
    dom: DomLocalStoreBackend
};
var LocalStore = ArrayStore.inherit({
    ctor: function(options) {
        if ("string" === typeof options) {
            options = {
                name: options
            }
        } else {
            options = options || {}
        }
        this.callBase(options);
        this._backend = new localStoreBackends[options.backend || "dom"](this, options);
        this._backend.load()
    },
    clear: function() {
        this.callBase();
        this._backend.notifyChanged()
    },
    _insertImpl: function(values) {
        var b = this._backend;
        return this.callBase(values).done(b.notifyChanged.bind(b))
    },
    _updateImpl: function(key, values) {
        var b = this._backend;
        return this.callBase(key, values).done(b.notifyChanged.bind(b))
    },
    _removeImpl: function(key) {
        var b = this._backend;
        return this.callBase(key).done(b.notifyChanged.bind(b))
    }
}, "local");
export default LocalStore;
