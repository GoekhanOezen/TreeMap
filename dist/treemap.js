var TreeMap = /** @class */ (function () {
    function TreeMap(selector, treemapData) {
        this.selector = selector;
        this.treemapData = treemapData;
        this.rootNode = {
            id: null,
            value: 0,
            name: 'root',
            color: 'transparent'
        };
        this.draw();
    }
    TreeMap.prototype.init = function () {
        this.initContainer();
        this.setParentSizeListener();
        this.updateDimension();
    };
    TreeMap.prototype.draw = function () {
        this.init();
        this.drawTreemap();
    };
    TreeMap.prototype.resize = function () {
        this.updateDimension();
        this.drawTreemap();
    };
    TreeMap.prototype.update = function (treemapdata) {
        this.treemapData = treemapdata;
        this.drawTreemap();
    };
    TreeMap.prototype.delete = function () {
        this.removeParentSizeListener();
        this.drawTreemap(true);
        this.deleteContainer();
    };
    TreeMap.prototype.drawTreemap = function (empty) {
        this.rootNode.children = empty ? [] : this.treemapData;
        this.datum = d3.treemap().size([this.width, this.height])(d3.hierarchy(this.rootNode, function (d) { return d.children; })
            .sum(function (d) { return d.value; }));
        // data join
        this.treemap = this.root.selectAll('.node').data(this.datum.leaves(), function (d) { return d.data.id; });
        // data enter
        this.treemap.enter().append("div")
            .attr("class", "node")
            .call(TreeMap.initialDimension)
            .merge(this.treemap)
            .text(function (d) { return d.data.name; })
            .on('mouseover', function (d, i, nodes) { TreeMap.addHoverClasses(this, nodes, true); })
            .on('mouseout', function (d, i, nodes) { TreeMap.addHoverClasses(this, nodes, false); })
            .transition()
            .style("left", function (d) { return d.x0 + "px"; })
            .style("top", function (d) { return d.y0 + "px"; })
            .style("width", function (d) { return Math.max(0, d.x1 - d.x0 - 1) + "px"; })
            .style("height", function (d) { return Math.max(0, d.y1 - d.y0 - 1) + "px"; })
            .style("background-color", function (d) { return d.data.color; });
        // data exit
        this.treemap.exit()
            .transition()
            .call(TreeMap.initialDimension)
            .remove();
    };
    TreeMap.addHoverClasses = function (node, nodes, classed) {
        var defocusedNodes = nodes.filter(function (aNode) { return aNode !== node; });
        d3.select(node).classed('focused', classed);
        d3.selectAll(defocusedNodes).classed('defocused', classed);
    };
    TreeMap.prototype.initContainer = function () {
        this.container = d3.select(this.selector);
        this.containerNode = this.container.node();
        if (!this.container.select('.root').node()) {
            this.root = this.container.append('div').classed('root', true);
        }
    };
    TreeMap.prototype.deleteContainer = function () {
        this.containerNode.innerHTML = '';
        this.containerNode.removeAttribute("data-width");
        this.containerNode.removeAttribute("data-height");
    };
    TreeMap.prototype.updateDimension = function () {
        this.width = this.containerNode.offsetWidth;
        this.height = this.containerNode.offsetHeight;
    };
    TreeMap.initialDimension = function (selection) {
        selection
            .style('left', function (d) { return d.x0 + (d.x1 - d.x0) / 2 + "px"; })
            .style('top', function (d) { return d.y0 + (d.y1 - d.y0) / 2 + "px"; })
            .style('width', function () { return "0px"; })
            .style('height', function () { return "0px"; });
    };
    /**
     * ParentSizeListener
     * inspiration from Ali Alaa @ http://themegasm.net/media-queries-mutationobserver/
     */
    TreeMap.prototype.setParentSizeListener = function () {
        var _this = this;
        TreeMap.updateWidthAndHeight(this.containerNode, true);
        this.onWidthChange = new Event('onWidthChange');
        this.observer = new MutationObserver(function (mutations) { return mutations.forEach(function (mutation) { return _this.mutationCallback(mutation); }); });
        this.addParentSizeListener();
    };
    TreeMap.prototype.addParentSizeListener = function () {
        var _this = this;
        this.observer.observe(this.containerNode, { attributes: true });
        this.containerNode.addEventListener('onWidthChange', function () { return _this.resize(); });
        window.addEventListener('resize', function () { return TreeMap.updateWidthAndHeight(_this.containerNode); });
    };
    TreeMap.prototype.removeParentSizeListener = function () {
        var _this = this;
        this.observer.disconnect();
        this.containerNode.removeEventListener('onWidthChange', function () { return _this.resize(); });
        window.removeEventListener('resize', function () { return TreeMap.updateWidthAndHeight(_this.containerNode); });
    };
    TreeMap.widthOrHeightChanged = function (elem) {
        return elem.offsetWidth !== parseInt(elem.dataset.width) || elem.offsetHeight !== parseInt(elem.dataset.height);
    };
    TreeMap.updateWidthAndHeight = function (node, force) {
        if (force || TreeMap.widthOrHeightChanged(node)) {
            node.dataset.width = node.offsetWidth + '';
            node.dataset.height = node.offsetHeight + '';
        }
    };
    TreeMap.prototype.mutationCallback = function (mutation) {
        TreeMap.updateWidthAndHeight(this.containerNode);
        if (mutation.type === 'attributes' && (mutation.attributeName === 'data-width' || mutation.attributeName === 'data-height')) {
            this.containerNode.dispatchEvent(this.onWidthChange);
        }
    };
    return TreeMap;
}());
