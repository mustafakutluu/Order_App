import React, {useState, useEffect, useRef} from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {InputText} from "primereact/inputtext";
import {Toast} from "primereact/toast";
import {Toolbar} from "primereact/toolbar";
import {Dialog} from "primereact/dialog";
import { useHistory } from 'react-router-dom';

const Dashboard = (props) => {

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

    const [orders, setOrders] = useState(null);
    const [lineOptions, setLineOptions] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [deleteOrdersDialog, setDeleteOrdersDialog] = useState(false);
    const [order, setOrder] = useState(emptyOrder);
    const [selectedOrders, setSelectedOrders] = useState(null);
    const toast = useRef(null);
    const history = useHistory();

    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
            }
        };

        setLineOptions(lineOptions)
    }

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
            }
        };

        setLineOptions(lineOptions)
    }

    useEffect(() => {
        setOrders(JSON.parse(sessionStorage.getItem("orders")));
    }, []);

    useEffect(() => {
        if (props.colorMode === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [props.colorMode]);

    const editOrder = (order) => {
        history.push({pathname:'/new_order', state:{selectedOrder: order}});
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Orders</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const confirmDeleteSelected = () => {
        setDeleteOrdersDialog(true);
    }

    const deleteSelectedOrders = () => {
        let _orders = orders.filter(val => !selectedOrders.includes(val));
        sessionStorage.setItem("orders",JSON.stringify(_orders));
        setOrders(_orders);
        setDeleteOrdersDialog(false);
        setSelectedOrders(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Orders Deleted', life: 3000 });
    }

    const hideDeleteOrdersDialog = () => {
        setDeleteOrdersDialog(false);
    }

    const deleteOrdersDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteOrdersDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedOrders} />
        </>
    );

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedOrders || !selectedOrders.length} />
                </div>
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editOrder(rowData)} />
            </div>
        );
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                    <DataTable value={orders} rows={10} paginator responsiveLayout="scroll"
                               selection={selectedOrders} onSelectionChange={(e) => setSelectedOrders(e.value)}
                               dataKey="id" rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                               globalFilter={globalFilter} emptyMessage="No orders found." header={header}>
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                        <Column field="name" header="Name" sortable headerStyle={{ width: '10%', minWidth: '10rem' }}></Column>
                        <Column field="product" header="Product" sortable headerStyle={{ width: '8%', minWidth: '4rem' }}></Column>
                        <Column field="quantity" header="#" sortable headerStyle={{ width: '1%', minWidth: '1rem' }}></Column>
                        <Column field="price" header="price" sortable headerStyle={{ width: '1%', minWidth: '1rem' }}></Column>
                        <Column field="date" header="Date" sortable headerStyle={{ width: '8%', minWidth: '6rem' }}></Column>
                        <Column field="street" header="Street" sortable headerStyle={{ width: '10%', minWidth: '10rem' }}></Column>
                        <Column field="city" header="City" sortable headerStyle={{ width: '10%', minWidth: '10rem' }}></Column>
                        <Column field="state" header="State" sortable headerStyle={{ width: '10%', minWidth: '8rem' }}></Column>
                        <Column field="zip" header="Zip" sortable headerStyle={{ width: '10%', minWidth: '6rem' }}></Column>
                        <Column field="cardtype" header="Card" sortable headerStyle={{ width: '10%', minWidth: '10rem' }}></Column>
                        <Column field="cardnumber" header="Card Number" sortable headerStyle={{ width: '10%', minWidth: '10rem' }}></Column>
                        <Column field="exp" header="Exp" sortable headerStyle={{ width: '10%', minWidth: '6rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={deleteOrdersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteOrdersDialogFooter} onHide={hideDeleteOrdersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {order && <span>Are you sure you want to delete the selected orders?</span>}
                        </div>
                    </Dialog>

                </div>

            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(Dashboard, comparisonFn);
