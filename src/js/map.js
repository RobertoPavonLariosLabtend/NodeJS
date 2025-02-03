(function() {
    const lat = document.querySelector('#lat').value || 20.67444163271174;
    const lng =  document.querySelector('#lng').value  || -103.38739216304566;
    const map = L.map('map').setView([lat, lng ], 16);
    let marker;

    //Usar Provider y Geocoder
    const geoCoderService = L.esri.Geocoding.geocodeService()
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = new L.marker( [lat, lng],{
        draggable: true,
        autoPan: true
    }).addTo(map)

    marker.on('moveend', function(e){
        marker = e.target
        const position = marker.getLatLng()
        setTimeout(() => {
            map.panTo(position);
        }, 100);

        //Obtener la calle y ciudad
        geoCoderService.reverse().latlng( position, 13 ).run( function(error, result) {
            marker.bindPopup( result.address.LongLabel )
        

        //Llenar campos
        document.querySelector( '.street' ).textContent = result?.address?.Address ?? ''
        document.querySelector( '#street' ).value = result?.address?.Address ?? ''
        document.querySelector( '#lat' ).value = result?.latlng?.lat ?? ''
        document.querySelector( '#lng' ).value = result?.latlng?.lng ?? ''
        })
    })

})()