<template>
  <footer class="footer">
    <span class="footer-title">© store.app</span>
  </footer>
</template>

<script>

export default {
  name: 'Footer',
}
</script>

<style lang="scss" scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  background: $white;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%), 0 -1px 1px rgb(0 0 0 / 10%);
  z-index: 1;
  &-title {
    color: $purple;
  }
}
</style>
