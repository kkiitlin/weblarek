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
import { Succeess } from './components/View/Succeess'; // Исправлена опечатка в названии файла
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

// --- 4. Обработчики событий (Слой Презентера) ---

// Последний отрисованный список товаров.
// Модель каталога сообщает об изменении и при выборе товара, поэтому галерею перерисовываем
// только тогда, когда изменился сам список товаров, а не выбранная карточка
let renderedProducts: IProduct[] | null = null;

/* Вспомогательные методы презентера */

// Текст кнопки в превью товара
function getPreviewButtonText(product: IProduct): string {
    if (product.price === null) {
        return 'Недоступно';
    }
    return basket.hasProduct(product.id) ? 'Удалить из корзины' : 'Купить';
}

// Подсветка выбранного способа оплаты.
// Поле address здесь не передаём, чтобы не затереть DOM-инпут, который лежит в свойстве address
function syncPaymentState(): void {
    const { payment } = buyer.getUsersData();

    orderForm.render({
        payment: payment === '' ? undefined : payment
    });
}

// Ошибки в формах и доступность их кнопок (true — кнопка заблокирована)
function updateFormsState(): void {
    const errors = buyer.validate();

    // способ оплаты мог измениться -> обновляем подсветку кнопок
    syncPaymentState();

    const orderErrors = [errors.payment, errors.address].filter(Boolean);
    orderForm.error = orderErrors.join('; ');
    orderForm.buttonStatus = orderErrors.length > 0;

    const contactsErrors = [errors.email, errors.phone].filter(Boolean);
    contactsForm.error = contactsErrors.join('; ');
    contactsForm.buttonStatus = contactsErrors.length > 0;
}

// Подготовка формы заказа (способ оплаты и адрес) к показу
function renderOrderForm(): HTMLElement {
    const data = buyer.getUsersData();
    const errors = buyer.validate();
    const orderErrors = [errors.payment, errors.address].filter(Boolean);

    // Способ оплаты подсвечиваем через render, а адрес ставим через свойство addressInput:
    // передавать address в render нельзя, иначе затрём DOM-инпут, который лежит в свойстве address
    syncPaymentState();
    orderForm.addressInput = data.address;

    // Ошибки показываем только после того, как пользователь начнёт вводить данные
    orderForm.error = '';
    orderForm.buttonStatus = orderErrors.length > 0;

    return orderForm.render();
}

// Подготовка формы контактов (email и телефон) к показу
function renderContactsForm(): HTMLElement {
    const data = buyer.getUsersData();
    const errors = buyer.validate();
    const contactsErrors = [errors.email, errors.phone].filter(Boolean);

    contactsForm.email = data.email;
    contactsForm.phone = data.phone;

    contactsForm.error = '';
    contactsForm.buttonStatus = contactsErrors.length > 0;

    return contactsForm.render();
}

/* Каталог */

// Список товаров изменился -> выводим карточки в галерею
events.on('catalog:change', () => {
    const products = catalog.getProductsList();

    // Изменился только выбранный товар -> галерею перерисовывать не нужно
    if (products === renderedProducts) return;

    renderedProducts = products;
    gallery.catalog = products.map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);
        return card.render(item);
    });
});

// Клик по карточке каталога -> сохраняем товар как выбранный
events.on('card:click', (data: { id: string }) => {
    const product = catalog.getIdProduct(data.id);
    if (product) {
        catalog.saveChoosenProduct(product);
    }
});

// Выбранный товар изменился -> показываем превью в модальном окне
events.on('catalog:change', () => {
    const product = catalog.getChoosenProduct();
    if (!product) return;

    const preview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
    preview.buttonText = getPreviewButtonText(product);

    modal.content = preview.render(product);
    modal.openWindow();
});

// Клик по кнопке в превью -> добавляем товар в корзину или удаляем его из корзины
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

// Содержимое корзины изменилось -> обновляем счётчик в шапке, список товаров и сумму
events.on('basket:change', () => {
    header.counter = basket.getCountBasketItem();

    basketView.basket = basket.getBasketProduct().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);
        const container = card.render(item);
        card.index = index + 1; // порядковый номер товара в списке
        return container;
    });
    basketView.total = basket.getPrice();
});

// Клик по иконке корзины в шапке -> открываем корзину
events.on('basket:open', () => {
    modal.content = basketView.render();
    modal.openWindow();
});

// Клик по иконке мусорки в корзине -> удаляем товар из корзины
events.on('card__basket:remove', (data: { id: string }) => {
    const product = basket.getBasketProduct().find((item) => item.id === data.id);
    if (product) {
        basket.removeItem(product);
    }
});

/* Оформление заказа */

// Клик по кнопке "Оформить" в корзине -> открываем форму заказа
events.on('basket:success', () => {
    modal.content = renderOrderForm();
    modal.openWindow();
});

// Пользователь изменил данные в форме -> сохраняем их в модели покупателя
events.on('form:change', (data: { field: keyof IBuyer; value: string }) => {
    switch (data.field) {
        case 'payment':
            if (data.value === 'cash' || data.value === 'card') {
                buyer.saveData({ payment: data.value });
            }
            break;
        case 'address':
            buyer.saveData({ address: data.value });
            break;
        case 'email':
            buyer.saveData({ email: data.value });
            break;
        case 'phone':
            buyer.saveData({ phone: data.value });
            break;
    }
});

// Данные покупателя изменились -> обновляем ошибки и состояние кнопок в формах
events.on('buyer:change', () => {
    updateFormsState();
});

// Клик по кнопке "Далее" в форме заказа -> переходим к форме контактов
events.on('order:submit', () => {
    const errors = buyer.validate();

    // Пока в форме заказа есть ошибки, дальше не идём
    if (errors.payment || errors.address) {
        updateFormsState();
        return;
    }

    modal.content = renderContactsForm();
});

// Клик по кнопке "Оплатить" в форме контактов -> отправляем заказ на сервер
events.on('contacts:submit', () => {
    const data = buyer.getUsersData();
    const errors = buyer.validate();

    // Пока в форме контактов есть ошибки, заказ не отправляем
    if (errors.email || errors.phone || !data.payment || !data.address) {
        updateFormsState();
        return;
    }

    const order: IOrder = {
        payment: data.payment,
        address: data.address,
        email: data.email,
        phone: data.phone,
        items: basket.getBasketProduct().map((item) => item.id),
        total: basket.getPrice()
    };

    api.postData(order)
        .then((result) => {
            basket.clearBasket();
            buyer.clearUsersData();

            // Сервер возвращает итоговую сумму заказа
            successView.counter = result.total;
            modal.content = successView.render();
        })
        .catch((err) => {
            contactsForm.error = 'Не удалось оформить заказ, попробуйте ещё раз';
            console.error('Ошибка при оформлении заказа:', err);
        });
});

// Клик по кнопке в окне успешного заказа -> закрываем модальное окно
// (имя события оставлено таким, каким его отправляет компонент Succeess)
events.on('succeess:agree', () => {
    modal.closeWindow();
});

// --- 5. Запуск приложения ---

// Загружаем список товаров с сервера
api.getProductList()
    .then((data) => {
        catalog.saveProductsList(data.items);
    })
    .catch((err) => {
        console.error('Ошибка при получении данных с сервера:', err);
    });

