export function isComponentName(node) {
  return node.type === 'Identifier' && /^[A-Z]/.test(node.name);
}
