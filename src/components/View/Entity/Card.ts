import { Component } from "../../base/Component";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";

export type keyCategory = keyof typeof categoryMap

export interface ICard extends Partial<IProduct> {
    index?: number;
}

export abstract class Card<T extends ICard> extends Component<T>{
    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;
    protected idCard?: string;

    constructor(container: HTMLElement){
        super(container)
        this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container)
        this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container)
    }

    set title(value: string) {
        this.cardTitle.textContent = value;
    }

    set id(value: string) {
        this.idCard = value;
    }

    set price(value: number | null) {
        if(value === null) {
            this.cardPrice.textContent = 'Бесценно';
        } else { 
            this.cardPrice.textContent = `${value} синапсов`
        }
    }
}