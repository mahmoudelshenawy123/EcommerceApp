module.exports = async (Models) => {
  Models.Categories.belongsToMany(Models.Providers, {
    through: 'ProviderCategories',
    foreignKey: 'categoryId', // Ensure this is correct
    otherKey: 'providerId', // Ensure this is correct
    as: 'providers', // Ensure the alias matches in usage
  });
  Models.Categories.belongsTo(Models.Products, {
    foreignKey: 'category_id',
    as: 'product',
  });

  // Models.Providers.belongsToMany(Models.Categories, {
  //   through: 'ProviderCategories',
  //   foreignKey: 'providerId', // Ensure this is correct
  //   otherKey: 'categoryId', // Ensure this is correct
  //   as: 'categories', // Ensure the alias matches in usage
  // });

  await Models.Categories.sync({ alter: true });
  // await Models.Providers.sync({ alter: true });
};
