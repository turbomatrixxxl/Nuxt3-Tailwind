<template>
  <div>
    <NuxtRouteAnnouncer />

    <div class="container">
      <!-- Left container -->
      <div
        class="list"
        aria-label="Initial container"
        role="region"
        @dragover.prevent
        @drop="onDropLeft">
        <h2>Items</h2>

        <div
          v-for="item in items"
          :key="item"
          class="item"
          draggable="true"
          :data-name="item"
          @dragstart="onDragStart(item, 'left')">
          {{ item }}
        </div>
      </div>

      <!-- Right container (cart) -->
      <div
        class="cart"
        aria-label="Shopping cart"
        role="region"
        @dragover.prevent
        @drop="onDropRight">
        <strong>Shopping Cart</strong>

        <ul>
          <li
            class="item"
            draggable="true"
            :data-name="item"
            @dragstart="onDragStart(item, 'right')"
            v-for="(item, index) in cartItems"
            :key="index">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// State
const items = ref(["🍎 Apple", "🍌 Banana", "🍊 Orange"]);
const cartItems = ref([]);

const dragItem = ref(null);
const dragFrom = ref(null);

// When drag starts, save the item and where it comes from
const onDragStart = (item, from) => {
  dragItem.value = item;
  dragFrom.value = from; // 'left' or 'right'
};

// Drop on left container (back from cart)
const onDropLeft = () => {
  if (dragItem.value && dragFrom.value === "right") {
    const index = cartItems.value.indexOf(dragItem.value);
    if (index > -1) cartItems.value.splice(index, 1);
    items.value.push(dragItem.value);
  }
  resetDrag();
};

// Drop on right container (add to cart)
const onDropRight = () => {
  if (dragItem.value && dragFrom.value === "left") {
    const index = items.value.indexOf(dragItem.value);
    if (index > -1) items.value.splice(index, 1);
    cartItems.value.push(dragItem.value);
  }
  resetDrag();
};

const resetDrag = () => {
  dragItem.value = null;
  dragFrom.value = null;
};
</script>

<style scoped>
.container {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.list,
.cart {
  padding: 1rem;
  border: 2px dashed #aaa;
  width: 200px;
  min-height: 200px;
}

.item {
  padding: 0.5rem;
  margin: 0.5rem 0;
  background-color: #f0f0f0;
  cursor: grab;
}
</style>
