import { ESLintUtils } from '@typescript-eslint/utils'
import { isInsideComponent } from '../utils/isInsideComponent'

const createRule = ESLintUtils.RuleCreator(
  () =>
    `https://github.com/shashkovdanil/eslint-plugin-usememo-recommendations`,
)

const EXPENSIVE_MATH_METHODS = [
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'log',
  'sqrt',
  'pow',
]

const ARRAY_METHODS = [
  'filter',
  'find',
  'findIndex',
  'map',
  'reduce',
  'reduceRight',
  'some',
  'every',
  'sort',
]

export default createRule({
  name: 'detect-heavy-operations',
  meta: {
    docs: {
      description:
        'detect potential heavy operations outside useMemo in React components',
    },
    type: 'suggestion',
    schema: [],
    messages: {
      recursive: 'Potential recursive call detected. Consider using useMemo.',
      math: 'Expensive mathematical operation detected outside useMemo. Consider using useMemo.',
      nestedLoops:
        'Nested loops detected outside useMemo. Consider using useMemo.',
      chainedArrayOperations:
        'Chained array operations detected outside useMemo. Consider using useMemo.',
    },
  },
  create: function (context) {
    let functionNames: string[] = []
    let insideMemoCallback = false

    return {
      FunctionDeclaration(node) {
        if (node.id) functionNames.push(node.id.name)
      },
      'FunctionDeclaration:exit': function (node) {
        const index = functionNames.findIndex(name => name === node.id?.name)

        if (index > -1) {
          functionNames.splice(index, 1)
        }
      },
      CallExpression(node) {
        if (!isInsideComponent(node)) return

        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'useMemo' &&
          node.arguments[0] &&
          node.arguments[0].type === 'ArrowFunctionExpression'
        ) {
          insideMemoCallback = true
        }

        // Check for recursive calls
        if (
          !insideMemoCallback &&
          node.callee.type === 'Identifier' &&
          functionNames.includes(node.callee.name)
        ) {
          context.report({
            node,
            messageId: 'recursive',
          })
        }

        // Check for expensive math operations
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'Math' &&
          node.callee.property.type === 'Identifier' &&
          EXPENSIVE_MATH_METHODS.includes(node.callee.property.name)
        ) {
          context.report({
            node,
            messageId: 'math',
          })
        }
      },
      'CallExpression:exit': function () {
        if (insideMemoCallback) {
          insideMemoCallback = false
        }
      },
      ForStatement(node) {
        if (!isInsideComponent(node)) return

        if (!insideMemoCallback) {
          if (node.body.type === 'BlockStatement') {
            const bodyStatements = node.body.body

            for (let statement of bodyStatements) {
              if (['ForStatement', 'WhileStatement'].includes(statement.type)) {
                context.report({
                  node: statement,
                  messageId: 'nestedLoops',
                })
              }
            }
          }
        }
      },
      WhileStatement(node) {
        if (!isInsideComponent(node)) return

        if (!insideMemoCallback) {
          if (node.body.type === 'BlockStatement') {
            const bodyStatements = node.body.body

            for (let statement of bodyStatements) {
              if (['ForStatement', 'WhileStatement'].includes(statement.type)) {
                context.report({
                  node: statement,
                  messageId: 'nestedLoops',
                })
              }
            }
          }
        }
      },
      MemberExpression(node) {
        if (!isInsideComponent(node)) return

        if (!insideMemoCallback) {
          if (
            node.object.type === 'CallExpression' &&
            node.property.type === 'Identifier' &&
            ARRAY_METHODS.includes(node.property.name) &&
            node.object.callee.type === 'MemberExpression' &&
            node.object.callee.property.type === 'Identifier' &&
            ARRAY_METHODS.includes(node.object.callee.property.name)
          ) {
            context.report({
              node,
              messageId: 'chainedArrayOperations',
            })
          }
        }
      },
    }
  },
  defaultOptions: [],
})
