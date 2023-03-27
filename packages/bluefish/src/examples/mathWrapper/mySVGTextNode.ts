import { TextNode } from 'mathjax-full/js/core/MmlTree/MmlNode';
import { SVGTextNode } from 'mathjax-full/js/output/svg/Wrappers/TextNode';

export class MySVGTextNode<N, T, D> extends SVGTextNode<N, T, D> {
    public toSVG(parent: any) {
        const text = (this.node as TextNode).getText();
        const variant = this.parent.variant;
        if (text.length === 0) return;
        if (variant === '-explicitFont') {
            this.element = this.adaptor.append(parent, this.jax.unknownText(text, variant));
        } else {
            const chars = this.remappedText(text, variant);
            if (this.parent.childNodes.length > 1) {
                parent = this.element = this.adaptor.append(parent, this.svg('g', { 'data-mml-node': 'text' }));
            }
            let x = 0;
            for (const n of chars) {
                x += this.placeChar(n, x, 0, parent, variant);
            }
        }
    }
}