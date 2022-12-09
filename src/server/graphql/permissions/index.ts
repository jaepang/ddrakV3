import { ApolloError } from 'apollo-server-micro'
import { shield } from 'graphql-shield'
import rules from './rules'

// https://www.graphql-shield.com/docs

const ERR_INTERNAL_SERVER = 'ERR_INTERNAL_SERVER'

export const permissions = shield(
  {
    Query: {
      me: rules.isAuthenticatedUser,
    },
  },
  {
    // [TODO] NODE_ENV production / test 따라서 debug false / true
    // debug: true,
    allowExternalErrors: true,
    fallbackError: async (thrownThing, parent, args, context, info) => {
      if (thrownThing instanceof ApolloError) {
        // expected errors
        return thrownThing
      } else if (thrownThing instanceof Error) {
        // unexpected errors
        console.error(thrownThing)

        // [TODO] logging
        // await Sentry.report(thrownThing)
        return new ApolloError('Internal server error', ERR_INTERNAL_SERVER)
      } else {
        // What the hell got thrown?
        console.error('The resolver threw something that is not an error.')
        console.error(thrownThing)
        return new ApolloError('Internal server error', ERR_INTERNAL_SERVER)
      }
    },
  },
)
