const {DataTypes} = require("sequelize");
const categoryModel = (Sequelize) => {
    return Sequelize.define(
        'category',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: 'categories',
            timestamps: false,
        }
    );
};

module.exports = categoryModel;