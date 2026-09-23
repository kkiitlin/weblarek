import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { TPayment } from "../../types";
import { IForm, Form } from "./Entity/Form";

interface IOrder extends IForm {
    payment: TPayment;
    address: string;
}

export class Order extends Form<IOrder> {
    protected buttonOnline: HTMLButtonElement;
    protected buttonOfflie: HTMLButtonElement;
    protected address: HTMLInputElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events) 

        this.buttonOfflie = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container)
        this.buttonOnline = ensureElement<HTMLButtonElement>('button[name="card"]', this.container)
        this.address = ensureElement<HTMLInputElement>('input[name="address"]', this.container)

        this.buttonOfflie.addEventListener('click', () => {
            const field = 'payment'
            const value = 'cash'
            this.onInputChange(field, value)
        })

        this.buttonOnline.addEventListener('click', () => {
            const field = 'payment'
            const value = 'card'
            this.onInputChange(field, value)
        })

        this.address.addEventListener('input', () => {
            const field = 'address'
            const value = this.address.value
            this.onInputChange(field, value)
        })
    }

    set payment(value: TPayment) {
        this.buttonOnline.classList.toggle('button_alt-active', value === 'card');
        this.buttonOfflie.classList.toggle('button_alt-active', value === 'cash');
    }

    set addressInput(value: string) {
        this.address.value = value;
    } 
}
