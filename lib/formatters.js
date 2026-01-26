export const formatDisplacement = (value) => {
    if (!value || isNaN(value) || value <= 0) return "0";
    if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(1) + "M";
    }
    if (value >= 1_000) {
        return (value / 1_000).toFixed(1) + "k";
    }
    return value.toLocaleString();
};
