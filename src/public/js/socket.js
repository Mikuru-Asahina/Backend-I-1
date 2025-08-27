const socket=io()

const productList = document.getElementById("productList");

socket.on("updateProducts", (products) => {
    productList.innerHTML = ""
    products.forEach((p) => {
        const li = document.createElement("li")
        li.innerHTML = `${p.title} - $${p.price} - Stock: ${p.stock}`
        productList.appendChild(li)
    })
})

// Alert para producto añadido
socket.on("productAdded", (product) => {
  console.log(`✅ Producto añadido: ${product.title}`)
});

// Alert para producto eliminado
socket.on("productDeleted", (id) => {
  console.log(`🗑️ Producto eliminado con id: ${id}`)
});