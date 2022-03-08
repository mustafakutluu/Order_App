import React, {useState, useEffect} from 'react';
import { ProductService } from '../service/ProductService';
import {Column} from "primereact/column";
import { DataTable } from 'primereact/datatable';
const Catalog = () => {

    const [catalog, setCatalog] = useState(null);

    useEffect(() => {
        const productService = new ProductService();
        productService.getProductsCatalog().then(data => setCatalog(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    }

    const discountBodyTemplate = (rowData) => {
        return "%"+rowData.discount;
    }

    return (
        <div className="col-4">
            <div className="card">
                <DataTable value={catalog} responsiveLayout="scroll" emptyMessage="No products found.">
                    <Column field="name" header="Name" headerStyle={{ width: '5%', minWidth: '10rem' }}></Column>
                    <Column field="price" header="Price" headerStyle={{ width: '5%', minWidth: '10rem' }} body={priceBodyTemplate}></Column>
                    <Column field="discount" header="Discount" headerStyle={{ width: '5%', minWidth: '10rem' }} body={discountBodyTemplate}></Column>
                </DataTable>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Catalog, comparisonFn);
