import Property from "./Property.js";
import Category from "./Category.js";
import Price from "./Price.js";
import User from "./User.js";
import Message from "./Message.js"
import { Cast } from "sequelize/lib/utils";

Property.belongsTo( Price )
Property.belongsTo( Category )
Property.belongsTo( User )
Property.hasMany( Message )

Message.belongsTo( Property ) 
Message.belongsTo( User ) 
export {
    Property,
    Price, 
    Category,
    User,
    Message
}