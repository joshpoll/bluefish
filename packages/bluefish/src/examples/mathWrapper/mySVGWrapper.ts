import { SVGWrapper } from "mathjax-full/js/output/svg/Wrapper";
import { BBox } from "mathjax-full/js/util/BBox";
import { OptionList } from "mathjax-full/js/util/Options";
import { MyWrapperFactory } from "./myWrapperFactory"

export class MySVGWrapper<N, T, D> extends SVGWrapper<N, T, D> {
    protected factory = new MyWrapperFactory<N, T, D>();

    public toSVG(parent: N) {
        console.log("extended");
        this.addChildren(this.standardSVGnode(parent));
    }

    /**
   * Return the wrapped node's bounding box that includes borders and padding
   *
   * @param {boolean} save  Whether to cache the bbox or not (used for stretchy elements)
   * @return {BBox}  The computed bounding box
   */
    public getOuterBBox(save: boolean = true): BBox {
        const bbox = this.getBBox(save);
        if (!this.styles) return bbox;
        const obox = new BBox();
        Object.assign(obox, bbox);
        for (const [name, side] of BBox.StyleAdjust) {
            const x = this.styles.get(name);
            if (x) {
                (obox as any)[side] += this.length2em(x, 1, obox.rscale);
            }
        }
        console.log(obox);
        return obox;
    }

    /**
 * @param {string} type      The tag name of the svg node to be created
 * @param {OptionList} def   The properties to set for the created node
 * @param {(N|T)[]} content  The child nodes for the created SVG node
 * @return {N}               The generated SVG tree
 */
    public svg(type: string, def: OptionList = {}, content: (N | T)[] = []): N {
        console.log(def);
        return this.jax.svg(type, def, content);
    }

    /**
  * Create the standard SVG element for the given wrapped node.
  *
  * @param {N} parent  The HTML element in which the node is to be created
  * @returns {N}  The root of the HTML tree for the wrapped node's output
  */
    protected standardSVGnode(parent: N): N {
        console.log("hi")
        const svg = this.createSVGnode(parent);
        this.handleStyles();
        this.handleScale();
        this.handleBorder();
        this.handleColor();
        this.handleAttributes();
        return svg;
    }

}