import { CommonMnMixin } from 'mathjax-full/js/output/common/Wrappers/mn';
import { SVGConstructor } from 'mathjax-full/js/output/svg/Wrapper';
import { SVGmn } from 'mathjax-full/js/output/svg/Wrappers/mn';
import { MySVGWrapper } from './mySVGWrapper';

export class MySVGmn<N, T, D> extends CommonMnMixin<SVGConstructor<any, any, any>>(MySVGWrapper) {
    /**
     * 
     * @override
     */
    public toSVG(parent: any) {
        console.log("text conversion");
        super.toSVG(parent)
    }
}