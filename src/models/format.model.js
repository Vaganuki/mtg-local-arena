const {DataTypes} = require("sequelize");
const formatModel = (Sequelize) => {
    return Sequelize.define(
        'format',
        {
            id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name:{}
        },
        {
            tableName:'formats',
            timestamps:false
        }
    );
};

module.exports = formatModel;