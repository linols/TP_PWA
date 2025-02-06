<template>
    <div class="payment-container">
      <button class="back-button" @click="$router.push('/')">🏠 Retour à l'accueil</button>
  
      <h2>💳 Paiement en ligne</h2>
      <p>Payez avec Apple Pay, Google Pay ou une carte bancaire.</p>
  
      <button v-if="supportsApplePay" id="apple-pay-button" @click="payWithApplePay">
        🍏 Payer avec Apple Pay
      </button>
  
      <button v-if="supportsGooglePay" id="google-pay-button" @click="payWithGooglePay">
        🏦 Payer avec Google Pay
      </button>
  
      <p v-if="paymentStatus" class="status">{{ paymentStatus }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  
  // État des boutons
  const supportsApplePay = ref(false);
  const supportsGooglePay = ref(false);
  const paymentStatus = ref<string | null>(null);
  
  // Méthodes de paiement
  const applePayMethod = {
    supportedMethods: "https://apple.com/apple-pay",
    data: {
      version: 3,
      merchantIdentifier: "merchant.example", // ⚠️ Remplace avec ton ID Apple Pay
      merchantCapabilities: ["supports3DS"],
      supportedNetworks: ["visa", "mastercard", "amex"],
      countryCode: "US",
    },
  };
  
  const googlePayMethod = {
    supportedMethods: "https://google.com/pay",
    data: {
      environment: "TEST", // ⚠️ Mettre "PRODUCTION" en live
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
            allowedCardNetworks: ["VISA", "MASTERCARD"],
          },
          tokenizationSpecification: {
            type: "PAYMENT_GATEWAY",
            parameters: {
              gateway: "example", // ⚠️ Remplace avec ton gateway réel (ex: stripe)
              gatewayMerchantId: "exampleMerchantId",
            },
          },
        },
      ],
      merchantInfo: {
        merchantId: "BCR2DN6TNN2X5", // ⚠️ Remplace avec ton vrai merchantId Google Pay
        merchantName: "My Vue App",
      },
      transactionInfo: {
        totalPriceStatus: "FINAL",
        totalPrice: "0.01",
        currencyCode: "USD",
      },
    },
  };
  
  // Vérifier la compatibilité des paiements
  onMounted(() => {
    if (window.PaymentRequest) {
      const applePayRequest = new PaymentRequest([applePayMethod], {
        total: { label: "Total", amount: { currency: "USD", value: "0.01" } },
      });
  
      applePayRequest.canMakePayment().then((result) => {
        supportsApplePay.value = !!result;
      });
  
      const googlePayRequest = new PaymentRequest([googlePayMethod], {
        total: { label: "Total", amount: { currency: "USD", value: "0.01" } },
      });
  
      googlePayRequest.canMakePayment().then((result) => {
        supportsGooglePay.value = !!result;
      });
    }
  });
  
  // Paiement avec Apple Pay
  const payWithApplePay = async () => {
    try {
      const request = new PaymentRequest([applePayMethod], {
        total: { label: "Total", amount: { currency: "USD", value: "0.01" } },
      });
  
      const response = await request.show();
      await response.complete("success");
      paymentStatus.value = "✅ Paiement Apple Pay réussi !";
    } catch (error) {
      paymentStatus.value = "❌ Paiement annulé.";
      console.error(error);
    }
  };
  
  // Paiement avec Google Pay
  const payWithGooglePay = async () => {
    try {
      const request = new PaymentRequest([googlePayMethod], {
        total: { label: "Total", amount: { currency: "USD", value: "0.01" } },
      });
  
      const response = await request.show();
      await response.complete("success");
      paymentStatus.value = "✅ Paiement Google Pay réussi !";
    } catch (error) {
      paymentStatus.value = "❌ Paiement annulé.";
      console.error(error);
    }
  };
  </script>
  
  <style scoped>
  .payment-container {
    text-align: center;
    margin-top: 20px;
  }
  
  button {
    padding: 12px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  #apple-pay-button {
    background-color: black;
  }
  
  #apple-pay-button:hover {
    background-color: darkgray;
  }
  
  #google-pay-button {
    background-color: #34a853;
  }
  
  #google-pay-button:hover {
    background-color: #2c8a40;
  }
  
  .status {
    margin-top: 15px;
    font-weight: bold;
  }
  
  .back-button {
    display: block;
    margin: 10px auto;
    background-color: #42b883;
  }
  
  .back-button:hover {
    background-color: #368a6e;
  }
  </style>
  