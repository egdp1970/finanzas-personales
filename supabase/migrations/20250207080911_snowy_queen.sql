/*
  # Actualización de categorías predefinidas

  1. Cambios
    - Eliminar categorías anteriores
    - Insertar nuevas categorías de ingresos y gastos
*/

-- Eliminar categorías existentes
DELETE FROM categories WHERE user_id IS NULL;

-- Insertar nuevas categorías
INSERT INTO categories (id, name, type, user_id) VALUES
    -- Categorías de ingresos
    (uuid_generate_v4(), 'Nómina Edu', 'income', NULL),
    (uuid_generate_v4(), 'Nómina Ana', 'income', NULL),
    (uuid_generate_v4(), 'Alquileres', 'income', NULL),
    (uuid_generate_v4(), 'Pagas extra', 'income', NULL),
    (uuid_generate_v4(), 'Otros', 'income', NULL),
    -- Categorías de gastos
    (uuid_generate_v4(), 'Comida', 'expense', NULL),
    (uuid_generate_v4(), 'Ropa', 'expense', NULL),
    (uuid_generate_v4(), 'Impuestos', 'expense', NULL),
    (uuid_generate_v4(), 'Teléfono', 'expense', NULL),
    (uuid_generate_v4(), 'Energía', 'expense', NULL),
    (uuid_generate_v4(), 'Otros', 'expense', NULL)
ON CONFLICT (name, user_id) DO NOTHING;