function required(v) { return v !== undefined && v !== null && String(v).trim() !== ""; }

function validateDestination(body) {
    const errors = {};
    if (!required(body.name)) errors.name = "Name is required";
    if (!required(body.country)) errors.country = "Country is required";
    if (!required(body.city)) errors.city = "City is required";
    return { valid: Object.keys(errors).length === 0, errors };
}

function validateEntry(body) {
    const errors = {};
    if (!required(body.destinationId)) errors.destinationId = "Destination is required";
    if (!required(body.title)) errors.title = "Title is required";
    if (!required(body.visitDate)) errors.visitDate = "Visit date is required";

    const rating = Number(body.rating);
    if (!(rating >= 1 && rating <= 5)) errors.rating = "Rating must be 1–5";
    return { valid: Object.keys(errors).length === 0, errors };
}

module.exports = { validateDestination, validateEntry };
