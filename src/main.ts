import './scss/styles.scss';

// Модели
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { CatalogModel } from './components/Models/CatalogModel'; 

// Утилиты и API
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { Communication } from './components/services/Communication';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IBuyer, IOrder, IProduct } from './types';

// Представления
import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';
import { Succeess } from './components/View/Succeess'; 
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { CardBasket } from './components/View/CardBasket'; 
import { Basket } from './components/View/Basket';
import { Order } from './components/View/Order';
import { Contacts } from './components/View/Contacts';

// --- 1. Инициализация базовых классов ---
const events = new EventEmitter();
const baseApi = new Api(API_URL); 
const api = new Communication(baseApi);

const basket = new BasketModel(events); 
const catalog = new CatalogModel(events);
const buyer = new BuyerModel(events);

// --- 2. Поиск шаблонов ---
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// --- 3. Инициализация компонентов Представления ---
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new Order(cloneTemplate(orderTemplate), events);
const contactsForm = new Contacts(cloneTemplate(contactsTemplate), events);
const successView = new Succeess(cloneTemplate(successTemplate), events);

const preview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit('card__preview:click')
});

// --- 4. Обработчики событий (Слой Презентера) ---

// Переменная для разделения логики отрисовки каталога и модалки
let renderedProducts: IProduct[] | null = null;

/* Вспомогательные методы презентера */
function getPreviewButtonText(product: IProduct): string {
    if (product.price === null) return 'Недоступно';
    return basket.hasProduct(product.id) ? 'Удалить из корзины' : 'Купить';
}

/* Каталог - ВАРИАНТ БЕЗ ИЗМЕНЕНИЯ CatalogModel */

// Единое событие, которое срабатывает и на список, и на клик по карточке
events.on('catalog:change', () => {
    const products = catalog.getProductsList();

    // 1. Если список товаров обновился (загрузили с сервера) -> рендерим галерею
    if (products !== renderedProducts) {
        renderedProducts = products;
        
        gallery.catalog = products.map((item) => {
            const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
                onClick: () => events.emit('card:click', { id: item.id })
            });
            return card.render(item);
        });
    } 
    // 2. Если список не менялся, значит произошел клик по карточке -> открываем превью
    else {
        const product = catalog.getChoosenProduct();
        if (!product) return;

        preview.buttonText = getPreviewButtonText(product);
        preview.buttonDisabled = product.price === null;

        modal.content = preview.render(product);
        modal.openWindow();
    }
});

events.on('card:click', (data: { id: string }) => {
    const product = catalog.getIdProduct(data.id);
    if (product) {
        catalog.saveChoosenProduct(product); // Это вызовет 'catalog:change' еще раз
    }
});

events.on('card__preview:click', () => {
    const product = catalog.getChoosenProduct();
    if (!product || product.price === null) return;

    if (basket.hasProduct(product.id)) {
        basket.removeItem(product);
    } else {
        basket.addProduct(product);
    }
    modal.closeWindow();
});

/* Корзина */

events.on('basket:change', () => {
    header.counter = basket.getCountBasketItem();

    const basketItems = basket.getBasketProduct().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('card__basket:remove', { id: item.id })
        });
        const container = card.render(item);
        card.index = index + 1;
        return container;
    });

    basketView.basket = basketItems;
    basketView.total = basket.getPrice();

    // Добавляем явное управление доступностью кнопки «Оформить» в зависимости от наличия товаров
    basketView.buttonStatus = basket.getCountBasketItem() === 0;
});

events.on('basket:open', () => {
    modal.content = basketView.render();
    modal.openWindow();
});

events.on('card__basket:remove', (data: { id: string }) => {
    const product = basket.getBasketProduct().find((item) => item.id === data.id);
    if (product) {
        basket.removeItem(product);
    }
});

/* Оформление заказа */

events.on('basket:success', () => {
    modal.content = orderForm.render();
    modal.openWindow();
});

events.on('form:change', (data: { field: keyof IBuyer; value: string }) => {
    switch (data.field) {
        case 'payment':
            if (data.value === 'cash' || data.value === 'card') {
                buyer.saveData({ payment: data.value });
            }
            break;
        case 'address': buyer.saveData({ address: data.value }); break;
        case 'email': buyer.saveData({ email: data.value }); break;
        case 'phone': buyer.saveData({ phone: data.value }); break;
    }
});

events.on('buyer:change', () => {
    const data = buyer.getUsersData();
    const errors = buyer.validate();

    orderForm.render({
        payment: data.payment === '' ? undefined : data.payment
    });
    orderForm.addressInput = data.address;
    
    const orderErrors = [errors.payment, errors.address].filter(Boolean);
    orderForm.error = orderErrors.join('; ');
    orderForm.buttonStatus = orderErrors.length > 0;

    contactsForm.email = data.email;
    contactsForm.phone = data.phone;

    const contactsErrors = [errors.email, errors.phone].filter(Boolean);
    contactsForm.error = contactsErrors.join('; ');
    contactsForm.buttonStatus = contactsErrors.length > 0;
});

events.on('order:submit', () => {
    modal.content = contactsForm.render();
});

events.on('contacts:submit', () => {
    const data = buyer.getUsersData();
    const order: IOrder = {
        payment: data.payment,
        address: data.address,
        email: data.email,
        phone: data.phone,
        items: basket.getBasketProduct().map((item) => item.id),
        total: basket.getPrice()
    };

    api.postData(order)
        .then((result: any) => {
            basket.clearBasket();
            buyer.clearUsersData();
            successView.counter = result.total;
            modal.content = successView.render();
        })
        .catch((err: any) => {
            contactsForm.error = 'Не удалось оформить заказ, попробуйте ещё раз';
            console.error('Ошибка при оформлении заказа:', err);
        });
});

events.on('succeess:agree', () => {
    modal.closeWindow();
});

// --- 5. Запуск приложения ---
api.getProductList()
    .then((data: any) => {
        catalog.saveProductsList(data.items);
    })
    .catch((err: any) => {
        console.error('Ошибка при получении данных с сервера:', err);
    });