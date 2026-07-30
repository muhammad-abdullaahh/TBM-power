document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cartContainer');
    if (container) {
        loadCart();
    }
});

async function loadCart() {
    const container = document.getElementById('cartContainer');
    
    try {
        const cartItems = await api.cart.get();
        
        if (!cartItems || cartItems.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <h3>Your cart is currently empty</h3>
                    <p style="margin-top: 15px;"><a href="products.html" class="btn btn-primary">Browse Products</a></p>
                </div>
            `;
            return;
        }

        let total = 0;
        let html = `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background: #f4f4f4; border-bottom: 2px solid #ddd;">
                        <th style="padding: 15px; text-align: left;">Product</th>
                        <th style="padding: 15px; text-align: center;">Price</th>
                        <th style="padding: 15px; text-align: center;">Quantity</th>
                        <th style="padding: 15px; text-align: center;">Subtotal</th>
                        <th style="padding: 15px; text-align: center;">Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        cartItems.forEach(item => {
            const product = item.product;
            const price = parseFloat(product.sale_price || product.original_price);
            const subtotal = price * item.quantity;
            total += subtotal;

            html += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 15px;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            ${product.image_url ? `<img src="${product.image_url}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">` : `<div style="width: 60px; height: 60px; background: #eee; border-radius: 4px;"></div>`}
                            <div>
                                <a href="product-detail.html?slug=${product.slug}" style="font-weight: bold; color: inherit; text-decoration: none;">${product.name}</a>
                            </div>
                        </div>
                    </td>
                    <td style="padding: 15px; text-align: center;">Rs ${price.toLocaleString()}</td>
                    <td style="padding: 15px; text-align: center;">${item.quantity}</td>
                    <td style="padding: 15px; text-align: center; font-weight: bold;">Rs ${subtotal.toLocaleString()}</td>
                    <td style="padding: 15px; text-align: center;">
                        <button class="remove-item-btn btn btn-outline" style="padding: 5px 10px; font-size: 0.8em; color: #dc3545; border-color: #dc3545;" data-id="${product.product_id}">Remove</button>
                    </td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 20px; background: #f9f9f9; border-radius: 8px;">
                <div>
                    <a href="products.html" class="btn btn-outline">Continue Shopping</a>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 1.5em; font-weight: bold; margin-bottom: 15px;">Total: Rs ${total.toLocaleString()}</div>
                    <p style="font-size: 0.85em; color: #666; margin-bottom: 15px;">Shipping & taxes calculated at checkout</p>
                    <a href="checkout.html" class="btn btn-primary" style="font-size: 1.1em; padding: 12px 30px;">Proceed to Checkout</a>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Attach remove events
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const productId = e.target.getAttribute('data-id');
                btn.textContent = 'Removing...';
                btn.disabled = true;
                try {
                    await api.cart.removeItem(productId);
                    // Reload cart
                    loadCart();
                } catch (error) {
                    console.error('Failed to remove item', error);
                    alert('Failed to remove item');
                    btn.textContent = 'Remove';
                    btn.disabled = false;
                }
            });
        });

    } catch (error) {
        console.error('Failed to load cart', error);
        container.innerHTML = `<p class="error-text">Error loading cart. Please try again later.</p>`;
    }
}
