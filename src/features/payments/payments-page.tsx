import { PaymentsView } from './components/payments-view'
import { usePaymentsController } from './use-payments-controller'

export function PaymentsPage() {
  return <PaymentsView {...usePaymentsController()} />
}
