import { ensureElement } from "../../utils/utils";
import { Form, IForm } from "./Entity/Form";
import { IEvents } from "../base/Events";

export interface IContacts extends IForm {
    email: string;
    phone: string;
}

export class Contacts extends Form<IContacts> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}