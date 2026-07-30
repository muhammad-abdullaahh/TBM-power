-- ============================================
-- ENUM TYPES
-- ============================================
CREATE TYPE payment_method_enum AS ENUM ('bank_transfer', 'jazzcash','easypaisa');
CREATE TYPE order_status_enum AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
CREATE TYPE system_type_enum AS ENUM ('on_grid', 'off_grid', 'hybrid');

-- ============================================
-- ADMINS ONLY (renamed from "users" — customers never appear here)
-- ============================================
CREATE TABLE admins (
    admin_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(category_id),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    specs JSONB,
    original_price NUMERIC(12,2) NOT NULL,
    sale_price NUMERIC(12,2),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- REVIEWS (no login — just a name + comment)
-- ============================================
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    reviewer_name VARCHAR(100) NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- CART ITEMS (keyed by session_id, not a user account)
-- ============================================
CREATE TABLE cart_items (
    cart_item_id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,   -- random UUID generated client-side, stored in a cookie
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    quantity INTEGER NOT NULL DEFAULT 1,
    added_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(session_id, product_id)
);

-- ============================================
-- ORDERS (guest checkout — customer info stored directly)
-- ============================================
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(150),
    status order_status_enum NOT NULL DEFAULT 'pending',
    payment_method payment_method_enum NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_charge NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(order_id),
    product_id INTEGER REFERENCES products(product_id),
    product_name VARCHAR(200) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    quantity INTEGER NOT NULL
);

-- ============================================
-- SOLAR CALCULATOR LEADS (unchanged — already guest-based)
-- ============================================
CREATE TABLE solar_leads (
    lead_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    city VARCHAR(100),
    system_type system_type_enum NOT NULL,
    monthly_bill_range VARCHAR(50) NOT NULL,
    region VARCHAR(100) NOT NULL,
    recommended_kw NUMERIC(5,2),
    panels_needed INTEGER,
    units_per_day NUMERIC(6,2),
    peak_sun_hours NUMERIC(4,2),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);