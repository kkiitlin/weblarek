import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IBasket {
    basket: HTMLElement;
    sum: number 
}

export class Basket extends Component<IBasket> {
    protected price: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected basketList: HTMLElement; 

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)

        this.price = ensureElement<HTMLElement>('.basket__price', this.container)
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container)
        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container)

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:success')
        })
    }

    set total(value: number) {
        this.price.textContent = `${value} синапсов`;
    }

    set basket(items: HTMLElement[]) {
        if(items.length === 0) {
            const description = document.createElement('P');
            description.textContent = 'Корзина пуста';
            this.basketList.replaceChildren(description);
            this.basketButton.disabled = true;
        } else {
            this.basketList.replaceChildren(...items);
            this.basketButton.disabled = false;
        }
    }

    set buttonStatus(value: boolean) {
        this.basketButton.disabled = value;
    }
}