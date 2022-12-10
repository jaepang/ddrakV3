import gql from 'graphql-tag'
import { EVENT_FRAGMENT } from '@client/shared/queries'

export const EVENTS_QUERY = gql`
  query Query($from: DateTime, $to: DateTime, $clubId: Int) {
    events(from: $from, to: $to, clubId: $clubId) {
      ${EVENT_FRAGMENT}
    }
  }
`

export const DEFAULT_EVENTS_QUERY = gql`
  query Query($from: DateTime, $to: DateTime) {
    defaultEvents(from: $from, to: $to) {
      ${EVENT_FRAGMENT}
    }
  }
`

export const CLUB_EVENTS_QUERY = gql`
  query Query($from: DateTime, $to: DateTime) {
    clubEvents(from: $from, to: $to) {
      ${EVENT_FRAGMENT}
    }
  }
`

export const MONTHLY_EVENTS_QUERY = gql`
  query Query($target: DateTime) {
    monthlyEvents(target: $target) {
      ${EVENT_FRAGMENT}
    }
  }
`

export const EVENT_QUERY = gql`
  query Query($id: Int) {
    event(id: $id) {
      ${EVENT_FRAGMENT}
    }
  }
`

export const CREATE_SINGLE_EVENT_MUTATION = gql`
  mutation Mutation($eventInput: EventInput!) {
    createSingleEvent(eventInput: $eventInput) {
      ${EVENT_FRAGMENT}
    }
  }
`

export const CREATE_EVENTS_MUTATION = gql`
  mutation Mutation($eventsInput: [EventInput]) {
    createEvents(eventsInput: $eventsInput)
  }
`

export const UPDATE_EVENT_MUTATION = gql`
  mutation Mutation($id: Int!, $eventInput: EventInput!) {
    updateEvent(id: $id, eventInput: $eventInput) {
      ${EVENT_FRAGMENT}
    }
  }
`

export const DELETE_EVENT_MUTATION = gql`
  mutation Mutation($id: Int!) {
    deleteEvent(id: $id) {
      ${EVENT_FRAGMENT}
    }
  }
`

export const DELETE_EVENTS_MUTATION = gql`
  mutation Mutation($ids: [Int]) {
    deleteEvents(ids: $ids)
  }
`
