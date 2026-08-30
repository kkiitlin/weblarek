
import { IApi, IOrder, IOrderResult, IProductResponse } from "../../types";

export class Communication {
    protected api: IApi

    constructor(api: IApi) {
       this.api = api;
    }

    getProductList(): Promise<IProductResponse> {
        return this.api.get('/product/');
    }

    postData(order: IOrder): Promise<IOrderResult> {
        return this.api.post('/order/', order);
    }
}

