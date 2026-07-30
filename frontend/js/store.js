document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the products page
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        initStorefront();
    }
});

async function initStorefront() {
    await loadCategories();
    await loadProducts();
}

async function loadCategories() {
    const filterNav = document.getElementById('categoryFilter');
    if (!filterNav) return;

    try {
        const categories = await api.categories.list();
        
        let html = `<button class="filter-btn active" data-category-id="">All Products</button>`;
        categories.forEach(cat => {
            html += `<button class="filter-btn" data-category-id="${cat.category_id}">${cat.name}</button>`;
        });
        
        filterNav.innerHTML = html;

        // Attach click events
        const buttons = filterNav.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                // Update active state
                buttons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const categoryId = e.target.getAttribute('data-category-id');
                await loadProducts(categoryId);
            });
        });
    } catch (error) {
        console.error('Failed to load categories', error);
        filterNav.innerHTML = `<p class="error-text">Failed to load categories.</p>`;
    }
}

async function loadProducts(categoryId = null) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = `<div class="loader">Loading products...</div>`;

    try {
        const products = await api.products.list(categoryId);
        
        if (products.length === 0) {
            grid.innerHTML = `<p style="text-align: center; grid-column: 1/-1;">No products found in this category.</p>`;
            return;
        }

        let html = '';
        products.forEach((product, index) => {
            const delay = index % 3 === 1 ? 'delay-100' : (index % 3 === 2 ? 'delay-200' : '');
            
            // Format pricing
            let priceHtml = '';
            if (product.sale_price) {
                priceHtml = `
                    <div class="product-pricing">
                        <span class="original-price" style="text-decoration: line-through; color: #888; font-size: 0.9em;">Rs ${parseFloat(product.original_price).toLocaleString()}</span>
                        <span class="sale-price" style="color: var(--primary-color); font-weight: 700; font-size: 1.2em;">Rs ${parseFloat(product.sale_price).toLocaleString()}</span>
                    </div>
                `;
            } else {
                priceHtml = `
                    <div class="product-pricing">
                        <span class="price" style="color: var(--primary-color); font-weight: 700; font-size: 1.2em;">Rs ${parseFloat(product.original_price).toLocaleString()}</span>
                    </div>
                `;
            }

            // Image handling (using full URL from backend, or fallback placeholder)
            const imageHtml = product.image_url 
                ? `<img src="${product.image_url}" alt="${product.name}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 4px;" />`
                : `<div class="placeholder-box light-variant">
                    <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                    <div class="placeholder-label">[Image Pending]</div>
                   </div>`;

            // Stock status
            const isOutOfStock = product.stock_quantity <= 0;
            const stockHtml = isOutOfStock 
                ? `<span style="color: #dc3545; font-size: 0.85em; display: block; margin-bottom: 10px;">Out of Stock</span>`
                : `<span style="color: #28a745; font-size: 0.85em; display: block; margin-bottom: 10px;">In Stock (${product.stock_quantity})</span>`;

            html += `
                <div class="product-card gallery-item reveal fade-up active ${delay}">
                    <div class="product-image-box" style="margin-bottom: 15px;">
                        ${imageHtml}
                    </div>
                    <div class="category-badge" style="font-size: 0.75rem; text-transform: uppercase; color: var(--primary-color); letter-spacing: 1px; margin-bottom: 5px;">
                        ${product.category ? product.category.name : ''}
                    </div>
                    <h3 style="margin-bottom: 5px;">${product.name}</h3>
                    ${priceHtml}
                    ${stockHtml}
                    <p style="margin-bottom: 15px;">${product.description || 'No description available.'}</p>
                    <a href="product-detail.html?slug=${product.slug}" class="btn btn-outline" style="width: 100%; display: block; text-align: center;">View Details</a>
                </div>
            `;
        });

        grid.innerHTML = html;
        
        // Re-trigger any scroll animations if they were relying on new elements
        if (typeof initScrollReveal === 'function') {
            setTimeout(initScrollReveal, 100);
        }

    } catch (error) {
        console.error('Failed to load products', error);
        grid.innerHTML = `<p class="error-text" style="grid-column: 1/-1;">Error loading products. Please try again later.</p>`;
    }
}
