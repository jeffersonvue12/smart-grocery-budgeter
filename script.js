let items = [];

const groceryDatabase = {
  milk: { price: 8.50, category: "Dairy" },
  cheese: { price: 9.25, category: "Dairy" },
  yogurt: { price: 7.25, category: "Dairy" },

  apple: { price: 6.80, category: "Fruits" },
  banana: { price: 5.30, category: "Fruits" },
  orange: { price: 6.90, category: "Fruits" },

  bread: { price: 7.50, category: "Grains" },
  rice: { price: 12.00, category: "Grains" },
  pasta: { price: 6.50, category: "Grains" },

  chicken: { price: 15.00, category: "Protein" },
  beef: { price: 18.50, category: "Protein" },
  fish: { price: 16.50, category: "Protein" },

  pizza: { price: 14.00, category: "Fast Food" },
  burger: { price: 13.00, category: "Fast Food" },
  fries: { price: 9.00, category: "Fast Food" },

  soda: { price: 7.00, category: "Drinks" },
  pepsi: { price: 7.00, category: "Drinks" },
  coke: { price: 7.00, category: "Drinks" },

  chips: { price: 8.50, category: "Snacks" },
  candy: { price: 6.50, category: "Snacks" }
};

function addItem() {
  const itemName = document.getElementById("itemName").value.trim();
  const budget = parseFloat(document.getElementById("budgetInput").value);

  if (!itemName || !budget) {
    alert("Please enter your budget and item name.");
    return;
  }

  const itemLower = itemName.toLowerCase();

  if (!groceryDatabase[itemLower]) {
    alert(
      "🥺 Sorry, this item is currently out of stock.\nWe will restock it as soon as possible 😉"
    );
    return;
  }

  const itemPrice = groceryDatabase[itemLower].price;
  const category = groceryDatabase[itemLower].category;

  items.push({
    name: itemName,
    price: itemPrice,
    category: category
  });

  saveItems();
  renderItems();

  document.getElementById("itemName").value = "";
}

function deleteItem(index) {
  items.splice(index, 1);
  saveItems();
  renderItems();
}

function renderItems() {
  const shoppingList = document.getElementById("shoppingList");
  const budget = parseFloat(document.getElementById("budgetInput").value) || 0;

  shoppingList.innerHTML = "";

  let total = 0;

  items.forEach((item, index) => {
    total += item.price;

    const unhealthyCategories = ["Fast Food", "Snacks", "Drinks"];
    const healthIcon = unhealthyCategories.includes(item.category) ? "⚠️" : "✅";

    const li = document.createElement("li");

    li.innerHTML = `
      <span>
        <span class="category-badge">${item.category}</span>
        ${item.name} - $${item.price.toFixed(2)} ${healthIcon}
      </span>
      <button class="delete-btn" onclick="deleteItem(${index})">Delete</button>
    `;

    shoppingList.appendChild(li);
  });

  const remaining = budget - total;

  document.getElementById("total").innerText = total.toFixed(2);
  document.getElementById("remaining").innerText = remaining.toFixed(2);

  const warning = document.getElementById("warning");
  const suggestion = document.getElementById("suggestion");

  warning.innerText = "";
  suggestion.innerText = "";

  const unhealthyFoods = [
    "soda",
    "chips",
    "burger",
    "pizza",
    "candy",
    "fries",
    "pepsi",
    "coke"
  ];

  const hasUnhealthyFood = items.some((item) =>
    unhealthyFoods.some((food) =>
      item.name.toLowerCase().includes(food)
    )
  );

  if (budget === 0) {
    warning.innerText = "";
    suggestion.innerText = "";
  } else if (remaining < 0) {
    warning.innerText = "⚠ Over Budget!";
    warning.style.color = "red";

    suggestion.innerText =
      "💡 Try removing expensive or unhealthy items to save money and stay healthier 😉";
    suggestion.style.color = "orange";
  } else if (hasUnhealthyFood) {
    warning.innerText = "⚠ Unhealthy food detected!";
    warning.style.color = "yellow";

    suggestion.innerText =
      "Value your health and choose healthier food options 😉";
    suggestion.style.color = "yellow";
  } else {
    warning.innerText = "✅ Within Budget";
    warning.style.color = "lightgreen";
    suggestion.innerText = "";
  }
}

function saveItems() {
  localStorage.setItem("groceryItems", JSON.stringify(items));
}

function loadItems() {
  const savedItems = localStorage.getItem("groceryItems");

  if (savedItems) {
    items = JSON.parse(savedItems);
  }

  renderItems();
}

window.onload = loadItems;

document.getElementById("itemName").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    addItem();
  }
});