var TreeMap = /** @class */ (function () {
    function TreeMap(selector, treemapData) {
        this.selector = selector;
        this.treemapData = treemapData;
        this.rootNode = {
            id: null,
            value: 0,
            title: 'root',
            color: 'transparent'
        };
        console.log(this);
        this.init();
        this.updateDimension();
        this.drawTreemap();
    }
    TreeMap.prototype.init = function () {
        this.initContainer();
        this.setParentSizeListener();
    };
    TreeMap.prototype.resize = function () {
        console.log('before', this.datum);
        this.updateDimension();
        console.log('after', this.datum);
        this.drawTreemap();
    };
    TreeMap.prototype.update = function (treemapdata) {
        this.treemapData = treemapdata;
        this.drawTreemap();
    };
    TreeMap.prototype.delete = function () {
        this.removeParentSizeListener();
        this.treemapData = [];
        this.drawTreemap();
    };
    TreeMap.prototype.drawTreemap = function () {
        this.rootNode.children = this.treemapData;
        this.datum = d3.treemap().size([this.width, this.height])(d3.hierarchy(this.rootNode, function (d) { return d.children; })
            .sum(function (d) { return d.value; }));
        // data join
        this.treemap = this.root.selectAll('.node').data(this.datum.leaves(), function (d) { return d.data.id; });
        // data enter
        this.treemap.enter().append("div")
            .attr("class", "node")
            .style("left", function (d) { return (d.x0 + (d.x1 - d.x0) / 2) + "px"; })
            .style("top", function (d) { return (d.y0 + (d.y1 - d.y0) / 2) + "px"; })
            .style("width", function (d) { return 0 + "px"; })
            .style("height", function (d) { return 0 + "px"; })
            .merge(this.treemap)
            .transition().duration(300)
            .style("left", function (d) { return d.x0 + "px"; })
            .style("top", function (d) { return d.y0 + "px"; })
            .style("width", function (d) { return Math.max(0, d.x1 - d.x0 - 1) + "px"; })
            .style("height", function (d) { return Math.max(0, d.y1 - d.y0 - 1) + "px"; })
            .style("background-color", function (d) { return d.data.color; });
        // data exit
        this.treemap.exit()
            .transition().duration(300)
            .style("left", function (d) { return (d.x0 + (d.x1 - d.x0) / 2) + "px"; })
            .style("top", function (d) { return (d.y0 + (d.y1 - d.y0) / 2) + "px"; })
            .style("width", function (d) { return 0 + "px"; })
            .style("height", function (d) { return 0 + "px"; })
            .remove();
        console.log(this.datum);
    };
    TreeMap.prototype.initContainer = function () {
        this.container = d3.select(this.selector);
        this.containerNode = this.container.node();
        this.root = this.container.append('div').classed('root', true);
    };
    TreeMap.prototype.updateDimension = function () {
        this.width = this.containerNode.offsetWidth;
        this.height = this.containerNode.offsetHeight;
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
