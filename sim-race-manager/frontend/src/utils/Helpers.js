



export function dollarToCent(amount){
    let newAmount = amount * 100
    return newAmount
}


export function centToDollar(amount){
    let newAmount = amount / 100
    return newAmount
}

export function getTotalPriceInCents(customer){

    if (customer['suscriptionType'] === 'Monthly'){
        return dollarToCent(customer['monthPrice'])
    }
    else{
        return dollarToCent(customer['annualPrice'])
    }
}

