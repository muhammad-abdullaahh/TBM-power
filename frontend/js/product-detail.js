document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('productDetailContainer');
    if (container) {
        loadProductDetail();
    }
});

async function loadProductDetail() {
    const container = document.getElementById('productDetailContainer');
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
        container.innerHTML = `<p class="error-text">Product not found. <a href="products.html">Return to products</a></p>`;
        return;
    }

    try {
        const product = await api.products.get(slug);

        // Format pricing
        let priceHtml = '';
        if (product.sale_price) {
            priceHtml = `
                <div class="product-pricing" style="margin: 20px 0;">
                    <span style="text-decoration: line-through; color: #888; font-size: 1.1em; margin-right: 15px;">Rs ${parseFloat(product.original_price).toLocaleString()}</span>
                    <span style="color: var(--primary-color); font-weight: 700; font-size: 2em;">Rs ${parseFloat(product.sale_price).toLocaleString()}</span>
                </div>
            `;
        } else {
            priceHtml = `
                <div class="product-pricing" style="margin: 20px 0;">
                    <span style="color: var(--primary-color); font-weight: 700; font-size: 2em;">Rs ${parseFloat(product.original_price).toLocaleString()}</span>
                </div>
            `;
        }

        const isOutOfStock = product.stock_quantity <= 0;
        const stockHtml = isOutOfStock 
            ? `<span style="color: #dc3545; font-weight: bold;">Out of Stock</span>`
            : `<span style="color: #28a745; font-weight: bold;">In Stock (${product.stock_quantity})</span>`;

        // Image
        const imageHtml = product.image_url 
            ? `<img src="${product.image_url}" alt="${product.name}" style="width: 100%; max-height: 500px; object-fit: cover; border-radius: 8px;" />`
            : `<div class="placeholder-box light-variant" style="height: 400px;">
                <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                <div class="placeholder-label">[Image Pending]</div>
               </div>`;

        // Specs (JSONB)
        let specsHtml = '';
        if (product.specs && Object.keys(product.specs).length > 0) {
            specsHtml = `
                <h3 style="margin-top: 30px;">Technical Specifications</h3>
                <table class="specs-table" style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <tbody>
                        ${Object.entries(product.specs).map(([key, value]) => `
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f9f9f9; width: 40%;">${key}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${value}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr; gap: 40px; margin-top: 20px;">
                <!-- Desktop layout uses CSS media queries to split into 2 columns if needed, inline styles for simplicity here -->
                <div style="display: flex; flex-wrap: wrap; gap: 40px;">
                    <div style="flex: 1; min-width: 300px;">
                        ${imageHtml}
                    </div>
                    <div style="flex: 1; min-width: 300px;">
                        <div class="category-badge" style="text-transform: uppercase; color: var(--primary-color); letter-spacing: 1px; margin-bottom: 10px; font-size: 0.9em;">
                            ${product.category ? product.category.name : ''}
                        </div>
                        <h2 style="font-size: 2.5em; margin-bottom: 10px;">${product.name}</h2>
                        ${stockHtml}
                        ${priceHtml}
                        <p style="font-size: 1.1em; line-height: 1.6; margin-bottom: 25px; color: #555;">
                            ${product.description || 'No description available.'}
                        </p>
                        
                        <div style="display: flex; gap: 15px; margin-bottom: 30px;">
                            <input type="number" id="qtyInput" value="1" min="1" max="${product.stock_quantity || 1}" style="width: 80px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;" ${isOutOfStock ? 'disabled' : ''}>
                            <button id="addToCartBtn" class="btn btn-primary" style="flex: 1;" ${isOutOfStock ? 'disabled' : ''}>
                                ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>
                        
                        ${specsHtml}
                    </div>
                </div>

                <!-- Reviews Section -->
                <div style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 40px;">
                    <h3>Customer Reviews</h3>
                    <div style="margin-bottom: 30px; font-style: italic; color: #777;">
                        (Reviews display is coming soon)
                    </div>

                    <div style="background: #f9f9f9; padding: 30px; border-radius: 8px;">
                        <h4>Write a Review</h4>
                        <form id="reviewForm" style="display: grid; gap: 15px; margin-top: 20px;">
                            <input type="hidden" id="reviewProductId" value="${product.product_id}">
                            <div>
                                <label style="display: block; margin-bottom: 5px;">Name *</label>
                                <input type="text" id="reviewName" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px;">Rating (1-5) *</label>
                                <input type="number" id="reviewRating" min="1" max="5" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px;">Comment</label>
                                <textarea id="reviewComment" rows="4" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary" style="justify-self: start;">Submit Review</button>
                            <div id="reviewMsg" style="margin-top: 10px; font-weight: bold;"></div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Add to Cart Logic
        if (!isOutOfStock) {
            document.getElementById('addToCartBtn').addEventListener('click', async () => {
                const qty = parseInt(document.getElementById('qtyInput').value, 10);
                if (qty > 0) {
                    try {
                        const btn = document.getElementById('addToCartBtn');
                        btn.textContent = 'Adding...';
                        btn.disabled = true;
                        
                        await api.cart.addItem(product.product_id, qty);
                        
                        btn.textContent = 'Added to Cart!';
                        setTimeout(() => {
                            btn.textContent = 'Add to Cart';
                            btn.disabled = false;
                        }, 2000);
                    } catch (error) {
                        alert(error.detail || 'Failed to add to cart');
                        document.getElementById('addToCartBtn').textContent = 'Add to Cart';
                        document.getElementById('addToCartBtn').disabled = false;
                    }
                }
            });
        }

        // Review Form Logic
        document.getElementById('reviewForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const msg = document.getElementById('reviewMsg');
            const data = {
                reviewer_name: document.getElementById('reviewName').value,
                rating: parseInt(document.getElementById('reviewRating').value, 10),
                comment: document.getElementById('reviewComment').value || undefined
            };

            try {
                await fetchAPI(`/products/${product.product_id}/reviews`, {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                msg.textContent = 'Review submitted successfully!';
                msg.style.color = 'green';
                e.target.reset();
            } catch (error) {
                msg.textContent = error.detail || 'Failed to submit review';
                msg.style.color = 'red';
            }
        });

    } catch (error) {
        console.error('Failed to load product details', error);
        if (error.status === 404) {
            container.innerHTML = `<p class="error-text">Product not found. <a href="products.html">Return to products</a></p>`;
        } else {
            container.innerHTML = `<p class="error-text">Error loading product details.</p>`;
        }
    }
}
