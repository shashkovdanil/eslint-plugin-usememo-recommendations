import { isReactFunction } from './isReactFunction'

export function isMemoCallback(node) {
  return !!(
    node.parent &&
    node.parent.callee &&
    isReactFunction(node.parent.callee, 'memo')
  )
}
