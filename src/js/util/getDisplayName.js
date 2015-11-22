
/**
 * Gets a components displayName
 * @param {Component} Component
 * @return {String} displayName
 */
export default function getDisplayName(Component) {
    return Component.displayName || Component.name || 'Component';
}
