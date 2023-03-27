import { SVGmath } from 'mathjax-full/js/output/svg/Wrappers/math';
import { BBox } from 'mathjax-full/js/util/BBox';

export class MySVGmath<N, T, D> extends SVGmath<N, T, D> {
    public toSVG(parent: any) {
        console.log("called this")
        super.toSVG(parent)
    }



}