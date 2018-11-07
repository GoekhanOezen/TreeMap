class TreeMap {

    private container: d3.Selection<HTMLElement, {}, HTMLElement, null>;
    private containerNode: HTMLElement;
    private onWidthChange?: Event;
    private observer?: MutationObserver;
    private datum: any;
    private root: any;
    private rootNode: TreeMapData = {
        id: null,
        value: 0,
        title: 'root',
        color: 'transparent'
    };
    private treemap: any;
    private width: number;
    private height: number;

    constructor (private selector: string, private treemapData: TreeMapData[]) {
        this.init();

        this.updateDimension();

        this.drawTreemap();
    }

    init() {
        this.initContainer();
        this.setParentSizeListener();
    }

    resize() {
        this.updateDimension();
        this.drawTreemap();
    }

    update(treemapdata: TreeMapData[]) {
        this.treemapData = treemapdata;
        this.drawTreemap();
    }

    delete() {
        this.removeParentSizeListener();
        this.treemapData = [];
        this.drawTreemap();
    }

    private drawTreemap() {
        this.rootNode.children = this.treemapData;

        this.datum = d3.treemap().size([this.width, this.height])(d3.hierarchy(this.rootNode, (d) => d.children)
            .sum((d) => d.value));
        // data join
        this.treemap = this.root.selectAll('.node').data(this.datum.leaves(), d => d.data.id);
        // data enter
        this.treemap.enter().append("div")
            .attr("class", "node")
            .style("left", (d) => (d.x0 + (d.x1 - d.x0)/2) + "px")
            .style("top", (d) => (d.y0 + (d.y1 - d.y0)/2) + "px")
            .style("width", (d) => 0 + "px")
            .style("height", (d) => 0 + "px")
            .merge(this.treemap)
            .transition().duration(300)
            .style("left", (d) => d.x0 + "px")
            .style("top", (d) => d.y0 + "px")
            .style("width", (d) => Math.max(0, d.x1 - d.x0 - 1) + "px")
            .style("height", (d) => Math.max(0, d.y1 - d.y0  - 1) + "px")
            .style("background-color", d => d.data.color);
        // data exit
        this.treemap.exit()
            .transition().duration(300)
            .style("left", (d) => (d.x0 + (d.x1 - d.x0)/2) + "px")
            .style("top", (d) => (d.y0 + (d.y1 - d.y0)/2) + "px")
            .style("width", (d) => 0 + "px")
            .style("height", (d) => 0 + "px")
            .remove();
    }

    initContainer() {
        this.container = d3.select(this.selector);
        this.containerNode = this.container.node();

        this.root = this.container.append('div').classed('root',true);
    }

    private updateDimension() {
        this.width = this.containerNode.offsetWidth;
        this.height = this.containerNode.offsetHeight;
    }


    /**
     * ParentSizeListener
     * inspiration from Ali Alaa @ http://themegasm.net/media-queries-mutationobserver/
     */
    private setParentSizeListener() {
        TreeMap.updateWidthAndHeight(this.containerNode, true);

        this.onWidthChange = new Event('onWidthChange');
        this.observer = new MutationObserver(mutations => mutations.forEach(mutation => this.mutationCallback(mutation)));

        this.addParentSizeListener();
    }

    private addParentSizeListener() {
        this.observer.observe(this.containerNode, { attributes: true });
        this.containerNode.addEventListener('onWidthChange', () => this.resize());
        window.addEventListener('resize', () => TreeMap.updateWidthAndHeight(this.containerNode));
    }

    private removeParentSizeListener() {
        this.observer.disconnect();
        this.containerNode.removeEventListener('onWidthChange', () => this.resize());
        window.removeEventListener('resize', () => TreeMap.updateWidthAndHeight(this.containerNode));
    }

    private static widthOrHeightChanged(elem) {
        return elem.offsetWidth !== parseInt(elem.dataset.width) || elem.offsetHeight !== parseInt(elem.dataset.height);
    }

    private static updateWidthAndHeight(node: HTMLElement, force?) {
        if(force || TreeMap.widthOrHeightChanged(node)) {
            node.dataset.width = node.offsetWidth + '';
            node.dataset.height = node.offsetHeight + '';
        }
    }

    private mutationCallback(mutation) {
        TreeMap.updateWidthAndHeight(this.containerNode);
        if(mutation.type === 'attributes' && (mutation.attributeName === 'data-width' || mutation.attributeName === 'data-height')) {
            this.containerNode.dispatchEvent(this.onWidthChange);
        }
    }
}

interface TreeMapData {
    id: number;
    value: number;
    title: string;
    color: string;
    children?: TreeMapData[]
}
