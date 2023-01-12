import { OnClickButton } from './interfaces/customTypes';

const MAX_LENGTH_CARD_NUMBER = 19;
const MAX_LENGTH_CVV = 3;
const MAX_LENGTH_DATE = 5;

export class PaymentForm {
    private modalWindow: Element;
    private parent: Element;
    private onClickButton: OnClickButton;

    constructor(parent: Element, onClickButton: OnClickButton) {
        this.onClickButton = onClickButton;

        this.parent = parent;
        this.modalWindow = document.createElement('div');
        this.modalWindow.classList.add('modal-window');
        this.modalWindow.innerHTML = `
        <p class="modal__close">&times;</p>
        <p class="modal__text">Make a payment</p>
        <form class="modal__form">
            <div class="systems">
                <img src="../../assets/icons/mastercard.png" class="img_payments" alt="card type">
                <input type="text" class="input input_card-number" placeholder="Card number">
            </div>
            <div class="modal__data">
                <input type="text" class="input input_name" placeholder="Name">
                <input type="phone" class="input input_phone" placeholder="Phone">
                <input type="text" class="input input_address" placeholder="Delivery address">
                <input type="email" class="input input_email" placeholder="E-mail">
                <input type="text" class="input input_valid" id="input_valid" placeholder="Valodate date mm/yy">
                <input type="text" class="input input_code" id="input_code" placeholder="CVV">
            </div>
            <div class="buttons__wrapper">
            <button type="submit" class="button button-pay" disabled>Pay</button>
            </div>
        </form>`;
    }

    public drawForm(): void {
        this.parent.appendChild(this.modalWindow);

        const form = document.querySelector('.modal__form')!;
        form.addEventListener('input', () => this.validateForm());

        const cardNumber = document.querySelector(
            '.input_card-number'
        )! as HTMLInputElement;
        cardNumber.addEventListener('input', () => this.updateCardImage());

        const close: Element = document.querySelector('.modal__close')!;
        close.addEventListener('click', () => this.closeWindow());

        const buttonPay: Element = document.querySelector('.button-pay')!;
        buttonPay.addEventListener('click', () => this.onClickButton('pay'));
    }

    private closeWindow(): void {
        this.modalWindow.remove();
    }

    private checkCardNumber(): boolean {
        const cardNumber = document.querySelector(
            '.input_card-number'
        )! as HTMLInputElement;
        cardNumber.maxLength = MAX_LENGTH_CARD_NUMBER;
        const value = cardNumber.value;
        cardNumber.value = value
            .replace(/[^\d]/g, '')
            .replace(/(.{4})/g, '$1 ')
            .trim();

        if (value.length === MAX_LENGTH_CARD_NUMBER) {
            return true;
        } else {
            return false;
        }
    }

    private updateCardImage(): void {
        const cardNumber = document.querySelector(
            '.input_card-number'
        )! as HTMLInputElement;
        const cardImage = document.querySelector(
            '.img_payments'
        )! as HTMLImageElement;
        const value = cardNumber.value;
        if (value.charAt(0) === '4') {
            cardImage.src = '../../assets/icons/visa.png';
        } else if (value.charAt(0) === '5') {
            cardImage.src = '../../assets/icons/mastercard.png';
        } else {
            cardImage.src = '../../assets/icons/maestro.png';
        }
    }

    private checkName(): boolean {
        const fullName = document.querySelector(
            '.input_name'
        )! as HTMLInputElement;
        const value = fullName.value;
        const regexp: RegExp = /^[A-Za-z]{3,}\s[A-Za-z]{3,}(\s?[A-Za-z]{3,})*$/;
        if (regexp.test(value)) {
            return true;
        } else {
            return false;
        }
    }

    private checkCvv(): boolean {
        const cvv = document.querySelector('.input_code')! as HTMLInputElement;
        cvv.maxLength = MAX_LENGTH_CVV;
        const value = cvv.value;
        cvv.value = value.replace(/[^\d]/g, '');
        if (value.length === MAX_LENGTH_CVV) {
            return true;
        } else {
            return false;
        }
    }

    private checkAddress() {
        const address = document.querySelector(
            '.input_address'
        )! as HTMLInputElement;
        const value = address.value;
        const regexp: RegExp =
            /^[A-Za-z0-9]{5,}\s[A-Za-z0-9]{5,}(\s?[A-Za-z0-9]{5,})*$/;
        if (regexp.test(value)) {
            return true;
        } else {
            return false;
        }
    }

    private checkPhone(): boolean {
        const phone = document.querySelector(
            '.input_phone'
        )! as HTMLInputElement;
        const value = phone.value;
        phone.value = value.replace(/[^\+\d]/g, '');
        const regexp: RegExp = /^\+\d{9,}$/;
        if (regexp.test(value)) {
            return true;
        } else {
            return false;
        }
    }

    private checkEmail(): boolean {
        const email = document.querySelector(
            '.input_email'
        )! as HTMLInputElement;
        const value = email.value;
        const regexp: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (regexp.test(value)) {
            return true;
        } else {
            return false;
        }
    }

    private checkExpirationDate(): boolean {
        const expirationDate = document.querySelector(
            '.input_valid'
        )! as HTMLInputElement;
        expirationDate.maxLength = MAX_LENGTH_DATE;
        const value = expirationDate.value;
        expirationDate.value = value
            .replace(/[^\d]/g, '')
            .replace(/(^.{2})/g, '$1/');
        const dateArray = value.split('/');
        if (Number(dateArray[0]) < 12) {
            return true;
        } else {
            return false;
        }
    }

    private validateForm() {
        let isOk = false;
        isOk = this.checkCardNumber();
        isOk = this.checkName();
        isOk = this.checkEmail();
        isOk = this.checkPhone();
        isOk = this.checkExpirationDate();
        isOk = this.checkCvv();
        isOk = this.checkAddress();
        if (isOk) {
            const buttonBuy = document.querySelector(
                '.button-pay'
            )! as HTMLButtonElement;
            buttonBuy.disabled = false;
        }
    }
}
