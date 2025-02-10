/*
  # Esquema inicial para la aplicación de finanzas personales

  1. Nuevas Tablas
    - users: Almacena información de usuarios
    - categories: Categorías de ingresos y gastos
    - transactions: Registro de transacciones financieras
    - budgets: Presupuestos por categoría
  
  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas de acceso basadas en el ID del usuario
  
  3. Vistas
    - monthly_summary: Resumen mensual de transacciones
    - category_summary: Resumen por categoría
*/

-- Habilitar la extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS para users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, user_id)
);

-- Habilitar RLS para categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Tabla de transacciones
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(10,2) NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    description TEXT,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS para transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Tabla de presupuestos
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, category_id, period_start)
);

-- Habilitar RLS para budgets
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can read own categories" ON categories
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read own budgets" ON budgets
    FOR SELECT USING (auth.uid() = user_id);

-- Insertar categorías por defecto
INSERT INTO categories (id, name, type, user_id) VALUES
    (uuid_generate_v4(), 'Vivienda', 'expense', NULL),
    (uuid_generate_v4(), 'Transporte', 'expense', NULL),
    (uuid_generate_v4(), 'Alimentación', 'expense', NULL),
    (uuid_generate_v4(), 'Otros', 'expense', NULL),
    (uuid_generate_v4(), 'Salario', 'income', NULL),
    (uuid_generate_v4(), 'Inversiones', 'income', NULL),
    (uuid_generate_v4(), 'Otros Ingresos', 'income', NULL)
ON CONFLICT (name, user_id) DO NOTHING;

-- Crear vistas para análisis
CREATE OR REPLACE VIEW monthly_summary AS
SELECT 
    user_id,
    DATE_TRUNC('month', date) as month,
    type,
    SUM(amount) as total_amount
FROM transactions
GROUP BY user_id, DATE_TRUNC('month', date), type;

CREATE OR REPLACE VIEW category_summary AS
SELECT 
    t.user_id,
    c.name as category_name,
    t.type,
    SUM(t.amount) as total_amount,
    COUNT(*) as transaction_count
FROM transactions t
JOIN categories c ON t.category_id = c.id
GROUP BY t.user_id, c.name, t.type;