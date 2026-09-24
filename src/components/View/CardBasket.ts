import { ensureElement } from "../../utils/utils";
import { Card, ICardActions } from "./Entity/Card"; // Добавлен импорт ICardActions
import { IProduct } from "../../types";

export class CardBasket extends Card<IProduct> {
    protected cardIndex: HTMLElement;
    protected buttonRemove: HTMLButtonElement;

    // Заменяем IEvents на actions
    constructor(container: HTMLElement, actions?: ICardActions) {

        super(container);

        this.cardIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.buttonRemove = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onClick) {
            this.buttonRemove.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this.cardIndex.textContent = String(value);
    }
}