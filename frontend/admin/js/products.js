let allCategories = [];
let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    initProductsPage();
});

async function initProductsPage() {
    await Promise.all([loadCategories(), loadProducts()]);

    // Modal controls
    document.getElementById('openAddModalBtn').addEventListener('click', openAddModal);
    document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
    document.getElementById('productForm').addEventListener('submit', handleSaveProduct);

    // Auto-generate slug from name
    document.getElementById('prodName').addEventListener('input', (e) => {
        const editId = document.getElementById('editProductId').value;
        if (!editId) {
            // Only auto-fill slug when adding a new product
            document.getElementById('prodSlug').value = e.target.value
                .toLowerCase()
                .trim()
                .replace(/[\s_]+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
        }
    });

    // Image upload
    document.getElementById('imageUploadInput').addEventListener('change', handleImageUpload);

    // Quick-add category form
    document.getElementById('addCategoryForm').addEventListener('submit', handleAddCategory);

    // Dynamic specs row button
    document.getElementById('addSpecRowBtn').addEventListener('click', () => addSpecRow());
}

function addSpecRow(key = '', value = '') {
    const container = document.getElementById('specsContainer');
    const rowId = 'spec-row-' + Date.now() + Math.random().toString(36).substr(2, 5);
    
    const rowHtml = `
        <div class="spec-row" id="${rowId}" style="display: flex; gap: 10px; align-items: center; width: 100%;">
            <input type="text" class="form-control spec-key" placeholder="Spec Name (e.g. Power)" value="${escapeHtml(key)}" style="margin-bottom: 0; flex: 1;" required>
            <input type="text" class="form-control spec-value" placeholder="Value (e.g. 200W)" value="${escapeHtml(value)}" style="margin-bottom: 0; flex: 1;" required>
            <button type="button" class="btn" onclick="document.getElementById('${rowId}').remove()" style="margin: 0; padding: 10px 14px; width: auto; background: #e74c3c; color: #fff;">✕</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', rowHtml);
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function loadCategories() {
    try {
        allCategories = await api.categories.list();
        const select = document.getElementById('prodCategory');
        if (select) {
            select.innerHTML = allCategories.map(cat =>
                `<option value="${cat.category_id}">${cat.name}</option>`
            ).join('');
        }
    } catch (err) {
        console.error('Failed to load categories', err);
    }
}

async function loadProducts() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Loading...</td></tr>`;

    try {
        // Fetch all products (including inactive ones requires admin endpoint — we use public for now)
        allProducts = await api.products.list();

        if (allProducts.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No products found. Add your first product!</td></tr>`;
            return;
        }

        tbody.innerHTML = allProducts.map(p => {
            const displayPrice = p.sale_price
                ? `<span style="text-decoration:line-through;color:#999;font-size:0.85em;">Rs ${parseFloat(p.original_price).toLocaleString()}</span><br>Rs ${parseFloat(p.sale_price).toLocaleString()}`
                : `Rs ${parseFloat(p.original_price).toLocaleString()}`;

            const imgTag = p.image_url
                ? `<img src="${p.image_url}" class="product-img-thumb" alt="${p.name}">`
                : `<div style="width:50px;height:50px;background:#eee;border-radius:4px;display:flex;align-items:center;justify-content:center;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg></div>`;

            return `
                <tr id="prod-row-${p.product_id}">
                    <td>${imgTag}</td>
                    <td>${p.name}<br><small style="color:#888;">${p.slug}</small></td>
                    <td>${p.category ? p.category.name : '—'}</td>
                    <td>${displayPrice}</td>
                    <td>${p.stock_quantity}</td>
                    <td><span class="badge ${p.is_active ? 'delivered' : 'cancelled'}">${p.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                        <div class="product-actions">
                            <button class="action-btn edit-btn" onclick="openEditModal(${p.product_id})">Edit</button>
                            <button class="action-btn delete-btn" onclick="handleDeleteProduct(${p.product_id}, this)">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

    } catch (err) {
        console.error('Failed to load products', err);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:red;">Error loading products.</td></tr>`;
    }
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('editProductId').value = '';
    document.getElementById('productForm').reset();
    document.getElementById('prodImageUrl').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('productFormError').textContent = '';
    document.getElementById('uploadMsg').textContent = '';
    document.getElementById('specsContainer').innerHTML = ''; // Clear spec rows
    document.getElementById('productModal').classList.add('active');
}

function openEditModal(productId) {
    const product = allProducts.find(p => p.product_id === productId);
    if (!product) return;

    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('editProductId').value = productId;
    document.getElementById('prodName').value = product.name;
    document.getElementById('prodSlug').value = product.slug;
    document.getElementById('prodCategory').value = product.category_id;
    document.getElementById('prodStock').value = product.stock_quantity;
    document.getElementById('prodOriginalPrice').value = product.original_price;
    document.getElementById('prodSalePrice').value = product.sale_price || '';
    document.getElementById('prodDescription').value = product.description || '';
    document.getElementById('prodImageUrl').value = product.image_url || '';
    document.getElementById('productFormError').textContent = '';
    document.getElementById('uploadMsg').textContent = '';

    // Populate spec rows
    const specsContainer = document.getElementById('specsContainer');
    specsContainer.innerHTML = '';
    if (product.specs && typeof product.specs === 'object') {
        Object.entries(product.specs).forEach(([key, val]) => {
            addSpecRow(key, val);
        });
    }

    const preview = document.getElementById('imagePreview');
    if (product.image_url) {
        preview.src = product.image_url;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }

    document.getElementById('productModal').classList.add('active');
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
}

async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const uploadMsg = document.getElementById('uploadMsg');
    uploadMsg.textContent = 'Uploading image...';

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => {
        const preview = document.getElementById('imagePreview');
        preview.src = ev.target.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);

    try {
        const result = await api.admin.products.uploadImage(file);
        document.getElementById('prodImageUrl').value = result.image_url;
        uploadMsg.textContent = '✓ Image uploaded successfully.';
        uploadMsg.style.color = 'green';
    } catch (err) {
        console.error('Image upload failed', err);
        uploadMsg.textContent = '✗ Upload failed: ' + (err.detail || 'Unknown error');
        uploadMsg.style.color = 'red';
    }
}

async function handleSaveProduct(e) {
    e.preventDefault();

    const btn = document.getElementById('saveProductBtn');
    const errorDiv = document.getElementById('productFormError');
    btn.textContent = 'Saving...';
    btn.disabled = true;
    errorDiv.textContent = '';

    const editId = document.getElementById('editProductId').value;

    const specs = {};
    const rows = document.querySelectorAll('.spec-row');
    rows.forEach(row => {
        const key = row.querySelector('.spec-key').value.trim();
        const val = row.querySelector('.spec-value').value.trim();
        if (key) {
            specs[key] = val;
        }
    });
    const specsPayload = Object.keys(specs).length > 0 ? specs : null;

    const payload = {
        name: document.getElementById('prodName').value,
        slug: document.getElementById('prodSlug').value,
        category_id: parseInt(document.getElementById('prodCategory').value, 10),
        stock_quantity: parseInt(document.getElementById('prodStock').value, 10),
        original_price: parseFloat(document.getElementById('prodOriginalPrice').value),
        sale_price: document.getElementById('prodSalePrice').value ? parseFloat(document.getElementById('prodSalePrice').value) : null,
        description: document.getElementById('prodDescription').value || null,
        specs: specsPayload,
        image_url: document.getElementById('prodImageUrl').value || null,
    };

    try {
        if (editId) {
            await api.admin.products.update(editId, payload);
        } else {
            await api.admin.products.create(payload);
        }

        closeModal();
        await loadProducts();
    } catch (err) {
        console.error('Failed to save product', err);
        // Handle FastAPI 422 validation errors (array of field errors)
        if (Array.isArray(err.detail)) {
            errorDiv.textContent = err.detail.map(d => `${d.loc.slice(-1)[0]}: ${d.msg}`).join(' | ');
        } else {
            errorDiv.textContent = err.detail || 'Failed to save product.';
        }
    } finally {
        btn.textContent = 'Save Product';
        btn.disabled = false;
    }
}

async function handleDeleteProduct(productId, btn) {
    if (!confirm('Are you sure you want to deactivate this product? It will be hidden from the store.')) return;

    btn.textContent = '...';
    btn.disabled = true;

    try {
        await api.admin.products.delete(productId);
        // Update the row status inline without full reload
        const row = document.getElementById(`prod-row-${productId}`);
        if (row) {
            const statusCell = row.querySelector('.badge');
            statusCell.textContent = 'Inactive';
            statusCell.classList.replace('delivered', 'cancelled');
            btn.textContent = 'Deleted';
        }
    } catch (err) {
        console.error('Failed to delete product', err);
        alert(err.detail || 'Failed to deactivate product.');
        btn.textContent = 'Delete';
        btn.disabled = false;
    }
}

async function handleAddCategory(e) {
    e.preventDefault();
    const msg = document.getElementById('catMsg');
    const name = document.getElementById('catName').value;
    const slug = document.getElementById('catSlug').value;

    try {
        await api.admin.categories.create({ name, slug });
        msg.textContent = `✓ Category "${name}" added!`;
        msg.style.color = 'green';
        e.target.reset();
        await loadCategories(); // Refresh dropdown
        setTimeout(() => msg.textContent = '', 3000);
    } catch (err) {
        msg.textContent = err.detail || 'Failed to add category.';
        msg.style.color = 'red';
    }
}
