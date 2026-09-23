import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Component } from "../base/Component";

interface ISucceess {
    counter: number
}

export class Succeess extends Component<ISucceess> {
    protected successDescription: HTMLElement;
    protected succeessButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)
        this.successDescription = ensureElement<HTMLElement>('.order-success__description', this.container)
        this.succeessButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container)

        this.succeessButton.addEventListener('click', () => {
            this.events.emit('succeess:agree')
        })
    }

    set counter(value: number) {
        this.successDescription.textContent = `Списано ${value} синапсов`
    }
}