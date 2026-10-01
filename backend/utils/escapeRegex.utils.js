const escapeRegex = (search) => {
    const SPECIAL_CHARACTER_PATTERN = /[.*+?^${}()|[\]\\]/g;

    return search.replace(SPECIAL_CHARACTER_PATTERN, "\\$&");
};

export default escapeRegex;