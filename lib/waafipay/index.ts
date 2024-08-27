import { WaafiPayResponse } from '@/types'
import axios from 'axios'

const {
  WAAFI_PAY_MERCHANT_UID,
  WAAFI_PAY_API_USER_ID,
  WAAFI_PAY_API_KEY,
  WAAFI_PAY_MERCHANT_NO,
} = process.env

const url = 'https://waafipay.ahmedibra.com/api/v1/payments'

export const initPayment = async ({
  amount,
  mobile,
}: {
  amount: number
  mobile: string
}): Promise<WaafiPayResponse & { error: string }> => {
  try {
    const obj = {
      mobile,
      amount,
      credentials: {
        merchantUId: WAAFI_PAY_MERCHANT_UID,
        apiUId: WAAFI_PAY_API_USER_ID,
        apiKey: WAAFI_PAY_API_KEY,
        accountNumberToWithdraw: WAAFI_PAY_MERCHANT_NO,
      },
    }

    const { data } = await axios.post(
      url + '/initialize?business=eduction',
      obj
    )

    return data
  } catch (error: any) {
    // @ts-ignore
    return { error: error?.response?.data?.error || error?.message }
  }
}

export const refundPayment = async ({
  amount,
  transactionId,
  reason,
}: {
  amount: number
  transactionId: string
  reason?: string
}) => {
  try {
    const obj = {
      transactionId,
      amount,
      reason: reason || 'Refund',
      credentials: {
        merchantUId: WAAFI_PAY_MERCHANT_UID,
        apiUId: WAAFI_PAY_API_USER_ID,
        apiKey: WAAFI_PAY_API_KEY,
      },
    }

    const { data } = await axios.post(
      url + '/payments/refund?business=eduction',
      obj
    )

    return data
  } catch (error: any) {
    return { error: error?.response?.data?.error || error?.message }
  }
}
