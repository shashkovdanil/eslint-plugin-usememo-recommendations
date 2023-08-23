import { getFunctionName } from './getFunctionName'
import { isComponentName } from './isComponentName'
import { isForwardRefCallback } from './isForwardRefCallback'
import { isMemoCallback } from './isMemoCallback'

export function isInsideComponent(node) {
  while (node) {
    const functionName = getFunctionName(node)
    if (functionName) {
      if (isComponentName(functionName)) {
        return true
      }
    }
    if (isForwardRefCallback(node) || isMemoCallback(node)) {
      return true
    }
    node = node.parent
  }
  return false
}
