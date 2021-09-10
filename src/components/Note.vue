<template>
  <div class="column">
    <h1 :style="{'color':course.color}" style="user-select: none; font-size: 24px">{{ note.name }} <b
        style="font-size: 20px">({{
        (note.coeff * 100).toFixed(0)
      }}%)</b>
    </h1>
    <button v-if="note.multiple" class="input custom-button" @click="openDialog">
      <p class="custom-button">{{localNote.toFixed(2)}}</p>
    </button>
    <vue-numeric v-else class="input" v-bind:precision="2"
                 v-model.lazy="userNote"
                 v-bind:min="0"
                 v-bind:max="20"
    ></vue-numeric>
  </div>
</template>

<script>
import VueNumeric from 'vue-numeric'
import {mapGetters} from "vuex";
import MultipleNote from "./MultipleNote";

export default {
  name: "Note",
  components: {
    VueNumeric
  },

  props: {
    course: {},
    note: {},
  },

  data() {
    return {
      localNote: -1
    }
  },

  computed: {
    ...mapGetters(['getNote']),
    userNote: {
      get() {
        return this.localNote
      },
      set(value) {
        this.localNote = value
        this.$store.dispatch('setNote', {
          note: {
            id: this.note.id,
            value: value
          },
          courseId: this.course.id
        })
        this.$emit("update-avg")
      }
    },
  },

  methods: {
    openDialog() {
      this.$buefy.modal.open({
        parent: this,
        component: MultipleNote,
        hasModalCard: true,
        trapFocus: true,
        props: {
          note: this.note
        }
      })
    }
  },

  beforeMount() {
    this.localNote = this.getNote(this.course.id, this.note.id)
  },
}
</script>

<style scoped>
input[type="tel"] {
  font-size: 20px;
  text-align: center;
  font-family: Karla, sans-serif;
}

.custom-button {
  font-size: 20px;
  text-align: center;
  font-family: Karla, sans-serif;
  vertical-align:middle;
  margin: auto;
  cursor: pointer;
}
</style>