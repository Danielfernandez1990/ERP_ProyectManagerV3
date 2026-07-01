import { Pool } from 'pg';
import { config } from '../config/env';
import bcryptjs from 'bcryptjs';

/**
 * Database Seed Script
 * 
 * Propósito: Inicializar datos de prueba en la base de datos
 * 
 * Uso:
 *   npm run seed
 * 
 * Precondiciones:
 *   - PostgreSQL debe estar corriendo
 *   - Las variables de entorno DB_* deben estar configuradas
 *   - La BD debe estar creada
 */

interface SeedData {
  empresa: {
    nombre: string;
    razon_social: string;
    plan: string;
  };
  usuarios: Array<{
    email: string;
    nombre: string;
    apellido: string;
    rol: string;
    password: string;
  }>;
}

const seedData: SeedData = {
  empresa: {
    nombre: 'ERP Test Company',
    razon_social: 'Test S.A.',
    plan: 'PRO',
  },
  usuarios: [
    {
      email: 'admin@erp.local',
      nombre: 'Administrator',
      apellido: 'System',
      rol: 'SUPER_ADMIN',
      password: 'Admin123!',
    },
    {
      email: 'test@erp.local',
      nombre: 'Test',
      apellido: 'Usuario',
      rol: 'OPERARIO',
      password: 'Admin123!',
    },
  ],
};

async function seed() {
  const pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
  });

  try {
    console.log('🌱 Iniciando seed de base de datos...');
    console.log(`📍 Conectando a ${config.db.host}:${config.db.port}/${config.db.database}`);

    const connection = await pool.connect();
    console.log('✓ Conexión exitosa');

    // 1. Crear empresa
    console.log('\n📦 Insertando empresa...');
    const empresaResult = await connection.query(
      `INSERT INTO empresas (nombre, razon_social, plan, estado) 
       VALUES ($1, $2, $3, 'activo')
       ON CONFLICT DO NOTHING
       RETURNING id, nombre`,
      [seedData.empresa.nombre, seedData.empresa.razon_social, seedData.empresa.plan],
    );
    
    let empresaId = empresaResult.rows[0]?.id;
    if (!empresaId) {
      const existing = await connection.query(
        'SELECT id FROM empresas WHERE nombre = $1',
        [seedData.empresa.nombre],
      );
      empresaId = existing.rows[0].id;
    }
    
    console.log(`✓ Empresa creada: ${seedData.empresa.nombre} (ID: ${empresaId})`);

    // 2. Crear usuarios
    console.log('\n👥 Insertando usuarios...');
    for (const usuario of seedData.usuarios) {
      const passwordHash = await bcryptjs.hash(usuario.password, 10);
      
      const result = await connection.query(
        `INSERT INTO usuarios (
          email, password_hash, nombre, apellido, rol, estado, activo, empresa_id
        ) VALUES ($1, $2, $3, $4, $5, 'activo', true, $6)
        ON CONFLICT (email) DO UPDATE SET 
          password_hash = $2, activo = true, estado = 'activo'
        RETURNING id, email, rol`,
        [usuario.email, passwordHash, usuario.nombre, usuario.apellido, usuario.rol, empresaId],
      );

      const createdUser = result.rows[0];
      console.log(`✓ Usuario creado: ${createdUser.email} (${createdUser.rol})`);
    }

    // 3. Crear licencia
    console.log('\n📜 Insertando licencia...');
    const licenciaResult = await connection.query(
      `INSERT INTO licencias (empresa_id, plan, usuarios_max, estado, fecha_inicio, fecha_expiracion)
       VALUES ($1, 'PRO', 20, 'activo', NOW(), NOW() + INTERVAL '1 year')
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [empresaId],
    );
    
    if (licenciaResult.rows.length > 0) {
      console.log(`✓ Licencia creada (ID: ${licenciaResult.rows[0].id})`);
    }

    // 4. Verificación
    console.log('\n📊 Verificación final:');
    
    const usuariosCount = await connection.query('SELECT COUNT(*) FROM usuarios');
    console.log(`✓ Total usuarios: ${usuariosCount.rows[0].count}`);

    const empresasCount = await connection.query('SELECT COUNT(*) FROM empresas');
    console.log(`✓ Total empresas: ${empresasCount.rows[0].count}`);

    const licenciasCount = await connection.query('SELECT COUNT(*) FROM licencias');
    console.log(`✓ Total licencias: ${licenciasCount.rows[0].count}`);

    console.log('\n✅ Seed completado exitosamente!');
    console.log('\n🔐 Credenciales de prueba:');
    console.log('   Email: admin@erp.local');
    console.log('   Password: Admin123!');
    console.log('\n⚠️  IMPORTANTE: Cambiar estas credenciales en producción');

    connection.release();
  } catch (error) {
    console.error('❌ Error durante seed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Ejecutar seed
seed().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
