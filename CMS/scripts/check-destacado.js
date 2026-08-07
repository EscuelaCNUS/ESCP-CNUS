const knex = require('knex')({
  client: 'better-sqlite3',
  connection: { filename: require('path').join(__dirname, '..', '.tmp', 'data.db') },
  useNullAsDefault: true,
});
(async () => {
  const rows = await knex('articulos').where('destacado', true).first();
  console.log('knex where destacado=true:', rows ? rows.id + ' ' + rows.titulo : null);
  const all = await knex('articulos').select('id', 'destacado');
  console.log('all:', all.map(r => r.id + ':' + JSON.stringify(r.destacado) + ':' + typeof r.destacado).join(', '));
  await knex.destroy();
})();
