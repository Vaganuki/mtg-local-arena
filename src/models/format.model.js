const {DataTypes} = require("sequelize");
const formatModel = (Sequelize) => {
    return Sequelize.define(
        'format',
        {
            id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name:{
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            tableName:'formats',
            timestamps:false
        }
    );
};

module.exports = formatModel;