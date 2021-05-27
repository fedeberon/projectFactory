import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSession } from "next-auth/client";
import * as mercadopagoService from '../services/mercadopagoService.js';

const FormBuyProject = ({ projectId }) => {
    const [session, loading] = useSession();

    useEffect(() => {
        if (window.Mercadopago) {
            window.Mercadopago.setPublishableKey(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY);
            window.Mercadopago.getIdentificationTypes();
        }
    }, []);

    const onChangeCardNumber = () => {
        const cardNumber = document.getElementById("cardNumber");
        const paymentMethodId = document.getElementById('paymentMethodId');
        const issuerSelect = document.getElementById('issuer');
        const transactionAmount = document.getElementById('transactionAmount');
        const installments = document.getElementById('installments');
        const elements = {
            cardNumber,
            paymentMethodId,
            issuerSelect,
            transactionAmount,
            installments,
        }
        mercadopagoService.completeElements(elements);
    };

    let doSubmit = false;
    const onClickBuyProject = (event) => {
        event.preventDefault();
        if(!doSubmit){
            const transactionAmount = document.querySelector("#transactionAmount").value;
            const description = document.querySelector("#description").value;
            const installments = document.querySelector("#installments").value;
            const paymentMethodId = document.querySelector("#paymentMethodId").value;
            const docType = document.querySelector("#docType").value;
            const docNumber = document.querySelector("#docNumber").value;
            const email = document.querySelector("#email").value;
            const $form = document.getElementById('paymentForm');

            const elements = {
                transactionAmount,
                description,
                installments,
                paymentMethodId,
                docType,
                docNumber,
                email,
                projectId,
                "accessToken": session.accessToken,
            };

            const pay = (status, response) => mercadopagoService.getTokenAndPay(status, response, elements);
            window.Mercadopago.createToken($form, pay);
            doSubmit = false;
            return false;
        }
    };

    


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
                        <input type="text" id="cardNumber" data-checkout="cardNumber" onChange={onChangeCardNumber} autoComplete="off"></input>
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
                        <button type="submit" id="btn-buy-project" onClick={onClickBuyProject}>Buy project</button>
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