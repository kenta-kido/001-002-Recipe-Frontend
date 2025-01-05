<template>
  <div class="flex justify-center items-center">
    <img
      class="max-w-full max-h-64 rounded-lg shadow-md"
      :src="'data:image/png;base64,' + photo"
      alt="Step Image"
    />
  </div>
</template>

<script>
export default {
  name: "PhotoViewer",
  props: {
    photo: {
      type: String,
      required: true,
    },
  },
};
</script>
