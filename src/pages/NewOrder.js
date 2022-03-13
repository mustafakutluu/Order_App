import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import {ProductService} from "../service/ProductService";
import { useLocation } from 'react-router-dom';
import Cleave from 'cleave.js/react';

const NewOrder = () => {
    let emptyOrder = {
        id: null,
        name: '',
        product: '',
        quantity: 1,
        price: 0,
        date: '',
        street: '',
        city: '',
        state: '',
        zip: 0,
        cardtype: '',
        cardnumber: '',
        exp: ''
    };

    let emptyProduct = {
        id: null,
        name: '',
        price: 0,
        discount: 0
    };

    const toast = useRef(null);
    const [submitted, setSubmitted] = useState(false);
    const [product, setProduct] = useState(false);
    const [catalog, setCatalog] = useState(false);
    const [orders, setOrders] = useState(null);
    const [order, setOrder] = useState(emptyOrder);
    const location = useLocation();

    useEffect(() => {
        const productService = new ProductService();
        productService.getProductsCatalog().then(data => {
            setCatalog(data);
            if(location.state){
                const _order = location.state.selectedOrder;
                setOrder(_order);

                const index = findIndexByProductName(data, _order.product);
                setProduct(data[index]);
            }
        });

        setOrders(JSON.parse(sessionStorage.getItem("orders")));
    }, []);

    const onCategoryChange = (e) => {
        setProduct(e.value);

        let currentDate = new Date();
        let _order = { ...order };
        _order['product'] = e.value['name'];
        _order['date'] = currentDate.getDay() + "/" + currentDate.getMonth() + "/" + currentDate.getFullYear();

        let totalPrice = _order['quantity']*(e.value['price'] - (e.value['price']*e.value['discount']/100));
        _order['price'] = totalPrice;

        setOrder(_order);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _order = { ...order };
        _order[`${name}`] = val;
        setOrder(_order);
    }

    const onInputNumberChange = (e, name) => {

        const val = e.value || 0;
        let _order = { ...order };
        _order[`${name}`] = val;

        if(name === "quantity") {
            let totalPrice = e.value*(product['price'] - (product['price']*product['discount']/100));
            _order['price'] = totalPrice;
        }

        setOrder(_order);
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < orders.length; i++) {
            if (orders[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const findIndexByProductName = (data, name) => {
        let index = -1;
        for (let i = 0; i < data.length; i++) {
            if (data[i].name === name) {
                index = i;
                break;
            }
        }

        return index;
    }

    const createId = () => {
        let id = '';
        let chars = '0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    const processOrder = () => {

        setSubmitted(true);

        if (order.name.trim()) {
            let _orders = [...orders];
            let _order = { ...order };
            if (order.id) {
                const index = findIndexById(order.id);

                _orders[index] = _order;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            }
            else {
                _order.id = createId();
                _order.image = 'product-placeholder.svg';
                _orders.push(_order);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            setOrders(_orders);
            sessionStorage.setItem("orders", JSON.stringify(_orders));
            resetOrderForm();

            console.log(_orders);
        }
    }

    const resetOrderForm = () => {
        setOrder(emptyOrder);
        setProduct(emptyProduct);
    }

    return (
        <div className="col-12">
            <Toast ref={toast} />
            <div className="card">
                <div className="card">
                    <h5>Product Information</h5>
                    <div className="field">
                        <label htmlFor="product" className="col-1">Product</label>
                        <Dropdown id="product" value={product} options={catalog} onChange={(e) => onCategoryChange(e)} optionLabel="name" placeholder="Select a Product" />
                    </div>
                    <div className="field">
                        <label htmlFor="quantity" className="col-1">Quantity</label>
                        <InputNumber inputId="quantity" value={order.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} mode="decimal" min={1} max={20} allowEmpty={false}/>
                    </div>
                    <div className="field">
                        <label htmlFor="price" className="col-1">Price per unit</label>
                        <InputNumber inputId="price" value={product.price} mode="currency" currency="USD" locale="en-US" disabled={true}/>
                    </div>
                    <div className="field">
                        <label htmlFor="discount" className="col-1">Discount</label>
                        <InputNumber inputId="discount" value={product.discount} mode="decimal" prefix="%" disabled={true}/>
                    </div>
                    <div className="field">
                        <label htmlFor="sum" className="col-1">Total</label>
                        <InputNumber inputId="sum" value={order.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" disabled={true}/>
                    </div>
                </div>
                <div className="card">
                    <h5>Address Information</h5>
                    <div className="field">
                        <label htmlFor="customerName" className="col-1">Customer Name</label>
                        <InputText id="customerName" value={order.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !order.name })} />
                        {submitted && !order.name && <small className="p-invalid">Name is required.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="street" className="col-1">Street</label>
                        <InputText id="street" value={order.street} onChange={(e) => onInputChange(e, 'street')} required autoFocus className={classNames({ 'p-invalid': submitted && !order.street })} />
                        {submitted && !order.street && <small className="p-invalid">Street is required.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="city" className="col-1">City</label>
                        <InputText id="city" value={order.city} onChange={(e) => onInputChange(e, 'city')} required autoFocus className={classNames({ 'p-invalid': submitted && !order.city })} />
                        {submitted && !order.city && <small className="p-invalid">City is required.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="state" className="col-1">State</label>
                        <InputText id="state" value={order.state} onChange={(e) => onInputChange(e, 'state')}/>
                    </div>
                    <div className="field">
                        <label htmlFor="zip" className="col-1">Zip</label>
                        <InputNumber inputId="zip" value={order.zip} onValueChange={(e) => onInputNumberChange(e, 'zip')} mode="decimal" min={1} max={9999} required autoFocus className={classNames({ 'p-invalid': submitted && !order.zip })} />
                        {submitted && !order.zip && <small className="p-invalid">Zip is required.</small>}
                    </div>
                </div>
                <div className="card">
                    <h5>Payment Information</h5>
                    <div className="grid field p-2">
                        <label className="col-1">Card Type</label>
                        <div className="field-radiobutton">
                            <RadioButton inputId="visa" name="category" value="visa" onChange={(e) => onInputChange(e, 'cardtype')} checked={order.cardtype === 'visa'} />
                            <label htmlFor="visa">Visa</label>
                        </div>
                        <div className="field-radiobutton col-1">
                            <RadioButton inputId="masterCard" name="category" value="mastercard" onChange={(e) => onInputChange(e, 'cardtype')} checked={order.cardtype === 'mastercard'} />
                            <label htmlFor="masterCard">MasterCard</label>
                        </div>
                        <div className="field-radiobutton col-2">
                            <RadioButton inputId="category3" name="category" value="amex" onChange={(e) => onInputChange(e, 'cardtype')} checked={order.cardtype === 'amex'} />
                            <label htmlFor="category3">American Express</label>
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="cardNumber" className="col-1">Card Number</label>
                        <Cleave id="cardNumber" className="p-inputtext p-component p-filled p-inputnumber-input" placeholder="Enter your credit card number" options={{creditCard: true}} value={order.cardnumber} onChange={(e) => onInputChange(e, 'cardnumber')}/>
                    </div>
                    <div className="field">
                        <label htmlFor="expireDate" className="col-1">Expire date</label>
                        <Cleave id="expireDate" className="p-inputtext p-component p-filled p-inputnumber-input" placeholder="MM/YY" options={{date: true, datePattern: ['m', 'y']}} value={order.exp} onChange={(e) => onInputChange(e, 'exp')}/>
                    </div>
                </div>
                <div>
                    <Button label="Confirm" icon="pi pi-check" className="p-button-text" onClick={processOrder} />
                    <Button label="Reset" icon="pi pi-check" className="p-button-text" onClick={resetOrderForm} />
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(NewOrder, comparisonFn);

