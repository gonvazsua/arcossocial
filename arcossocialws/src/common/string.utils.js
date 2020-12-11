exports.normalize = (stringToClean) => {
    const accents = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
    return stringToClean 
        ? stringToClean.split('').map( letter => accents[letter] || letter).join('').toString().toUpperCase()
        : null;
    /*
    return stringToClean 
        ? stringToClean.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        : null;
    */
};