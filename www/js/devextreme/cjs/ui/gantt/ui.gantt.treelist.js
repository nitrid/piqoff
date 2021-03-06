/**
 * DevExtreme (cjs/ui/gantt/ui.gantt.treelist.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.GanttTreeList = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _tree_list = _interopRequireDefault(require("../tree_list"));
var _position = require("../../core/utils/position");
var _type = require("../../core/utils/type");
var _uiGantt = require("./ui.gantt.helper");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
var GANTT_TASKS = "tasks";
var GANTT_COLLAPSABLE_ROW = "dx-gantt-collapsable-row";
var GANTT_DEFAULT_ROW_HEIGHT = 34;
var GanttTreeList = function() {
    function GanttTreeList(gantt) {
        this._gantt = gantt;
        this._$treeList = this._gantt._$treeList
    }
    var _proto = GanttTreeList.prototype;
    _proto.getTreeList = function() {
        var _this = this;
        var _this$_gantt$option = this._gantt.option(GANTT_TASKS),
            keyExpr = _this$_gantt$option.keyExpr,
            parentIdExpr = _this$_gantt$option.parentIdExpr;
        this._treeList = this._gantt._createComponent(this._$treeList, _tree_list.default, {
            dataSource: this._gantt._tasksRaw,
            keyExpr: keyExpr,
            parentIdExpr: parentIdExpr,
            columns: this.getColumns(),
            columnResizingMode: "nextColumn",
            height: this._getHeight(),
            width: this._gantt.option("taskListWidth"),
            selection: {
                mode: _uiGantt.GanttHelper.getSelectionMode(this._gantt.option("allowSelection"))
            },
            selectedRowKeys: _uiGantt.GanttHelper.getArrayFromOneElement(this._gantt.option("selectedRowKey")),
            sorting: {
                mode: "none"
            },
            scrolling: {
                showScrollbar: "onHover",
                mode: "virtual"
            },
            allowColumnResizing: true,
            autoExpandAll: true,
            showRowLines: this._gantt.option("showRowLines"),
            rootValue: this._gantt.option("rootValue"),
            onContentReady: function(e) {
                _this._onContentReady(e)
            },
            onSelectionChanged: function(e) {
                _this._onSelectionChanged(e)
            },
            onRowCollapsed: function(e) {
                _this._onRowCollapsed(e)
            },
            onRowExpanded: function(e) {
                _this._onRowExpanded(e)
            },
            onRowPrepared: function(e) {
                _this._onRowPrepared(e)
            },
            onContextMenuPreparing: function(e) {
                _this._onContextMenuPreparing(e)
            },
            onRowClick: function(e) {
                _this.onRowClick(e)
            },
            onRowDblClick: function(e) {
                _this.onRowDblClick(e)
            }
        });
        return this._treeList
    };
    _proto.onAfterTreeListCreate = function() {
        if (this._postponedGanttInitRequired) {
            this._initGanttOnContentReady({
                component: this._treeList
            });
            delete this._postponedGanttInitRequired
        }
    };
    _proto._onContentReady = function(e) {
        var hasTreeList = !!this._treeList;
        if (hasTreeList) {
            this._initGanttOnContentReady(e)
        } else {
            this._postponedGanttInitRequired = true
        }
    };
    _proto._initGanttOnContentReady = function(e) {
        if (e.component.getDataSource()) {
            this._gantt._initGanttView();
            this._initScrollSync(e.component)
        }
    };
    _proto._onSelectionChanged = function(e) {
        var selectedRowKey = e.currentSelectedRowKeys[0];
        this._gantt._setGanttViewOption("selectedRowKey", selectedRowKey);
        this._gantt._setOptionWithoutOptionChange("selectedRowKey", selectedRowKey);
        this._gantt._actionsManager.raiseSelectionChangedAction(selectedRowKey)
    };
    _proto._onRowCollapsed = function(e) {
        this._gantt._onTreeListRowExpandChanged(e, false)
    };
    _proto._onRowExpanded = function(e) {
        this._gantt._onTreeListRowExpandChanged(e, true)
    };
    _proto._onRowPrepared = function(e) {
        if ("data" === e.rowType && e.node.children.length > 0) {
            (0, _renderer.default)(e.rowElement).addClass(GANTT_COLLAPSABLE_ROW)
        }
    };
    _proto._onContextMenuPreparing = function(e) {
        var _e$row, _e$row2;
        if ("data" === (null === (_e$row = e.row) || void 0 === _e$row ? void 0 : _e$row.rowType)) {
            this.setOption("selectedRowKeys", [e.row.data[this._gantt.option("tasks.keyExpr")]])
        }
        e.items = [];
        var info = {
            cancel: false,
            event: e.event,
            type: "task",
            key: null === (_e$row2 = e.row) || void 0 === _e$row2 ? void 0 : _e$row2.key,
            position: {
                x: e.event.pageX,
                y: e.event.pageY
            }
        };
        this._gantt._showPopupMenu(info)
    };
    _proto._getHeight = function() {
        if (this._$treeList.height()) {
            return this._$treeList.height()
        }
        this._gantt._hasHeight = (0, _type.isDefined)(this._gantt.option("height")) && "" !== this._gantt.option("height");
        return this._gantt._hasHeight ? "100%" : ""
    };
    _proto._initScrollSync = function(treeList) {
        var _this2 = this;
        var treeListScrollable = treeList.getScrollable();
        if (treeListScrollable) {
            treeListScrollable.off("scroll");
            treeListScrollable.on("scroll", (function(e) {
                _this2._onScroll(e)
            }))
        }
    };
    _proto._onScroll = function(treeListScrollView) {
        var ganttViewTaskAreaContainer = this._gantt._ganttView.getTaskAreaContainer();
        if (ganttViewTaskAreaContainer.scrollTop !== treeListScrollView.component.scrollTop()) {
            ganttViewTaskAreaContainer.scrollTop = treeListScrollView.component.scrollTop()
        }
    };
    _proto._correctRowsViewRowHeight = function(height) {
        var view = this._treeList._views && this._treeList._views.rowsView;
        if ((null === view || void 0 === view ? void 0 : view._rowHeight) !== height) {
            view._rowHeight = height
        }
    };
    _proto._skipUpdateTreeListDataSource = function() {
        return this._gantt.option("validation.autoUpdateParentTasks")
    };
    _proto.selectRows = function(keys) {
        this.setOption("selectedRowKeys", keys)
    };
    _proto.scrollBy = function(scrollTop) {
        var treeListScrollable = this._treeList.getScrollable();
        if (treeListScrollable) {
            var diff = scrollTop - treeListScrollable.scrollTop();
            if (0 !== diff) {
                treeListScrollable.scrollBy({
                    left: 0,
                    top: diff
                })
            }
        }
    };
    _proto.updateDataSource = function(data) {
        var forceUpdate = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : false;
        if (!this._skipUpdateTreeListDataSource()) {
            this.setOption("dataSource", data)
        } else if (forceUpdate) {
            var _data = this._treeList.option("dataSource");
            this._gantt._onParentTasksRecalculated(_data)
        }
    };
    _proto.onRowClick = function(e) {
        this._gantt._actionsManager.raiseTaskClickAction(e.key, e.event)
    };
    _proto.onRowDblClick = function(e) {
        if (this._gantt._actionsManager.raiseTaskDblClickAction(e.key, e.event)) {
            this._gantt._ganttView._ganttViewCore.showTaskEditDialog()
        }
    };
    _proto.getOffsetHeight = function() {
        return this._gantt._treeList._$element.get(0).offsetHeight
    };
    _proto.getRowHeight = function() {
        var $row = this._treeList._$element.find(".dx-data-row");
        var height = $row.length ? (0, _position.getBoundingRect)($row.last().get(0)).height : GANTT_DEFAULT_ROW_HEIGHT;
        if (!height) {
            height = GANTT_DEFAULT_ROW_HEIGHT
        }
        this._correctRowsViewRowHeight(height);
        return height
    };
    _proto.getHeaderHeight = function() {
        return (0, _position.getBoundingRect)(this._treeList._$element.find(".dx-treelist-headers").get(0)).height
    };
    _proto.getColumns = function() {
        var columns = this._gantt.option("columns");
        if (columns) {
            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];
                var isKeyColumn = column.dataField === this._gantt.option("".concat(GANTT_TASKS, ".keyExpr")) || column.dataField === this._gantt.option("".concat(GANTT_TASKS, ".parentIdExpr"));
                if (isKeyColumn && !column.dataType) {
                    column.dataType = "object"
                }
            }
        }
        return columns
    };
    _proto.setOption = function(optionName, value) {
        this._treeList && this._treeList.option(optionName, value)
    };
    _proto.getOption = function(optionName) {
        return this._treeList.option(optionName)
    };
    _proto.onTaskInserted = function(insertedId, parentId) {
        if ((0, _type.isDefined)(parentId)) {
            var expandedRowKeys = this.getOption("expandedRowKeys");
            if (-1 === expandedRowKeys.indexOf(parentId)) {
                expandedRowKeys.push(parentId);
                this.setOption("expandedRowKeys", expandedRowKeys)
            }
        }
        this.selectRows(_uiGantt.GanttHelper.getArrayFromOneElement(insertedId));
        this.setOption("focusedRowKey", insertedId)
    };
    return GanttTreeList
}();
exports.GanttTreeList = GanttTreeList;
