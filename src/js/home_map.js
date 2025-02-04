
(function(){
    const lat = 20.67444163271174;
    const lng =  -103.38739216304566;
    const homeMap = L.map('homeMap').setView([lat, lng ], 10);

    let markers = new L.FeatureGroup().addTo( homeMap )

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(homeMap);

    let properties = [];
    
    const filters = {
        category: '',
        price: ''
    }
    const categorySelect = document.querySelector('#categories')
    const priceSelect = document.querySelector('#prices')

    categorySelect.addEventListener('change', e => {
        filters.category = +e.target.value
        filterProperties()
    })
    priceSelect.addEventListener('change', e => {
        filters.price = +e.target.value
        filterProperties()
    })


    const getProperties = async () =>{
        try {
            const url = 'api/properties'
            const response =  await fetch( url )            
            properties = await response.json()

            showProperties( properties )
        } catch (error) {
            
        }
    }

    getProperties()

    const showProperties = properties => {
        
        markers.clearLayers()

        properties.forEach(property => {
            const marker = new L.marker([property?.lat, property?.lng],{
                autoPan: true
            })
            .addTo(homeMap)
            .bindPopup(`
                <p class="text-indigo-600 font-bold">${property.category?.name || 'No Category'}</p>
                <h1 class="text-xl font-extrabold uppercase my-2">${property?.title || 'No Title'}</h1>
                <img src="/uploads/${property?.img || 'default.jpg'}" alt="Imagen de la propiedad ${property.title}">
                <p class="text-gray-600 font-bold">${property.price?.name || 'No Price'}</p>
                <a href="/property/${property.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase">Ver Propiedad</a>
            `);
            markers.addLayer(marker);
            
        }
    )
        
    }

    const filterProperties = () => {
        const result = properties.filter( filterCategory).filter( filterPrice )
        showProperties( result )
    }

    const filterCategory = property => {
        return filters.category ? property.categoryId === filters.category : property
    }
    const filterPrice = property => {
        return filters.price ? property.priceId === filters.price : property
    }

})()