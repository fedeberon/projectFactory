import API from "./api";

export const processPayment = async (payment,token) => {
  API.defaults.headers.common["Authorization"] = token;
  return await API.post(`/mercadopago/process_payment`,payment);
};

export const getTokenAndPay = async (status, response, elements) => {
  if (status == 200 || status == 201) {
      const payment = Object.assign({}, elements, { "token" : response.id })
      const processPaymentResponse = await processPayment(payment,elements.accessToken);
      
      if (processPaymentResponse.status == "approved") {
          document.querySelector("#successful").hidden = false;
      } else {
          document.querySelector("#error").hidden = false;
      }
  } else {
      alert("Verify filled data!\n"+JSON.stringify(response, null, 4));
  }
};

export const completeElements = (elements) => {
  const cardNumber = elements.cardNumber.value;
  if (cardNumber.length >= 6) {
      let bin = cardNumber.substring(0,6);
      window.Mercadopago.getPaymentMethod({
          "bin": bin
      }, (status,response) => setPaymentMethod(status,response, elements));
  }
};

const setPaymentMethod = (status, response, elements) => {
  if (status == 200) {
      const paymentMethod = response[0];
      elements.paymentMethodId.value = paymentMethod.id;

      getIssuers(paymentMethod.id, elements);
  } else {
      alert(`payment method info error: ${response}`);
  }
};

const getIssuers = (paymentMethodId, elements) => {
  window.Mercadopago.getIssuers(
      paymentMethodId,
      (status, response) => setIssuers(status, response, elements)
  );
};


const setIssuers = (status, response, elements) => {
  if (status == 200) {
      const issuerSelect = elements.issuerSelect;
      response.forEach( issuer => {
          const opt = document.createElement('option');
          opt.text = issuer.name;
          opt.value = issuer.id;
          issuerSelect.appendChild(opt);
      });
  
      getInstallments(elements);
  } else {
      alert(`issuers method info error: ${response}`);
  }
};

const getInstallments = (elements) => {
  window.Mercadopago.getInstallments({
      "payment_method_id": elements.paymentMethodId.value,
      "amount": parseFloat(elements.transactionAmount.value),
      "issuer_id": parseInt(elements.issuerSelect.value)
  }, (status, response) => setInstallments(status, response, elements));
};

const setInstallments = (status, response, elements) => {
  if (status == 200) {
      elements.installments.options.length = 0;
      response[0].payer_costs.forEach( payerCost => {
          let opt = document.createElement('option');
          opt.text = payerCost.recommended_message;
          opt.value = payerCost.installments;
          elements.installments.appendChild(opt);
      });
  } else {
      alert(`installments method info error: ${response}`);
  }
}