module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    timestamps: true, // createdAt and updatedAt columns in every Table
    underscored: true, // default with underscore for tables
    underscoredAll: true, // default with underscore for coluns and relations
  },
};
