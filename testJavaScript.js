function reverse(string) {
  let reversed = ""; // Initialize an empty string to hold the reversed version

  for (let index = string.length - 1; index >= 0; index--) {
    reversed += string[index]; // Append each character from the end
  }

  return reversed;
}

function evenOdd(number) {
  if (number % 2 === 0) {
    return "Even";
  } else {
    return "Odd";
  }
}

function maximum(array) {
  const max = Math.max(...array);

  return max;
}

function maximum2(array) {
  const max = array.reduce((max, current) => (max > current ? max : current));
  console.log(max);

  return max;
}

function vowels(string) {
  const vowelsBase = ["a", "e", "i", "o", "u"];
  const vowelsArray = string
    .split("")
    .filter((vowel) => vowelsBase.includes(vowel.toLowerCase()));

  return vowelsArray.length;
}

function vowels2(string) {
  let counter = 0;
  const vowels = "aeiou";

  for (const vowel of string.toLowerCase()) {
    if (vowels.includes(vowel)) {
      counter++;
    }
  }

  return counter;
}

function arraySum(array) {
  const sum = array.reduce((acc, current) => {
    return acc + current;
  }, 0);

  return sum;
}

function arraySum2(array) {
  let sum = 0;

  for (let index = 0; index < array.length; index++) {
    sum += array[index];
  }

  return sum;
}

function palindromeCheck(string) {
  let reversed = "";
  for (let index = string.length - 1; index >= 0; index--) {
    reversed += string[index];
  }

  return string.toLowerCase() === reversed.toLowerCase();
}

function firstSingleCharIndex(string) {
  for (let index = 0; index < string.length; index++) {
    const char = string[index];
    if (string.indexOf(char) === string.lastIndexOf(char)) {
      return index;
    }
  }
  return null;
}

function debounce(callback, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

// Example usage:
const log = debounce(() => console.log("Hello"), 1000);

log(); // Nothing happens immediately
log(); // Timer resets
log(); // Timer resets again
// After 1 second from the last call, 'Hello' is logged

function deepClone(obj, visited = new WeakMap()) {
  // Handle null or non-object types
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // Handle circular references
  if (visited.has(obj)) {
    return visited.get(obj);
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle Map
  if (obj instanceof Map) {
    const clone = new Map();
    visited.set(obj, clone);
    obj.forEach((value, key) => {
      clone.set(key, deepClone(value, visited));
    });
    return clone;
  }

  // Handle Set
  if (obj instanceof Set) {
    const clone = new Set();
    visited.set(obj, clone);
    obj.forEach((value) => {
      clone.add(deepClone(value, visited));
    });
    return clone;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const clone = [];
    visited.set(obj, clone);
    obj.forEach((item, index) => {
      clone[index] = deepClone(item, visited);
    });
    return clone;
  }

  // Handle objects
  const clone = Object.create(Object.getPrototypeOf(obj));
  visited.set(obj, clone);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key], visited);
    }
  }

  return clone;
}

// Example usage:
const original = {
  name: "John",
  details: { age: 30, city: "New York" },
  hobbies: ["reading", { type: "sports", name: "tennis" }],
  date: new Date(),
  regex: /abc/gi,
  map: new Map([
    ["key1", "value1"],
    ["key2", { nested: "object" }],
  ]),
  set: new Set([1, 2, 3]),
};

const clone = deepClone(original);
clone.details.age = 31;
clone.map.set("key2", { nested: "modified" });

console.log(original.details.age); // 30 (original unchanged)
console.log(original.map.get("key2")); // { nested: "object" }
console.log(clone.map.get("key2")); // { nested: "modified" }

function composeAsync(arrayOfFunctions) {
  return async function (initialValue) {
    let result = initialValue;

    for (const fun of arrayOfFunctions) {
      result = await fun(result);
    }

    return result;
  };
}

export default function memoizeAsync(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (!cache.has(key)) {
      const promise = fn(...args)
        .then((result) => {
          cache.set(key, Promise.resolve(result)); // Ensure resolved Promise is stored
          return result;
        })
        .catch((err) => {
          cache.delete(key); // Optional: remove failed calls so they can be retried
          throw err;
        });

      cache.set(key, promise);
    }

    return cache.get(key);
  };
}

const fetchData = async (id) => {
  console.log("Fetching", id);
  return new Promise((resolve) => setTimeout(() => resolve(id * 2), 1000));
};

const memoizedFetch = memoizeAsync(fetchData);

memoizedFetch(10).then(console.log); // logs "Fetching 10", then 20
memoizedFetch(10).then(console.log); // immediately logs 20 (cached)

function promiseAllSettled(promises) {
  return Promise.all(
    promises.map((pr) => {
      return Promise.resolve(pr)
        .then((value) => ({
          status: "fullfiled",
          value,
        }))
        .catch((reason) => ({
          status: "rejected",
          reason,
        }));
    })
  );
}

// function promiseAllSettled(promises) {
//   return Promise.all(
//     promises.map(p =>
//       Promise.resolve(p)
//         .then(value => ({
//           status: "fulfilled",
//           value
//         }))
//         .catch(reason => ({
//           status: "rejected",
//           reason
//         }))
//     )
//   );
// }

const p1 = Promise.resolve(1);
const p2 = Promise.reject("error");
const p3 = new Promise((resolve) => setTimeout(() => resolve(3), 100));

promiseAllSettled([p1, p2, p3]).then((results) => {
  console.log(results);
}); /* 
 [
  { status: 'fulfilled', value: 1 },
  { status: 'rejected', reason: 'error' },
  { status: 'fulfilled', value: 3 }
]
*/

