exports.normalize = (stringToClean) => {
    return stringToClean 
        ? stringToClean.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        : null;
};