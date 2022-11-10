<template>
  <LayoutDefault>
    <hello-world />
  </LayoutDefault>
</template>

<script>
import LayoutDefault from "@/layouts/default"
import HelloWorld from "../../components/HelloWorld.vue";

export default {
  name: "ViewHome",
  components: {
    HelloWorld,
    LayoutDefault
  },
};
</script>
