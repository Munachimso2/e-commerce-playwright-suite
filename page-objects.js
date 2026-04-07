

export class PageObjects {
    constructor(page) {
        this.page = page;
        this.searchBox = page.getByRole("textbox", { name: "search" });
        this.allProducts = page.locator(".card");
        this.cartBtn = this.page.locator("li").getByRole("button", { name: "Cart" });
        this.toastContainer = this.page.locator("#toast-container");
        this.emptyCartMsg = this.page.getByRole("heading", { name: "No Products in Your Cart !" });
        this.cartItems = this.page.locator(".cartSection h3");
        this.expectedProducts = ["ZARA COAT 3", "ADIDAS ORIGINAL", "IPHONE 13 PRO"];
        this.checkoutBtn = this.page.getByRole("button", { name: "Checkout" });
        this.countryInput = this.page.getByPlaceholder("Select Country");
        this.placeOrderErrorMsg = this.page.getByText("Please Enter Full Shipping Information", { exact: true });
        this.placeOrderSuccessMsg = this.page.getByText("Order Placed Successfully", { exact: true });
        this.placeOrderBtn = this.page.getByText("Place Order", { exact: true });
        this.ordersBtn = this.page.getByRole("button", { name: "Orders" });
        this.ordersTable = this.page.locator("table");
        this.orderID = this.page.locator('tr.line-item.ng-star-inserted')
    }

    async goto() {
        await this.page.goto("https://rahulshettyacademy.com/client/#/dashboard/dash")
    }

    async search(productName) {
        await this.searchBox.fill(productName);
        await this.searchBox.press("Enter");
        await this.page.waitForLoadState('networkidle');
    }

    async addProductToCart(productName) {
        const product = this.allProducts.filter({ hasText: productName });
        await product.getByRole("button", { name: "Add To Cart" }).click();
    }

    async getTotalProducts() {
        return await this.allProducts.count();
    }

    async gotoCart() {
        await this.cartBtn.click();
        await this.page.waitForLoadState('networkidle');
    }

    async checkoutProduct() {
        await this.checkoutBtn.click();
        await this.page.waitForLoadState('networkidle');
    }

    async placeOrder() {
        await this.placeOrderBtn.click();
        await this.page.waitForLoadState('networkidle');
    }

    async placeOrderWithCountry(country) {
        await this.countryInput.type(country);
        const dropdownOption = this.page.getByText(country, { exact: true });
        await dropdownOption.click();
    }

    async placeOrderWithInvalidCountry(country) {
        await this.countryInput.type(country);
    }

    async gotoOrders() {
        await this.ordersBtn.click();
        await this.page.waitForLoadState('networkidle');
    }



}

