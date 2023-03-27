import { SVGWrapper } from 'mathjax-full/js/output/svg/Wrapper';
import { SVGWrapperFactory } from 'mathjax-full/js/output/svg/WrapperFactory';
import { SVGWrappers } from 'mathjax-full/js/output/svg/Wrappers'
import { SVGmsqrt } from 'mathjax-full/js/output/svg/Wrappers/msqrt';
import { SVGmn } from 'mathjax-full/js/output/svg/Wrappers/mn';
import { SVGTextNode } from 'mathjax-full/js/output/svg/Wrappers/TextNode';
import { MySVGmsqrt } from '../mathWrapper/mySVGmsqrt';
import { MySVGWrapper } from '../mathWrapper/mySVGWrapper';
import { MySVGTextNode } from '../mathWrapper/mySVGTextNode';
import { MySVGmath } from './mySVGmath';
import { SVGmath } from 'mathjax-full/js/output/svg/Wrappers/math';

export class MyWrapperFactory<N, T, D> extends SVGWrapperFactory<N, T, D>
{
    public static defaultNodes = {
        ...SVGWrapperFactory.defaultNodes,
        [SVGmath.kind]: MySVGmath,
        [SVGWrapper.kind]: MySVGWrapper,
        [SVGmsqrt.kind]: MySVGmsqrt,
        [SVGmn.kind]: SVGmn,
        [SVGTextNode.kind]: MySVGTextNode

    };
}