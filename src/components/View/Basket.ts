import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface IBasket {
    basket: HTMLElement[]; // Исправлено на массив
    total: number;         // Исправлено с sum на total
}

export class Basket extends Component<IBasket> {
    protected price: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected basketList: HTMLElement; 

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.price = ensureElement<HTMLElement>('.basket__price', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:success');
        });

        // Пока в корзине нет товаров, кнопка «Оформить» неактивна
        this.buttonStatus = true;
    }

    set total(value: number) {
        this.price.textContent = `${value} синапсов`;
    }

    set basket(items: HTMLElement[]) {
        if (items.length === 0) {
            const description = document.createElement('p'); 
            description.textContent = 'Корзина пуста';
            this.basketList.replaceChildren(description);
            this.buttonStatus = true; // Используем собственный сеттер
        } else {
            this.basketList.replaceChildren(...items);
            this.buttonStatus = false;
        }
    }

    set buttonStatus(value: boolean) {
        this.basketButton.disabled = value;
    }
}