import { isReactFunction } from './isReactFunction'

export function isForwardRefCallback(node) {
  return !!(
    node.parent &&
    node.parent.callee &&
    isReactFunction(node.parent.callee, 'forwardRef')
  )
}
