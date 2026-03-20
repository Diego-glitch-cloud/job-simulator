const db = require('../db/config');

// Función auxiliar para responder JSON puro
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  if (data) {
    res.end(JSON.stringify(data));
  } else {
    res.end();
  }
};

// Validaciones estrictas según el README
const validateBody = (body, isPatch = false) => {
  const errors = [];
  const requiredFields = ['name', 'genre', 'country', 'year_formed', 'rating', 'is_active'];

  if (!isPatch) {
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        errors.push(`Falta el campo requerido: ${field}`);
      }
    }
  }

  if (body.name !== undefined && typeof body.name !== 'string') errors.push('name (Banda) debe ser string');
  if (body.genre !== undefined && typeof body.genre !== 'string') errors.push('genre (Género) debe ser string');
  if (body.country !== undefined && typeof body.country !== 'string') errors.push('country (País) debe ser string');
  if (body.year_formed !== undefined && !Number.isInteger(body.year_formed)) errors.push('year_formed (Año) debe ser integer');
  if (body.rating !== undefined && typeof body.rating !== 'number') errors.push('rating (Rating) debe ser float');
  if (body.is_active !== undefined && typeof body.is_active !== 'boolean') errors.push('is_active (Activa) debe ser boolean');

  return errors;
};

// Formateador para asegurar que float siga siendo numérico (node-pg devuelve string en NUMERIC)
const formatRow = (row) => ({
  ...row,
  rating: parseFloat(row.rating)
});

module.exports = async (req, res) => {
  const method = req.method;
  const idStr = req.url.split('?')[0].split('/')[2]; 
  const id = idStr ? parseInt(idStr) : null;
  
  try {
    // ==== GET ====
    if (method === 'GET') {
      if (id) {
        const result = await db.query('SELECT * FROM bands WHERE id = $1', [id]);
        if (result.rows.length === 0) return sendJSON(res, 404, { error: 'No encontrado' });
        return sendJSON(res, 200, formatRow(result.rows[0]));
      } else {
        const result = await db.query('SELECT * FROM bands ORDER BY id ASC');
        return sendJSON(res, 200, result.rows.map(formatRow));
      }
    }

    // ==== POST ====
    if (method === 'POST') {
      const errors = validateBody(req.body);
      if (errors.length > 0) return sendJSON(res, 400, { errors });

      const { name, genre, country, year_formed, rating, is_active } = req.body;
      const result = await db.query(
        'INSERT INTO bands (name, genre, country, year_formed, rating, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, genre, country, year_formed, rating, is_active]
      );
      return sendJSON(res, 201, formatRow(result.rows[0]));
    }

    // ==== PUT ====
    if (method === 'PUT') {
      if (!id) return sendJSON(res, 400, { error: 'ID es requerido' });
      const errors = validateBody(req.body);
      if (errors.length > 0) return sendJSON(res, 400, { errors });

      const { name, genre, country, year_formed, rating, is_active } = req.body;
      const result = await db.query(
        'UPDATE bands SET name=$1, genre=$2, country=$3, year_formed=$4, rating=$5, is_active=$6 WHERE id=$7 RETURNING *',
        [name, genre, country, year_formed, rating, is_active, id]
      );
      if (result.rows.length === 0) return sendJSON(res, 404, { error: 'No encontrado' });
      return sendJSON(res, 200, formatRow(result.rows[0]));
    }

    // ==== PATCH ==== 
    if (method === 'PATCH') {
      if (!id) return sendJSON(res, 400, { error: 'ID es requerido' });
      const errors = validateBody(req.body, true);
      if (errors.length > 0) return sendJSON(res, 400, { errors });

      const updates = [];
      const values = [];
      let idx = 1;
      const fields = ['name', 'genre', 'country', 'year_formed', 'rating', 'is_active'];
      for (const field of fields) {
        if (req.body[field] !== undefined) {
          updates.push(`${field}=$${idx}`);
          values.push(req.body[field]);
          idx++;
        }
      }

      if (updates.length === 0) return sendJSON(res, 400, { error: 'Nada que actualizar' });
      values.push(id);
      const result = await db.query(
        `UPDATE bands SET ${updates.join(', ')} WHERE id=$${idx} RETURNING *`,
        values
      );
      
      if (result.rows.length === 0) return sendJSON(res, 404, { error: 'No encontrado' });
      return sendJSON(res, 200, formatRow(result.rows[0]));
    }

    // ==== DELETE ====
    if (method === 'DELETE') {
      if (!id) return sendJSON(res, 400, { error: 'ID es requerido' });
      const result = await db.query('DELETE FROM bands WHERE id=$1 RETURNING *', [id]);
      if (result.rows.length === 0) return sendJSON(res, 404, { error: 'No encontrado' });
      return sendJSON(res, 204, null); // Obligatorio para código 204
    }

    return sendJSON(res, 405, { error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    return sendJSON(res, 500, { error: 'Error interno del servidor' });
  }
};
