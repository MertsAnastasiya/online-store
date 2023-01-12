'use strict';
import { productsData } from './data';
import { OnClickButton } from './interfaces/customTypes';
import { IProduct } from './interfaces/product.interface';

export class ProductPage {
    private parent: Element;
    private productDataLayout: string;
    private product: IProduct;
    private onClickButton: OnClickButton;

    constructor(parent: Element, id: number, onClickButton: OnClickButton) {
        this.onClickButton = onClickButton;

        this.product = productsData.filter((data) => data.id === id)[0]!;
        this.parent = parent;
        this.productDataLayout = `
            <div class="route"></div>
            <div class="product-info">
                <div class="product__image">
                    <img class="main-image"></img>
                    <div class="additional-images__wrapper">
                    </div>
                </div>
                <div class="product__description">
                    <div>
                        <div class="name"></div>
                        <div class="brand"></div>
                        <div class="description"></div>
                        <div class="rating"></div>
                        <div class="price"></div>
                    </div>
                    <div class="buttons__wrapper">
                        <button class="button button_add add-cart">Add to Cart</button>
                        <button class="button button_buy">Buy Now</button>
                    </div>
                    <div class="delivery__wrapper">
                        <div class="delivery">Free Delivery</div>
                        <div class="return">Free 30days returns</div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    public drawProductPage() {
        this.parent.innerHTML = this.productDataLayout;
        const route: Element = document.querySelector('.route')!;
        const productName: Element = document.querySelector('.name')!;
        const brand: Element = document.querySelector('.brand')!;
        const description: Element = document.querySelector('.description')!;
        const addCartButton = document.querySelector('.add-cart')! as HTMLButtonElement;
        const buyButton: Element = document.querySelector('.button_buy')! as HTMLButtonElement;
        const price: Element = document.querySelector('.price')!;
        const rating: Element = document.querySelector('.rating')!;
        const mainImg = document.querySelector('.main-image')! as HTMLImageElement;
        const addImgWrapper: Element = document.querySelector('.additional-images__wrapper')!;

        const routeText: string = `Store / ${this.product.category} / ${this.product.brand} / ${this.product.title}`;
        route.innerHTML = routeText;
        productName.innerHTML = this.product.title;
        brand!.innerHTML = this.product.brand;
        description!.innerHTML = this.product.description;
        addCartButton.setAttribute('id', this.product.id.toString());
        price!.innerHTML = `€${this.product.price}`;
        rating!.innerHTML = `Rating: ${this.product.rating}`;
        if (this.product.images[0]) {
            mainImg.src = this.product.images[0]!;
        }

        let i = 0;
        while (i !== 3) {
            if (this.product.images[i]) {
                const addImg = document.createElement('img');
                addImg.classList.add('additional-image')
                addImg.src = this.product.images[i]!;
                addImg.addEventListener('click', () => {
                        mainImg.src = addImg.src;
                });
                addImgWrapper.appendChild(addImg);
            }
            i++;
        }
        addCartButton.addEventListener('click', () => this.onClickButton('cart'));
        buyButton.addEventListener('click', () => this.onClickButton('buy'));
    }
}
