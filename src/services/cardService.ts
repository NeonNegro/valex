import * as cardRepository from '../repositories/cardRepository.js'
import * as employeeRepository from '../repositories/employeeRepository.js';
import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';

export async function createCard (apiKey: string, employeeId: number, cardType: cardRepository.TransactionTypes){


    const employee = await getEmployee(employeeId);

    await validateApiKey(apiKey);
    await ensureUniqueCardTypeByEmployee(cardType, employeeId);
    const cardNumber = faker.finance.creditCardNumber('mastercard');
    
    const newCard = fillCardFields(employee, cardNumber, cardType);
    
    cardRepository.insert(newCard);
}

async function ensureUniqueCardTypeByEmployee(cardType: cardRepository.TransactionTypes, employeeId: number){
    const existingCard = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId);
    if(existingCard)
        throw {type: 'conflict', message: 'Employee alread has a card of same type'}
}
function fillCardFields(employee: employeeRepository.Employee, cardNumber: string, cardType: cardRepository.TransactionTypes){

    let cardData  = {} as cardRepository.CardInsertData;
    cardData.employeeId = employee.id;
    cardData.number = cardNumber;
    cardData.cardholderName = formatCardName(employee.fullName);
    cardData.securityCode = createSecurityCode();
    cardData.expirationDate = createCardExpirationDate();
    cardData.isVirtual = false;
    cardData.isBlocked = true;
    cardData.type = cardType;

    return cardData;

}
function createSecurityCode(){
    const cvv = faker.finance.creditCardCVV();
    const cryptrN = new Cryptr('myTotallySecretKey');
    const encriptedCVV = cryptrN.encrypt(cvv);
    
    return encriptedCVV
}
function createCardExpirationDate(){
    const EXPIRATION_PERIOD = 5;
    const EXPIRATION_PERIOD_TYPE = 'y';
    const DATE_FORMAT = 'MM/YY';

    return dayjs().add(EXPIRATION_PERIOD,EXPIRATION_PERIOD_TYPE).format(DATE_FORMAT);
}