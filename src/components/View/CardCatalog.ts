import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { CDN_URL, categoryMap } from "../../utils/constants";
import { Card, keyCategory } from "./Entity/Card";

export class CardCatalog extends Card<IProduct> {
    protected cardCategory: HTMLElement;
    protected cardImage: HTMLImageElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container)
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container)

        this.container.addEventListener('click', () => {
            this.events.emit('card:click', {id: this.idCard})
        })
    }

    set image(value: string) { 
        this.cardImage.src = `${CDN_URL}/${value}`;
        this.cardImage.alt = this.title
    }

    set category(value: string) {
        this.cardCategory.textContent = value;

        for(const key in categoryMap) {
            this.cardCategory.classList.toggle(
                categoryMap[key as keyCategory],
                key === value
            )
        }
    }
}
