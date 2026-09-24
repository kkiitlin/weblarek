import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { TPayment } from "../../types";
import { IForm, Form } from "./Entity/Form";

export interface IOrder extends IForm {
    payment: TPayment;
    address: string;
}

export class Order extends Form<IOrder> {
    protected buttonOnline: HTMLButtonElement;
    protected buttonOffline: HTMLButtonElement; // Исправлена опечатка (было Offlie)
    protected address: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        // Убран модификатор protected перед events
        super(container, events); 

        this.buttonOffline = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.buttonOnline = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.address = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.buttonOffline.addEventListener('click', () => {
            const field = 'payment';
            const value = 'cash';
            this.onInputChange(field, value);
        });

        this.buttonOnline.addEventListener('click', () => {
            const field = 'payment';
            const value = 'card';
            this.onInputChange(field, value);
        });

    }

    set payment(value: TPayment) {
        this.buttonOnline.classList.toggle('button_alt-active', value === 'card');
        this.buttonOffline.classList.toggle('button_alt-active', value === 'cash');
    }

    set addressInput(value: string) {
        this.address.value = value;
    } 
}