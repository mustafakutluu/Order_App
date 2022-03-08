import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const NewOrder = () => {
    let emptyOrder = {
        id: null,
        name: '',
        image: null,
        description: '',
        category: null,
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };

    const [submitted, setSubmitted] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [sum, setSum] = useState(0);
    const [customerName, setCustomerName] = useState(null);
    const [street, setStreet] = useState(null);
    const [city, setCity] = useState(null);
    const [stateInfo, setStateInfo] = useState(null);
    const [zip, setZip] = useState(0);

    const [order, setOrder] = useState(null);

    const onCategoryChange = (e) => {
        let _order = { ...order };
        _order['category'] = e.value;
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
        setOrder(_order);
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <Toast ref={toast} />
                <div className="card">
                    <div className="card">
                        <h5>Product Information</h5>
                        <div className="field">
                            <label htmlFor="product">Product</label>
                            <Dropdown id="product" value={selectedProduct} options={products} onChange={onProductChange} optionLabel="name" placeholder="Select a Product" />
                        </div>
                        <div className="field">
                            <label htmlFor="quantity">Quantity</label>
                            <InputNumber inputId="quantity" value={quantity} onValueChange={(e) => setQuantity(e.value)} mode="decimal" min={0} max={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="price">Price per unit</label>
                            <InputNumber inputId="price" value={price} onValueChange={(e) => setPrice(e.value)} mode="currency" currency="USD" locale="en-US"/>
                        </div>
                        <div className="field">
                            <label htmlFor="discount">Discount</label>
                            <InputNumber inputId="discount" value={discount} onValueChange={(e) => setDiscount(e.value)} mode="decimal" prefix="%"/>
                        </div>
                        <div className="field">
                            <label htmlFor="sum">Total</label>
                            <InputNumber inputId="sum" value={sum} onValueChange={(e) => setSum(e.value)} mode="currency" currency="USD" locale="en-US" disabled={true}/>
                        </div>
                    </div>
                    <div className="card">
                        <h5>Address Information</h5>
                        <div className="field">
                            <label htmlFor="customerName">Customer Name</label>
                            <InputText id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !customerName })} />
                            {submitted && !customerName && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="street">Street</label>
                            <InputText id="street" value={street} onChange={(e) => setStreet(e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !street })} />
                            {submitted && !street && <small className="p-invalid">Street is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="city">City</label>
                            <InputText id="city" value={city} onChange={(e) => setCity(e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !city })} />
                            {submitted && !city && <small className="p-invalid">City is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="state">State</label>
                            <InputText id="state" value={stateInfo} onChange={(e) => setStateInfo(e.target.value)}/>
                        </div>
                        <div className="field">
                            <label htmlFor="zip">Zip</label>
                            <InputNumber inputId="zip" value={zip} onValueChange={(e) => setZip(e.value)} mode="decimal" min={1} max={9999} required autoFocus className={classNames({ 'p-invalid': submitted && !zip })} />
                            {submitted && !zip && <small className="p-invalid">Zip is required.</small>}
                        </div>
                    </div>
                    <div className="card">
                        <h5>Payment Information</h5>
                        <div className="formgrid grid">
                            <div className="field-radiobutton col-4">
                                <RadioButton inputId="visa" name="category" value="Visa" onChange={oncardtypeChange} checked={order.cardtype === 'Visa'} />
                                <label htmlFor="visa">Visa</label>
                            </div>
                            <div className="field-radiobutton col-4">
                                <RadioButton inputId="masterCard" name="category" value="MasterCard" onChange={oncardtypeChange} checked={order.cardtype === 'MasterCard'} />
                                <label htmlFor="masterCard">MasterCard</label>
                            </div>
                            <div className="field-radiobutton col-4">
                                <RadioButton inputId="category3" name="category" value="American Express" onChange={oncardtypeChange} checked={order.cardtype === 'American Express'} />
                                <label htmlFor="category3">American Express</label>
                            </div>
                        </div>
                    </div>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete <b>{product.name}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(NewOrder, comparisonFn);

