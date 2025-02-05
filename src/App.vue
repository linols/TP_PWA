<script setup lang="ts">
</script>

<template>
  <div>
    <h1>Mon Application Vue PWAA</h1>
    <router-view />
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}

nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

router-link {
  text-decoration: none;
  font-size: 18px;
  color: #007bff;
}

router-link:hover {
  text-decoration: underline;
}
</style>
