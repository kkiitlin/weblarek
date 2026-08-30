import './scss/styles.scss';

import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { CatalogModel } from './components/Models/CatalogModel'; 

import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { Communication } from './components/services/Communication';
import { apiProducts } from './utils/data';

//экземпляры моделей 
const basket = new BasketModel(); 
const catalog = new CatalogModel();
const buyer = new BuyerModel();

const baseApi = new Api(API_URL); 
const api = new Communication(baseApi)

//проверяем каталог 

catalog.saveProductsList(apiProducts.items)
console.log("Обзор всего каталога товаров", catalog.getProductsList())

const firstIdElem = apiProducts.items[0].id
console.log(`Поиск товара по его id "${firstIdElem}:"`, catalog.getIdProduct(firstIdElem))

catalog.saveChoosenProduct(apiProducts.items[0]);
console.log('Выбранный товар:', catalog.getChoosenProduct())

//проверяем корзину с товарами 

console.log('Первоначальное состояние корзины: ', basket.getBasketProduct())
console.log('Количество товаров в корзине изначально: ', basket.getCountBasketItem())

const product1 = apiProducts.items[0]
const product2 = apiProducts.items[1]
basket.addProduct(product1)
basket.addProduct(product2)
console.log('Корзина после добавления двух товаров: ', basket.getBasketProduct())
console.log('Количество товаров в корзине после добавления двух товаров', basket.getCountBasketItem())
console.log('Стоимость товара после добавления', basket.getPrice());

console.log('Есть ли первый товар в корзине (до удаления):', basket.hasProduct(product1.id));
basket.removeItem(product1) 
console.log('Корзина после удаления одного товара: ', basket.getBasketProduct())
console.log('Количество товаров в корзине после удалния товара', basket.getCountBasketItem())
console.log('Стоимость товара после удаления товара', basket.getPrice());
console.log('Есть ли первый товар в корзине (после удаления):', basket.hasProduct(product1.id));

basket.clearBasket()
console.log('Корзина после полной очистки', basket.getBasketProduct())

// проверка данных пользователя 

console.log('Получение данных пользователя', buyer.getUsersData())

buyer.saveData({ email: 'kkiitlink@gmail.com', phone: '+3752900098' });
console.log('Данные после частичного ввода:', buyer.getUsersData());
console.log('Ошибки валидации (ожидаем payment и address):', buyer.validate());

buyer.saveData({ payment: 'card', address: 'Есенина 19' });
console.log('Данные после полного заполнения:', buyer.getUsersData());
console.log('Ошибки валидации (ожидаем пустой объект {}):', buyer.validate());

buyer.clearUsersData();
console.log('Данные покупателя после очистки:', buyer.getUsersData());

api.getProductList()
    .then((data) => {
        catalog.saveProductsList(data.items);
        console.log('Данные каталога успешно загружены с сервера:');
        console.log(catalog.getProductsList());
    })
    .catch((err) => {
        console.error('Ошибка при получении данных с сервера:', err);
    });

