/**
 * DevExtreme (esm/integration/jquery/component_registrator.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import jQuery from "jquery";
import componentRegistratorCallbacks from "../../core/component_registrator_callbacks";
import errors from "../../core/errors";
if (jQuery) {
    var registerJQueryComponent = function(name, componentClass) {
        jQuery.fn[name] = function(options) {
            var isMemberInvoke = "string" === typeof options;
            var result;
            if (isMemberInvoke) {
                var memberName = options;
                var memberArgs = [].slice.call(arguments).slice(1);
                this.each((function() {
                    var instance = componentClass.getInstance(this);
                    if (!instance) {
                        throw errors.Error("E0009", name)
                    }
                    var member = instance[memberName];
                    var memberValue = member.apply(instance, memberArgs);
                    if (void 0 === result) {
                        result = memberValue
                    }
                }))
            } else {
                this.each((function() {
                    var instance = componentClass.getInstance(this);
                    if (instance) {
                        instance.option(options)
                    } else {
                        new componentClass(this, options)
                    }
                }));
                result = this
            }
            return result
        }
    };
    componentRegistratorCallbacks.add(registerJQueryComponent)
}
