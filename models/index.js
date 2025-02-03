import Property from "./Property.js";
import Category from "./Category.js";
import Price from "./Price.js";
import User from "./User.js";
import { Cast } from "sequelize/lib/utils";

Property.belongsTo( Price )
Property.belongsTo( Category )
Property.belongsTo( User )

export {
    Property,
    Price, 
    Category,
    User
}