import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

const Login = ({setAuthenticated}) => {

    const [userName, setUserName] = useState(null);
    const [password, setPassword] = useState(null);
    const history = useHistory();
    const toast = useRef(null);

    const confirmLogin = () => {

        if(process.env.REACT_APP_USERNAME === userName && process.env.REACT_APP_PASSWORD === password) {
            sessionStorage.setItem("loginStatus","true");
            setAuthenticated(true);
            history.push('/');
        }else {
            setAuthenticated(false);
            toast.current.show({severity:'error', summary: 'Wrong username/password!', life: 3000});
        }
    }

    return (
        <div>
            <Toast ref={toast} position="top-right"/>
            <div className="align-items-center flex justify-content-center lg:px-8 md:px-6 px-4 py-8 surface-ground ng-star-inserted">
                <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
                    <div className="text-center mb-5">
                        <img src="images/pages/icon-devices.svg" alt="hyper" height="50" className="mb-3"/>
                        <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                    </div>

                    <div>
                        <label htmlFor="email1" className="block text-900 font-medium mb-2">Username</label>
                        <InputText id="email1" type="text" className="w-full mb-3" onChange={e => setUserName(e.target.value)} />

                        <label htmlFor="password1" className="block text-900 font-medium mb-2">Password</label>
                        <InputText id="password1" type="password" className="w-full mb-3" onChange={e => setPassword(e.target.value)}/>

                        <Button label="Sign In" icon="pi pi-user" className="w-full" onClick={confirmLogin}/>
                    </div>
                    <div className="text-center py-3">
                        <label className="block text-900 font-medium mb-2">Username: Tester / Password: test</label>
                    </div>
                </div>
            </div>
        </div>
    );
}

Login.propTypes = {setAuthenticated: PropTypes.func.isRequired}


export default React.memo(Login);
