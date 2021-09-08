<template>
  <div class="column">
    <p>Nom: {{note.name}}</p>
    <p>Coeff: {{note.coeff}}</p>
    <input class="input" type="number" name="note"/>
  </div>
</template>

<script>
export default {
  name: "Note",
  props: {
    note: {}
  }
}
</script>

<style scoped>

</style>