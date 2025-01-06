module.exports = async (Models) => {
  Models.Products.belongsTo(Models.Providers, {
    foreignKey: 'provider_id',
    as: 'provider',
  });
  Models.Products.belongsTo(Models.Categories, {
    foreignKey: 'category_id',
    as: 'category',
  });
  await Models.Products.sync({ alter: true });
  // await Models.Providers.sync({ alter: true });
};
