module.exports = async (Models) => {
  Models.Orders.belongsTo(Models.Providers, {
    foreignKey: 'provider_id',
    as: 'provider',
  });
  Models.Orders.belongsTo(Models.User, {
    foreignKey: 'user_id',
    as: 'user',
  });
  Models.Orders.belongsToMany(Models.Products, {
    through: Models.OrderProducts, // Reference the join table model
    foreignKey: 'order_id', // Foreign key for Orders in OrderProducts
    otherKey: 'product_id', // Foreign key for Products in OrderProducts
    as: 'products', // Alias for usage
  });

  // Models.Products.belongsTo(Models.Categories, {
  //   foreignKey: 'category_id',
  //   as: 'category',
  // });

  await Models.Orders.sync({ alter: true });
  await Models.OrderProducts.sync({ alter: true });
  // await Models.Providers.sync({ alter: true });
};
