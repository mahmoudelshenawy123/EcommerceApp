module.exports = async (Models) => {
  Models.Providers.hasMany(Models.ProvidersStories, {
    foreignKey: 'provider_id',
    as: 'stories',
  });
  Models.ProvidersStories.belongsTo(Models.Providers, {
    foreignKey: 'provider_id',
    as: 'provider',
  });
  Models.Providers.hasMany(Models.Products, {
    foreignKey: 'provider_id',
    as: 'products',
  });
  Models.Providers.belongsTo(Models.Orders, {
    foreignKey: 'provider_id',
    as: 'provider',
  });
  Models.Providers.belongsToMany(Models.Categories, {
    through: 'ProviderCategories',
    foreignKey: 'providerId', // Ensure this is correct
    otherKey: 'categoryId', // Ensure this is correct
    as: 'categories', // Ensure the alias matches in usage
  });
  await Models.Providers.sync({ alter: true });
  await Models.ProvidersStories.sync({ alter: true });
};
