module.exports = async (Models) => {
  Models.Products.belongsTo(Models.Providers, {
    foreignKey: 'provider_id',
    as: 'provider',
  });
  Models.Products.belongsTo(Models.Categories, {
    foreignKey: 'category_id',
    as: 'category',
  });
  Models.Products.belongsToMany(Models.Orders, {
    through: Models.OrderProducts, // Reference the join table model
    foreignKey: 'product_id', // Foreign key for Products in OrderProducts
    otherKey: 'order_id', // Foreign key for Orders in OrderProducts
    as: 'orders', // Alias for usage
  });
  await Models.Products.sync({ alter: true });
  // await Models.Providers.sync({ alter: true });
};
