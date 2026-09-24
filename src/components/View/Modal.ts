import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Component } from "../base/Component";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected modalElem: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
    
        this.modalElem = ensureElement<HTMLElement>('.modal__content', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        // Убрали дублирующиеся слушатели. Вешаем закрытие окна на крестик и на оверлей
        this.closeButton.addEventListener('click', this.closeWindow.bind(this));
        this.container.addEventListener('click', this.closeWindow.bind(this));
        
        // Предотвращаем закрытие при клике внутри самой карточки
        this.modalElem.addEventListener('click', (event) => event.stopPropagation());

        // Обработка клавиши Escape (вызываем только closeWindow)
        document.addEventListener('keydown', (e) => {
            if(this.container.classList.contains('modal_active') && e.key === 'Escape') {
                this.closeWindow();
            }
        });
    }

    openWindow(): void {
        this.container.classList.add('modal_active');
    } 

    closeWindow(): void {
        this.container.classList.remove('modal_active');
        // Перенесли отправку события сюда, как просил ревьюер
        this.events.emit('modal:close');
    }

    set content(value: HTMLElement) {
        this.modalElem.replaceChildren(value);
    }
}