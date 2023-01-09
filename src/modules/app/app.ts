import { productsData } from '../data';
import { GlobalFilters } from '../filters/globalFilters';
import { FilterResult } from '../filters/result';
import { FilterType, SliderType, SliderValue } from '../interfaces/customTypes';
import { IProduct } from '../interfaces/product.interface';
import { ProductList } from '../product/productList';
import { Cart } from '../cart';
import { SearchParams } from '../searchParams';
import { Button } from '../filters/button';

export class App {
    private productList: ProductList;
    private globalFiltres: GlobalFilters;
    private cart: Cart;
    private searchParams: SearchParams;

    constructor() {
        this.searchParams = new SearchParams();
        this.globalFiltres = new GlobalFilters(
            (
                currentFilters: Map<FilterType, Set<string>>,
                currentSliders: Map<SliderType, SliderValue>,
                searchValue: string
            ) => this.updateResult(currentFilters, currentSliders, searchValue),

            (param: string, value: string, isAdd: boolean) =>
                this.searchParams.updateSearchParamByCheckbox(
                    param,
                    value,
                    isAdd
                ),
            (param: string, min: string, max: string) => this.searchParams.updateSearchParamBySlider(param, min, max),
            (param: string, value: string) => this.searchParams.updateSearchParamBySearch(param, value)
        );
        const products: Element = document.querySelector('.products')!; // ???
        this.productList = new ProductList(
            products,
            (id: number, isAdded: boolean) =>
                this.onProductItemSelected(id, isAdded),
            (id: number) => this.onProductClick(id)
        );
        const header: Element = document.querySelector('.header__container')!; //???

        this.cart = new Cart(header);
    }

    public start(): void {
        this.cart.drawCart();
        this.cart.setCurrentValues('0', '0');
        this.cart.resetBtn(); // will be remove at the end
        this.globalFiltres.createFilters(productsData);

        const startFilters: Map<FilterType, Set<string>> = this.globalFiltres.getCurrentFilters();
        const startSliders: Map<SliderType, SliderValue> = this.globalFiltres.getCurrentSliders();
        this.updateResult(startFilters, startSliders, '');

        const btnCopy = new Button(
            document.querySelector('.buttons__wrapper')!,
            (type: string) => this.onClickButton(type)
        );
        btnCopy.drawButton('copy');
        btnCopy.drawButton('reset');
    }

    public updateResult(
        currentFilters: Map<FilterType, Set<string>>,
        slidersValue: Map<SliderType, SliderValue>,
        searchValue: string
    ): void {
        const array: IProduct[] = FilterResult.getFilterResult(
            currentFilters,
            slidersValue,
            searchValue
        );
        this.productList.drawProductList(array);
        this.setFoundProducts(array.length);
    }

    private setFoundProducts(count: number): void {
        const found: Element = document.querySelector('.filters__result')!;
        found.innerHTML = `Found: ${count}`;
    }

    public onProductItemSelected(productId: number, isAdded: boolean) {
        const product = productsData.filter(
            (product) => product.id === productId
        )[0]!;
        let currentCount: number = Number(this.getCount());
        let currentSum: number = Number(this.getSum());
        currentCount += isAdded ? 1 : -1;
        currentSum += isAdded ? product.price : -product.price;
        this.setCount(String(currentCount));
        this.setSum(String(currentSum));
        this.cart.setCurrentValues(String(currentSum), String(currentCount));
    }

    public onProductClick(id: number) {
        window.open(
            `${window.location.href}product.html?id=${id}`,
            '_blank'
        );
    }

    public getSum(): string {
        if (localStorage.getItem('sum')) {
            return localStorage.getItem('sum')!;
        } else {
            return '0';
        }
    }

    public getCount(): string {
        if (localStorage.getItem('count')) {
            return localStorage.getItem('count')!;
        } else {
            return '0';
        }
    }

    private setSum(sum: string): void {
        localStorage.setItem('sum', sum);
    }

    private setCount(amount: string): void {
        localStorage.setItem('count', amount);
    }

    private onClickButton(type: string) {
        switch (type) {
            case 'copy': {
                const temp: HTMLInputElement = document.createElement('input');
                document.body.appendChild(temp);
                temp.value = window.location.href;
                temp.select();
                document.execCommand('copy');
                document.body.removeChild(temp);
                break;
            }
            case 'reset': {
                const allCheckbox: NodeListOf<HTMLInputElement> = document.querySelectorAll('.checkbox');
                allCheckbox.forEach((checkbox) => {
                    if (checkbox.checked) {
                        checkbox.checked = false;
                    }
                });
                this.searchParams.clearUrl();
                this.globalFiltres.clearFilters();
            }
            default:
                throw new Error('Something went wrong');
                break;
        }
    }
}
