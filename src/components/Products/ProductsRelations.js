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
    through: Models.OrderProducts,
    foreignKey: 'product_id',
    otherKey: 'order_id',
    as: 'orders',
  });
  await Models.Products.sync({ alter: true });
};
