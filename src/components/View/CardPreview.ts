import { ensureElement } from "../../utils/utils";
// Убираем импорт IEvents, добавляем ICardActions и ICard
import { Card, keyCategory, ICardActions, ICard } from "./Entity/Card";
import { categoryMap, CDN_URL } from "../../utils/constants";

export interface ICardPreview extends ICard {
    description?: string;
    buttonText?: string;
    buttonDisabled?: boolean;
}

export class CardPreview extends Card<ICardPreview> {
    protected cardCategory: HTMLElement;
    protected cardImage: HTMLImageElement;
    protected cardDescription: HTMLElement;
    protected cardButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardDescription = ensureElement<HTMLElement>('.card__text', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (actions?.onClick) {
            this.cardButton.addEventListener('click', actions.onClick);
        }
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

    set description(value: string) {
        this.cardDescription.textContent = value;
    }

    set buttonText(value: string) {
        this.cardButton.textContent = String(value);
    }

    set buttonDisabled(value: boolean) {
        this.cardButton.disabled = value;
    }
}