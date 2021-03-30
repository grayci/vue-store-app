<template>
  <div id="app">
    <Header />
    <ProductsList />
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ProductsList from '@/views/ProductsList.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    ProductsList
  },
}
</script>

<style lang="scss">
body {
  margin: 0;
  font-family: $font-family;
}

button {
  cursor: pointer;
  font-family: $details-font-family;
  font-weight: 600;
  text-transform: uppercase;
  color: $white;
  border: 0;
  background: $purple;
  padding: 15px 50px;
}
</style>