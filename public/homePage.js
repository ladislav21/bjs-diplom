const logoutButton = new LogoutButton();
logoutButton.action = () => ApiConnector.logout(response => {
    if(response.success) {
        location.reload()
    }
});

ApiConnector.current(response => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoard = new RatesBoard();
//let nowTime = new Date();
function updateRatesBoard() {
    ApiConnector.getStocks(response => {
        if(response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
            // let newTime = new Date();
            // console.log("Успешно обновлено", newTime - nowTime);
            // nowTime = new Date();
        };
    });
}
updateRatesBoard();
setInterval(updateRatesBoard, 60000);

const moneyManager = new MoneyManager();

function moneyManagerChecker(data, message) {
    if(data.success) {
        ProfileWidget.showProfile(data.data);
        moneyManager.setMessage(true, message);
    } else {
        moneyManager.setMessage(false, data.error);
    }
}

moneyManager.addMoneyCallback = data => 
    ApiConnector.addMoney({currency: data.currency, amount: data.amount}, response => 
    moneyManagerChecker(response, `Успешное пополнение кошелька на сумму ${data.amount} ${data.currency}`));

moneyManager.conversionMoneyCallback = data => 
    ApiConnector.convertMoney({fromCurrency: data.fromCurrency, targetCurrency: data.targetCurrency, fromAmount: data.fromAmount}, response => 
    moneyManagerChecker(response, `Конвертация из ${data.fromCurrency} в ${data.targetCurrency} выполнена!`));

// Требуется проверка... 
moneyManager.sendMoneyCallback = data => 
    ApiConnector.transferMoney({to: data.to, currency: data.currency, amount: data.amount}, response => 
    moneyManagerChecker(response, 'Перевод успешно выполнен!'));