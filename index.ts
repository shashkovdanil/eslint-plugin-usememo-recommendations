import detectHeavyOperations from './rules/detect-heavy-operations'
import { name } from './package.json'

export default {
  rules: {
    'detect-heavy-operations': detectHeavyOperations,
  },
  name,
}
