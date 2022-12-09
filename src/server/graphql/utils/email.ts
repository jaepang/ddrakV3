import { ApolloError } from 'apollo-server-micro'

interface SendEmailParams {
  receiver: string
  sender: string
  content: string
  title: string
}

export async function sendEmail({ sender, receiver, content, title }: SendEmailParams): Promise<boolean> {
  try {
    console.log({
      sender,
      receiver,
      title,
      content,
    })

    return false
  } catch (error) {
    throw new ApolloError(error)
  }
}
