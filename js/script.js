let products = [];
let originalOrder = [];
let currentSort = { key: null, direction: 1 };
let userName = '';

// Solicitar el nombre del usuario al cargar la página
window.onload = function() {
    userName = prompt("Por favor, ingresa tu nombre:");
    if (userName) {
        alert(`Bienvenido, ${userName}!`);
    } else {
        userName = 'Usuario';
        alert(`Bienvenido, ${userName}!`);
    }
};

// Función para agregar un producto
function addProduct() {
    const productName = document.getElementById('productName').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productInstallments = parseInt(document.getElementById('productInstallments').value);

    // Verificar si los campos están completos y son válidos
    if (!productName || isNaN(productPrice) || isNaN(productInstallments)) {
        console.log('Error: Por favor, completa todos los campos correctamente.');
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    // Crear un objeto de producto
    const product = {
        name: productName,
        price: productPrice,
        installments: productInstallments
    };

    // Agregar el producto a las listas
    products.push(product);
    originalOrder.push(product);
    console.log("Producto agregado:", product);
    displayProducts(); // Actualizar la lista de productos
    clearForm(); // Limpiar el formulario
}

// Función para mostrar los productos
function displayProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Limpiar la lista de productos

    // Iterar sobre los productos y agregarlos al HTML
    products.forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <span><strong>Producto:</strong> ${product.name}</span>
            <span><strong>Precio:</strong> $${product.price.toFixed(2)}</span>
            <span><strong>Cuotas:</strong> ${product.installments}</span>
            <button onclick="removeProduct(${index})">&times;</button>
        `;
        productList.appendChild(productItem);
    });

    console.log("Lista de productos actualizada:", products);
}

// Función para limpiar el formulario
function clearForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productInstallments').value = '';
}

// Función para eliminar un producto
function removeProduct(index) {
    console.log(`Producto eliminado:`, products[index]);
    products.splice(index, 1); // Eliminar el producto de la lista
    originalOrder.splice(index, 1); // Eliminar el producto del orden original
    displayProducts(); // Actualizar la lista de productos
}

// Función para calcular los pagos totales
function calculateTotalPayments() {
    const payments = [];
    const productCount = [];
    const productDetails = [];

    // Calcular los pagos mensuales
    products.forEach(product => {
        const monthlyPayment = product.price / product.installments;

        for (let i = 0; i < product.installments; i++) {
            if (!payments[i]) {
                payments[i] = 0;
                productCount[i] = 0;
                productDetails[i] = [];
            }
            payments[i] += monthlyPayment;
            productCount[i] += 1;
            productDetails[i].push({ name: product.name, payment: monthlyPayment.toFixed(2) });
        }
    });

    // Mostrar los pagos mensuales
    const totalPayments = document.getElementById('totalPayments');
    totalPayments.innerHTML = '<h2>Pagos Mensuales:</h2>';
    payments.forEach((payment, index) => {
        const paymentItem = document.createElement('div');
        paymentItem.className = 'payment-item';
        paymentItem.innerHTML = `
            <div class="payment-item-header">
                <p><strong>Mes ${index + 1}:</strong> <span>$${payment.toFixed(2)} (${productCount[index]} productos)</span></p>
                <button class="toggle-button" onclick="toggleDetails(this)">Ver más</button>
            </div>
        `;

        const paymentDetails = document.createElement('div');
        paymentDetails.className = 'payment-details';

        productDetails[index].forEach(detail => {
            paymentDetails.innerHTML += `<p>${detail.name}: $${detail.payment}</p>`;
        });

        paymentItem.appendChild(paymentDetails);
        totalPayments.appendChild(paymentItem);

        console.log(`Mes ${index + 1}: $${payment.toFixed(2)} (${productCount[index]} productos)`);
    });

    alert(`Pagos mensuales calculados, ${userName}. Revisa la consola para más detalles.`);
}

// Función para alternar la visibilidad de los detalles del pago
function toggleDetails(button) {
    const paymentItem = button.closest('.payment-item');
    paymentItem.classList.toggle('active');

    if (paymentItem.classList.contains('active')) {
        button.textContent = 'Ver menos';
    } else {
        button.textContent = 'Ver más';
    }
}

// Función para ordenar productos
function sortProducts(key) {
    // Verificar si la ordenación es por la misma clave
    if (currentSort.key === key) {
        // Cambiar la dirección de la ordenación
        if (currentSort.direction === 1) {
            currentSort.direction = -1; // Cambiar a descendente
        } else if (currentSort.direction === -1) {
            currentSort.key = null; // Desactivar orden
            currentSort.direction = 1;
            products = [...originalOrder]; // Restablecer el orden original
        }
    } else {
        currentSort.key = key;
        currentSort.direction = 1; // Orden ascendente por defecto
    }

    // Ordenar los productos
    if (currentSort.key) {
        products.sort((a, b) => {
            if (a[key] < b[key]) return -1 * currentSort.direction;
            if (a[key] > b[key]) return 1 * currentSort.direction;
            return 0;
        });
    }

    console.log(`Productos ordenados por ${key} (${currentSort.direction === 1 ? 'ascendente' : currentSort.direction === -1 ? 'descendente' : 'desactivado'})`);
    updateSortButtons(); // Actualizar los botones de ordenación
    displayProducts(); // Actualizar la lista de productos
}

// Función para actualizar los botones de ordenación
function updateSortButtons() {
    const buttons = document.querySelectorAll('.sorting-buttons button');
    buttons.forEach(button => {
        button.classList.remove('active', 'desc');
    });

    if (currentSort.key) {
        const activeButton = document.getElementById(`sort${capitalize(currentSort.key)}`);
        activeButton.classList.add('active');
        if (currentSort.direction === -1) {
            activeButton.classList.add('desc');
        }
    }
}

// Función para capitalizar la primera letra de una cadena
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Llamadas de prueba
document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addProduct();
});
