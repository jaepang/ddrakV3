import { NexusGenArgTypes, NexusGenObjects } from '@shared/generated/nexus-typegen'
import { graphQLClient } from '@client/utils'
import {
  EVENTS_QUERY,
  DEFAULT_EVENTS_QUERY,
  CLUB_EVENTS_QUERY,
  MONTHLY_EVENTS_QUERY,
  EVENT_QUERY,
  CREATE_SINGLE_EVENT_MUTATION,
  CREATE_EVENTS_MUTATION,
  UPDATE_EVENT_MUTATION,
  DELETE_EVENT_MUTATION,
  DELETE_EVENTS_MUTATION,
} from './tags'

export const eventsQuery = async ({ queryKey }): Promise<{ events: NexusGenObjects['Event'][] }> => {
  const [_, variables] = queryKey
  return await graphQLClient.request(EVENTS_QUERY, variables)
}

export const defaultEventsQuery = async ({ queryKey }): Promise<{ defaultEvents: NexusGenObjects['Event'][] }> => {
  const [_, variables] = queryKey
  return await graphQLClient.request(DEFAULT_EVENTS_QUERY, variables)
}

export const clubEventsQuery = async ({ queryKey }): Promise<{ clubEvents: NexusGenObjects['Event'][] }> => {
  const [_, variables] = queryKey
  return await graphQLClient.request(CLUB_EVENTS_QUERY, variables)
}

export const monthlyEventsQuery = async ({ queryKey }): Promise<{ monthlyEvents: NexusGenObjects['Event'][] }> => {
  const [_, variables] = queryKey
  return await graphQLClient.request(MONTHLY_EVENTS_QUERY, variables)
}

export const eventQuery = async (variables: NexusGenArgTypes['Query']['event']): Promise<NexusGenObjects['Event']> => {
  return await graphQLClient.request(EVENT_QUERY, variables)
}

export const createSingleEventMutation = async (
  variables: NexusGenArgTypes['Mutation']['createSingleEvent'],
): Promise<NexusGenObjects['Event']> => {
  return await graphQLClient.request(CREATE_SINGLE_EVENT_MUTATION, variables)
}

export const createEventsMutation = async (
  variables: NexusGenArgTypes['Mutation']['createEvents'],
): Promise<number> => {
  return await graphQLClient.request(CREATE_EVENTS_MUTATION, variables)
}

export const updateEventMutation = async (
  variables: NexusGenArgTypes['Mutation']['updateEvent'],
): Promise<NexusGenObjects['Event']> => {
  return await graphQLClient.request(UPDATE_EVENT_MUTATION, variables)
}

export const deleteEventMutation = async (
  variables: NexusGenArgTypes['Mutation']['deleteEvent'],
): Promise<NexusGenObjects['Event']> => {
  return await graphQLClient.request(DELETE_EVENT_MUTATION, variables)
}

export const deleteEventsMutation = async (
  variables: NexusGenArgTypes['Mutation']['deleteEvents'],
): Promise<number> => {
  return await graphQLClient.request(DELETE_EVENTS_MUTATION, variables)
}
