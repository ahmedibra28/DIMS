const InvoicePrintScreen = (stdPaymentInfo) => {
  if (stdPaymentInfo) {
    return <div className='modal-body'> {JSON.stringify(stdPaymentInfo)} </div>
  } else return <span>Nothing</span>
}

export default InvoicePrintScreen
