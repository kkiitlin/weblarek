import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

export type FormErrors = Partial<Record<keyof IBuyer, string>>

export class BuyerModel {
    protected buyerData: IBuyer = {
        payment: '',
        address: '',
        phone: '',
        email: ''
    }

    constructor(protected events: IEvents) {}

    saveData(data: Partial<IBuyer>): void {
    this.buyerData = { ...this.buyerData, ...data };
    this.events.emit('buyer:change')
    }

    getUsersData(): IBuyer {
        return this.buyerData
    }

    clearUsersData(): void {
        this.buyerData = {
        payment: '',
        address: '',
        phone: '',
        email: '',
        }
        this.events.emit('buyer:change')
    }

    validate(): FormErrors {
        const errors: FormErrors = {}
        
        if (!this.buyerData.payment){
            errors.payment = 'Не выбран способ оплаты'
        }

        if (!this.buyerData.address){
            errors.address = 'Введите адрес'
        }

        if (!this.buyerData.phone){
            errors.phone = 'Введите номер телефона'
        }

        if (!this.buyerData.email){
            errors.email = 'Введите адрес электронной почты'
        }

        return errors
    }
}