// Create a JavaScript EventEmitter class that allows subscribing to events, emitting events with data, and unsubscribing from events. The class should have methods: on(event, callback), emit(event, ...args), and off(event, callback). Additionally, implement a once(event, callback) method that automatically unsubscribes after the first event emission.

class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  // Subscribe to an event
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
  }

  // Subscribe to an event, then auto-unsubscribe after first call
  once(event, callback) {
    const onceWrapper = (...args) => {
      this.off(event, onceWrapper);
      callback(...args);
    };
    this.on(event, onceWrapper);
  }

  // Emit an event with optional arguments
  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (!listeners || listeners.length === 0) {
      console.log(`Nothing to emit from event : ${event}`);

      return;
    }

    if (listeners) {
      for (const listener of [...listeners]) {
        listener(...args);
      }
    }
  }

  // Unsubscribe from an event
  off(event, callback) {
    const listeners = this.events.get(event);
    if (!listeners) {
      return;
    }

    const filtered = listeners.filter((listener) => listener !== callback);

    if (filtered.length > 0) {
      this.events.set(event, filtered);
    } else {
      this.events.delete(event);
      console.log(`All listeners have been removed from event: ${event}`);
    }
  }
}

const emitter = new EventEmitter();

function greet(name) {
  console.log(`Hello, ${name}`);
}

function ciao(name) {
  console.log(`Ciao, ${name}`);
}

emitter.on("welcome", greet);
emitter.on("welcome", ciao);

emitter.once("welcome", (name) => console.log(`Welcome, ${name}!, (once)`));

emitter.emit("welcome", "Alice");
// Output:
// Hello, Alice!
//  Ciao, Alice!
// Welcome, Alice! (once)

emitter.emit("welcome", "Bob");
// Output:
//  Ciao, Bob!
// Hello, Bob!

emitter.off("welcome", greet);
emitter.emit("welcome", "Charlie");
// Output:
//  Ciao, Charlie!

emitter.off("welcome", ciao);

emitter.emit("welcome", "Radu");

// Create a memoize function that caches the results of expensive function calls. Your function should take another function as input and return a memoized version. The memoized function should use all of its arguments as a cache key. Additionally, implement a way to clear the cache. Make sure your solution can handle functions with complex arguments (objects, arrays) properly.

function memoize(fn) {
  const cache = new Map();

  function generateKey(args) {
    // Stable serialization: supports complex arguments, including nested objects
    return JSON.stringify(args, (_, value) =>
      typeof value === "function" ? value.toString() : value
    );
  }

  const memoized = function (...args) {
    const key = generateKey(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };

  // Add method to clear cache
  memoized.clear = () => {
    cache.clear();
  };

  return memoized;
}

const complexFn = (a, b) => {
  const result = a.x + b.y;
  console.log(`Expensive call...${result}`);
  return result;
};

const memoizedFn = memoize(complexFn);

console.log(memoizedFn({ x: 2 }, { y: 3 })); // Expensive call... 5
console.log(
  "Expensive call again (different objects)",
  memoizedFn({ x: 2 }, { y: 3 })
); // Expensive call again (different objects)
const obj1 = { x: 2 };
const obj2 = { y: 3 };
console.log("Expensive call...", memoizedFn(obj1, obj2)); // Expensive call... 5
console.log("Cached!", memoizedFn(obj1, obj2)); // Cached! 5

memoizedFn.clear();
console.log("Expensive call again after clear...", memoizedFn(obj1, obj2)); // Expensive call again after clear... 5

// Write a function witch transforms a function of multiple arguments into a series of functions that each take a single argument?

function curry(fn) {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) {
      return fn(...args);
    }
    return (...moreArgs) => {
      return curried(...args, ...moreArgs);
    };
  };
}

//  implement a function to flatten a deeply nested array

function flatten(arr) {
  return arr.flat(Infinity);
}

let deepArr = [1, [2, [3, [4, 5]]]];

console.log(flatten(deepArr));
// ➜ [1, 2, 3, 4, 5]

// Write the HTML and JavaScript needed to implement a drag-and-drop interface where users can drag items from a list into a "shopping cart" area.

/* <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Drag and Drop Shopping Cart</title>
  <style>
    .container {
      display: flex;
      gap: 2rem;
    }

    .list, .cart {
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

    .cart.dragover {
      background-color: #d0f0d0;
    }
  </style>
</head>
<body>

<h2>Items</h2>
<div class="container">
  <div class="list" id="itemList">
    <div class="item" draggable="true" data-name="Apple">🍎 Apple</div>
    <div class="item" draggable="true" data-name="Banana">🍌 Banana</div>
    <div class="item" draggable="true" data-name="Orange">🍊 Orange</div>
  </div>

  <div class="cart" id="cart" aria-label="Shopping cart" role="region">
    <strong>Shopping Cart</strong>
    <ul id="cartItems"></ul>
  </div>
</div>

<script src="script.js"></script>
</body>
</html>
 */

// const items = document.querySelectorAll(".item");
// const cart = document.getElementById("cart");
// const cartItems = document.getElementById("cartItems");

// // Handle drag start
// items.forEach((item) => {
//   item.addEventListener("dragstart", (e) => {
//     e.dataTransfer.setData("text/plain", item.dataset.name);
//   });
// });

// // Allow drop
// cart.addEventListener("dragover", (e) => {
//   e.preventDefault(); // Required for drop to work
//   cart.classList.add("dragover");
// });

// // Remove drag style
// cart.addEventListener("dragleave", () => {
//   cart.classList.remove("dragover");
// });

// // Handle drop
// cart.addEventListener("drop", (e) => {
//   e.preventDefault();
//   cart.classList.remove("dragover");
//   const itemName = e.dataTransfer.getData("text/plain");

//   const li = document.createElement("li");
//   li.textContent = itemName;
//   cartItems.appendChild(li);
// });
