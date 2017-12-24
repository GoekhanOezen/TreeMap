/// <reference types="d3"/>;
namespace Treemap {

    export class Chart {

        private container: d3.Selection<undefined>;

        constructor (private selector: string, private treemapData: TreeMapData[]) {
            d3.select('#' + selector);
        }

        private init () {}
    }

    export interface TreeMapData {
        id: number;
        value: number;
        title: string;
        color: string;
    }
}
