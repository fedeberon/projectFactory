import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { processPayment } from '../services/mercadopagoService.js';

const FormBuyProject = ({ projectId }) => {
    const router = useRouter();
    const { id } = router.query;
    const [project, setProject] = useState({});
    const [professional, setProfessional] = useState({});
    const [session, loading] = useSession();

    const guessPaymentMethod = () => {
        let cardnumber = document.getElementById("cardNumber").value;
        if (cardnumber.length >= 6) {
            let bin = cardnumber.substring(0,6);
            window.Mercadopago.getPaymentMethod({
                "bin": bin
            }, setPaymentMethod);
        }
    };

    const setPaymentMethod = (status, response) => {
        if (status == 200) {
            let paymentMethod = response[0];
            document.getElementById('paymentMethodId').value = paymentMethod.id;

            getIssuers(paymentMethod.id);
        } else {
            alert(`payment method info error: ${response}`);
        }
    };

    const getIssuers = (paymentMethodId) => {
        window.Mercadopago.getIssuers(
            paymentMethodId,
            setIssuers
        );
    };

    const setIssuers = (status, response) => {
        if (status == 200) {
            let issuerSelect = document.getElementById('issuer');
            response.forEach( issuer => {
                let opt = document.createElement('option');
                opt.text = issuer.name;
                opt.value = issuer.id;
                issuerSelect.appendChild(opt);
            });
        
            getInstallments(
                document.getElementById('paymentMethodId').value,
                document.getElementById('transactionAmount').value,
                issuerSelect.value
            );
        } else {
            alert(`issuers method info error: ${response}`);
        }
    };

    const getInstallments = (paymentMethodId, transactionAmount, issuerId) => {
        window.Mercadopago.getInstallments({
            "payment_method_id": paymentMethodId,
            "amount": parseFloat(transactionAmount),
            "issuer_id": parseInt(issuerId)
        }, setInstallments);
    };

    const setInstallments = (status, response) => {
        if (status == 200) {
            document.getElementById('installments').options.length = 0;
            response[0].payer_costs.forEach( payerCost => {
                let opt = document.createElement('option');
                opt.text = payerCost.recommended_message;
                opt.value = payerCost.installments;
                document.getElementById('installments').appendChild(opt);
            });
        } else {
            alert(`installments method info error: ${response}`);
        }
    }

    let doSubmit = false;
    const getCardToken = (event) => {
        event.preventDefault();
        if(!doSubmit){
            let $form = document.getElementById('paymentForm');
            window.Mercadopago.createToken($form, setCardTokenAndPay);
            return false;
        }
    }

    const setCardTokenAndPay = (status, response) => {
        if (status == 200 || status == 201) {
            let form = document.getElementById('paymentForm');
            let card = document.createElement('input');
            card.setAttribute('name', 'token');
            card.setAttribute('type', 'hidden');
            card.setAttribute('value', response.id);
            form.appendChild(card);
            doSubmit=true;
            sendPay(response.id);
        } else {
            alert("Verify filled data!\n"+JSON.stringify(response, null, 4));
        }
    };

    const sendPay = async (token) => {
        const transactionAmount = document.querySelector("#transactionAmount").value;
        const description = document.querySelector("#description").value;
        const installments = document.querySelector("#installments").value;
        const paymentMethodId = document.querySelector("#paymentMethodId").value;
        const docType = document.querySelector("#docType").value;
        const docNumber = document.querySelector("#docNumber").value;
        const email = document.querySelector("#email").value;
    
        const payment = {
            "transactionAmount" : transactionAmount,
            "token": token,
            "description" : description,
            "installments" : installments,
            "paymentMethodId" : paymentMethodId,
            "docType" : docType,
            "docNumber" : docNumber,
            "email" : email,
            "projectId" : projectId
        }

        const response = await processPayment(payment,session.accessToken);
        
        if (response.status == "approved") {
            document.querySelector("#successful").hidden = false;
        } else {
            document.querySelector("#error").hidden = false;
        }
    }
    
    return(
        <>
            <form action="http://localhost:8082/project-factory/api/v1/mercadopago/process_payment" method="post" id="paymentForm">
                <h3>Detalles del comprador</h3>
                <p>Use this card number for test payment: 5031-7557-3453-0604</p>
                <div>
                    <div>
                        <label htmlFor="email">E-mail</label>
                        <input id="email" name="email" type="text" defaultValue="test@test.com"/>
                    </div>
                    <div>
                        <label htmlFor="docType">Tipo de documento</label>
                        <select id="docType" name="docType" data-checkout="docType" type="text"></select>
                    </div>
                    <div>
                        <label htmlFor="docNumber">Número de documento</label>
                        <input id="docNumber" defaultValue="41999064" name="docNumber" data-checkout="docNumber" type="text"/>
                    </div>
                </div>
                <h3>Detalles de la tarjeta</h3>
                <div>
                    <div>
                        <label htmlFor="cardholderName">Titular de la tarjeta</label>
                        <input id="cardholderName" defaultValue="Tomas Arras" data-checkout="cardholderName" type="text"></input>
                    </div>
                    <div>
                        <label htmlFor="">Fecha de vencimiento</label>
                        <div>
                            <input type="text" defaultValue="11" placeholder="MM" id="cardExpirationMonth" data-checkout="cardExpirationMonth"
                            autoComplete="off"></input>
                            <span className="date-separator">/</span>
                            <input type="text" defaultValue="25" placeholder="YY" id="cardExpirationYear" data-checkout="cardExpirationYear" 
                            autoComplete="off"></input>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="cardNumber">Número de la tarjeta</label>
                        <input type="text" id="cardNumber" data-checkout="cardNumber" onChange={guessPaymentMethod} autoComplete="off"></input>
                    </div>
                    <div>
                        <label htmlFor="securityCode">Código de seguridad</label>
                        <input id="securityCode" defaultValue="123" data-checkout="securityCode" type="text"
                         autoComplete="off"></input>
                    </div>
                    <div id="issuerInput">
                        <label htmlFor="issuer">Banco emisor</label>
                        <select id="issuer" name="issuer" data-checkout="issuer"></select>
                    </div>
                    <div>
                        <label htmlFor="installments">Cuotas</label>
                        <select type="text" id="installments" name="installments"></select>
                    </div>
                    <div>
                        <input type="hidden" name="transactionAmount" id="transactionAmount" defaultValue="100"></input>
                        <input type="hidden" name="paymentMethodId" id="paymentMethodId"></input>
                        <input type="hidden" name="description" id="description"></input>
                        <br></br>
                        <button type="submit" id="btn-buy-project" onClick={getCardToken}>Buy project</button>
                        <br></br>
                        <span hidden id="successful" style={{color: "green"}}>You have purchased this project</span>
                        <span hidden id="error" style={{color: "red"}}>Error</span>
                    </div>
                </div>
            </form>
            <script src="https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js"></script>

        </>
    );
};

export default FormBuyProject;