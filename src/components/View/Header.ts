import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface Iheader {
    counter: string;
}

export class Header extends Component<Iheader> {
    protected basketButton: HTMLButtonElement
    protected counterElem: HTMLElement

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container) 

        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container) 
        this.counterElem = ensureElement<HTMLElement>('.header__basket-counter', this.container)

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open')
        })
    }

    set counter(value: number) {
        this.counterElem.textContent = String(value)
    }
}