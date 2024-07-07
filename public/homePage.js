const logoutButton = new LogoutButton();
logoutButton.action = () => ApiConnector.logout(response => {
    if(response.success) {
        location.reload();
    }
});

ApiConnector.current(response => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoard = new RatesBoard();
function updateRatesBoard() {
    ApiConnector.getStocks(response => {
        if(response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        };
    });
}
updateRatesBoard();
setInterval(updateRatesBoard, 60000);

const moneyManager = new MoneyManager();

function updateMoneyManager(data, message) {
    if(data.success) {
        ProfileWidget.showProfile(data.data);
    } else {
        message = data.error
    }
    moneyManager.setMessage(data.success, message);
}

moneyManager.addMoneyCallback = data => 
    ApiConnector.addMoney({currency: data.currency, amount: data.amount}, response => 
        updateMoneyManager(response, `Успешное пополнение кошелька на сумму ${data.amount} ${data.currency}`));

moneyManager.conversionMoneyCallback = data => 
    ApiConnector.convertMoney({fromCurrency: data.fromCurrency, targetCurrency: data.targetCurrency, fromAmount: data.fromAmount}, response =>
        updateMoneyManager(response, `Конвертация из ${data.fromCurrency} в ${data.targetCurrency} выполнена!`));

moneyManager.sendMoneyCallback = data => 
    ApiConnector.transferMoney({to: data.to, currency: data.currency, amount: data.amount}, response =>
        updateMoneyManager(response, `Перевод ${data.amount} ${data.currency} пользователю с ID ${data.to} выполнен!`));

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites(data => {
    if(data.success) {
        updateUsersTable(data);
    }
});

function updateUsersTable(data) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(data.data);
    moneyManager.updateUsersList(data.data);
} 

function changeFavorites(data, message) {
    if(data.success) {
        updateUsersTable(data);
    } else {
        message = data.error;
    }
    moneyManager.setMessage(data.success, message);
}

favoritesWidget.addUserCallback = data =>
    ApiConnector.addUserToFavorites({id: data.id, name: data.name}, response => 
        changeFavorites(response, `Пользователь с ID ${data.id} добавлен`));

favoritesWidget.removeUserCallback = id =>
    ApiConnector.removeUserFromFavorites(id, response => 
        changeFavorites(response, `Пользователь с ID ${id} удалён`));