module.exports = async (Models) => {
  Models.Categories.belongsToMany(Models.Providers, {
    through: 'ProviderCategories',
    foreignKey: 'categoryId',
    otherKey: 'providerId',
    as: 'providers',
  });
  Models.Categories.belongsTo(Models.Products, {
    foreignKey: 'category_id',
    as: 'product',
  });

  await Models.Categories.sync({ alter: true });
};
