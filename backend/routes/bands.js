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
  const requiredFields = ['campo1', 'campo2', 'campo3', 'campo4', 'campo5', 'campo6'];

  if (!isPatch) {
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        errors.push(`Falta el campo requerido: ${field}`);
      }
    }
  }

  if (body.campo1 !== undefined && typeof body.campo1 !== 'string') errors.push('campo1 (Banda) debe ser string');
  if (body.campo2 !== undefined && typeof body.campo2 !== 'string') errors.push('campo2 (Género) debe ser string');
  if (body.campo3 !== undefined && typeof body.campo3 !== 'string') errors.push('campo3 (País) debe ser string');
  if (body.campo4 !== undefined && !Number.isInteger(body.campo4)) errors.push('campo4 (Año) debe ser integer');
  if (body.campo5 !== undefined && typeof body.campo5 !== 'number') errors.push('campo5 (Rating) debe ser float');
  if (body.campo6 !== undefined && typeof body.campo6 !== 'boolean') errors.push('campo6 (Activa) debe ser boolean');

  return errors;
};

// Formateador para asegurar que float siga siendo numérico (node-pg devuelve string en NUMERIC)
const formatRow = (row) => ({
  ...row,
  campo5: parseFloat(row.campo5)
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

      const { campo1, campo2, campo3, campo4, campo5, campo6 } = req.body;
      const result = await db.query(
        'INSERT INTO bands (campo1, campo2, campo3, campo4, campo5, campo6) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [campo1, campo2, campo3, campo4, campo5, campo6]
      );
      return sendJSON(res, 201, formatRow(result.rows[0]));
    }

    // ==== PUT ====
    if (method === 'PUT') {
      if (!id) return sendJSON(res, 400, { error: 'ID es requerido' });
      const errors = validateBody(req.body);
      if (errors.length > 0) return sendJSON(res, 400, { errors });

      const { campo1, campo2, campo3, campo4, campo5, campo6 } = req.body;
      const result = await db.query(
        'UPDATE bands SET campo1=$1, campo2=$2, campo3=$3, campo4=$4, campo5=$5, campo6=$6 WHERE id=$7 RETURNING *',
        [campo1, campo2, campo3, campo4, campo5, campo6, id]
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
      const fields = ['campo1', 'campo2', 'campo3', 'campo4', 'campo5', 'campo6'];
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
