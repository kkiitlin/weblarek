import { Component } from "../../base/Component";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";

export type keyCategory = keyof typeof categoryMap;

export interface ICard extends Partial<IProduct> {
    index?: number;
}

// 1. Добавляем интерфейс для колбэков
export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export abstract class Card<T extends ICard> extends Component<T> {
    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;

    // 2. Добавляем actions в конструктор
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this.cardTitle.textContent = value;
    }

    set price(value: number | null) {
        if(value === null) {
            this.cardPrice.textContent = 'Бесценно';
        } else { 
            this.cardPrice.textContent = `${value} синапсов`;
        }
    }
}