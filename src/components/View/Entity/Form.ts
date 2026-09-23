import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Component } from "../../base/Component";

export interface IForm {
    error: string;
}

export class Form<T extends IForm> extends Component<T> {
    protected errorForm: HTMLElement;
    protected buttonForm: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)

        this.buttonForm = ensureElement<HTMLButtonElement>('.modal__actions button', this.container)
        this.errorForm = ensureElement<HTMLElement>('.form__errors', this.container)

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.getAttribute('name')}:submit`)
        })
    }

    set error(value: string) {
        this.errorForm.textContent = value;
    }

    set buttonStatus(value: boolean) {
        this.buttonForm.disabled = value;
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit('form:change', {
        field,
        value,
        });
    }
}