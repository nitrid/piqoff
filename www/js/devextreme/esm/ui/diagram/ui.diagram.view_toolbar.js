/**
 * DevExtreme (esm/ui/diagram/ui.diagram.view_toolbar.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import DiagramToolbar from "./ui.diagram.toolbar";
import DiagramCommandsManager from "./diagram.commands_manager";
class DiagramViewToolbar extends DiagramToolbar {
    _getCommands() {
        return DiagramCommandsManager.getViewToolbarCommands(this.option("commands"), this.option("excludeCommands"))
    }
}
export default DiagramViewToolbar;
