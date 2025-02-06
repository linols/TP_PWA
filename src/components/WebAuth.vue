    <template>
        <div class="auth-container">
        <button class="back-button" @click="$router.push('/')">🏠 Retour à l'accueil</button>
    
        <h2>🔐 Authentification WebAuthn</h2>
        <p>Cliquez sur le bouton ci-dessous pour vous authentifier via Face ID, empreinte digitale ou Windows Hello.</p>
    
        <button @click="authenticateUser">🔓 S'authentifier</button>
    
        <p v-if="authStatus" class="status">{{ authStatus }}</p>
        </div>
    </template>
    
    <script setup lang="ts">
    import { ref } from "vue";
    
    const authStatus = ref<string | null>(null);
    

    const generateChallenge = (length = 32) => {
        const challenge = new Uint8Array(length);
        window.crypto.getRandomValues(challenge);
        return challenge;
    };
    

    const authenticateUser = async () => {
  try {
    if (!window.PublicKeyCredential) {
      authStatus.value = "⚠️ WebAuthn n'est pas supporté sur cet appareil.";
      return;
    }

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge: generateChallenge(),
      timeout: 60000,
      rpId: window.location.hostname,
      userVerification: "required",
      allowCredentials: []
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
      mediation: "required"
    });

    if (assertion) {
      authStatus.value = "✅ Authentification réussie avec biométrie ou mot de passe !";
      console.log("Assertion reçue :", assertion);
    } else {
      authStatus.value = "❌ Aucune méthode d'authentification disponible.";
    }
  } catch (error) {
    authStatus.value = "⚠️ Erreur : ";
    console.error(error);
  }
};





    </script>
    
    <style scoped>
    .auth-container {
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
    