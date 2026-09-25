import { ensureElement } from "../../utils/utils";
import { CDN_URL, categoryMap } from "../../utils/constants";
import { Card, keyCategory, ICardActions } from "./Entity/Card";
import { IProduct } from "../../types";

export class CardCatalog extends Card<IProduct> {
    protected cardCategory: HTMLElement;
    protected cardImage: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardActions) {

        super(container, actions); 
        
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);

    }

    set image(value: string) { 
        this.cardImage.src = `${CDN_URL}/${value}`;

        this.cardImage.alt = this.cardTitle.textContent || ''; 
    }

    set category(value: string) {
        this.cardCategory.textContent = value;

        for(const key in categoryMap) {
            this.cardCategory.classList.toggle(
                categoryMap[key as keyCategory],
                key === value
            );
        }
    }
}