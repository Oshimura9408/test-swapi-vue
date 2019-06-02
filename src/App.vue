<template>
  <div id="app">
    <Header/>
    <!-- <router-view></router-view> -->
    <!-- <listSW/> -->
    <test/>
  </div>
</template>

<script>
// import listSW from "./components/listSW.vue";

import test from "./components/test.vue";
import Header from "./components/header.vue";

export default {
  components: {
    // listSW,
    test,
    Header
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
}

a {
  text-decoration: none;
}

#app {
  font-family: "Roboto", sans-serif;
  font-weight: 300;
}
</style>
