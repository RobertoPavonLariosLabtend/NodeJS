

const admin = (req, res) => {
    res.render( 'properties/admin' ,{
        page: 'Mis propiedades',
        showNav: true
    })
}
const createProperty = (req, res) => {
    res.render( 'properties/create' ,{
        page: 'Crear una propiedad',
        showNav: true
    })
}


export{
    admin,
    createProperty
}