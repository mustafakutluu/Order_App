import axios from 'axios';

export class ProductService {

    getProductsCatalog() {
        return axios.get('assets/demo/data/products-catalog.json').then(res => res.data.data);
    }

    getProducts() {
        return axios.get('assets/demo/data/orders.json').then(res => res.data.data);
    }
}
