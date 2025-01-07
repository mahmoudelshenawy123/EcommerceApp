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
    through: Models.OrderProducts,
    foreignKey: 'order_id',
    otherKey: 'product_id',
    as: 'products',
  });

  await Models.Orders.sync({ alter: true });
  await Models.OrderProducts.sync({ alter: true });
};
