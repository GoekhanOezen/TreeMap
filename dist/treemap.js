/// <reference types="d3"/>;
var Treemap;
(function (Treemap) {
    var Chart = /** @class */ (function () {
        function Chart(selector, treemapData) {
            this.selector = selector;
            this.treemapData = treemapData;
            d3.select('#' + selector);
        }
        Chart.prototype.init = function () { };
        return Chart;
    }());
    Treemap.Chart = Chart;
})(Treemap || (Treemap = {}));
