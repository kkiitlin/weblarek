import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IProduct } from "../../types";
import { Card, keyCategory } from "./Entity/Card";
import { categoryMap, CDN_URL } from "../../utils/constants";

export class CardPreview extends Card<IProduct> {
    protected cardCategory: HTMLElement;
    protected cardImage: HTMLImageElement;
    protected cardDescription: HTMLElement;
    protected cardButton: HTMLButtonElement;
    

    constructor(container: HTMLElement, protected events: IEvents){
        super(container)

        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container)
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container)
        this.cardDescription = ensureElement<HTMLElement>('.card__text', this.container)
        this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container)

        this.cardButton.addEventListener('click', () => {
            this.events.emit('card__preview:click')
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
            );
        }
    }

    set description(value: string) {
        this.cardDescription.textContent = value;
    }

    set buttonText(value: string) {
        this.cardButton.textContent = String(value)
        this.cardButton.disabled = false;
        if(value === 'Недоступно') {
            this.cardButton.disabled = true
        }
    }
}