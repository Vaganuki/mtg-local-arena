const {DataTypes} = require("sequelize");
const userModel = (sequelize) => {
    return sequelize.define(
        'user',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            firstname: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastname: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            birthdate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            tableName: 'users',
            timestamps: false,
        }
    );
}

module.exports = userModel;