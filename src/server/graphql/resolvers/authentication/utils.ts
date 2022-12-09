import { User } from '@prisma/client'
import { ApolloError } from 'apollo-server-micro'
import { sendEmail } from '../../utils'

export async function sendPasswordRecoveryEmail(user: User): Promise<boolean> {
  try {
    const result = await sendEmail({
      title: '비밀번호 재설정',
      content: `<p>입금완료시 비밀번호를 알려드립니다.</p>`,
      sender: 'yourmate@yourmate.io',
      receiver: user.email,
    })

    if (!result) throw new ApolloError('FAILED_SEND_EMAIL')
    return true
  } catch (error) {
    throw new ApolloError(error)
  }
}
