// backend/src/middleware/validate.js
function isNonEmpty(s) {
    return typeof s === "string" && s.trim().length > 0;
}

function isRating(n) {
    const v = Number(n);
    return Number.isFinite(v) && v >= 1 && v <= 5;
}

function isIsoDate(s) {
    if (!s) return false;
    // yyyy-mm-dd format check
    return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

exports.validateDestination = (body) => {
    const errors = {};

    if (!isNonEmpty(body.name)) errors.name = "Name is required";
    if (!isNonEmpty(body.country)) errors.country = "Country is required";
    if (!isNonEmpty(body.city)) errors.city = "City is required";
    if (!isIsoDate(body.visitDate)) errors.visitDate = "Visit date is required (yyyy-mm-dd)";
    if (!isRating(body.rating)) errors.rating = "Rating must be 1..5";

    return { valid: Object.keys(errors).length === 0, errors };
};

// --- JOURNAL VALIDATION ---

exports.validateJournal = (body) => {
    const errors = {};

    // Destination required
    if (!body.destinationId) {
        errors.destinationId = "Destination is required";
    }

    // Title required
    if (!isNonEmpty(body.title)) {
        errors.title = "Title is required";
    }

    // Optional rating, but if present must be 1..5
    if (body.rating !== undefined && body.rating !== "") {
        if (!isRating(body.rating)) {
            errors.rating = "Rating must be 1..5";
        }
    }

    // Optional visit date, but if present must be yyyy-mm-dd
    if (body.visitDate && !isIsoDate(body.visitDate)) {
        errors.visitDate = "Visit date must be yyyy-mm-dd";
    }

    return { valid: Object.keys(errors).length === 0, errors };
};

