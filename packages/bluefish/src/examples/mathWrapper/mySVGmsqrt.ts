
import { SVGmsqrt } from 'mathjax-full/js/output/svg/Wrappers/msqrt';

export class MySVGmsqrt<N, T, D> extends SVGmsqrt<N, T, D> {
    public toSVG(parent: N) {
        const surd = this.childNodes[this.surd];
        const base = this.childNodes[this.base];
        const root = (this.root ? this.childNodes[this.root] : null);
        //
        //  Get the parameters for the spacing of the parts
        //
        const sbox = surd.getBBox();
        const bbox = base.getOuterBBox();
        const q = this.getPQ(sbox)[1];
        const t = this.font.params.rule_thickness * this.bbox.scale;
        const H = bbox.h + q + t;
        //
        //  Create the SVG structure for the root
        //
        const SVG = this.standardSVGnode(parent);
        const BASE = this.adaptor.append(SVG, this.svg('g'));
        //
        //  Place the children
        //
        this.addRoot(SVG, root, sbox, H);
        surd.toSVG(SVG);
        surd.place(this.dx, H - sbox.h);
        base.toSVG(BASE);
        base.place(this.dx + sbox.w, 0);
        this.adaptor.append(SVG, this.svg('rect', {
            width: this.fixed(bbox.w), height: this.fixed(t),
            x: this.fixed(this.dx + sbox.w), y: this.fixed(H - t)
        }));
        console.log("sqrt bounding box", {
            width: this.fixed(bbox.w), height: this.fixed(t),
            x: this.fixed(this.dx + sbox.w), y: this.fixed(H - t)
        });
        // if(!window['boundingBox'])
        //     window['boundingBox'] = '';

        return {
            width: this.fixed(bbox.w), height: this.fixed(t),
            x: this.fixed(this.dx + sbox.w), y: this.fixed(H - t)
        };
    }
}