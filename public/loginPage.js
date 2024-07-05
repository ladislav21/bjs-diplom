"use strict"

const userForm = new UserForm();

function checkerLoginPass(data) {
    data.success ? location.reload() : alert(data.error);
}

userForm.loginFormCallback = data => ApiConnector.login({login: data.login, password: data.password}, response => checkerLoginPass(response));
userForm.registerFormCallback = data => ApiConnector.register({login: data.login, password: data.password}, response => checkerLoginPass(response));