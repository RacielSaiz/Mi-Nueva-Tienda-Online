document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('product-form');
    const searchForm = document.getElementById('search-form');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            if (!loggedInUser) {
                alert('Debes iniciar sesión para agregar un producto.');
                return;
            }

            const name = document.getElementById('name').value.trim();
            const description = document.getElementById('description').value.trim();
            const price = document.getElementById('price').value.trim();
            const image = document.getElementById('image').files[0];
            const contact = document.getElementById('contact').value.trim();
            const email = document.getElementById('email').value.trim();
            const category = document.getElementById('category').value.trim() || 'Sin categoría';

            // Validaciones
            if (!name || !description || !price || (!contact && !email)) {
                alert('Por favor, completa todos los campos obligatorios.');
                return;
            }

            if (!image) {
                alert('Por favor, selecciona una imagen para el producto.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = function() {
                const product = {
                    id: Date.now(),
                    name,
                    description,
                    price,
                    image: reader.result,
                    contact,
                    email,
                    category,
                    creator: loggedInUser.username
                };

                let products = JSON.parse(localStorage.getItem('products')) || [];
                products.push(product);
                localStorage.setItem('products', JSON.stringify(products));

                window.location.href = '../index.html';
            };

            reader.readAsDataURL(image);
        });
    } else {
        loadProducts();

        if (searchForm) {
            searchForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const name = document.getElementById('search-name').value.toLowerCase();
                const description = document.getElementById('search-description').value.toLowerCase();
                loadProducts(name, description);
            });
        }
    }

    function loadProducts(nameFilter = '', descriptionFilter = '') {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';
        let products = JSON.parse(localStorage.getItem('products')) || [];

        products
            .filter(product => {
                const nameMatch = product.name.toLowerCase().includes(nameFilter);
                const descriptionMatch = product.description.toLowerCase().includes(descriptionFilter);
                return nameMatch && descriptionMatch;
            })
            .forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';

                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>Precio: $${product.price}</p>
                    <p>Contacto: ${product.contact || product.email}</p>
                    <p>Categoría: ${product.category}</p>
                    <button onclick="editProduct(${product.id})">Editar</button>
                    <button onclick="deleteProduct(${product.id})">Eliminar</button>
                `;

                productList.appendChild(productDiv);
            });
    }

    window.editProduct = function(id) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        let products = JSON.parse(localStorage.getItem('products')) || [];
        let product = products.find(p => p.id === id);

        if (product) {
            if (product.creator !== loggedInUser.username && !loggedInUser.isModerator) {
                alert('No tienes permiso para editar este producto.');
                return;
            }

            document.getElementById('name').value = product.name;
            document.getElementById('description').value = product.description;
            document.getElementById('price').value = product.price;
            document.getElementById('contact').value = product.contact;
            document.getElementById('email').value = product.email;
            document.getElementById('category').value = product.category;

            // Eliminar producto del almacenamiento temporalmente para evitar duplicados al actualizar
            products = products.filter(p => p.id !== id);
            localStorage.setItem('products', JSON.stringify(products));
        }
    };

    window.deleteProduct = function(id) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        let products = JSON.parse(localStorage.getItem('products')) || [];
        let product = products.find(p => p.id === id);

        if (product) {
            if (product.creator !== loggedInUser.username && !loggedInUser.isModerator) {
                alert('No tienes permiso para eliminar este producto.');
                return;
            }

            products = products.filter(p => p.id !== id);
            localStorage.setItem('products', JSON.stringify(products));
            loadProducts();
        }
    };
});
